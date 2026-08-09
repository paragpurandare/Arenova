package com.arenova.equipment.services;

import java.util.List;

import com.arenova.equipment.dtos.EquipmentRequestDTO;
import com.arenova.equipment.dtos.EquipmentResponseDTO;

public interface EquipmentService {

    EquipmentResponseDTO createEquipment(Long clubId, EquipmentRequestDTO dto);

    List<EquipmentResponseDTO> getEquipmentByClub(Long clubId);

    EquipmentResponseDTO getEquipmentById(Long id);

    EquipmentResponseDTO updateEquipment(Long id, EquipmentRequestDTO dto);

    void deactivateEquipment(Long id);
}
