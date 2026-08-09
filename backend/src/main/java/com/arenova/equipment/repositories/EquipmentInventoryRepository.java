package com.arenova.equipment.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arenova.equipment.entities.EquipmentInventory;

public interface EquipmentInventoryRepository extends JpaRepository<EquipmentInventory, Long> {

    Optional<EquipmentInventory> findByEquipmentIdAndDate(Long equipmentId, LocalDate date);

    List<EquipmentInventory> findByEquipmentClubIdAndDate(Long clubId, LocalDate date);
}
