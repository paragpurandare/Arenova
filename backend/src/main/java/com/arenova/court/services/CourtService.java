package com.arenova.court.services;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.arenova.client.SlotClient;
import com.arenova.client.dtos.SlotGenerateRequestDTO;
import com.arenova.club.entities.Club;
import com.arenova.club.repository.ClubRepository;
import com.arenova.common.Exceptions.ResourceNotFoundException;
import com.arenova.court.dtos.CourtEditDTO;
import com.arenova.court.dtos.CourtRequestDTO;
import com.arenova.court.dtos.CourtResponseDTO;
import com.arenova.court.entities.Court;
import com.arenova.court.entities.CourtConfig;
import com.arenova.court.repositories.CourtRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CourtService {

    private final ClubRepository clubRepo;
    private final CourtRepository courtRepo;
    private final CourtConfigService courtConfigService;
    private final SlotClient slotClient;
    private final ModelMapper modelMapper;

    public void insertNewCourt(CourtRequestDTO dto) {

        Club club = clubRepo.findById(dto.getClubId())
                .orElseThrow(() -> new ResourceNotFoundException("Club not Found!"));

        Court court = modelMapper.map(dto, Court.class);
        court.setId(null);
        court.setClub(club);
        court.setActive(true);

        court.setConfig(courtConfigService.buildDefaultConfig());

        Court savedCourt = courtRepo.save(court);

        // Trigger remote slot generation in SLOT-SERVICE (arenova_slot_DB) via OpenFeign RPC
        triggerRemoteSlotGeneration(savedCourt);
    }

    public void updateCourt(CourtEditDTO dto, Long courtId) {

        Court court = courtRepo.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        modelMapper.map(dto, court);

        if (dto.getActive() != null) {
            court.setActive(dto.getActive());
        }

        CourtConfig config = court.getConfig();
        if (config == null) {
            config = courtConfigService.buildDefaultConfig();
            court.setConfig(config);
        }

        LocalTime oldOpen = config.getOpenTime();
        LocalTime oldClose = config.getCloseTime();
        int oldDuration = config.getSlotDuration();
        int oldBuffer = config.getBufferTime();

        courtConfigService.applyEdits(config, dto);

        boolean scheduleChanged = !java.util.Objects.equals(oldOpen, config.getOpenTime())
                || !java.util.Objects.equals(oldClose, config.getCloseTime())
                || oldDuration != config.getSlotDuration()
                || oldBuffer != config.getBufferTime();

        Court savedCourt = courtRepo.save(court);

        if (scheduleChanged) {
            triggerRemoteSlotGeneration(savedCourt);
        }
    }

    private void triggerRemoteSlotGeneration(Court court) {
        try {
            CourtConfig cfg = court.getConfig();
            SlotGenerateRequestDTO req = SlotGenerateRequestDTO.builder()
                    .courtId(court.getId())
                    .openTime(cfg != null && cfg.getOpenTime() != null ? cfg.getOpenTime() : LocalTime.of(6, 0))
                    .closeTime(cfg != null && cfg.getCloseTime() != null ? cfg.getCloseTime() : LocalTime.of(22, 0))
                    .slotDuration(cfg != null && cfg.getSlotDuration() > 0 ? cfg.getSlotDuration() : 60)
                    .bufferTime(cfg != null ? cfg.getBufferTime() : 0)
                    .days(30)
                    .build();

            slotClient.generateSlots(req);
            log.info("Successfully triggered slot-service for courtId: {}", court.getId());
        } catch (Exception ex) {
            log.warn("Failed to trigger remote slot generation in slot-service for courtId {}: {}", court.getId(), ex.getMessage());
        }
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

    private CourtResponseDTO toResponseDto(Court court) {
        CourtResponseDTO dto = modelMapper.map(court, CourtResponseDTO.class);

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
