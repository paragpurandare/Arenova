package com.arenova.court.services;

import com.arenova.court.dtos.CourtEditDTO;
import com.arenova.court.entities.CourtConfig;

/**
 * Owns all CourtConfig logic (defaults, edits) so CourtService only has
 * to worry about the Court itself, not the operating-hours / slot-duration
 * rules that live on its config.
 */
public interface CourtConfigService {

    /** Builds a fresh config with sensible defaults for a brand-new court. */
    CourtConfig buildDefaultConfig();

    /** Applies edited values from the DTO onto an existing config in place. */
    void applyEdits(CourtConfig config, CourtEditDTO dto);
}
