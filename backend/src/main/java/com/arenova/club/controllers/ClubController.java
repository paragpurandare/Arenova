package com.arenova.club.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "http://localhost:5173")
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
}
