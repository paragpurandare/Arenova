package com.arenova.club.dtos;

import com.arenova.club.enums.ClubStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Body for the admin "change club status" endpoint (approve/suspend/reactivate). */
@Getter
@Setter
@NoArgsConstructor
public class ClubStatusUpdateDTO {

	@NotNull
	private ClubStatus status;
}
