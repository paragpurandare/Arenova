package com.arenova.club.controllers;

import java.math.BigDecimal;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.arenova.club.dtos.ClubRequestDTO;
import com.arenova.club.services.ClubService;
import com.arenova.common.dtos.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor

public class ClubController {
	
	private final ClubService clubService;
	
	
	@PostMapping
	public ResponseEntity<?> createNewClub(@RequestBody ClubRequestDTO clubDto) {
		
		try {
			clubService.insertNewClub(clubDto);
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(new ApiResponse("Club added Successfully", "Success"));
		}
		catch(Exception e) {
			
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
								.body(new ApiResponse(e.getMessage(), "Failed"));
								
		}
	}
	
	@GetMapping
	public ResponseEntity<?> getClubsOfOwner(@RequestParam Long ownerId) {
		
		try {
			return ResponseEntity.ok(clubService.getAllClubs(ownerId));
					
		}
		catch(Exception e) {
			
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
								.body(new ApiResponse(e.getMessage(), "Failed"));
								
		}
	}

	/**
	 * GET /api/clubs/nearby?lat=18.5204&lng=73.8567&radiusKm=10
	 *
	 * Returns all ACTIVE clubs within the given radius (km) of the
	 * customer's coordinates, sorted by distance (nearest first).
	 * Uses the Haversine formula for great-circle distance.
	 */
	@GetMapping("/nearby")
	public ResponseEntity<?> getNearbyClubs(@RequestParam BigDecimal lat,
	                                        @RequestParam BigDecimal lng,
	                                        @RequestParam(required = false) Double radiusKm) {

		try {
			return ResponseEntity.ok(clubService.getNearbyClubs(lat, lng, radiusKm));
		}
		catch(Exception e) {

			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
								.body(new ApiResponse(e.getMessage(), "Failed"));

		}
	}
}
