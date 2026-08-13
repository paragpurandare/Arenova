package com.arenova.booking.dtos;

import java.util.List;

import com.arenova.payment.enums.PaymentMethod;
import com.arenova.rental.dtos.RentalItemRequest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDTO {

    @NotNull(message = "Slot ID is required")
    private Long slotId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @Valid
    private List<RentalItemRequest> equipmentItems;
}
