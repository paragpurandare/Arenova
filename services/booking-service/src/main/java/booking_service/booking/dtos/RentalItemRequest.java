package booking_service.booking.dtos;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RentalItemRequest {

    @NotNull(message = "Equipment ID is required")
    private Long equipmentId;

    private String equipmentName;

    private String sportType;

    @JsonAlias({"pricePerSlot", "pricePerHour", "price", "unitPrice"})
    private BigDecimal pricePerUnit;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}
