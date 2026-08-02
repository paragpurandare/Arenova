package com.arenova.court.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arenova.court.entities.Court;

public interface CourtRepository extends JpaRepository<Court, Long> {
	
	
	// Find all courts for a specific club
    List<Court> findByClubId(Long clubId);
    
    // Find only active courts for customer view
    List<Court> findByClubIdAndActiveTrue(Long clubId);

	List<Court> findAllByActiveTrue();
	
}
