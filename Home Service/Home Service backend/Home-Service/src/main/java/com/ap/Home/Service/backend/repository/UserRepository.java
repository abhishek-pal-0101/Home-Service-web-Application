package com.ap.Home.Service.backend.repository;

import com.ap.Home.Service.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // We need a custom method to find a user by their email for Login!
    Optional<User> findByEmail(String email);
}
