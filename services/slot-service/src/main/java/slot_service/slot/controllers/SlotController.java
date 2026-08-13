package slot_service.slot.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import slot_service.common.dtos.ApiResponse;
import slot_service.slot.dtos.SlotGenerateRequestDTO;
import slot_service.slot.dtos.SlotsResponseDTO;
import slot_service.slot.services.SlotService;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotController {

    private final SlotService slotService;

    @GetMapping
    public ResponseEntity<List<SlotsResponseDTO>> getSlotsByCourtAndDate(
            @RequestParam Long courtId,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate slotDate) {

        return ResponseEntity.ok(
                slotService.getSlotsByCourtAndDate(courtId, slotDate));
    }

    @GetMapping("/{slotId}")
    public ResponseEntity<SlotsResponseDTO> getSlotById(
            @PathVariable Long slotId) {

        return ResponseEntity.ok(
                slotService.getSlotById(slotId));
    }

    @PutMapping("/{slotId}/block")
    public ResponseEntity<ApiResponse> blockSlot(
            @PathVariable Long slotId) {

        slotService.blockSlot(slotId);
        return ResponseEntity.ok(new ApiResponse("Slot blocked successfully.", "Success"));
    }

    @PutMapping("/{slotId}/unblock")
    public ResponseEntity<ApiResponse> unblockSlot(
            @PathVariable Long slotId) {

        slotService.unblockSlot(slotId);
        return ResponseEntity.ok(new ApiResponse("Slot unblocked successfully.", "Success"));
    }

    @PutMapping("/{slotId}/book")
    public ResponseEntity<ApiResponse> bookSlot(
            @PathVariable Long slotId) {

        slotService.bookSlot(slotId);
        return ResponseEntity.ok(new ApiResponse("Slot booked successfully.", "Success"));
    }

    @PutMapping("/{slotId}/release")
    public ResponseEntity<ApiResponse> releaseSlot(
            @PathVariable Long slotId) {

        slotService.releaseSlot(slotId);
        return ResponseEntity.ok(new ApiResponse("Slot released successfully.", "Success"));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse> generateSlots(
            @Valid @RequestBody SlotGenerateRequestDTO dto) {

        slotService.generateSlots(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Slots generated successfully for court " + dto.getCourtId(), "Success"));
    }
}
