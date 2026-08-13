package rental_service.rental.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import rental_service.common.entities.BaseEntity;
import rental_service.rental.enums.RentalStatus;

@Entity
@Table(name = "rental_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@AttributeOverride(
    name = "id",
    column = @Column(name = "rental_order_id")
)
public class RentalOrder extends BaseEntity {

    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_name")
    private String userName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RentalStatus status = RentalStatus.PENDING;

    @Column(nullable = false)
    private LocalDate rentalDate;

    private LocalDateTime pickedUpAt;

    private LocalDateTime returnedAt;
}
