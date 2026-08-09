package com.arenova.schedulers;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.arenova.court.entities.Court;
import com.arenova.court.repositories.CourtRepository;
import com.arenova.slot.services.SlotService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor

public class SlotSchedular {

	private final SlotService slotService;
	
	private final CourtRepository courtRepo;
	
	@Scheduled(cron="0 */15 * * * *")
    public void expireSlots(){

        slotService.expirePastSlots();

    }
	
	
	@Scheduled(cron = "0 0 0 * * *")
    public void generateDailySlots() {

        List<Court> courts = courtRepo.findAllByActiveTrue();

        for (Court court : courts) {
            slotService.generateNextDaySlots(court.getId());
        }
    }
}
