package com.arenova.booking.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.arenova.booking.dtos.BookingRequestDTO;
import com.arenova.booking.dtos.BookingResponseDTO;
import com.arenova.client.BookingClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingClient bookingClient;

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO dto) {
        return bookingClient.createBooking(dto);
    }

    @Override
    public BookingResponseDTO confirmBooking(Long id, String gatewayTxnId) {
        return bookingClient.confirmBooking(id, gatewayTxnId);
    }

    @Override
    public void cancelBooking(Long id) {
        bookingClient.cancelBooking(id);
    }

    @Override
    public BookingResponseDTO getBooking(Long id) {
        return bookingClient.getBooking(id);
    }

    @Override
    public List<BookingResponseDTO> getBookingsByUser(Long userId) {
        return bookingClient.getBookingsByUser(userId);
    }

    @Override
    public List<BookingResponseDTO> getBookingsByClub(Long clubId) {
        return bookingClient.getBookingsByClub(clubId);
    }
}
