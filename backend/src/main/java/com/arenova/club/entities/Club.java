package com.arenova.club.entities;

import java.math.BigDecimal;

import com.arenova.club.enums.ClubStatus;
import com.arenova.common.entities.BaseEntity;
import com.arenova.user.entities.User;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "clubs")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@AttributeOverride(
	    name = "id",
	    column = @Column(name = "club_id")
	)

public class Club extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 100)
    private String country;

    @Column(length = 10)
    private String pincode;

    @Column(length = 100)
    private String placeId;

    @Column(nullable = false)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClubStatus status;
    
    
    
    
//    @OneToMany(mappedBy = "club")
//    private List<Equipment> equipment;
    
//    @OneToMany(mappedBy = "club")
//    private List<Court> courts;
    
    
//    @Column(nullable = false)
//    @Builder.Default
//    private Boolean active = true;
}