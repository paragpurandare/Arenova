package booking_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import booking_service.clients.dtos.PaymentRequestDTO;
import booking_service.clients.dtos.PaymentResponseDTO;

@FeignClient(name = "PAYMENT-SERVICE", url = "${payment.service.url:http://localhost:8083}")
public interface PaymentClient {

    @PostMapping("/api/payments")
    PaymentResponseDTO createPayment(@RequestBody PaymentRequestDTO dto);

    @PutMapping("/api/payments/{id}/confirm")
    PaymentResponseDTO confirmPayment(
            @PathVariable("id") Long id,
            @RequestParam(value = "gatewayTxnId", required = false) String gatewayTxnId);

    @PutMapping("/api/payments/{id}/refund")
    PaymentResponseDTO refundPayment(@PathVariable("id") Long id);

    @GetMapping("/api/payments/{id}")
    PaymentResponseDTO getPayment(@PathVariable("id") Long id);
}
