package com.arenova.rental.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.arenova.rental.dtos.RentalOrderItemResponseDTO;
import com.arenova.rental.dtos.RentalOrderResponseDTO;
import com.arenova.rental.entities.RentalOrder;
import com.arenova.rental.entities.RentalOrderItem;

public class RentalOrderMapper {

    public static RentalOrderItemResponseDTO toItemResponseDTO(RentalOrderItem item) {
        return RentalOrderItemResponseDTO.builder()
                .id(item.getId())
                .equipmentId(item.getEquipment().getId())
                .equipmentName(item.getEquipment().getName())
                .sportType(item.getEquipment().getSportType())
                .quantity(item.getQuantity())
                .pricePerUnit(item.getPricePerUnit())
                .subtotal(item.getSubtotal())
                .build();
    }

    public static RentalOrderResponseDTO toResponseDTO(RentalOrder order, List<RentalOrderItem> items) {
        String fullName = order.getUser().getFirstName() + " " + order.getUser().getLastName();

        List<RentalOrderItemResponseDTO> itemDTOs = items != null
                ? items.stream().map(RentalOrderMapper::toItemResponseDTO).collect(Collectors.toList())
                : List.of();

        return RentalOrderResponseDTO.builder()
                .id(order.getId())
                .bookingId(order.getBookingId())
                .userId(order.getUser().getId())
                .userName(fullName.trim())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .rentalDate(order.getRentalDate())
                .pickedUpAt(order.getPickedUpAt())
                .returnedAt(order.getReturnedAt())
                .createdAt(order.getCreatedAt())
                .items(itemDTOs)
                .build();
    }
}
