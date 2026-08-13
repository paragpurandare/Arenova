package com.arenova.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.arenova.booking.dtos.BookingRequestDTO;
import com.arenova.booking.dtos.BookingResponseDTO;

@FeignClient(name = "BOOKING-SERVICE", url = "${booking.service.url:http://localhost:8084}")
public interface BookingClient {

    @PostMapping("/api/bookings")
    BookingResponseDTO createBooking(@RequestBody BookingRequestDTO dto);

    @PutMapping("/api/bookings/{id}/confirm")
    BookingResponseDTO confirmBooking(
            @PathVariable("id") Long id,
            @RequestParam(value = "gatewayTxnId", required = false) String gatewayTxnId);

    @PutMapping("/api/bookings/{id}/cancel")
    void cancelBooking(@PathVariable("id") Long id);

    @GetMapping("/api/bookings/{id}")
    BookingResponseDTO getBooking(@PathVariable("id") Long id);

    @GetMapping("/api/bookings/user/{userId}")
    List<BookingResponseDTO> getBookingsByUser(@PathVariable("userId") Long userId);

    @GetMapping("/api/bookings/club/{clubId}")
    List<BookingResponseDTO> getBookingsByClub(@PathVariable("clubId") Long clubId);
}
