package slot_service.slot.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import slot_service.slot.dtos.SlotGenerateRequestDTO;
import slot_service.slot.dtos.SlotsResponseDTO;

public interface SlotService {

    List<SlotsResponseDTO> getSlotsByCourtAndDate(Long courtId, LocalDate slotDate);

    SlotsResponseDTO getSlotById(Long slotId);

    void blockSlot(Long slotId);

    void unblockSlot(Long slotId);

    void bookSlot(Long slotId);

    void releaseSlot(Long slotId);

    void expirePastSlots();

    void generateSlots(SlotGenerateRequestDTO dto);

    void generateNextDaySlots(Long courtId, LocalTime openTime, LocalTime closeTime, int slotDuration, int bufferTime);
}
