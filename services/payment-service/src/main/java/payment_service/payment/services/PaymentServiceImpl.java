package payment_service.payment.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import payment_service.common.exceptions.BadRequestException;
import payment_service.common.exceptions.ResourceNotFoundException;
import payment_service.payment.dtos.PaymentRequestDTO;
import payment_service.payment.dtos.PaymentResponseDTO;
import payment_service.payment.entities.Payment;
import payment_service.payment.enums.PaymentStatus;
import payment_service.payment.mappers.PaymentMapper;
import payment_service.payment.repositories.PaymentRepository;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public PaymentResponseDTO createPayment(PaymentRequestDTO dto) {
        Payment payment = new Payment();
        payment.setUserId(dto.getUserId());
        payment.setUserName(dto.getUserName());
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

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return PaymentMapper.toResponseDTO(payment);
        }

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
    @Transactional(readOnly = true)
    public PaymentResponseDTO getPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return PaymentMapper.toResponseDTO(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDTO getPaymentByBooking(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking id: " + bookingId));
        return PaymentMapper.toResponseDTO(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponseDTO> getPaymentsByUser(Long userId) {
        return paymentRepository.findByUserId(userId).stream()
                .map(PaymentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
