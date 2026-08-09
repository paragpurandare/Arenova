package com.arenova.equipment.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
public class EquipmentResponseDTO {

    private Long id;
    private Long clubId;
    private String clubName;
    private String name;
    private String sportType;
    private BigDecimal pricePerSlot;
    private Integer totalStock;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
