package com.arenova.slot.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.arenova.common.Exceptions.ResourceNotFoundException;
import com.arenova.court.entities.Court;
import com.arenova.court.entities.CourtConfig;
import com.arenova.court.repositories.CourtConfigRepository;
import com.arenova.court.repositories.CourtRepository;
import com.arenova.slot.dtos.SlotsResponseDTO;
import com.arenova.slot.entities.Slot;
import com.arenova.slot.entities.SlotStatus;
import com.arenova.slot.repositories.SlotRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Transactional
@RequiredArgsConstructor


public class SlotServiceImpl implements SlotService {
	
	private final SlotRepository slotRepo;
	private final CourtRepository courtRepo;
	private final CourtConfigRepository courtConfigRepo;
	

	@Override
	public List<SlotsResponseDTO> getSlotsByCourtAndDate(Long courtId, LocalDate slotDate) {
		
		  if (!courtRepo.existsById(courtId)) {
		        throw new ResourceNotFoundException("Court not found with id : " + courtId);
		  }

		// TODO Auto-generated method stub
		List<Slot> slots = slotRepo.findAllByCourt_IdAndSlotDate(courtId, slotDate);

	    return slots.stream()
	            .map(this::convertToDto)
	            .toList();
	}

	@Override
	public SlotsResponseDTO getSlotById(Long slotId) {
		
		Slot slot = slotRepo.findById(slotId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Slot not found with id : " + slotId));

	    return convertToDto(slot);
	}

	@Override
	public void blockSlot(Long slotId) {
	
		int updatedRows = slotRepo.blockSlot(slotId);

        if (updatedRows == 0) {
            throw new ResourceNotFoundException("Slot not found with id : " + slotId);
        }
        
	}


	@Override
	public void unblockSlot(Long slotId) {
		
		 int updatedRows = slotRepo.unblockSlot(slotId);

	        if (updatedRows == 0) {
	            throw new ResourceNotFoundException("Slot not found with id : " + slotId);
	        }
		
	}

	@Override
	public void bookSlot(Long slotId) {
		
		 int updatedRows = slotRepo.bookSlot(slotId);

	        if (updatedRows == 0) {
	            throw new IllegalStateException(
	                    "Slot is unavailable, blocked or already booked.");
	        }
		
	}
	
	@Override
	public void expirePastSlots() {
		
		 slotRepo.expirePastSlots(
	                LocalDate.now(),
	                LocalTime.now()
	        );
		
	}
	
	@Override
	public void generateSlots(Long courtId) {
		
		Court court = courtRepo.findById(courtId)
	            .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

	    CourtConfig config = courtConfigRepo.findByCourt_Id(courtId)
	            .orElseThrow(() -> new ResourceNotFoundException("Court configuration not found"));

	    slotRepo.deleteFutureAvailableSlots(courtId, LocalDate.now());

	    List<Slot> slots = new ArrayList<>();

	    LocalDate today = LocalDate.now();

	    for (int i = 0; i < 30; i++) {

	        LocalDate slotDate = today.plusDays(i);

	        LocalTime current = config.getOpenTime();

	        while (true) {

	            LocalTime endTime =
	                    current.plusMinutes(config.getSlotDuration());

	            if (endTime.isAfter(config.getCloseTime()))
	                break;

	            Slot slot = new Slot();

	            slot.setCourt(court);
	            slot.setSlotDate(slotDate);
	            slot.setStartTime(current);
	            slot.setEndTime(endTime);
	            slot.setStatus(SlotStatus.AVAILABLE);

	            slots.add(slot);

	            current = endTime.plusMinutes(config.getBufferTime());
	        }
	    }

	    slotRepo.saveAll(slots);
		
	}
	
	
	@Override
	public void generateNextDaySlots(Long courtId) {
		
		 Court court = courtRepo.findById(courtId)
		            .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

		    CourtConfig config = courtConfigRepo.findByCourt_Id(courtId)
		            .orElseThrow(() -> new ResourceNotFoundException("Court configuration not found"));

		    LocalDate lastGeneratedDate =
		            slotRepo.findMaxSlotDateByCourt(courtId);

		    if (lastGeneratedDate == null) {
		        lastGeneratedDate = LocalDate.now().minusDays(1);
		    }

		    LocalDate nextDate = lastGeneratedDate.plusDays(1);

		    List<Slot> slots = new ArrayList<>();

		    LocalTime current = config.getOpenTime();

		    while (true) {

		        LocalTime endTime =
		                current.plusMinutes(config.getSlotDuration());

		        if (endTime.isAfter(config.getCloseTime()))
		            break;

		        Slot slot = new Slot();

		        slot.setCourt(court);
		        slot.setSlotDate(nextDate);
		        slot.setStartTime(current);
		        slot.setEndTime(endTime);
		        slot.setStatus(SlotStatus.AVAILABLE);

		        slots.add(slot);

		        current = endTime.plusMinutes(config.getBufferTime());
		    }

		    slotRepo.saveAll(slots);
		}
		
	
	
	private SlotsResponseDTO convertToDto(Slot slot) {

	    SlotsResponseDTO dto = new SlotsResponseDTO();

	    dto.setId(slot.getId());
	    dto.setCourtId(slot.getCourt().getId());
	    dto.setSlotDate(slot.getSlotDate());
	    dto.setStartTime(slot.getStartTime());
	    dto.setEndTime(slot.getEndTime());
	    dto.setStatus(slot.getStatus());

	    return dto;
	}

	
	
}
