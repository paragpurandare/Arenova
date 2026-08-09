package com.arenova.user.services;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.arenova.common.Exceptions.BadRequestException;
import com.arenova.common.Exceptions.ResourceNotFoundException;
import com.arenova.security.JwtUtil;
import com.arenova.user.dtos.AuthResponseDTO;
import com.arenova.user.dtos.LoginRequestDTO;
import com.arenova.user.dtos.RegisterRequestDTO;
import com.arenova.user.dtos.UserResponseDTO;
import com.arenova.user.entities.User;
import com.arenova.user.entities.UserRole;
import com.arenova.user.repository.UserRepositroy;
import com.arenova.user.util.RoleMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepositroy userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponseDTO register(RegisterRequestDTO request) {

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("An account with this email already exists");
        }

        if (request.getPhone() != null && !request.getPhone().isBlank()
                && userRepository.existsByPhone(request.getPhone().trim())) {
            throw new BadRequestException("An account with this phone number already exists");
        }

        UserRole role = RoleMapper.toEntityRole(request.getRole());

        User user = new User();
        user.setFirstName(firstNameOf(request.getName()));
        user.setLastName(lastNameOf(request.getName()));
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone().trim());
        }

        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name(), saved.getId());
        return new AuthResponseDTO(token, toUserResponse(saved));
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword()));
        } catch (AuthenticationException ex) {
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponseDTO(token, toUserResponse(user));
    }

    @Override
    public UserResponseDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toUserResponse(user);
    }

    @Override
    public List<UserResponseDTO> getManagers() {
        return userRepository.findByRole(UserRole.ROLE_MANAGER).stream()
                .map(this::toUserResponse)
                .toList();
    }

    private UserResponseDTO toUserResponse(User user) {
        String fullName = (user.getFirstName() + " " + safe(user.getLastName())).trim();
        return new UserResponseDTO(
                user.getId(),
                fullName,
                user.getEmail(),
                user.getPhone(),
                user.getProfileImage(),
                RoleMapper.toClientRole(user.getRole())
        );
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String firstNameOf(String fullName) {
        String trimmed = fullName.trim();
        int spaceIndex = trimmed.indexOf(' ');
        return spaceIndex > 0 ? trimmed.substring(0, spaceIndex) : trimmed;
    }

    private String lastNameOf(String fullName) {
        String trimmed = fullName.trim();
        int spaceIndex = trimmed.indexOf(' ');
        return spaceIndex > 0 ? trimmed.substring(spaceIndex + 1).trim() : "";
    }
}
