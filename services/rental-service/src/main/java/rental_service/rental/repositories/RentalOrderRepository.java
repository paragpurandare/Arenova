package rental_service.rental.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import rental_service.rental.entities.RentalOrder;

@Repository
public interface RentalOrderRepository extends JpaRepository<RentalOrder, Long> {

    List<RentalOrder> findByUserId(Long userId);

    Optional<RentalOrder> findByBookingId(Long bookingId);
}
