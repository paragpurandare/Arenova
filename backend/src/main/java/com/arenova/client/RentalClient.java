package com.arenova.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.arenova.common.dtos.ApiResponse;
import com.arenova.rental.dtos.RentalOrderRequestDTO;
import com.arenova.rental.dtos.RentalOrderResponseDTO;

@FeignClient(name = "RENTAL-SERVICE", url = "${rental.service.url:http://localhost:8082}")
public interface RentalClient {

    @PostMapping("/api/rentals")
    RentalOrderResponseDTO createRentalOrder(@RequestBody RentalOrderRequestDTO dto);

    @GetMapping("/api/rentals/{id}")
    RentalOrderResponseDTO getRentalOrder(@PathVariable("id") Long id);

    @GetMapping("/api/rentals/user/{userId}")
    List<RentalOrderResponseDTO> getRentalOrdersByUser(@PathVariable("userId") Long userId);

    @GetMapping("/api/rentals/booking/{bookingId}")
    RentalOrderResponseDTO getRentalOrderByBooking(@PathVariable("bookingId") Long bookingId);

    @PutMapping("/api/rentals/{id}/cancel")
    ApiResponse cancelRentalOrder(@PathVariable("id") Long id);

    @PutMapping("/api/rentals/{id}/pickup")
    RentalOrderResponseDTO markPickedUp(@PathVariable("id") Long id);

    @PutMapping("/api/rentals/{id}/return")
    RentalOrderResponseDTO markReturned(@PathVariable("id") Long id);
}
