package booking_service.booking.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import booking_service.booking.entities.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findBySlotId(Long slotId);

    List<Booking> findByClubIdOrderByCreatedAtDesc(Long clubId);

    Optional<Booking> findFirstBySlotIdOrderByIdDesc(Long slotId);
}
