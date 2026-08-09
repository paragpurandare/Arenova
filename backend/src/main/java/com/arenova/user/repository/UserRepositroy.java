package com.arenova.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.GrantedAuthority;

import com.arenova.user.entities.User;
import java.util.List;
import com.arenova.user.entities.UserRole;


public interface UserRepositroy extends JpaRepository<User, Long> {

	Optional<User> findById(Long ownerId);

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	boolean existsByPhone(String phone);

	Optional<User> findByRole(UserRole roleManager);

}
