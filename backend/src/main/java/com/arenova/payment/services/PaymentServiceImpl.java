package com.arenova.payment.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.arenova.client.PaymentClient;
import com.arenova.payment.dtos.PaymentRequestDTO;
import com.arenova.payment.dtos.PaymentResponseDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentClient paymentClient;

    @Override
    public PaymentResponseDTO createPayment(PaymentRequestDTO dto) {
        return paymentClient.createPayment(dto);
    }

    @Override
    public PaymentResponseDTO confirmPayment(Long id, String gatewayTxnId) {
        return paymentClient.confirmPayment(id, gatewayTxnId);
    }

    @Override
    public PaymentResponseDTO failPayment(Long id) {
        return paymentClient.failPayment(id);
    }

    @Override
    public PaymentResponseDTO refundPayment(Long id) {
        return paymentClient.refundPayment(id);
    }

    @Override
    public PaymentResponseDTO getPayment(Long id) {
        return paymentClient.getPayment(id);
    }

    @Override
    public PaymentResponseDTO getPaymentByBooking(Long bookingId) {
        return paymentClient.getPaymentByBooking(bookingId);
    }

    @Override
    public List<PaymentResponseDTO> getPaymentsByUser(Long userId) {
        return paymentClient.getPaymentsByUser(userId);
    }
}
