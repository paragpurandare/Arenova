package com.arenova.club.dtos;

import java.math.BigDecimal;

import com.arenova.club.enums.ClubStatus;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO returned by the nearby-clubs endpoint. Extends ClubResponseDTO fields
 * and adds the computed distance (in km) from the customer's location.
 */
@Getter
@Setter
@NoArgsConstructor
public class NearbyClubResponseDTO {

    private Long id;
    private String name;
    private String address;
    private String city;
    private BigDecimal basePrice;
    private ClubStatus status;
    private String imageUrl;
    private Double distanceKm;
}
