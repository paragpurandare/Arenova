package com.arenova.equipment.entities;

import java.time.LocalDate;

import com.arenova.common.entities.BaseEntity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "equipment_inventory",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_equipment_date",
        columnNames = {"equipment_id", "date"}
    )
)

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@AttributeOverride(
    name = "id",
    column = @Column(name = "inventory_id")
)

public class EquipmentInventory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private Integer totalUnits;

    @Column(nullable = false)
    private Integer reservedUnits = 0;
}
