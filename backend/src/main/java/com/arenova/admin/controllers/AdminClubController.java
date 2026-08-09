package com.arenova.admin.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arenova.club.dtos.ClubStatusUpdateDTO;
import com.arenova.club.services.ClubService;
import com.arenova.common.dtos.ApiResponse;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Admin-only club management: review every club regardless of owner/status,
 * and approve/suspend/reactivate them. More admin endpoints (revenue,
 * rentals, etc.) will be added here once those features exist.
 */
@RestController
@RequestMapping("/api/admin/clubs")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminClubController {

	private final ClubService clubService;

	/** All clubs on the platform, any status - for the admin review queue. */
	@GetMapping
	public ResponseEntity<?> getAllClubs() {

		try {
			return ResponseEntity.ok(clubService.getAllClubsForAdmin());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ApiResponse(e.getMessage(), "Failed"));
		}
	}

	/** Approve a pending club, suspend one, or reactivate it - one endpoint, any transition. */
	@PutMapping("/{id}/status")
	public ResponseEntity<?> updateClubStatus(@PathVariable Long id, @Valid @RequestBody ClubStatusUpdateDTO dto) {

		try {
			return ResponseEntity.ok(clubService.updateClubStatus(id, dto.getStatus()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ApiResponse(e.getMessage(), "Failed"));
		}
	}
}
