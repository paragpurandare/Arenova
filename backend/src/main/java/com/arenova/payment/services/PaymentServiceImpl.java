package com.arenova.payment.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.arenova.common.Exceptions.BadRequestException;
import com.arenova.common.Exceptions.ResourceNotFoundException;
import com.arenova.payment.dtos.PaymentRequestDTO;
import com.arenova.payment.dtos.PaymentResponseDTO;
import com.arenova.payment.entities.Payment;
import com.arenova.payment.enums.PaymentStatus;
import com.arenova.payment.mappers.PaymentMapper;
import com.arenova.payment.repositories.PaymentRepository;
import com.arenova.user.entities.User;
import com.arenova.user.repository.UserRepositroy;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepositroy userRepository;

    @Override
    @Transactional
    public PaymentResponseDTO createPayment(PaymentRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setBookingId(dto.getBookingId());
        payment.setAmount(dto.getAmount());
        payment.setMethod(dto.getMethod());
        payment.setGatewayTxnId(dto.getGatewayTxnId());
        payment.setStatus(PaymentStatus.PENDING);

        Payment saved = paymentRepository.save(payment);
        return PaymentMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public PaymentResponseDTO confirmPayment(Long id, String gatewayTxnId) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new BadRequestException("Only PENDING payments can be confirmed. Current status: " + payment.getStatus());
        }

        if (gatewayTxnId != null && !gatewayTxnId.isBlank()) {
            payment.setGatewayTxnId(gatewayTxnId);
        }
        payment.setStatus(PaymentStatus.SUCCESS);

        Payment updated = paymentRepository.save(payment);
        return PaymentMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public PaymentResponseDTO failPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new BadRequestException("Only PENDING payments can be marked as failed. Current status: " + payment.getStatus());
        }

        payment.setStatus(PaymentStatus.FAILED);
        Payment updated = paymentRepository.save(payment);
        return PaymentMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public PaymentResponseDTO refundPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new BadRequestException("Only SUCCESS payments can be refunded. Current status: " + payment.getStatus());
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        Payment updated = paymentRepository.save(payment);
        return PaymentMapper.toResponseDTO(updated);
    }

    @Override
    public PaymentResponseDTO getPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return PaymentMapper.toResponseDTO(payment);
    }

    @Override
    public PaymentResponseDTO getPaymentByBooking(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking id: " + bookingId));
        return PaymentMapper.toResponseDTO(payment);
    }

    @Override
    public List<PaymentResponseDTO> getPaymentsByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return paymentRepository.findByUserId(userId).stream()
                .map(PaymentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
