package com.arenova.booking.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.arenova.booking.entities.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findBySlotId(Long slotId);

    Optional<Booking> findFirstBySlotIdOrderByIdDesc(Long slotId);

    @Query("SELECT b FROM Booking b JOIN b.slot s JOIN s.court c WHERE c.club.id = :clubId ORDER BY b.createdAt DESC")
    List<Booking> findByClubId(@Param("clubId") Long clubId);
}
