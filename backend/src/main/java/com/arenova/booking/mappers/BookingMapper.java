package com.arenova.booking.mappers;

import java.math.BigDecimal;

import com.arenova.booking.dtos.BookingResponseDTO;
import com.arenova.booking.entities.Booking;
import com.arenova.payment.dtos.PaymentResponseDTO;
import com.arenova.rental.dtos.RentalOrderResponseDTO;
import com.arenova.slot.entities.Slot;

public class BookingMapper {

    public static BookingResponseDTO toResponseDTO(
            Booking booking,
            RentalOrderResponseDTO rentalOrderDTO,
            PaymentResponseDTO paymentDTO) {

        Slot slot = booking.getSlot();
        String userName = booking.getUser().getFirstName() + " " + booking.getUser().getLastName();

        BigDecimal rentalAmount = rentalOrderDTO != null ? rentalOrderDTO.getTotalAmount() : BigDecimal.ZERO;

        return BookingResponseDTO.builder()
                .id(booking.getId())
                .slotId(slot.getId())
                .courtId(slot.getCourt().getId())
                .courtName(slot.getCourt().getName())
                .sportsType(slot.getCourt().getSportsType() != null ? slot.getCourt().getSportsType().name() : null)
                .clubId(slot.getCourt().getClub().getId())
                .clubName(slot.getCourt().getClub().getName())
                .slotDate(slot.getSlotDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .userId(booking.getUser().getId())
                .userName(userName.trim())
                .courtAmount(booking.getAmount())
                .rentalAmount(rentalAmount)
                .platformFee(booking.getPlatformFee())
                .gstAmount(booking.getGstAmount())
                .totalPayable(booking.getTotalAmount())
                .status(booking.getStatus())
                .qrCode(booking.getQrCode())
                .createdAt(booking.getCreatedAt())
                .rentalOrder(rentalOrderDTO)
                .payment(paymentDTO)
                .build();
    }
}
