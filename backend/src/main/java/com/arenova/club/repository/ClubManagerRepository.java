package com.arenova.club.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.arenova.club.entities.ClubManager;

public interface ClubManagerRepository extends JpaRepository<ClubManager, Long> {

    /** Find the active ClubManager record for the given manager user id. */
	@Query("SELECT cm FROM ClubManager cm JOIN FETCH cm.club c LEFT JOIN FETCH c.owner WHERE cm.manager.id = :managerId AND cm.active = true")
    Optional<ClubManager> findByManager_IdAndActiveTrue(Long managerId);

    /** Any existing assignment row for this club (active or not) - club_id is unique. */
    Optional<ClubManager> findByClub_Id(Long clubId);

    /** Any existing assignment row for this manager (active or not) - manager_id is unique. */
    Optional<ClubManager> findByManager_Id(Long managerId);
}
