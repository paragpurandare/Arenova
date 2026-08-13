package slot_service.slot.dtos;

import java.math.BigDecimal;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotGenerateRequestDTO {
    @NotNull(message = "Court ID is required")
    private Long courtId;

    private LocalTime openTime;
    private LocalTime closeTime;
    private Integer slotDuration; // in minutes
    private Integer bufferTime;   // in minutes
    private Integer days;         // default 30
    private BigDecimal price;     // price per slot
}
