package com.arenova.equipment.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.arenova.equipment.entities.EquipmentInventory;

import jakarta.persistence.LockModeType;

public interface EquipmentInventoryRepository extends JpaRepository<EquipmentInventory, Long> {

    Optional<EquipmentInventory> findByEquipmentIdAndDate(Long equipmentId, LocalDate date);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT ei FROM EquipmentInventory ei WHERE ei.equipment.id = :equipmentId AND ei.date = :date")
    Optional<EquipmentInventory> findByEquipmentIdAndDateWithLock(@Param("equipmentId") Long equipmentId, @Param("date") LocalDate date);

    List<EquipmentInventory> findByEquipmentClubIdAndDate(Long clubId, LocalDate date);
}
