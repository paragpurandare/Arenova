package rental_service.rental.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import rental_service.common.exceptions.BadRequestException;
import rental_service.common.exceptions.ResourceNotFoundException;
import rental_service.rental.dtos.RentalItemRequest;
import rental_service.rental.dtos.RentalOrderRequestDTO;
import rental_service.rental.dtos.RentalOrderResponseDTO;
import rental_service.rental.entities.RentalOrder;
import rental_service.rental.entities.RentalOrderItem;
import rental_service.rental.enums.RentalStatus;
import rental_service.rental.mappers.RentalOrderMapper;
import rental_service.rental.repositories.RentalOrderItemRepository;
import rental_service.rental.repositories.RentalOrderRepository;

@Service
@RequiredArgsConstructor
public class RentalOrderServiceImpl implements RentalOrderService {

    private final RentalOrderRepository rentalOrderRepository;
    private final RentalOrderItemRepository rentalOrderItemRepository;

    @Override
    @Transactional
    public RentalOrderResponseDTO createRentalOrder(RentalOrderRequestDTO dto) {
        RentalOrder rentalOrder = new RentalOrder();
        rentalOrder.setUserId(dto.getUserId());
        rentalOrder.setUserName(dto.getUserName());
        rentalOrder.setBookingId(dto.getBookingId());
        rentalOrder.setRentalDate(dto.getDate());
        rentalOrder.setStatus(RentalStatus.PENDING);
        rentalOrder.setTotalAmount(BigDecimal.ZERO);

        RentalOrder savedOrder = rentalOrderRepository.save(rentalOrder);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<RentalOrderItem> itemsToSave = new ArrayList<>();

        for (RentalItemRequest itemReq : dto.getItems()) {
            BigDecimal pricePerUnit = itemReq.getPricePerUnit() != null ? itemReq.getPricePerUnit() : BigDecimal.valueOf(20);
            BigDecimal subtotal = pricePerUnit.multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            RentalOrderItem orderItem = new RentalOrderItem();
            orderItem.setRentalOrder(savedOrder);
            orderItem.setEquipmentId(itemReq.getEquipmentId());
            orderItem.setEquipmentName(itemReq.getEquipmentName() != null ? itemReq.getEquipmentName() : "Equipment #" + itemReq.getEquipmentId());
            orderItem.setSportType(itemReq.getSportType() != null ? itemReq.getSportType() : "General");
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPricePerUnit(pricePerUnit);
            orderItem.setSubtotal(subtotal);

            itemsToSave.add(orderItem);
            totalAmount = totalAmount.add(subtotal);
        }

        savedOrder.setTotalAmount(totalAmount);
        rentalOrderRepository.save(savedOrder);

        List<RentalOrderItem> savedItems = rentalOrderItemRepository.saveAll(itemsToSave);
        return RentalOrderMapper.toResponseDTO(savedOrder, savedItems);
    }

    @Override
    @Transactional(readOnly = true)
    public RentalOrderResponseDTO getRentalOrder(Long id) {
        RentalOrder rentalOrder = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental order not found with id: " + id));
        List<RentalOrderItem> items = rentalOrderItemRepository.findByRentalOrderId(id);
        return RentalOrderMapper.toResponseDTO(rentalOrder, items);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RentalOrderResponseDTO> getRentalOrdersByUser(Long userId) {
        return rentalOrderRepository.findByUserId(userId).stream()
                .map(order -> {
                    List<RentalOrderItem> items = rentalOrderItemRepository.findByRentalOrderId(order.getId());
                    return RentalOrderMapper.toResponseDTO(order, items);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RentalOrderResponseDTO getRentalOrderByBooking(Long bookingId) {
        RentalOrder rentalOrder = rentalOrderRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rental order not found for booking id: " + bookingId));
        List<RentalOrderItem> items = rentalOrderItemRepository.findByRentalOrderId(rentalOrder.getId());
        return RentalOrderMapper.toResponseDTO(rentalOrder, items);
    }

    @Override
    @Transactional
    public void cancelRentalOrder(Long id) {
        RentalOrder rentalOrder = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental order not found with id: " + id));

        if (rentalOrder.getStatus() == RentalStatus.CANCELLED) {
            throw new BadRequestException("Rental order is already cancelled.");
        }
        if (rentalOrder.getStatus() == RentalStatus.RETURNED) {
            throw new BadRequestException("Cannot cancel a rental order that has already been returned.");
        }

        rentalOrder.setStatus(RentalStatus.CANCELLED);
        rentalOrderRepository.save(rentalOrder);
    }

    @Override
    @Transactional
    public RentalOrderResponseDTO markPickedUp(Long id) {
        RentalOrder rentalOrder = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental order not found with id: " + id));

        if (rentalOrder.getStatus() != RentalStatus.PENDING) {
            throw new BadRequestException("Only PENDING rental orders can be marked as picked up. Current status: " + rentalOrder.getStatus());
        }

        rentalOrder.setStatus(RentalStatus.ACTIVE);
        rentalOrder.setPickedUpAt(LocalDateTime.now());
        RentalOrder updated = rentalOrderRepository.save(rentalOrder);
        List<RentalOrderItem> items = rentalOrderItemRepository.findByRentalOrderId(id);

        return RentalOrderMapper.toResponseDTO(updated, items);
    }

    @Override
    @Transactional
    public RentalOrderResponseDTO markReturned(Long id) {
        RentalOrder rentalOrder = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental order not found with id: " + id));

        if (rentalOrder.getStatus() != RentalStatus.ACTIVE) {
            throw new BadRequestException("Only ACTIVE rental orders can be marked as returned. Current status: " + rentalOrder.getStatus());
        }

        rentalOrder.setStatus(RentalStatus.RETURNED);
        rentalOrder.setReturnedAt(LocalDateTime.now());

        RentalOrder updated = rentalOrderRepository.save(rentalOrder);
        List<RentalOrderItem> items = rentalOrderItemRepository.findByRentalOrderId(id);
        return RentalOrderMapper.toResponseDTO(updated, items);
    }
}
