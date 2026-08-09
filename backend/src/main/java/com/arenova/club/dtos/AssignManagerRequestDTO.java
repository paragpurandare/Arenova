package com.arenova.club.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Body for assigning a manager to a club. */
@Getter
@Setter
@NoArgsConstructor
public class AssignManagerRequestDTO {

	@NotNull
	private Long managerId;
}
