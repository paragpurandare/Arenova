package com.arenova.client;

import java.time.LocalDate;
import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.arenova.client.dtos.SlotGenerateRequestDTO;
import com.arenova.common.dtos.ApiResponse;
import com.arenova.slot.dtos.SlotsResponseDTO;

@FeignClient(name = "SLOT-SERVICE", url = "${slot.service.url:http://localhost:8081}")
public interface SlotClient {

    @GetMapping("/api/slots")
    List<SlotsResponseDTO> getSlotsByCourtAndDate(
            @RequestParam("courtId") Long courtId,
            @RequestParam("slotDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate slotDate);

    @GetMapping("/api/slots/{slotId}")
    SlotsResponseDTO getSlotById(@PathVariable("slotId") Long slotId);

    @PutMapping("/api/slots/{slotId}/block")
    ApiResponse blockSlot(@PathVariable("slotId") Long slotId);

    @PutMapping("/api/slots/{slotId}/unblock")
    ApiResponse unblockSlot(@PathVariable("slotId") Long slotId);

    @PutMapping("/api/slots/{slotId}/book")
    ApiResponse bookSlot(@PathVariable("slotId") Long slotId);

    @PutMapping("/api/slots/{slotId}/release")
    ApiResponse releaseSlot(@PathVariable("slotId") Long slotId);

    @PostMapping("/api/slots/generate")
    ApiResponse generateSlots(@RequestBody SlotGenerateRequestDTO dto);
}
