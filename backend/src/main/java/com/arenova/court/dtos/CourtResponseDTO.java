package com.arenova.court.dtos;

import java.time.LocalTime;

import com.arenova.court.entities.SportsType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CourtResponseDTO {

	private Long id;

	@NotBlank
	private String name;

	@NotNull
	private SportsType sportsType;

	@NotNull
	private Long clubId;

	private LocalTime openTime;

	private LocalTime closeTime;

	private int slotDuration;

	private int bufferTime;

	private int maxPlayers;

	private boolean active;
}
