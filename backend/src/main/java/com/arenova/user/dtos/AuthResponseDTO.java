package com.arenova.user.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Response returned by /api/auth/login and /api/auth/register.
 * The client reads either `token` (used) or `jwt` (fallback), and
 * either `user` (used) or the whole payload (fallback) - see
 * AuthContext.jsx. We send both `token` and `user` explicitly.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {

    private String token;
    private UserResponseDTO user;
}
