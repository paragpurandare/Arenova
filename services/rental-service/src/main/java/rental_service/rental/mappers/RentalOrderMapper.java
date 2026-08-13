package rental_service.rental.mappers;

import java.util.List;
import java.util.stream.Collectors;

import rental_service.rental.dtos.RentalOrderItemResponseDTO;
import rental_service.rental.dtos.RentalOrderResponseDTO;
import rental_service.rental.entities.RentalOrder;
import rental_service.rental.entities.RentalOrderItem;

public class RentalOrderMapper {

    public static RentalOrderItemResponseDTO toItemResponseDTO(RentalOrderItem item) {
        return RentalOrderItemResponseDTO.builder()
                .id(item.getId())
                .equipmentId(item.getEquipmentId())
                .equipmentName(item.getEquipmentName())
                .sportType(item.getSportType())
                .quantity(item.getQuantity())
                .pricePerUnit(item.getPricePerUnit())
                .subtotal(item.getSubtotal())
                .build();
    }

    public static RentalOrderResponseDTO toResponseDTO(RentalOrder order, List<RentalOrderItem> items) {
        List<RentalOrderItemResponseDTO> itemDTOs = items != null
                ? items.stream().map(RentalOrderMapper::toItemResponseDTO).collect(Collectors.toList())
                : List.of();

        return RentalOrderResponseDTO.builder()
                .id(order.getId())
                .bookingId(order.getBookingId())
                .userId(order.getUserId())
                .userName(order.getUserName())
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
