package com.arenova.club.controllers;

import java.math.BigDecimal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.arenova.club.dtos.ClubRequestDTO;
import com.arenova.club.dtos.ClubResponseDTO;
import com.arenova.club.repository.ClubManagerRepository;
import com.arenova.club.services.ClubService;
import com.arenova.common.dtos.ApiResponse;
import com.arenova.security.UserPrincipal;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clubs")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;
    private final ClubManagerRepository clubManagerRepository;

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> createNewClub(@RequestBody ClubRequestDTO clubDto) {
        try {
            clubService.insertNewClub(clubDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse("Club added Successfully", "Success"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), "Failed"));
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<?> getClubsOfOwner(@RequestParam Long ownerId) {
        try {
            return ResponseEntity.ok(clubService.getAllClubs(ownerId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), "Failed"));
        }
    }

    /**
     * GET /api/clubs/manager-club
     *
     * Returns the club assigned to the currently-authenticated manager via
     * the club_managers table. Only accessible by users with ROLE_MANAGER.
     */
    @GetMapping("/manager-club")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getManagerClub() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
            Long managerId = principal.getId();

            return clubManagerRepository
                    .findByManager_IdAndActiveTrue(managerId)
                    .map(cm -> {
                        ClubResponseDTO dto = clubService.toResponseDto(cm.getClub());
                        return ResponseEntity.ok((Object) dto);
                    })
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiResponse("No club assignment found for this manager.", "Not Found")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), "Failed"));
        }
    }

    /**
     * GET /api/clubs/nearby?lat=18.5204&lng=73.8567&radiusKm=10
     *
     * Returns all ACTIVE clubs within the given radius (km) of the
     * customer's coordinates, sorted by distance (nearest first).
     */
    @GetMapping("/nearby")
    @PreAuthorize("hasAnyRole('CUSTOMER','OWNER','MANAGER','ADMIN')")
    public ResponseEntity<?> getNearbyClubs(@RequestParam BigDecimal lat,
                                            @RequestParam BigDecimal lng,
                                            @RequestParam(required = false) Double radiusKm) {
        try {
            return ResponseEntity.ok(clubService.getNearbyClubs(lat, lng, radiusKm));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), "Failed"));
        }
    }
}
