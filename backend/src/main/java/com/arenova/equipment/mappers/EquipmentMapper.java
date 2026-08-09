package com.arenova.equipment.mappers;

import com.arenova.equipment.dtos.EquipmentAvailabilityResponseDTO;
import com.arenova.equipment.dtos.EquipmentResponseDTO;
import com.arenova.equipment.entities.Equipment;
import com.arenova.equipment.entities.EquipmentInventory;

public class EquipmentMapper {

    public static EquipmentResponseDTO toResponseDTO(Equipment equipment) {
        return EquipmentResponseDTO.builder()
                .id(equipment.getId())
                .clubId(equipment.getClub().getId())
                .clubName(equipment.getClub().getName())
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
                .equipmentId(equipment.getId())
                .equipmentName(equipment.getName())
                .sportType(equipment.getSportType())
                .pricePerSlot(equipment.getPricePerSlot())
                .date(inventory.getDate())
                .totalUnits(inventory.getTotalUnits())
                .reservedUnits(inventory.getReservedUnits())
                .availableUnits(inventory.getTotalUnits() - inventory.getReservedUnits())
                .build();
    }
}
