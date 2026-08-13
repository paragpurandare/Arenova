package slot_service.slot.schedulers;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import slot_service.slot.repositories.SlotRepository;
import slot_service.slot.services.SlotService;

@Component
@RequiredArgsConstructor
@Slf4j
public class SlotScheduler {

    private final SlotService slotService;
    private final SlotRepository slotRepository;

    /**
     * Runs every 15 minutes to mark past available slots as EXPIRED.
     */
    @Scheduled(cron = "0 */15 * * * *")
    public void expirePastSlots() {
        log.info("Running scheduled task: expirePastSlots...");
        try {
            slotService.expirePastSlots();
            log.info("Expired past slots successfully.");
        } catch (Exception ex) {
            log.error("Error during expirePastSlots scheduler: {}", ex.getMessage(), ex);
        }
    }

    /**
     * Runs every day at midnight (00:00:00) to generate slots for the next day.
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void generateDailySlots() {
        log.info("Running scheduled task: generateDailySlots...");
        try {
            List<Long> courtIds = slotRepository.findDistinctCourtIds();
            for (Long courtId : courtIds) {
                slotService.generateNextDaySlots(courtId, null, null, 60, 0);
            }
            log.info("Generated daily slots for {} courts.", courtIds.size());
        } catch (Exception ex) {
            log.error("Error during generateDailySlots scheduler: {}", ex.getMessage(), ex);
        }
    }
}
