package com.arenova.court.dtos;

import java.time.LocalTime;

import com.arenova.court.entities.SportsType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Body for editing a court. All config-related fields are optional
 * (wrapper types, not primitives) so a partial edit - e.g. renaming a
 * court without touching its hours - doesn't silently reset the rest
 * of the config to zero/false. Only fields actually sent get applied;
 * see CourtConfigServiceImpl.applyEdits().
 */
@Getter
@Setter
@NoArgsConstructor
public class CourtEditDTO {

	@NotBlank
	private String name;

	@NotNull
	private SportsType sportsType;

	private LocalTime openTime;

	private LocalTime closeTime;

	private Boolean active;

	private Integer bufferTime;

	private Integer slotDuration;

	private Integer maxPlayers;
}
