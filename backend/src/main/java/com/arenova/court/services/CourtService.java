package com.arenova.court.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.arenova.club.entities.Club;
import com.arenova.club.repository.ClubRepository;
import com.arenova.common.Exceptions.ResourceNotFoundException;
import com.arenova.court.dtos.CourtEditDTO;
import com.arenova.court.dtos.CourtRequestDTO;
import com.arenova.court.dtos.CourtResponseDTO;
import com.arenova.court.entities.Court;
import com.arenova.court.entities.CourtConfig;
import com.arenova.court.repositories.CourtRepository;
import com.arenova.slot.services.SlotService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * Handles Court creation/updates. CourtConfig (operating hours, slot
 * duration, etc.) is fully owned by CourtConfigService - this class just
 * asks for a config to attach, then triggers slot generation once the
 * court (and its config, via cascade) is safely persisted.
 *
 * Flow: CourtService creates/saves the Court -> CourtConfigService
 * builds/edits the CourtConfig -> SlotService.generateSlots(courtId).
 */
@Service
@Transactional
@RequiredArgsConstructor
public class CourtService {

    private final ClubRepository clubRepo;
    private final CourtRepository courtRepo;
    private final CourtConfigService courtConfigService;
    private final SlotService slotService;
    private final ModelMapper modelMapper;

    public void insertNewCourt(CourtRequestDTO dto) {

        Club club = clubRepo.findById(dto.getClubId())
                .orElseThrow(() -> new ResourceNotFoundException("Club not Found!"));

        Court court = modelMapper.map(dto, Court.class);
        court.setId(null);
        court.setClub(club);
        court.setActive(true);

        // Config is built in-memory here; Court.config has CascadeType.ALL,
        // so it's persisted automatically the moment the court itself is saved.
        court.setConfig(courtConfigService.buildDefaultConfig());

        Court savedCourt = courtRepo.save(court);

        // Config now exists in the DB (courtId is available) - safe to generate slots.
        slotService.generateSlots(savedCourt.getId());
    }

    public void updateCourt(CourtEditDTO dto, Long courtId) {

        Court court = courtRepo.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        // ModelMapper is configured with skipNullEnabled, so any field the
        // caller didn't send (name, sportsType) is simply left untouched
        // on the existing court rather than being nulled out.
        modelMapper.map(dto, court);

        if (dto.getActive() != null) {
            court.setActive(dto.getActive());
        }

        // Reuse the existing config (falls back to a fresh default if somehow missing)
        // so we never lose the config_id or orphan the old row.
        CourtConfig config = court.getConfig();
        if (config == null) {
            config = courtConfigService.buildDefaultConfig();
            court.setConfig(config);
        }
        courtConfigService.applyEdits(config, dto);

        Court savedCourt = courtRepo.save(court);

        // Operating hours/slot duration may have changed - regenerate future slots.
        slotService.generateSlots(savedCourt.getId());
    }

    public List<CourtResponseDTO> getAllCourts(Long clubId) {

        List<Court> courts = courtRepo.findByClubId(clubId);

        return courts.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<CourtResponseDTO> getAllActiveCourts(Long clubId) {

        List<Court> courts = courtRepo.findByClubIdAndActiveTrue(clubId);

        return courts.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    // Shared DTO-mapping helper for both list endpoints - avoids duplicating
    // the same "stitch club/config fields onto the DTO" logic twice.
    private CourtResponseDTO toResponseDto(Court court) {
        CourtResponseDTO dto = modelMapper.map(court, CourtResponseDTO.class);

        // Explicitly carry over id and active so the frontend can reference them.
        dto.setId(court.getId());
        dto.setActive(court.isActive());

        if (court.getClub() != null) {
            dto.setClubId(court.getClub().getId());
        }

        if (court.getConfig() != null) {
            dto.setOpenTime(court.getConfig().getOpenTime());
            dto.setCloseTime(court.getConfig().getCloseTime());
            dto.setSlotDuration(court.getConfig().getSlotDuration());
            dto.setBufferTime(court.getConfig().getBufferTime());
            dto.setMaxPlayers(court.getConfig().getMaxPlayers());
        }

        return dto;
    }
}
