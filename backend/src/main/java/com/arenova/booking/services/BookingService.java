package com.arenova.booking.services;

import java.util.List;

import com.arenova.booking.dtos.BookingRequestDTO;
import com.arenova.booking.dtos.BookingResponseDTO;

public interface BookingService {

    BookingResponseDTO createBooking(BookingRequestDTO dto);

    BookingResponseDTO confirmBooking(Long id, String gatewayTxnId);

    void cancelBooking(Long id);

    BookingResponseDTO getBooking(Long id);

    List<BookingResponseDTO> getBookingsByUser(Long userId);

    List<BookingResponseDTO> getBookingsByClub(Long clubId);
}
