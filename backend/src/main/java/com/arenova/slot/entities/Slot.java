package com.arenova.slot.entities;

import com.arenova.common.entities.BaseEntity;
import com.arenova.court.entities.Court;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
    name = "slots",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_court_date_start_time",
            columnNames = {"court_id", "slot_date", "start_time"}
        )
    },
    indexes = {
        @Index(
            name = "idx_court_slot_date",
            columnList = "court_id, slot_date"
        )
    }
)

@AttributeOverride(
	    name = "id",
	    column = @Column(name = "slot_id")
	    
	   )

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Slot extends BaseEntity {

	
	 	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	    @JoinColumn(name = "court_id", nullable = false)
	    private Court court;

	    @Column(name = "slot_date", nullable = false)
	    private LocalDate slotDate;

	    @Column(name = "start_time", nullable = false)
	    private LocalTime startTime;

	    @Column(name = "end_time", nullable = false)
	    private LocalTime endTime;

	    @Enumerated(EnumType.STRING)
	    @Column(nullable = false)
	    private SlotStatus status;
	
}
