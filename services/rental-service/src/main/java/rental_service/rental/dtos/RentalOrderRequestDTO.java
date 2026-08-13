package rental_service.rental.dtos;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RentalOrderRequestDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    private String userName;

    private Long bookingId;

    @NotNull(message = "Rental date is required")
    private LocalDate date;

    @NotEmpty(message = "Items list cannot be empty")
    @Valid
    private List<RentalItemRequest> items;
}
