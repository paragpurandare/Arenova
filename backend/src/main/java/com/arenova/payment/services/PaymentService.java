package com.arenova.payment.services;

import java.util.List;

import com.arenova.payment.dtos.PaymentRequestDTO;
import com.arenova.payment.dtos.PaymentResponseDTO;

public interface PaymentService {

    PaymentResponseDTO createPayment(PaymentRequestDTO dto);

    PaymentResponseDTO confirmPayment(Long id, String gatewayTxnId);

    PaymentResponseDTO failPayment(Long id);

    PaymentResponseDTO refundPayment(Long id);

    PaymentResponseDTO getPayment(Long id);

    PaymentResponseDTO getPaymentByBooking(Long bookingId);

    List<PaymentResponseDTO> getPaymentsByUser(Long userId);
}
