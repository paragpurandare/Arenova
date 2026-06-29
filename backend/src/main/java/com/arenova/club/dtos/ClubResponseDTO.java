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
	private String Address;
	private String city;
	private BigDecimal basePrice;
	private ClubStatus status;
	private String ownerName;
	private String imageUrl;
}
