package com.arenova.court.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arenova.common.dtos.ApiResponse;
import com.arenova.court.dtos.CourtEditDTO;
import com.arenova.court.dtos.CourtRequestDTO;
import com.arenova.court.services.CourtService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController

@RequestMapping("api/courts")
@SecurityRequirement(name = "bearerAuth")


@RequiredArgsConstructor
public class CourtController {

	private final CourtService courtService;
	
	
	@PostMapping
	@PreAuthorize("hasRole('OWNER')")
	public ResponseEntity<?> createNewCourt(@RequestBody CourtRequestDTO dto) {
		
		try {
			
			courtService.insertNewCourt(dto);
			
			return ResponseEntity.status(HttpStatus.CREATED)
							.body(new ApiResponse("Court Added Successfully", "Success"));
			
		}
		catch(Exception e) {
			
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
								.body(new ApiResponse(e.getMessage(), "Failed"));
		}						
	}
	
	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('OWNER','MANAGER','ADMIN')")
	public ResponseEntity<?> getAllCourts(@PathVariable("id") Long id){
		
		try {
			
			return ResponseEntity.ok(courtService.getAllCourts(id));
			
		}
		catch(Exception e) {
			
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(new ApiResponse(e.getMessage(), "Failed"));
		}
	}
	
	
	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('OWNER','MANAGER')")
		public ResponseEntity<?> editCourt(@RequestBody CourtEditDTO dto, @PathVariable("id") Long id){
			
			try {
				
				courtService.updateCourt(dto, id);
				return ResponseEntity.ok(new ApiResponse("Court Updated Successfully", "Success"));
				
			}
			catch(Exception e) {
				
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(new ApiResponse(e.getMessage(), "Failed"));
			}
		}
		
		@GetMapping("active/{id}")
		@PreAuthorize("hasAnyRole('CUSTOMER','OWNER','MANAGER')")
		public ResponseEntity<?> getAllActiveCourts(@PathVariable("id") Long id){
			
			try {
				
				return ResponseEntity.ok(courtService.getAllActiveCourts(id));
				
			}
			catch(Exception e) {
				
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(new ApiResponse(e.getMessage(), "Failed"));
			}
		}
		
	}
	
