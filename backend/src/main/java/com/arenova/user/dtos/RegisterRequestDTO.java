package com.arenova.user.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    /** Lowercase role key from the client, e.g. "customer" | "manager" | "owner" | "super". */
    @NotBlank(message = "Role is required")
    private String role;

    /** Optional - the current registration form doesn't collect this. */
    private String phone;
}
