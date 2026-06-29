package com.arenova.club.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.arenova.club.dtos.ClubRequestDTO;
import com.arenova.club.dtos.ClubResponseDTO;
import com.arenova.club.entities.Club;
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
		
		clubRepo.save(club);
	}
	
	public List<ClubResponseDTO> getAllClubs(Long ownerId) {
		
		if(!userRepo.existsById(ownerId)) {
			
			throw new ResourceNotFoundException("Owner Does not Exists");
		}
		
		List<Club> clubs = clubRepo.findClubsByOwnerId(ownerId);
		
		return clubs.stream()
					.map((club)-> modelMapper.map(club, ClubResponseDTO.class))
					.collect(Collectors.toList());
				
	}
	
}
