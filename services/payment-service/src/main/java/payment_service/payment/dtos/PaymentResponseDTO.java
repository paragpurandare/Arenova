package payment_service.payment.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import payment_service.payment.enums.PaymentMethod;
import payment_service.payment.enums.PaymentStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {

    private Long id;
    private Long bookingId;
    private Long userId;
    private String userName;
    private BigDecimal amount;
    private PaymentMethod method;
    private String gatewayTxnId;
    private PaymentStatus status;
    private LocalDateTime createdAt;
}
