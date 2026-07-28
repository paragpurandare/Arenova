package com.arenova.user.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Public-facing user profile. Shape matches what the client's
 * AuthContext stores as `user` (name, email, role, ...).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String profileImage;

    /** Lowercase role key the client understands, e.g. "customer" | "manager" | "owner" | "super". */
    private String role;
}
