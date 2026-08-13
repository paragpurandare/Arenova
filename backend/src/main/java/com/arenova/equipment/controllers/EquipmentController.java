package com.arenova.equipment.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arenova.common.dtos.ApiResponse;
import com.arenova.equipment.dtos.EquipmentRequestDTO;
import com.arenova.equipment.dtos.EquipmentResponseDTO;
import com.arenova.equipment.services.EquipmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @PostMapping("/clubs/{clubId}/equipment")
    @PreAuthorize("hasAnyRole('ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<EquipmentResponseDTO> createEquipment(
            @PathVariable Long clubId,
            @Valid @RequestBody EquipmentRequestDTO dto) {
        EquipmentResponseDTO response = equipmentService.createEquipment(clubId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/clubs/{clubId}/equipment")
    public ResponseEntity<List<EquipmentResponseDTO>> getEquipmentByClub(@PathVariable Long clubId) {
        List<EquipmentResponseDTO> response = equipmentService.getEquipmentByClub(clubId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/equipment/{id}")
    public ResponseEntity<EquipmentResponseDTO> getEquipmentById(@PathVariable Long id) {
        EquipmentResponseDTO response = equipmentService.getEquipmentById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/equipment/{id}")
    @PreAuthorize("hasAnyRole('ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<EquipmentResponseDTO> updateEquipment(
            @PathVariable Long id,
            @Valid @RequestBody EquipmentRequestDTO dto) {
        EquipmentResponseDTO response = equipmentService.updateEquipment(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/equipment/{id}")
    @PreAuthorize("hasAnyRole('ROLE_OWNER', 'ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<ApiResponse> deactivateEquipment(@PathVariable Long id) {
        equipmentService.deactivateEquipment(id);
        return ResponseEntity.ok(new ApiResponse("Equipment deactivated successfully", "Success"));
    }
}
