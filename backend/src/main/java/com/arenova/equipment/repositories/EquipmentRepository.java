package com.arenova.equipment.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arenova.equipment.entities.Equipment;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> findByClubId(Long clubId);

    List<Equipment> findByClubIdAndIsActiveTrue(Long clubId);
}
