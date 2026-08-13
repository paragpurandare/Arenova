package com.arenova.rental.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.arenova.common.Exceptions.BadRequestException;
import com.arenova.common.Exceptions.ResourceNotFoundException;
import com.arenova.equipment.entities.Equipment;
import com.arenova.equipment.repositories.EquipmentRepository;
import com.arenova.equipment.services.EquipmentInventoryService;
import com.arenova.rental.dtos.RentalItemRequest;
import com.arenova.rental.dtos.RentalOrderRequestDTO;
import com.arenova.rental.dtos.RentalOrderResponseDTO;
import com.arenova.rental.entities.RentalOrder;
import com.arenova.rental.entities.RentalOrderItem;
import com.arenova.rental.enums.RentalStatus;
import com.arenova.rental.mappers.RentalOrderMapper;
import com.arenova.rental.repositories.RentalOrderItemRepository;
import com.arenova.rental.repositories.RentalOrderRepository;
import com.arenova.user.entities.User;
import com.arenova.user.repository.UserRepositroy;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RentalOrderServiceImpl implements RentalOrderService {

    private final RentalOrderRepository rentalOrderRepository;
    private final RentalOrderItemRepository rentalOrderItemRepository;
    private final EquipmentRepository equipmentRepository;
    private final EquipmentInventoryService inventoryService;
    private final UserRepositroy userRepository;

    @Override
    @Transactional
    public RentalOrderResponseDTO createRentalOrder(RentalOrderRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));

        RentalOrder rentalOrder = new RentalOrder();
        rentalOrder.setUser(user);
        rentalOrder.setBookingId(dto.getBookingId());
        rentalOrder.setRentalDate(dto.getDate());
        rentalOrder.setStatus(RentalStatus.PENDING);
        rentalOrder.setTotalAmount(BigDecimal.ZERO);

        // Save order header first to generate ID
        RentalOrder savedOrder = rentalOrderRepository.save(rentalOrder);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<RentalOrderItem> itemsToSave = new ArrayList<>();

        for (RentalItemRequest itemReq : dto.getItems()) {
            Equipment equipment = equipmentRepository.findById(itemReq.getEquipmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + itemReq.getEquipmentId()));

            if (Boolean.FALSE.equals(equipment.getIsActive())) {
                throw new BadRequestException("Equipment '" + equipment.getName() + "' is currently inactive and cannot be rented.");
            }

            // Reserve units in equipment inventory for the given date (throws InsufficientStockException if unavailable)
            inventoryService.reserveUnits(equipment.getId(), dto.getDate(), itemReq.getQuantity());

            BigDecimal pricePerUnit = equipment.getPricePerSlot();
            BigDecimal subtotal = pricePerUnit.multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            RentalOrderItem orderItem = new RentalOrderItem();
            orderItem.setRentalOrder(savedOrder);
            orderItem.setEquipment(equipment);
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
    public RentalOrderResponseDTO getRentalOrder(Long id) {
        RentalOrder rentalOrder = rentalOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental order not found with id: " + id));
        List<RentalOrderItem> items = rentalOrderItemRepository.findByRentalOrderId(id);
        return RentalOrderMapper.toResponseDTO(rentalOrder, items);
    }

    @Override
    public List<RentalOrderResponseDTO> getRentalOrdersByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return rentalOrderRepository.findByUserId(userId).stream()
                .map(order -> {
                    List<RentalOrderItem> items = rentalOrderItemRepository.findByRentalOrderId(order.getId());
                    return RentalOrderMapper.toResponseDTO(order, items);
                })
                .collect(Collectors.toList());
    }

    @Override
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

        List<RentalOrderItem> items = rentalOrderItemRepository.findByRentalOrderId(id);

        // Release inventory if status was PENDING or ACTIVE
        if (rentalOrder.getStatus() == RentalStatus.PENDING || rentalOrder.getStatus() == RentalStatus.ACTIVE) {
            for (RentalOrderItem item : items) {
                inventoryService.releaseUnits(item.getEquipment().getId(), rentalOrder.getRentalDate(), item.getQuantity());
            }
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

        List<RentalOrderItem> items = rentalOrderItemRepository.findByRentalOrderId(id);

        // Release reserved units on return
        for (RentalOrderItem item : items) {
            inventoryService.releaseUnits(item.getEquipment().getId(), rentalOrder.getRentalDate(), item.getQuantity());
        }

        RentalOrder updated = rentalOrderRepository.save(rentalOrder);
        return RentalOrderMapper.toResponseDTO(updated, items);
    }
}
