package booking_service.clients.dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    private Long userId;
    private String userName;
    private Long bookingId;
    private BigDecimal amount;
    private String method;
    private String gatewayTxnId;
}
