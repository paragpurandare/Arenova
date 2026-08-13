package payment_service.payment.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import payment_service.payment.dtos.PaymentRequestDTO;
import payment_service.payment.dtos.PaymentResponseDTO;
import payment_service.payment.services.PaymentService;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponseDTO> createPayment(@Valid @RequestBody PaymentRequestDTO dto) {
        PaymentResponseDTO response = paymentService.createPayment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<PaymentResponseDTO> confirmPayment(
            @PathVariable Long id,
            @RequestParam(required = false) String gatewayTxnId) {
        PaymentResponseDTO response = paymentService.confirmPayment(id, gatewayTxnId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/fail")
    public ResponseEntity<PaymentResponseDTO> failPayment(@PathVariable Long id) {
        PaymentResponseDTO response = paymentService.failPayment(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/refund")
    public ResponseEntity<PaymentResponseDTO> refundPayment(@PathVariable Long id) {
        PaymentResponseDTO response = paymentService.refundPayment(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDTO> getPayment(@PathVariable Long id) {
        PaymentResponseDTO response = paymentService.getPayment(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByUser(@PathVariable Long userId) {
        List<PaymentResponseDTO> response = paymentService.getPaymentsByUser(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentByBooking(@PathVariable Long bookingId) {
        PaymentResponseDTO response = paymentService.getPaymentByBooking(bookingId);
        return ResponseEntity.ok(response);
    }
}
