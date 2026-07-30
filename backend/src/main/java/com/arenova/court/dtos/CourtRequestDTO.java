package com.arenova.court.dtos;

import com.arenova.court.entities.SportsType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor

public class CourtRequestDTO {

	@NotBlank
	private String name;
	
	@NotNull
	private SportsType sportsType;
	
	@NotNull
	private Long clubId;
	
}
