package com.arenova.slot.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.arenova.client.SlotClient;
import com.arenova.client.dtos.SlotGenerateRequestDTO;
import com.arenova.court.entities.Court;
import com.arenova.court.entities.CourtConfig;
import com.arenova.court.repositories.CourtRepository;
import com.arenova.slot.dtos.SlotsResponseDTO;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SlotServiceImpl implements SlotService {

    private final SlotClient slotClient;
    private final CourtRepository courtRepo;

    @Override
    public List<SlotsResponseDTO> getSlotsByCourtAndDate(Long courtId, LocalDate slotDate) {
        return slotClient.getSlotsByCourtAndDate(courtId, slotDate);
    }

    @Override
    public SlotsResponseDTO getSlotById(Long slotId) {
        return slotClient.getSlotById(slotId);
    }

    @Override
    public void blockSlot(Long slotId) {
        slotClient.blockSlot(slotId);
    }

    @Override
    public void unblockSlot(Long slotId) {
        slotClient.unblockSlot(slotId);
    }

    @Override
    public void bookSlot(Long slotId) {
        slotClient.bookSlot(slotId);
    }

    @Override
    public void releaseSlot(Long slotId) {
        slotClient.releaseSlot(slotId);
    }

    @Override
    public void expirePastSlots() {
        log.info("Past slots expiration delegated to SLOT-SERVICE scheduled tasks.");
    }

    @Override
    public void generateSlots(Long courtId) {
        Court court = courtRepo.findById(courtId).orElse(null);
        CourtConfig cfg = court != null ? court.getConfig() : null;

        SlotGenerateRequestDTO req = SlotGenerateRequestDTO.builder()
                .courtId(courtId)
                .openTime(cfg != null && cfg.getOpenTime() != null ? cfg.getOpenTime() : LocalTime.of(6, 0))
                .closeTime(cfg != null && cfg.getCloseTime() != null ? cfg.getCloseTime() : LocalTime.of(22, 0))
                .slotDuration(cfg != null && cfg.getSlotDuration() > 0 ? cfg.getSlotDuration() : 60)
                .bufferTime(cfg != null ? cfg.getBufferTime() : 0)
                .days(30)
                .build();

        slotClient.generateSlots(req);
    }

    @Override
    public void generateNextDaySlots(Long courtId) {
        generateSlots(courtId);
    }
}
