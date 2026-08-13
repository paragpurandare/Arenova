package com.arenova.club.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.arenova.club.dtos.AssignManagerRequestDTO;
import com.arenova.club.services.ClubManagerService;
import com.arenova.common.dtos.ApiResponse;
import com.arenova.security.UserPrincipal;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Owner-side manager assignment for their own clubs, plus the manager's
 * own "which club am I assigned to" lookup.
 */
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class ClubManagerController {

    private final ClubManagerService clubManagerService;

    /** Owner assigns a manager to one of their own clubs. */
    @PostMapping("/api/clubs/{clubId}/manager")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> assignManager(@PathVariable Long clubId,
                                            @Valid @RequestBody AssignManagerRequestDTO dto,
                                            Authentication authentication) {

        Long ownerId = ((UserPrincipal) authentication.getPrincipal()).getId();

        try {
            clubManagerService.assignManager(clubId, dto.getManagerId(), ownerId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse("Manager assigned successfully.", "Success"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), "Failed"));
        }
    }

    /** Owner removes whichever manager currently runs one of their clubs. */
    @DeleteMapping("/api/clubs/{clubId}/manager")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> unassignManager(@PathVariable Long clubId, Authentication authentication) {

        Long ownerId = ((UserPrincipal) authentication.getPrincipal()).getId();

        try {
            clubManagerService.unassignManager(clubId, ownerId);
            return ResponseEntity.ok(new ApiResponse("Manager unassigned.", "Success"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), "Failed"));
        }
    }

    /** Owner/Admin: who currently manages a given club. */
    @GetMapping("/api/clubs/{clubId}/manager")
    @PreAuthorize("hasAnyRole('CUSTOMER','OWNER','MANAGER','ADMIN')")
    public ResponseEntity<?> getManagerOfClub(@PathVariable Long clubId) {

        try {
            return ResponseEntity.ok(clubManagerService.getManagerOfClub(clubId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), "Failed"));
        }
    }
}
