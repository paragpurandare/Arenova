package com.arenova.club.dtos;

import java.math.BigDecimal;

import com.arenova.club.enums.ClubStatus;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ClubResponseDTO {

	private Long id;
	private String name;
	private String address;
	private String city;
	private BigDecimal basePrice;
	private ClubStatus status;
	private String ownerFirstName;
	private String imageUrl;

	// Lets the frontend compute "distance from me" for the owner's own
	// clubs the same way it already does for the customer nearby list.
	private BigDecimal latitude;
	private BigDecimal longitude;
}
