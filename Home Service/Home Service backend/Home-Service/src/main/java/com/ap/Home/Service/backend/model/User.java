package com.ap.Home.Service.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data // Lombok magic: creates all getters and setters for you!
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String phoneNumber;
    @Column(name = "service_type")
    private String serviceType;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
    // Note: In a production app, we would hash this password using BCrypt!

    private String role; // We can use "CUSTOMER" or "PROVIDER"


}
