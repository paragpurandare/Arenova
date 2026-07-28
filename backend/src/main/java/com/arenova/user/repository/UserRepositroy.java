package com.arenova.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arenova.user.entities.User;

public interface UserRepositroy extends JpaRepository<User, Long> {

	Optional<User> findById(Long ownerId);

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	boolean existsByPhone(String phone);

}
