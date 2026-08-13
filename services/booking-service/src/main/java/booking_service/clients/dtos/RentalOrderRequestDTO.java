package booking_service.clients.dtos;

import java.time.LocalDate;
import java.util.List;

import booking_service.booking.dtos.RentalItemRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentalOrderRequestDTO {
    private Long userId;
    private String userName;
    private Long bookingId;
    private LocalDate date;
    private List<RentalItemRequest> items;
}
