package com.arenova.equipment.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.arenova.club.entities.Club;
import com.arenova.club.repository.ClubRepository;
import com.arenova.common.Exceptions.ResourceNotFoundException;
import com.arenova.equipment.dtos.EquipmentRequestDTO;
import com.arenova.equipment.dtos.EquipmentResponseDTO;
import com.arenova.equipment.entities.Equipment;
import com.arenova.equipment.mappers.EquipmentMapper;
import com.arenova.equipment.repositories.EquipmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final ClubRepository clubRepository;

    @Override
    @Transactional
    public EquipmentResponseDTO createEquipment(Long clubId, EquipmentRequestDTO dto) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));

        Equipment equipment = new Equipment();
        equipment.setClub(club);
        equipment.setName(dto.getName());
        equipment.setSportType(dto.getSportType());
        equipment.setPricePerSlot(dto.getPricePerSlot());
        equipment.setTotalStock(dto.getTotalStock());
        equipment.setIsActive(true);

        Equipment saved = equipmentRepository.save(equipment);
        return EquipmentMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EquipmentResponseDTO> getEquipmentByClub(Long clubId) {
        if (!clubRepository.existsById(clubId)) {
            throw new ResourceNotFoundException("Club not found with id: " + clubId);
        }

        return equipmentRepository.findByClubIdAndIsActiveTrue(clubId).stream()
                .map(EquipmentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EquipmentResponseDTO getEquipmentById(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));
        return EquipmentMapper.toResponseDTO(equipment);
    }

    @Override
    @Transactional
    public EquipmentResponseDTO updateEquipment(Long id, EquipmentRequestDTO dto) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));

        equipment.setName(dto.getName());
        equipment.setSportType(dto.getSportType());
        equipment.setPricePerSlot(dto.getPricePerSlot());
        equipment.setTotalStock(dto.getTotalStock());

        Equipment updated = equipmentRepository.save(equipment);
        return EquipmentMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void deactivateEquipment(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));
        equipment.setIsActive(false);
        equipmentRepository.save(equipment);
    }
}
