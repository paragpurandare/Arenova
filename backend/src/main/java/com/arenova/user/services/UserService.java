package com.arenova.user.services;

import com.arenova.user.dtos.AuthResponseDTO;
import com.arenova.user.dtos.LoginRequestDTO;
import com.arenova.user.dtos.RegisterRequestDTO;
import com.arenova.user.dtos.UserResponseDTO;

public interface UserService {

    AuthResponseDTO register(RegisterRequestDTO request);

    AuthResponseDTO login(LoginRequestDTO request);

    UserResponseDTO getProfile(String email);
}
