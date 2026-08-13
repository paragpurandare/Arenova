package com.arenova.payment.mappers;

import com.arenova.payment.dtos.PaymentResponseDTO;
import com.arenova.payment.entities.Payment;

public class PaymentMapper {

    public static PaymentResponseDTO toResponseDTO(Payment payment) {
        String fullName = payment.getUser().getFirstName() + " " + payment.getUser().getLastName();

        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .bookingId(payment.getBookingId())
                .userId(payment.getUser().getId())
                .userName(fullName.trim())
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .gatewayTxnId(payment.getGatewayTxnId())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
