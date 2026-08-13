package com.arenova.client.dtos;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotGenerateRequestDTO {
    private Long courtId;
    private LocalTime openTime;
    private LocalTime closeTime;
    private Integer slotDuration;
    private Integer bufferTime;
    private Integer days;
}
