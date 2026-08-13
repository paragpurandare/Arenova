package booking_service.booking.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDTO {

    @NotNull(message = "Slot ID is required")
    private Long slotId;

    private Long courtId;
    private String courtName;
    private String sportsType;
    private Long clubId;
    private String clubName;
    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String userName;

    private BigDecimal courtAmount;

    private String paymentMethod;

    @Valid
    private List<RentalItemRequest> equipmentItems;
}
