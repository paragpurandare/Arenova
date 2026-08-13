package booking_service.booking.services;

import java.util.List;

import booking_service.booking.dtos.BookingRequestDTO;
import booking_service.booking.dtos.BookingResponseDTO;

public interface BookingService {

    BookingResponseDTO createBooking(BookingRequestDTO dto);

    BookingResponseDTO confirmBooking(Long id, String gatewayTxnId);

    void cancelBooking(Long id);

    BookingResponseDTO getBooking(Long id);

    List<BookingResponseDTO> getBookingsByUser(Long userId);

    List<BookingResponseDTO> getBookingsByClub(Long clubId);
}
