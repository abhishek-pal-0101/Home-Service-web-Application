package com.ap.Home.Service.backend.service;


import com.ap.Home.Service.backend.model.User;
import com.ap.Home.Service.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 1. Fetch all users for the Admin
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. Delete/Ban a user by ID
    public void deleteUser(Long id) {
        if(userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }

    // Handle User Registration
    public User registerUser(User user) {
        // Check if email already exists to prevent duplicates
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        return userRepository.save(user);
    }

    // Handle User Login
    public User loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            // Password matches! Return the user data to React
            return user.get();
        } else {
            throw new RuntimeException("Invalid email or password.");
        }
    }

    // Get user by ID (useful for Admin dashboard)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}