package booking_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import booking_service.clients.dtos.SlotsResponseDTO;
import booking_service.common.dtos.ApiResponse;

@FeignClient(name = "SLOT-SERVICE", url = "${slot.service.url:http://localhost:8081}")
public interface SlotClient {

    @GetMapping("/api/slots/{slotId}")
    SlotsResponseDTO getSlotById(@PathVariable("slotId") Long slotId);

    @PutMapping("/api/slots/{slotId}/book")
    ApiResponse bookSlot(@PathVariable("slotId") Long slotId);

    @PutMapping("/api/slots/{slotId}/release")
    ApiResponse releaseSlot(@PathVariable("slotId") Long slotId);
}
