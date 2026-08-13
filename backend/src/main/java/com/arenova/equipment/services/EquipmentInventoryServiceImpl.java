package com.arenova.equipment.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.arenova.common.Exceptions.InsufficientStockException;
import com.arenova.common.Exceptions.ResourceNotFoundException;
import com.arenova.equipment.dtos.EquipmentAvailabilityResponseDTO;
import com.arenova.equipment.entities.Equipment;
import com.arenova.equipment.entities.EquipmentInventory;
import com.arenova.equipment.mappers.EquipmentMapper;
import com.arenova.equipment.repositories.EquipmentInventoryRepository;
import com.arenova.equipment.repositories.EquipmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EquipmentInventoryServiceImpl implements EquipmentInventoryService {

    private final EquipmentInventoryRepository inventoryRepository;
    private final EquipmentRepository equipmentRepository;

    @Override
    @Transactional
    public List<EquipmentAvailabilityResponseDTO> getAvailability(Long clubId, LocalDate date) {
        // Get all active equipment for the club
        List<Equipment> equipmentList = equipmentRepository.findByClubIdAndIsActiveTrue(clubId);

        List<EquipmentAvailabilityResponseDTO> result = new ArrayList<>();
        for (Equipment equipment : equipmentList) {
            EquipmentInventory inventory = getOrCreateInventory(equipment.getId(), date);
            result.add(EquipmentMapper.toAvailabilityDTO(inventory));
        }
        return result;
    }

    @Override
    @Transactional
    public EquipmentInventory getOrCreateInventory(Long equipmentId, LocalDate date) {
        return inventoryRepository.findByEquipmentIdAndDate(equipmentId, date)
                .orElseGet(() -> {
                    Equipment equipment = equipmentRepository.findById(equipmentId)
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Equipment not found with id: " + equipmentId));

                    EquipmentInventory inventory = new EquipmentInventory();
                    inventory.setEquipment(equipment);
                    inventory.setDate(date);
                    inventory.setTotalUnits(equipment.getTotalStock());
                    inventory.setReservedUnits(0);
                    return inventoryRepository.save(inventory);
                });
    }

    @Override
    @Transactional
    public void reserveUnits(Long equipmentId, LocalDate date, int quantity) {
        // Use pessimistic lock to prevent concurrent overbooking
        EquipmentInventory inventory = inventoryRepository.findByEquipmentIdAndDateWithLock(equipmentId, date)
                .orElseGet(() -> getOrCreateInventory(equipmentId, date));

        int available = inventory.getTotalUnits() - inventory.getReservedUnits();
        if (quantity > available) {
            throw new InsufficientStockException(
                    "Insufficient stock for equipment '" + inventory.getEquipment().getName()
                    + "'. Requested: " + quantity + ", Available: " + available);
        }

        inventory.setReservedUnits(inventory.getReservedUnits() + quantity);
        inventoryRepository.save(inventory);
    }

    @Override
    @Transactional
    public void releaseUnits(Long equipmentId, LocalDate date, int quantity) {
        EquipmentInventory inventory = inventoryRepository.findByEquipmentIdAndDate(equipmentId, date)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inventory not found for equipment id: " + equipmentId + " on date: " + date));

        int newReserved = inventory.getReservedUnits() - quantity;
        inventory.setReservedUnits(Math.max(0, newReserved));
        inventoryRepository.save(inventory);
    }
}
