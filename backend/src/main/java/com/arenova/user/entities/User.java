package com.arenova.user.entities;

import com.arenova.common.entities.BaseEntity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@AttributeOverride(
    name = "id",
    column = @Column(name = "user_id")
)
@Getter
@Setter
@NoArgsConstructor

public class User extends BaseEntity {

    @Column(nullable = false, length = 50)
    @NotBlank
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 150)
    @Email
    private String email;

    @Column(nullable = false)
    private String password;

    // Optional: the current registration form only collects name/email/password/role.
    // MySQL's unique index still permits multiple NULLs, so this stays safely unique.
    @Column(unique = true, length = 15)
    private String phone;

    @Column(length = 255)
    private String profileImage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
//    // bean annotations ( Validations purpose)
//    @NotBlank
//    private String firstName;
//
//    @Email
//    private String email;
}
