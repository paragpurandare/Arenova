package com.arenova.club.services;

import org.springframework.stereotype.Service;

import com.arenova.club.entities.Club;
import com.arenova.club.entities.ClubManager;
import com.arenova.club.repository.ClubManagerRepository;
import com.arenova.club.repository.ClubRepository;
import com.arenova.common.Exceptions.BadRequestException;
import com.arenova.common.Exceptions.ResourceNotFoundException;
import com.arenova.user.dtos.UserResponseDTO;
import com.arenova.user.entities.User;
import com.arenova.user.entities.UserRole;
import com.arenova.user.repository.UserRepositroy;
import com.arenova.user.util.RoleMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * Assigns/reassigns managers to clubs. The club_id and manager_id columns
 * on club_managers are both unique (one club <-> one manager at a time),
 * so assigning reuses an existing row where possible instead of trying
 * to insert a second one and violating that constraint.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ClubManagerService {

    private final ClubManagerRepository clubManagerRepo;
    private final ClubRepository clubRepo;
    private final UserRepositroy userRepo;

    /**
     * Assigns managerId to clubId, on behalf of ownerId. Verifies the
     * owner actually owns the club and the target user really is a manager.
     */
    public void assignManager(Long clubId, Long managerId, Long ownerId) {

        Club club = clubRepo.findByIdAndOwnerId(clubId, ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found for this owner"));

        User manager = userRepo.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));

        if (manager.getRole() != UserRole.ROLE_MANAGER) {
            throw new BadRequestException("Selected user is not a manager");
        }

        User owner = userRepo.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        // Reuse an existing row for this club if present (club_id is unique),
        // otherwise reuse the manager's existing row if they managed a
        // different club before (manager_id is unique), otherwise start fresh.
        ClubManager assignment = clubManagerRepo.findByClub_Id(clubId)
                .or(() -> clubManagerRepo.findByManager_Id(managerId))
                .orElseGet(ClubManager::new);

        assignment.setClub(club);
        assignment.setManager(manager);
        assignment.setAssignedBy(owner);
        assignment.setActive(true);

        clubManagerRepo.save(assignment);
    }

    /** Deactivates whichever manager is currently assigned to this club, if any. */
    public void unassignManager(Long clubId, Long ownerId) {

        clubRepo.findByIdAndOwnerId(clubId, ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found for this owner"));

        clubManagerRepo.findByClub_Id(clubId).ifPresent(assignment -> {
            assignment.setActive(false);
            clubManagerRepo.save(assignment);
        });
    }

    /** Who (if anyone) currently manages this club. */
    public UserResponseDTO getManagerOfClub(Long clubId) {

        ClubManager assignment = clubManagerRepo.findByClub_Id(clubId)
                .filter(ClubManager::getActive)
                .orElseThrow(() -> new ResourceNotFoundException("No manager assigned to this club"));

        return toUserResponse(assignment.getManager());
    }


    private UserResponseDTO toUserResponse(User user) {
        String fullName = (user.getFirstName() + " " + safe(user.getLastName())).trim();
        return new UserResponseDTO(
                user.getId(), fullName, user.getEmail(), user.getPhone(),
                user.getProfileImage(), RoleMapper.toClientRole(user.getRole())
        );
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
