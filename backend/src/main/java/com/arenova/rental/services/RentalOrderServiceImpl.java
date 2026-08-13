package com.arenova.rental.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.arenova.client.RentalClient;
import com.arenova.rental.dtos.RentalOrderRequestDTO;
import com.arenova.rental.dtos.RentalOrderResponseDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RentalOrderServiceImpl implements RentalOrderService {

    private final RentalClient rentalClient;

    @Override
    public RentalOrderResponseDTO createRentalOrder(RentalOrderRequestDTO dto) {
        return rentalClient.createRentalOrder(dto);
    }

    @Override
    public RentalOrderResponseDTO getRentalOrder(Long id) {
        return rentalClient.getRentalOrder(id);
    }

    @Override
    public List<RentalOrderResponseDTO> getRentalOrdersByUser(Long userId) {
        return rentalClient.getRentalOrdersByUser(userId);
    }

    @Override
    public RentalOrderResponseDTO getRentalOrderByBooking(Long bookingId) {
        return rentalClient.getRentalOrderByBooking(bookingId);
    }

    @Override
    public void cancelRentalOrder(Long id) {
        rentalClient.cancelRentalOrder(id);
    }

    @Override
    public RentalOrderResponseDTO markPickedUp(Long id) {
        return rentalClient.markPickedUp(id);
    }

    @Override
    public RentalOrderResponseDTO markReturned(Long id) {
        return rentalClient.markReturned(id);
    }
}
