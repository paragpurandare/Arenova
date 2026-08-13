package com.arenova.rental.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arenova.common.dtos.ApiResponse;
import com.arenova.rental.dtos.RentalOrderRequestDTO;
import com.arenova.rental.dtos.RentalOrderResponseDTO;
import com.arenova.rental.services.RentalOrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalOrderController {

    private final RentalOrderService rentalOrderService;

    @PostMapping
    public ResponseEntity<RentalOrderResponseDTO> createRentalOrder(@Valid @RequestBody RentalOrderRequestDTO dto) {
        RentalOrderResponseDTO response = rentalOrderService.createRentalOrder(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalOrderResponseDTO> getRentalOrder(@PathVariable Long id) {
        RentalOrderResponseDTO response = rentalOrderService.getRentalOrder(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RentalOrderResponseDTO>> getRentalOrdersByUser(@PathVariable Long userId) {
        List<RentalOrderResponseDTO> response = rentalOrderService.getRentalOrdersByUser(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<RentalOrderResponseDTO> getRentalOrderByBooking(@PathVariable Long bookingId) {
        RentalOrderResponseDTO response = rentalOrderService.getRentalOrderByBooking(bookingId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse> cancelRentalOrder(@PathVariable Long id) {
        rentalOrderService.cancelRentalOrder(id);
        return ResponseEntity.ok(new ApiResponse("Rental order cancelled successfully", "Success"));
    }

    @PutMapping("/{id}/pickup")
    @PreAuthorize("hasAnyRole('ROLE_OWNER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<RentalOrderResponseDTO> markPickedUp(@PathVariable Long id) {
        RentalOrderResponseDTO response = rentalOrderService.markPickedUp(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('ROLE_OWNER', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<RentalOrderResponseDTO> markReturned(@PathVariable Long id) {
        RentalOrderResponseDTO response = rentalOrderService.markReturned(id);
        return ResponseEntity.ok(response);
    }
}
