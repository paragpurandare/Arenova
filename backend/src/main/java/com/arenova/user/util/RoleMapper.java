package com.arenova.user.util;

import com.arenova.user.entities.UserRole;

/**
 * Bridges the lowercase role keys the React client works with
 * ("customer", "manager", "owner", "super") and the backend's
 * UserRole enum (ROLE_CUSTOMER, ROLE_MANAGER, ROLE_OWNER, ROLE_ADMIN).
 */
public final class RoleMapper {

    private RoleMapper() {
    }

    public static UserRole toEntityRole(String clientRole) {
        if (clientRole == null) {
            throw new IllegalArgumentException("Role must not be empty");
        }

        return switch (clientRole.trim().toLowerCase()) {
            case "customer" -> UserRole.ROLE_CUSTOMER;
            case "manager" -> UserRole.ROLE_MANAGER;
            case "owner" -> UserRole.ROLE_OWNER;
            case "super", "admin" -> UserRole.ROLE_ADMIN;
            default -> throw new IllegalArgumentException("Unknown role: " + clientRole);
        };
    }

    public static String toClientRole(UserRole role) {
        return switch (role) {
            case ROLE_CUSTOMER -> "customer";
            case ROLE_MANAGER -> "manager";
            case ROLE_OWNER -> "owner";
            case ROLE_ADMIN -> "super";
        };
    }
}
