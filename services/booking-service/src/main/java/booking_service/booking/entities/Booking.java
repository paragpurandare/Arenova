package booking_service.booking.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import booking_service.booking.enums.BookingStatus;
import booking_service.common.entities.BaseEntity;
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

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@AttributeOverride(
    name = "id",
    column = @Column(name = "booking_id")
)
public class Booking extends BaseEntity {

    @Column(name = "slot_id", nullable = false)
    private Long slotId;

    @Column(name = "court_id")
    private Long courtId;

    @Column(name = "court_name")
    private String courtName;

    @Column(name = "sports_type")
    private String sportsType;

    @Column(name = "club_id")
    private Long clubId;

    @Column(name = "club_name")
    private String clubName;

    @Column(name = "slot_date")
    private LocalDate slotDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "rental_order_id")
    private Long rentalOrderId;

    @Column(name = "payment_id")
    private Long paymentId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount; // court fee

    @Column(precision = 10, scale = 2)
    private BigDecimal rentalAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal platformFee = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal gstAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "qr_code", length = 255)
    private String qrCode;
}
