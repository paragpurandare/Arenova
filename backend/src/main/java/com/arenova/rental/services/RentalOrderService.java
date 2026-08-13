package com.arenova.rental.services;

import java.util.List;

import com.arenova.rental.dtos.RentalOrderRequestDTO;
import com.arenova.rental.dtos.RentalOrderResponseDTO;

public interface RentalOrderService {

    RentalOrderResponseDTO createRentalOrder(RentalOrderRequestDTO dto);

    RentalOrderResponseDTO getRentalOrder(Long id);

    List<RentalOrderResponseDTO> getRentalOrdersByUser(Long userId);

    RentalOrderResponseDTO getRentalOrderByBooking(Long bookingId);

    void cancelRentalOrder(Long id);

    RentalOrderResponseDTO markPickedUp(Long id);

    RentalOrderResponseDTO markReturned(Long id);
}
