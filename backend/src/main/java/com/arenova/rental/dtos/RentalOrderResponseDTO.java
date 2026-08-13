package com.arenova.rental.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.arenova.rental.enums.RentalStatus;

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
public class RentalOrderResponseDTO {

    private Long id;
    private Long bookingId;
    private Long userId;
    private String userName;
    private BigDecimal totalAmount;
    private RentalStatus status;
    private LocalDate rentalDate;
    private LocalDateTime pickedUpAt;
    private LocalDateTime returnedAt;
    private LocalDateTime createdAt;
    private List<RentalOrderItemResponseDTO> items;
}
