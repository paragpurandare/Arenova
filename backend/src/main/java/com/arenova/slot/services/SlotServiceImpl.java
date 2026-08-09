package com.arenova.slot.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.arenova.common.Exceptions.ResourceNotFoundException;
import com.arenova.court.entities.Court;
import com.arenova.court.entities.CourtConfig;
import com.arenova.court.repositories.CourtRepository;
import com.arenova.court.services.CourtConfigService;
import com.arenova.slot.dtos.SlotsResponseDTO;
import com.arenova.slot.entities.Slot;
import com.arenova.slot.entities.SlotStatus;
import com.arenova.slot.repositories.SlotRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class SlotServiceImpl implements SlotService {

    private final SlotRepository slotRepo;
    private final CourtRepository courtRepo;

    // How many days ahead the initial slot generation covers.
    private static final int SLOT_GENERATION_WINDOW_DAYS = 30;

    @Override
    public List<SlotsResponseDTO> getSlotsByCourtAndDate(Long courtId, LocalDate slotDate) {

        if (!courtRepo.existsById(courtId)) {
            throw new ResourceNotFoundException("Court not found with id : " + courtId);
        }

        List<Slot> slots = slotRepo.findAllByCourt_IdAndSlotDate(courtId, slotDate);

        return slots.stream()
                .map(this::convertToDto)
                .toList();
    }

    @Override
    public SlotsResponseDTO getSlotById(Long slotId) {

        Slot slot = slotRepo.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id : " + slotId));

        return convertToDto(slot);
    }

    @Override
    public void blockSlot(Long slotId) {

        int updatedRows = slotRepo.blockSlot(slotId);

        if (updatedRows == 0) {
            throw new ResourceNotFoundException("Slot not found with id : " + slotId);
        }
    }

    @Override
    public void unblockSlot(Long slotId) {

        int updatedRows = slotRepo.unblockSlot(slotId);

        if (updatedRows == 0) {
            throw new ResourceNotFoundException("Slot not found with id : " + slotId);
        }
    }

    @Override
    public void bookSlot(Long slotId) {

        int updatedRows = slotRepo.bookSlot(slotId);

        if (updatedRows == 0) {
            throw new IllegalStateException("Slot is unavailable, blocked or already booked.");
        }
    }

    @Override
    public void expirePastSlots() {
        slotRepo.expirePastSlots(LocalDate.now(), LocalTime.now());
    }

    @Override
    public void generateSlots(Long courtId) {

        Court court = courtRepo.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        CourtConfig config = court.getConfig();

        // Wipe any not-yet-booked future slots first, so a config change
        // (e.g. new operating hours) doesn't leave stale slots behind.
        slotRepo.deleteFutureAvailableSlots(courtId, LocalDate.now());

        LocalDate today = LocalDate.now();
        List<Slot> slots = new ArrayList<>();

        for (int i = 0; i < SLOT_GENERATION_WINDOW_DAYS; i++) {
            slots.addAll(buildSlotsForDay(court, config, today.plusDays(i)));
        }

        slotRepo.saveAll(slots);
    }

    @Override
    public void generateNextDaySlots(Long courtId) {

        Court court = courtRepo.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        CourtConfig config = court.getConfig();

        LocalDate lastGeneratedDate = slotRepo.findMaxSlotDateByCourt(courtId);
        if (lastGeneratedDate == null) {
            lastGeneratedDate = LocalDate.now().minusDays(1);
        }

        LocalDate nextDate = lastGeneratedDate.plusDays(1);

        List<Slot> slots = buildSlotsForDay(court, config, nextDate);

        slotRepo.saveAll(slots);
    }

    // Builds the AVAILABLE slots for a single court/day from open time to
    // close time, stepping by (slotDuration + bufferTime) each iteration.
    // Shared by both generateSlots() and generateNextDaySlots() so the
    // slot-carving rules only live in one place.
    private List<Slot> buildSlotsForDay(Court court, CourtConfig config, LocalDate date) {

        List<Slot> daySlots = new ArrayList<>();
        LocalTime current = config.getOpenTime();

        while (true) {
            LocalTime endTime = current.plusMinutes(config.getSlotDuration());

            if (endTime.isAfter(config.getCloseTime())) {
                break;
            }

            daySlots.add(Slot.builder()
                    .court(court)
                    .slotDate(date)
                    .startTime(current)
                    .endTime(endTime)
                    .status(SlotStatus.AVAILABLE)
                    .build());

            current = endTime.plusMinutes(config.getBufferTime());
        }

        return daySlots;
    }

    private SlotsResponseDTO convertToDto(Slot slot) {
        return SlotsResponseDTO.builder()
                .id(slot.getId())
                .courtId(slot.getCourt().getId())
                .slotDate(slot.getSlotDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .status(slot.getStatus())
                .build();
    }
}
