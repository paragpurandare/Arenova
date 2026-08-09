package com.arenova.club.services;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
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
				.orElseThrow(() -> new ResourceNotFoundException("Owner not Found!"));
	
		Club club = modelMapper.map(clubDto, Club.class);
		club.setPlaceId(clubDto.getPlaceId());
		club.setId(null);
		club.setOwner(owner);
		club.setStatus(ClubStatus.PENDING);
		
		clubRepo.save(club);
	}
	
	public List<ClubResponseDTO> getAllClubs(Long ownerId) {
		if (!userRepo.existsById(ownerId)) {
			throw new ResourceNotFoundException("Owner Does not Exists");
		}
	    
		List<Club> clubs = clubRepo.findClubsByOwnerId(ownerId);
	    
		return clubs.stream()
				.map(this::toResponseDto)
				.collect(Collectors.toList());
	}

	public List<ClubResponseDTO> getAllClubsForAdmin() {
		return clubRepo.findAll().stream()
				.map(this::toResponseDto)
				.collect(Collectors.toList());
	}

	public ClubResponseDTO updateClubStatus(Long clubId, ClubStatus status) {
		Club club = clubRepo.findById(clubId)
				.orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));

		club.setStatus(status);

		return toResponseDto(clubRepo.save(club));
	}
	
	public List<NearbyClubResponseDTO> getNearbyClubs(BigDecimal latitude,
	                                                  BigDecimal longitude,
	                                                  Double radiusKm) {
		double radius = (radiusKm != null) ? radiusKm : 10.0;
		double custLat = latitude.doubleValue();
		double custLng = longitude.doubleValue();

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
					dto.setDistanceKm(Math.round(dist * 100.0) / 100.0);
					return dto;
				})
				.filter(dto -> dto.getDistanceKm() <= radius)
				.sorted(Comparator.comparingDouble(NearbyClubResponseDTO::getDistanceKm))
				.collect(Collectors.toList());
	}

	private double haversineKm(double lat1, double lng1, double lat2, double lng2) {
		final double R = 6371.0;
		double dLat = Math.toRadians(lat2 - lat1);
		double dLng = Math.toRadians(lng2 - lng1);
		double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
				+ Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
				* Math.sin(dLng / 2) * Math.sin(dLng / 2);
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	/**
	 * Convert a Club entity to ClubResponseDTO via direct assignment
	 * to prevent ModelMapper mapping exceptions caused by entity references.
	 */
	public ClubResponseDTO toResponseDto(Club club) {
		if (club == null) {
			return null;
		}

		ClubResponseDTO dto = new ClubResponseDTO();
		dto.setId(club.getId());
		dto.setName(club.getName());
		dto.setAddress(club.getAddress());
		dto.setCity(club.getCity());
		dto.setBasePrice(club.getBasePrice());
		dto.setStatus(club.getStatus());
		dto.setImageUrl(club.getImageUrl());
		dto.setLatitude(club.getLatitude());
		dto.setLongitude(club.getLongitude());

		if (club.getOwner() != null) {
			dto.setOwnerFirstName(club.getOwner().getFirstName() + " " + club.getOwner().getLastName());
		}

		return dto;
	}
}