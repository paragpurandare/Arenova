package com.arenova.rental.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.arenova.rental.entities.RentalOrder;
import com.arenova.rental.enums.RentalStatus;

@Repository
public interface RentalOrderRepository extends JpaRepository<RentalOrder, Long> {

    List<RentalOrder> findByUserId(Long userId);

    Optional<RentalOrder> findByBookingId(Long bookingId);

    List<RentalOrder> findByUserIdAndStatus(Long userId, RentalStatus status);
}
