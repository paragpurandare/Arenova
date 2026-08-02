package com.arenova.slot.services;

import java.time.LocalDate;
import java.util.List;

import com.arenova.slot.dtos.SlotsResponseDTO;

public interface SlotService {

	List<SlotsResponseDTO> getSlotsByCourtAndDate(Long courtId, LocalDate slotDate);

    SlotsResponseDTO getSlotById(Long slotId);

    void blockSlot(Long slotId);

    void unblockSlot(Long slotId);

    void bookSlot(Long slotId);

    void expirePastSlots();

    void generateSlots(Long courtId);
    
    void generateNextDaySlots(Long courtId);
}
