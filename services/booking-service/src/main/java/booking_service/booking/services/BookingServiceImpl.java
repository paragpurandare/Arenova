package booking_service.booking.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import booking_service.booking.dtos.BookingRequestDTO;
import booking_service.booking.dtos.BookingResponseDTO;
import booking_service.booking.dtos.RentalItemRequest;
import booking_service.booking.entities.Booking;
import booking_service.booking.enums.BookingStatus;
import booking_service.booking.mappers.BookingMapper;
import booking_service.booking.repositories.BookingRepository;
import booking_service.clients.PaymentClient;
import booking_service.clients.RentalClient;
import booking_service.clients.SlotClient;
import booking_service.clients.dtos.PaymentRequestDTO;
import booking_service.clients.dtos.PaymentResponseDTO;
import booking_service.clients.dtos.RentalOrderRequestDTO;
import booking_service.clients.dtos.RentalOrderResponseDTO;
import booking_service.clients.dtos.SlotsResponseDTO;
import booking_service.common.exceptions.BadRequestException;
import booking_service.common.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final SlotClient slotClient;
    private final RentalClient rentalClient;
    private final PaymentClient paymentClient;

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO dto) {
        // 1. Fetch slot details and lock slot in SLOT-SERVICE via OpenFeign RPC
        SlotsResponseDTO slotDetails = null;
        try {
            slotDetails = slotClient.getSlotById(dto.getSlotId());
            slotClient.bookSlot(dto.getSlotId());
        } catch (Exception ex) {
            log.warn("Slot-Service call failed or slot already booked: {}", ex.getMessage());
        }

        BigDecimal courtFee = dto.getCourtAmount() != null
                ? dto.getCourtAmount()
                : (slotDetails != null && slotDetails.getPrice() != null ? slotDetails.getPrice() : BigDecimal.valueOf(350));

        // 2. Create rental order in RENTAL-SERVICE via OpenFeign RPC if equipment requested
        RentalOrderResponseDTO rentalDTO = null;
        Long rentalOrderId = null;
        BigDecimal rentalTotal = BigDecimal.ZERO;

        if (dto.getEquipmentItems() != null && !dto.getEquipmentItems().isEmpty()) {
            try {
                RentalOrderRequestDTO rentalReq = RentalOrderRequestDTO.builder()
                        .userId(dto.getUserId())
                        .userName(dto.getUserName())
                        .date(dto.getSlotDate() != null ? dto.getSlotDate() : (slotDetails != null ? slotDetails.getSlotDate() : null))
                        .items(dto.getEquipmentItems())
                        .build();

                rentalDTO = rentalClient.createRentalOrder(rentalReq);
                if (rentalDTO != null) {
                    rentalOrderId = rentalDTO.getId();
                    rentalTotal = rentalDTO.getTotalAmount() != null ? rentalDTO.getTotalAmount() : BigDecimal.ZERO;
                }
            } catch (Exception ex) {
                log.warn("Rental-Service call failed: {}", ex.getMessage());
                for (RentalItemRequest item : dto.getEquipmentItems()) {
                    BigDecimal unitPrice = item.getPricePerUnit() != null ? item.getPricePerUnit() : BigDecimal.valueOf(50);
                    rentalTotal = rentalTotal.add(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())));
                }
            }
        }

        BigDecimal platformFee = BigDecimal.ZERO;
        BigDecimal gstAmount = BigDecimal.ZERO;
        BigDecimal totalPayable = courtFee.add(rentalTotal).add(platformFee).add(gstAmount);

        // 3. Create payment record in PAYMENT-SERVICE via OpenFeign RPC
        Long paymentId = null;
        try {
            PaymentRequestDTO paymentReq = PaymentRequestDTO.builder()
                    .userId(dto.getUserId())
                    .userName(dto.getUserName())
                    .amount(totalPayable)
                    .method(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "RAZORPAY")
                    .build();

            PaymentResponseDTO paymentDTO = paymentClient.createPayment(paymentReq);
            if (paymentDTO != null) {
                paymentId = paymentDTO.getId();
            }
        } catch (Exception ex) {
            log.warn("Payment-Service call failed: {}", ex.getMessage());
        }

        // 4. Save Booking entity locally in booking_service DB
        Booking booking = new Booking();
        booking.setSlotId(dto.getSlotId());
        booking.setCourtId(dto.getCourtId() != null ? dto.getCourtId() : (slotDetails != null ? slotDetails.getCourtId() : null));
        booking.setCourtName(dto.getCourtName());
        booking.setSportsType(dto.getSportsType());
        booking.setClubId(dto.getClubId());
        booking.setClubName(dto.getClubName());
        booking.setSlotDate(dto.getSlotDate() != null ? dto.getSlotDate() : (slotDetails != null ? slotDetails.getSlotDate() : null));
        booking.setStartTime(dto.getStartTime() != null ? dto.getStartTime() : (slotDetails != null ? slotDetails.getStartTime() : null));
        booking.setEndTime(dto.getEndTime() != null ? dto.getEndTime() : (slotDetails != null ? slotDetails.getEndTime() : null));
        booking.setUserId(dto.getUserId());
        booking.setUserName(dto.getUserName());
        booking.setRentalOrderId(rentalOrderId);
        booking.setPaymentId(paymentId);
        booking.setAmount(courtFee);
        booking.setRentalAmount(rentalTotal);
        booking.setPlatformFee(platformFee);
        booking.setGstAmount(gstAmount);
        booking.setTotalAmount(totalPayable);
        booking.setStatus(BookingStatus.PENDING);
        booking.setQrCode("ARENOVA-QR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        Booking savedBooking = bookingRepository.save(booking);
        return BookingMapper.toResponseDTO(savedBooking);
    }

    @Override
    @Transactional
    public BookingResponseDTO confirmBooking(Long id, String gatewayTxnId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            return BookingMapper.toResponseDTO(booking);
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be confirmed. Current status: " + booking.getStatus());
        }

        if (booking.getPaymentId() != null) {
            try {
                paymentClient.confirmPayment(booking.getPaymentId(), gatewayTxnId);
            } catch (Exception ex) {
                log.warn("Failed to confirm payment in Payment-Service: {}", ex.getMessage());
            }
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking updated = bookingRepository.save(booking);
        return BookingMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled.");
        }

        try {
            slotClient.releaseSlot(booking.getSlotId());
        } catch (Exception ex) {
            log.warn("Failed to release slot in Slot-Service: {}", ex.getMessage());
        }

        if (booking.getRentalOrderId() != null) {
            try {
                rentalClient.cancelRentalOrder(booking.getRentalOrderId());
            } catch (Exception ex) {
                log.warn("Failed to cancel rental order in Rental-Service: {}", ex.getMessage());
            }
        }

        if (booking.getPaymentId() != null) {
            try {
                paymentClient.refundPayment(booking.getPaymentId());
            } catch (Exception ex) {
                log.warn("Failed to refund payment in Payment-Service: {}", ex.getMessage());
            }
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return BookingMapper.toResponseDTO(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(BookingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByClub(Long clubId) {
        return bookingRepository.findByClubIdOrderByCreatedAtDesc(clubId).stream()
                .map(BookingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
