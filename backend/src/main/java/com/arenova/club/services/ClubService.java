package com.arenova.club.services;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.arenova.club.dtos.ClubRequestDTO;
import com.arenova.club.dtos.ClubResponseDTO;
import com.arenova.club.dtos.NearbyClubResponseDTO;
import com.arenova.club.entities.Club;
import com.arenova.club.enums.ClubStatus;
import com.arenova.club.repository.ClubRepository;
import com.arenova.common.Exceptions.ResourceNotFoundException;
import com.arenova.user.entities.User;
import com.arenova.user.repository.UserRepositroy;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Transactional
@Service

@RequiredArgsConstructor
public class ClubService {
	
	private final ClubRepository clubRepo;
	
	private final UserRepositroy userRepo;
	
	private final ModelMapper modelMapper;
	
	
	public void insertNewClub(ClubRequestDTO clubDto) {
		
		User owner = userRepo.findById(clubDto.getOwnerId())
									   .orElseThrow(()-> new ResourceNotFoundException("Owner not Found!"));
	
		
		Club club = modelMapper.map(clubDto, Club.class);
		club.setPlaceId(clubDto.getPlaceId());
		club.setId(null);
		club.setOwner(owner);
		club.setStatus(ClubStatus.PENDING);
		
		clubRepo.save(club);
	}
	
	
	public List<ClubResponseDTO> getAllClubs(Long ownerId) {
	    
	    if(!userRepo.existsById(ownerId)) {
	        throw new ResourceNotFoundException("Owner Does not Exists");
	    }
	    
	    List<Club> clubs = clubRepo.findClubsByOwnerId(ownerId);
	    
	    return clubs.stream()
	                .map(club -> {
	                    // 1. Let ModelMapper map all matching fields
	                    ClubResponseDTO dto = modelMapper.map(club, ClubResponseDTO.class);
	                    
	                    // 2. Safely stitch together the name if the owner entity exists
	                    if (club.getOwner() != null) {
	                        String fullName = club.getOwner().getFirstName() + " " + club.getOwner().getLastName();
	                        dto.setOwnerFirstName(fullName);
	                    }
	                    
	                    return dto; // 3. Return the fully populated DTO to the stream
	                })
	                .collect(Collectors.toList());
	}
	
	
	/**
	 * Finds all ACTIVE clubs within the given radius (in km) from the
	 * customer's lat/lng coordinates, sorted by distance (nearest first).
	 * Uses the Haversine formula to compute the great-circle distance
	 * between two points on the Earth's surface.
	 *
	 * @param latitude  customer latitude
	 * @param longitude customer longitude
	 * @param radiusKm  search radius in kilometers (default 10 if null)
	 * @return list of nearby clubs with computed distance, sorted ascending
	 */
	public List<NearbyClubResponseDTO> getNearbyClubs(BigDecimal latitude,
	                                                  BigDecimal longitude,
	                                                  Double radiusKm) {
	    double radius = (radiusKm != null) ? radiusKm : 10.0;
	    double custLat = latitude.doubleValue();
	    double custLng = longitude.doubleValue();

	    // Fetch only active clubs so customers never see pending/suspended ones.
	    List<Club> activeClubs = clubRepo.findByStatus(ClubStatus.ACTIVE);

	    return activeClubs.stream()
	            .map(club -> {
	                double dist = haversineKm(custLat, custLng,
	                        club.getLatitude().doubleValue(),
	                        club.getLongitude().doubleValue());

	                NearbyClubResponseDTO dto = new NearbyClubResponseDTO();
	                dto.setId(club.getId());
	                dto.setName(club.getName());
	                dto.setAddress(club.getAddress());
	                dto.setCity(club.getCity());
	                dto.setBasePrice(club.getBasePrice());
	                dto.setStatus(club.getStatus());
	                dto.setImageUrl(club.getImageUrl());
	                dto.setDistanceKm(Math.round(dist * 100.0) / 100.0); // round to 2 decimals
	                return dto;
	            })
	            .filter(dto -> dto.getDistanceKm() <= radius)
	            .sorted(Comparator.comparingDouble(NearbyClubResponseDTO::getDistanceKm))
	            .collect(Collectors.toList());
	}

	/**
	 * Haversine formula — computes the great-circle distance (in km)
	 * between two latitude/longitude coordinate pairs.
	 *
	 * R = 6371 km (Earth's mean radius)
	 * a = sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlng/2)
	 * c = 2·atan2(√a, √(1−a))
	 * d = R · c
	 */
	private double haversineKm(double lat1, double lng1, double lat2, double lng2) {
	    final double R = 6371.0; // Earth radius in km
	    double dLat = Math.toRadians(lat2 - lat1);
	    double dLng = Math.toRadians(lng2 - lng1);
	    double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
	             + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
	             * Math.sin(dLng / 2) * Math.sin(dLng / 2);
	    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    return R * c;
	}
	
}
