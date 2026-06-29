package com.arenova.club.entities;

import com.arenova.common.entities.BaseEntity;
import com.arenova.user.entities.User;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "club_managers")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClubManager extends BaseEntity {

    // Which club is being managed
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "club_id", nullable = false, unique = true)
    private Club club;

    // Which user is the manager
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "manager_id", nullable = false, unique = true)
    private User manager;

    // Which owner assigned the manager
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assigned_by", nullable = false)
    private User assignedBy;
    
    @Column(nullable = false)
    private Boolean active = true;

}