package com.arenova.rental.dtos;

import java.math.BigDecimal;

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
public class RentalOrderItemResponseDTO {

    private Long id;
    private Long equipmentId;
    private String equipmentName;
    private String sportType;
    private Integer quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal subtotal;
}
