package com.arenova.payment.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.arenova.payment.enums.PaymentMethod;
import com.arenova.payment.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
