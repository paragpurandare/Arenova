package com.arenova.court.entities;

import java.time.LocalTime;

import com.arenova.club.entities.Club;
import com.arenova.common.entities.BaseEntity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "court_config")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@AttributeOverride(
	    name = "id",
	    column = @Column(name = "config_id")
	    
	   )

public class CourtConfig extends BaseEntity {


	@Column(name = "open_time")
	private LocalTime openTime;
	
	@Column(name = "close_time")
    private LocalTime closeTime;
	
    @Column(name = "slot_duration")
    private int slotDuration;
    
	@Column(name = "buffer_time")
    private int bufferTime;
	
	@Column(name = "max_players")
    private int maxPlayers;      
}
