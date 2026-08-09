package com.arenova.equipment.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

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
public class EquipmentAvailabilityResponseDTO {

    private Long equipmentId;
    private String equipmentName;
    private String sportType;
    private BigDecimal pricePerSlot;
    private LocalDate date;
    private Integer totalUnits;
    private Integer reservedUnits;
    private Integer availableUnits;
}
