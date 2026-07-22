package com.arenova.club.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arenova.club.entities.Club;
import com.arenova.club.enums.ClubStatus;

public interface ClubRepository extends JpaRepository<Club, Long> {

	public List<Club> findClubsByOwnerId(Long ownerId); // get all clubs by owner

	public Optional<Club> findByIdAndOwnerId(Long Id, Long ownerId); // this we are going to use for edit club

	public List<Club> findByStatus(ClubStatus status); // nearby clubs query
}
