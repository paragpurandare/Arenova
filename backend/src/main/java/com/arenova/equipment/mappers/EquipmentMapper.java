package com.arenova.equipment.mappers;

import com.arenova.equipment.dtos.EquipmentAvailabilityResponseDTO;
import com.arenova.equipment.dtos.EquipmentResponseDTO;
import com.arenova.equipment.entities.Equipment;
import com.arenova.equipment.entities.EquipmentInventory;

public class EquipmentMapper {

    public static EquipmentResponseDTO toResponseDTO(Equipment equipment) {
        Long clubId = null;
        String clubName = null;
        if (equipment.getClub() != null) {
            clubId = equipment.getClub().getId();
            try {
                clubName = equipment.getClub().getName();
            } catch (Exception e) {
                // Safe fallback if proxy uninitialized
            }
        }

        return EquipmentResponseDTO.builder()
                .id(equipment.getId())
                .clubId(clubId)
                .clubName(clubName)
                .name(equipment.getName())
                .sportType(equipment.getSportType())
                .pricePerSlot(equipment.getPricePerSlot())
                .totalStock(equipment.getTotalStock())
                .isActive(equipment.getIsActive())
                .createdAt(equipment.getCreatedAt())
                .build();
    }

    public static EquipmentAvailabilityResponseDTO toAvailabilityDTO(EquipmentInventory inventory) {
        Equipment equipment = inventory.getEquipment();
        return EquipmentAvailabilityResponseDTO.builder()
                .equipmentId(equipment != null ? equipment.getId() : null)
                .equipmentName(equipment != null ? equipment.getName() : null)
                .sportType(equipment != null ? equipment.getSportType() : null)
                .pricePerSlot(equipment != null ? equipment.getPricePerSlot() : null)
                .date(inventory.getDate())
                .totalUnits(inventory.getTotalUnits())
                .reservedUnits(inventory.getReservedUnits())
                .availableUnits(inventory.getTotalUnits() - inventory.getReservedUnits())
                .build();
    }
}
