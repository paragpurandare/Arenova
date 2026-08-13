package booking_service.booking.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import booking_service.booking.dtos.BookingRequestDTO;
import booking_service.booking.dtos.BookingResponseDTO;
import booking_service.booking.services.BookingService;
import booking_service.common.dtos.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequestDTO dto) {
        BookingResponseDTO response = bookingService.createBooking(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<BookingResponseDTO> confirmBooking(
            @PathVariable Long id,
            @RequestParam(required = false) String gatewayTxnId) {
        BookingResponseDTO response = bookingService.confirmBooking(id, gatewayTxnId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok(new ApiResponse("Booking cancelled successfully", "Success"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBooking(@PathVariable Long id) {
        BookingResponseDTO response = bookingService.getBooking(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByUser(@PathVariable Long userId) {
        List<BookingResponseDTO> response = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByClub(@PathVariable Long clubId) {
        List<BookingResponseDTO> response = bookingService.getBookingsByClub(clubId);
        return ResponseEntity.ok(response);
    }
}
