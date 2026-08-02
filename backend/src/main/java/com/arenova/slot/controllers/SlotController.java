package com.arenova.slot.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.arenova.common.dtos.ApiResponse;
import com.arenova.slot.dtos.SlotsResponseDTO;
import com.arenova.slot.services.SlotService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotController {

    private final SlotService slotService;

    /**
     * Get all slots of a court for a particular date.
     * Used by Customer and Club Manager.
     */
    @GetMapping
    public ResponseEntity<List<SlotsResponseDTO>> getSlotsByCourtAndDate(
            @RequestParam Long courtId,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate slotDate) {

        return ResponseEntity.ok(
                slotService.getSlotsByCourtAndDate(courtId, slotDate));
    }

    /**
     * Get slot details.
     */
    @GetMapping("/{slotId}")
    public ResponseEntity<SlotsResponseDTO> getSlotById(
            @PathVariable Long slotId) {

        return ResponseEntity.ok(
                slotService.getSlotById(slotId));
    }

    /**
     * Block a slot.
     * Accessible by Club Manager.
     */
    @PutMapping("/{slotId}/block")
    public ResponseEntity<?> blockSlot(
            @PathVariable Long slotId) {

        slotService.blockSlot(slotId);

        return ResponseEntity.status(HttpStatus.CREATED)
        						.body(new ApiResponse("Slot blocked successfully.", "Success"));
    }

    /**
     * Unblock a slot.
     * Accessible by Club Manager.
     */
    @PutMapping("/{slotId}/unblock")
    public ResponseEntity<?> unblockSlot(
            @PathVariable Long slotId) {

        slotService.unblockSlot(slotId);

        return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponse("Slot unblocked successfully.", "Success"));
    }

}