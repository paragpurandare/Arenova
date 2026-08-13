package rental_service.rental.services;

import java.util.List;

import rental_service.rental.dtos.RentalOrderRequestDTO;
import rental_service.rental.dtos.RentalOrderResponseDTO;

public interface RentalOrderService {

    RentalOrderResponseDTO createRentalOrder(RentalOrderRequestDTO dto);

    RentalOrderResponseDTO getRentalOrder(Long id);

    List<RentalOrderResponseDTO> getRentalOrdersByUser(Long userId);

    RentalOrderResponseDTO getRentalOrderByBooking(Long bookingId);

    void cancelRentalOrder(Long id);

    RentalOrderResponseDTO markPickedUp(Long id);

    RentalOrderResponseDTO markReturned(Long id);
}
