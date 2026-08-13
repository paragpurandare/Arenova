package slot_service.slot.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import slot_service.common.exceptions.ResourceNotFoundException;
import slot_service.slot.dtos.SlotGenerateRequestDTO;
import slot_service.slot.dtos.SlotsResponseDTO;
import slot_service.slot.entities.Slot;
import slot_service.slot.entities.SlotStatus;
import slot_service.slot.repositories.SlotRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class SlotServiceImpl implements SlotService {

    private final SlotRepository slotRepo;

    private static final int DEFAULT_SLOT_WINDOW_DAYS = 30;
    private static final LocalTime DEFAULT_OPEN_TIME = LocalTime.of(6, 0);
    private static final LocalTime DEFAULT_CLOSE_TIME = LocalTime.of(23, 0);
    private static final int DEFAULT_SLOT_DURATION = 60;
    private static final int DEFAULT_BUFFER_TIME = 0;
    private static final BigDecimal DEFAULT_SLOT_PRICE = BigDecimal.valueOf(350);

    @Override
    @Transactional(readOnly = true)
    public List<SlotsResponseDTO> getSlotsByCourtAndDate(Long courtId, LocalDate slotDate) {
        List<Slot> slots = slotRepo.findAllByCourtIdAndSlotDate(courtId, slotDate);
        return slots.stream()
                .map(this::convertToDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SlotsResponseDTO getSlotById(Long slotId) {
        Slot slot = slotRepo.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + slotId));
        return convertToDto(slot);
    }

    @Override
    public void blockSlot(Long slotId) {
        int updatedRows = slotRepo.blockSlot(slotId);
        if (updatedRows == 0) {
            throw new ResourceNotFoundException("Slot not found with id: " + slotId);
        }
    }

    @Override
    public void unblockSlot(Long slotId) {
        int updatedRows = slotRepo.unblockSlot(slotId);
        if (updatedRows == 0) {
            throw new ResourceNotFoundException("Slot not found with id: " + slotId);
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
    public void releaseSlot(Long slotId) {
        int updatedRows = slotRepo.releaseSlot(slotId);
        if (updatedRows == 0) {
            throw new ResourceNotFoundException("Slot not found or not currently booked with id: " + slotId);
        }
    }

    @Override
    public void expirePastSlots() {
        slotRepo.expirePastSlots(LocalDate.now(), LocalTime.now());
    }

    @Override
    public void generateSlots(SlotGenerateRequestDTO dto) {
        Long courtId = dto.getCourtId();
        LocalTime openTime = dto.getOpenTime() != null ? dto.getOpenTime() : DEFAULT_OPEN_TIME;
        LocalTime closeTime = dto.getCloseTime() != null ? dto.getCloseTime() : DEFAULT_CLOSE_TIME;
        int duration = dto.getSlotDuration() != null && dto.getSlotDuration() > 0 ? dto.getSlotDuration() : DEFAULT_SLOT_DURATION;
        int buffer = dto.getBufferTime() != null ? dto.getBufferTime() : DEFAULT_BUFFER_TIME;
        int windowDays = dto.getDays() != null && dto.getDays() > 0 ? dto.getDays() : DEFAULT_SLOT_WINDOW_DAYS;
        BigDecimal price = dto.getPrice() != null ? dto.getPrice() : DEFAULT_SLOT_PRICE;

        slotRepo.deleteFutureAvailableSlots(courtId, LocalDate.now());

        List<Slot> existingSlots = slotRepo.findAllByCourtId(courtId);
        Set<String> existingKeys = existingSlots.stream()
                .map(s -> s.getSlotDate() + "_" + s.getStartTime())
                .collect(Collectors.toSet());

        LocalDate today = LocalDate.now();
        List<Slot> slotsToSave = new ArrayList<>();

        for (int i = 0; i < windowDays; i++) {
            List<Slot> daySlots = buildSlotsForDay(courtId, openTime, closeTime, duration, buffer, price, today.plusDays(i));
            for (Slot slot : daySlots) {
                String key = slot.getSlotDate() + "_" + slot.getStartTime();
                if (!existingKeys.contains(key)) {
                    slotsToSave.add(slot);
                    existingKeys.add(key);
                }
            }
        }

        if (!slotsToSave.isEmpty()) {
            slotRepo.saveAll(slotsToSave);
        }
    }

    @Override
    public void generateNextDaySlots(Long courtId, LocalTime openTime, LocalTime closeTime, int slotDuration, int bufferTime) {
        LocalTime open = openTime != null ? openTime : DEFAULT_OPEN_TIME;
        LocalTime close = closeTime != null ? closeTime : DEFAULT_CLOSE_TIME;
        int duration = slotDuration > 0 ? slotDuration : DEFAULT_SLOT_DURATION;
        int buffer = bufferTime >= 0 ? bufferTime : DEFAULT_BUFFER_TIME;

        LocalDate lastGeneratedDate = slotRepo.findMaxSlotDateByCourt(courtId);
        if (lastGeneratedDate == null) {
            lastGeneratedDate = LocalDate.now().minusDays(1);
        }

        LocalDate nextDate = lastGeneratedDate.plusDays(1);

        List<Slot> existingSlots = slotRepo.findAllByCourtIdAndSlotDate(courtId, nextDate);
        Set<LocalTime> existingStartTimes = existingSlots.stream()
                .map(Slot::getStartTime)
                .collect(Collectors.toSet());

        List<Slot> daySlots = buildSlotsForDay(courtId, open, close, duration, buffer, DEFAULT_SLOT_PRICE, nextDate);
        List<Slot> slotsToSave = daySlots.stream()
                .filter(s -> !existingStartTimes.contains(s.getStartTime()))
                .collect(Collectors.toList());

        if (!slotsToSave.isEmpty()) {
            slotRepo.saveAll(slotsToSave);
        }
    }

    private List<Slot> buildSlotsForDay(Long courtId, LocalTime openTime, LocalTime closeTime, int duration, int buffer, BigDecimal price, LocalDate date) {
        List<Slot> daySlots = new ArrayList<>();
        LocalTime current = openTime;

        while (true) {
            LocalTime endTime = current.plusMinutes(duration);
            if (endTime.isAfter(closeTime)) {
                break;
            }

            daySlots.add(Slot.builder()
                    .courtId(courtId)
                    .slotDate(date)
                    .startTime(current)
                    .endTime(endTime)
                    .price(price)
                    .status(SlotStatus.AVAILABLE)
                    .build());

            current = endTime.plusMinutes(buffer);
        }

        return daySlots;
    }

    private SlotsResponseDTO convertToDto(Slot slot) {
        return SlotsResponseDTO.builder()
                .id(slot.getId())
                .courtId(slot.getCourtId())
                .slotDate(slot.getSlotDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .price(slot.getPrice() != null ? slot.getPrice() : DEFAULT_SLOT_PRICE)
                .status(slot.getStatus() != null ? slot.getStatus().name() : "AVAILABLE")
                .build();
    }
}
