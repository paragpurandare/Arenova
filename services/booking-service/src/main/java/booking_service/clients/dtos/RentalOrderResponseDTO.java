package booking_service.clients.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentalOrderResponseDTO {
    private Long id;
    private Long bookingId;
    private Long userId;
    private String userName;
    private BigDecimal totalAmount;
    private String status;
    private LocalDate rentalDate;
}
