package com.arenova.slot.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import com.arenova.slot.entities.SlotStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class SlotsResponseDTO {

	 	private Long id;
	    private Long courtId;
	    private LocalDate slotDate;
	    private LocalTime  startTime;
	    private LocalTime endTime;
	    private SlotStatus status;
}
