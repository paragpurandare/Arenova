package com.arenova.booking.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.arenova.booking.enums.BookingStatus;
import com.arenova.payment.dtos.PaymentResponseDTO;
import com.arenova.rental.dtos.RentalOrderResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {

    private Long id;

    // Slot & Court Details
    private Long slotId;
    private Long courtId;
    private String courtName;
    private String sportsType;
    private Long clubId;
    private String clubName;
    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;

    // User Details
    private Long userId;
    private String userName;

    // Financial Breakdown
    private BigDecimal courtAmount;
    private BigDecimal rentalAmount;
    private BigDecimal platformFee;
    private BigDecimal gstAmount;
    private BigDecimal totalPayable;

    // Status & Verification
    private BookingStatus status;
    private String qrCode;
    private LocalDateTime createdAt;

    // Linked Entities
    private RentalOrderResponseDTO rentalOrder;
    private PaymentResponseDTO payment;
}
