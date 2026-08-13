package payment_service.payment.services;

import java.util.List;

import payment_service.payment.dtos.PaymentRequestDTO;
import payment_service.payment.dtos.PaymentResponseDTO;

public interface PaymentService {

    PaymentResponseDTO createPayment(PaymentRequestDTO dto);

    PaymentResponseDTO confirmPayment(Long id, String gatewayTxnId);

    PaymentResponseDTO failPayment(Long id);

    PaymentResponseDTO refundPayment(Long id);

    PaymentResponseDTO getPayment(Long id);

    PaymentResponseDTO getPaymentByBooking(Long bookingId);

    List<PaymentResponseDTO> getPaymentsByUser(Long userId);
}
