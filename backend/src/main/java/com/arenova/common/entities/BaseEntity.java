package com.arenova.common.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

	@MappedSuperclass
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor 
	public abstract class BaseEntity {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @CreationTimestamp
	    @Column(updatable = false, nullable = false)
	    private LocalDateTime createdAt;

	    @UpdateTimestamp
	    private LocalDateTime updatedAt;
	    
	    @Column
	    private LocalDateTime deletedAt;
}
