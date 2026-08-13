package booking_service.booking.mappers;

import java.math.BigDecimal;

import booking_service.booking.dtos.BookingResponseDTO;
import booking_service.booking.entities.Booking;

public class BookingMapper {

    public static BookingResponseDTO toResponseDTO(Booking booking) {
        BigDecimal rentalAmt = booking.getRentalAmount() != null ? booking.getRentalAmount() : BigDecimal.ZERO;
        BigDecimal platform = booking.getPlatformFee() != null ? booking.getPlatformFee() : BigDecimal.ZERO;
        BigDecimal gst = booking.getGstAmount() != null ? booking.getGstAmount() : BigDecimal.ZERO;

        return BookingResponseDTO.builder()
                .id(booking.getId())
                .slotId(booking.getSlotId())
                .courtId(booking.getCourtId())
                .courtName(booking.getCourtName())
                .sportsType(booking.getSportsType())
                .clubId(booking.getClubId())
                .clubName(booking.getClubName())
                .slotDate(booking.getSlotDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .userId(booking.getUserId())
                .userName(booking.getUserName())
                .courtAmount(booking.getAmount())
                .rentalAmount(rentalAmt)
                .platformFee(platform)
                .gstAmount(gst)
                .totalPayable(booking.getTotalAmount())
                .status(booking.getStatus())
                .qrCode(booking.getQrCode())
                .createdAt(booking.getCreatedAt())
                .rentalOrderId(booking.getRentalOrderId())
                .paymentId(booking.getPaymentId())
                .build();
    }
}
