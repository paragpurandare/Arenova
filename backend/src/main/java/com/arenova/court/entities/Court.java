package com.arenova.court.entities;

import java.math.BigDecimal;

import com.arenova.club.entities.Club;
import com.arenova.club.enums.ClubStatus;
import com.arenova.common.entities.BaseEntity;
import com.arenova.user.entities.User;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "courts")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@AttributeOverride(
	    name = "id",
	    column = @Column(name = "court_id")
	    
	   )

public class Court extends BaseEntity {
	
	  @Column(length = 50)
	  private String name;
	  
	  @Enumerated(EnumType.STRING)
	  @Column(name = "sports_type", length = 50)
	  private SportsType sportsType;
	  
	  
	  @Column(name = "active")
	  private boolean active;
	  
	  @ManyToOne(fetch = FetchType.LAZY)
	  @JoinColumn(name = "club_id")
	  private Club club;
	    
	  @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
	  @JoinColumn(name = "config_id")
	  private CourtConfig config;   // auto-created with defaults
}
