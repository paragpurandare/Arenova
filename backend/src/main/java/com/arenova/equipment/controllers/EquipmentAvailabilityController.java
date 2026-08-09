package com.arenova.equipment.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.arenova.equipment.dtos.EquipmentAvailabilityResponseDTO;
import com.arenova.equipment.services.EquipmentInventoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clubs/{clubId}/equipment")
@RequiredArgsConstructor
public class EquipmentAvailabilityController {

    private final EquipmentInventoryService inventoryService;

    @GetMapping("/availability")
    public ResponseEntity<List<EquipmentAvailabilityResponseDTO>> getAvailability(
            @PathVariable Long clubId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<EquipmentAvailabilityResponseDTO> response = inventoryService.getAvailability(clubId, date);
        return ResponseEntity.ok(response);
    }
}
