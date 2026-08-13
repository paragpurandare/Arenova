package rental_service.rental.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import rental_service.rental.entities.RentalOrderItem;

@Repository
public interface RentalOrderItemRepository extends JpaRepository<RentalOrderItem, Long> {

    List<RentalOrderItem> findByRentalOrderId(Long rentalOrderId);

    void deleteByRentalOrderId(Long rentalOrderId);
}
