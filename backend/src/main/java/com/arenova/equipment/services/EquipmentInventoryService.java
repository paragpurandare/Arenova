package com.arenova.equipment.services;

import java.time.LocalDate;
import java.util.List;

import com.arenova.equipment.dtos.EquipmentAvailabilityResponseDTO;
import com.arenova.equipment.entities.EquipmentInventory;

public interface EquipmentInventoryService {

    List<EquipmentAvailabilityResponseDTO> getAvailability(Long clubId, LocalDate date);

    EquipmentInventory getOrCreateInventory(Long equipmentId, LocalDate date);

    void reserveUnits(Long equipmentId, LocalDate date, int quantity);

    void releaseUnits(Long equipmentId, LocalDate date, int quantity);
}
