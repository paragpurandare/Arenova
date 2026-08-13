package payment_service.payment.mappers;

import payment_service.payment.dtos.PaymentResponseDTO;
import payment_service.payment.entities.Payment;

public class PaymentMapper {

    public static PaymentResponseDTO toResponseDTO(Payment payment) {
        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .bookingId(payment.getBookingId())
                .userId(payment.getUserId())
                .userName(payment.getUserName())
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .gatewayTxnId(payment.getGatewayTxnId())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
