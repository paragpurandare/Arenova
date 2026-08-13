package booking_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import booking_service.clients.dtos.RentalOrderRequestDTO;
import booking_service.clients.dtos.RentalOrderResponseDTO;
import booking_service.common.dtos.ApiResponse;

@FeignClient(name = "RENTAL-SERVICE", url = "${rental.service.url:http://localhost:8082}")
public interface RentalClient {

    @PostMapping("/api/rentals")
    RentalOrderResponseDTO createRentalOrder(@RequestBody RentalOrderRequestDTO dto);

    @GetMapping("/api/rentals/{id}")
    RentalOrderResponseDTO getRentalOrder(@PathVariable("id") Long id);

    @PutMapping("/api/rentals/{id}/cancel")
    ApiResponse cancelRentalOrder(@PathVariable("id") Long id);
}
