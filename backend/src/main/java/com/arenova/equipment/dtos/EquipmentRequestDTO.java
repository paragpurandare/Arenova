package com.arenova.equipment.dtos;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentRequestDTO {

    @NotBlank(message = "Equipment name is required")
    private String name;

    private String sportType;

    @NotNull(message = "Price per slot is required")
    @Positive(message = "Price must be positive")
    private BigDecimal pricePerSlot;

    @NotNull(message = "Total stock is required")
    @Min(value = 1, message = "Stock must be at least 1")
    private Integer totalStock;
}
