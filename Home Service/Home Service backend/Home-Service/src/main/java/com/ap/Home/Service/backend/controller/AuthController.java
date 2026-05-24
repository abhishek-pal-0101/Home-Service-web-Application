package com.ap.Home.Service.backend.controller;

import com.ap.Home.Service.backend.security.JwtUtil;
import com.ap.Home.Service.backend.model.User;
import com.ap.Home.Service.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Your React URL
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        // Assuming you have a findByEmail method in your UserRepository
        Optional<User> userOpt = userRepository.findByEmail(email);

        // Basic password check
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            User user = userOpt.get();

            // Generate the token using their email and role
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

            // Send the token back to React
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", token,
                    "role", user.getRole()
            ));
        }

        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
}