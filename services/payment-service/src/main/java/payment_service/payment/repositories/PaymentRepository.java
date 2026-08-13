package payment_service.payment.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import payment_service.payment.entities.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserId(Long userId);

    Optional<Payment> findByBookingId(Long bookingId);

    Optional<Payment> findByGatewayTxnId(String gatewayTxnId);
}
