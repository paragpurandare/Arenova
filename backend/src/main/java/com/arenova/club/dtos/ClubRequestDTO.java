package com.arenova.club.dtos;

import java.math.BigDecimal;

import com.arenova.club.enums.ClubStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Setter
@Getter
@NoArgsConstructor

public class ClubRequestDTO {
	
		@NotBlank
	    private String name;
	    private String description;
	    private BigDecimal latitude;
	    private BigDecimal longitude;
	    private String address;
	    private String city;    
	    private String state;
	    private String country;
	    private String pincode;
	    private String placeId;
	    private String imageUrl;
	    private Long ownerId;
	    private BigDecimal basePrice;
	    
}
