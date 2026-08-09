package com.arenova.equipment.entities;

import java.math.BigDecimal;

import com.arenova.club.entities.Club;
import com.arenova.common.entities.BaseEntity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "equipment")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@AttributeOverride(
    name = "id",
    column = @Column(name = "equipment_id")
)

public class Equipment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String sportType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerSlot;

    @Column(nullable = false)
    private Integer totalStock;

    @Column(nullable = false)
    private Boolean isActive = true;
}
