package com.arenova.court.services;

import java.time.LocalTime;

import org.springframework.stereotype.Service;

import com.arenova.court.dtos.CourtEditDTO;
import com.arenova.court.entities.CourtConfig;

@Service
public class CourtConfigServiceImpl implements CourtConfigService {

    // Sensible defaults applied to every newly created court.
    private static final LocalTime DEFAULT_OPEN_TIME = LocalTime.of(6, 0);
    private static final LocalTime DEFAULT_CLOSE_TIME = LocalTime.of(22, 0);
    private static final int DEFAULT_SLOT_DURATION_MINS = 60;
    private static final int DEFAULT_BUFFER_MINS = 0;
    private static final int DEFAULT_MAX_PLAYERS = 4;

    @Override
    public CourtConfig buildDefaultConfig() {
        CourtConfig config = new CourtConfig();
        config.setOpenTime(DEFAULT_OPEN_TIME);
        config.setCloseTime(DEFAULT_CLOSE_TIME);
        config.setSlotDuration(DEFAULT_SLOT_DURATION_MINS);
        config.setBufferTime(DEFAULT_BUFFER_MINS);
        config.setMaxPlayers(DEFAULT_MAX_PLAYERS);
        return config;
    }

    @Override
    public void applyEdits(CourtConfig config, CourtEditDTO dto) {
        // Only touch fields that were actually sent - null means "leave
        // this one alone", so a name-only edit can't zero out the rest
        // of the court's config (openTime/closeTime/slotDuration/etc).
        if (dto.getOpenTime() != null) {
            config.setOpenTime(dto.getOpenTime());
        }
        if (dto.getCloseTime() != null) {
            config.setCloseTime(dto.getCloseTime());
        }
        if (dto.getSlotDuration() != null) {
            config.setSlotDuration(dto.getSlotDuration());
        }
        if (dto.getBufferTime() != null) {
            config.setBufferTime(dto.getBufferTime());
        }
        if (dto.getMaxPlayers() != null) {
            config.setMaxPlayers(dto.getMaxPlayers());
        }
    }
}
