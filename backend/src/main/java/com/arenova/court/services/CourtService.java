package com.arenova.court.services;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.arenova.club.entities.Club;
import com.arenova.club.repository.ClubRepository;
import com.arenova.common.Exceptions.ResourceNotFoundException;
import com.arenova.court.dtos.CourtEditDTO;
import com.arenova.court.dtos.CourtRequestDTO;
import com.arenova.court.dtos.CourtResponseDTO;
import com.arenova.court.entities.Court;
import com.arenova.court.entities.CourtConfig;
import com.arenova.court.repositories.CourtRepository;
import com.arenova.slot.services.SlotService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional

@RequiredArgsConstructor

public class CourtService {
	
	private final ClubRepository clubRepo;

	private final CourtRepository courtRepo;
	
	private final SlotService slotService;
	
	private final ModelMapper modelMapper;
	
	
	public void insertNewCourt(CourtRequestDTO dto) {
		
		
		Club club = clubRepo.findById(dto.getClubId())
							.orElseThrow(()-> new ResourceNotFoundException("Club not Found!"));
		
		
		Court court = new Court();
		
		court = modelMapper.map(dto, Court.class);
		
		court.setClub(club);
		
		court.setId(null);
		
		court.setActive(true);
		
		
		CourtConfig config = new CourtConfig();
	    config.setOpenTime(LocalTime.of(6, 0));   // Default 06:00
	    config.setCloseTime(LocalTime.of(22, 0)); // Default 22:00
	    config.setSlotDuration(60);            	 // Default 60 mins
	    config.setBufferTime(0);              	 // Default 0 mins
	    config.setMaxPlayers(4);              	 // Default 4 players

	    court.setConfig(config);
	    
	    
	    Court savedCourt = courtRepo.save(court);
	    
	    slotService.generateSlots(savedCourt.getId());
	    					
	}
	
	public void updateCourt(CourtEditDTO dto, Long courtId) {
	    // 1. Fetch existing managed entity
	    Court court = courtRepo.findById(courtId)
	            .orElseThrow(() -> new ResourceNotFoundException("Court not found"));
	    
	    // 2. Map updated fields directly onto the EXISTING court object
	    modelMapper.map(dto, court);
	    court.setActive(dto.isActive());
	    
	    // 3. Reuse the EXISTING CourtConfig attached to this court
	    CourtConfig config = court.getConfig();
	    if (config == null) {
	        config = new CourtConfig();
	        court.setConfig(config);
	    }

	    // 4. Update fields on the existing config object (preserves config_id)
	    config.setOpenTime(dto.getOpenTime());
	    config.setCloseTime(dto.getCloseTime());
	    config.setSlotDuration(dto.getSlotDuration());
	    config.setBufferTime(dto.getBufferTime());
	    config.setMaxPlayers(dto.getMaxPlayers());

	    // 5. Save changes
	    Court savedCourt = courtRepo.save(court);
	    
	    slotService.generateSlots(savedCourt.getId());
	    
	}
	
	
	public List<CourtResponseDTO> getAllCourts(Long clubId) {
		
		
		List<Court> courts = courtRepo.findByClubId(clubId);
		
		
		return courts.stream()
					 .map(court -> {
						 
						 CourtResponseDTO dto = modelMapper.map(court, CourtResponseDTO.class);
						 
						// Manually map nested fields from Club and Config
	                     if (court.getClub() != null) {
	                         dto.setClubId(court.getClub().getId());
	                     }
	                     
	                     if (court.getConfig() != null) {
	                         dto.setOpenTime(court.getConfig().getOpenTime());
	                         dto.setCloseTime(court.getConfig().getCloseTime());
	                         dto.setSlotDuration(court.getConfig().getSlotDuration());
	                     }
						 
						 return dto;
					 })
					 .collect(Collectors.toList());
	}
	
	
	public List<CourtResponseDTO> getAllActiveCourts(Long clubId) {
		
		
		List<Court> courts = courtRepo.findByClubIdAndActiveTrue(clubId);
		
		
		return courts.stream()
					 .map(court -> {
						 
						 CourtResponseDTO dto = modelMapper.map(court, CourtResponseDTO.class);
						 
						// Manually map nested fields from Club and Config
	                     if (court.getClub() != null) {
	                         dto.setClubId(court.getClub().getId());
	                     }
	                     
	                     if (court.getConfig() != null) {
	                         dto.setOpenTime(court.getConfig().getOpenTime());
	                         dto.setCloseTime(court.getConfig().getCloseTime());
	                         dto.setSlotDuration(court.getConfig().getSlotDuration());
	                     }
	                     
						 return dto;
					 })
					 .collect(Collectors.toList());
	}
}
