package com.arenova.court.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arenova.court.entities.CourtConfig;
import com.arenova.slot.entities.Slot;

public interface CourtConfigRepository extends JpaRepository<CourtConfig, Long> {

	
}
