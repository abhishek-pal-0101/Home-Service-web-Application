package com.ap.Home.Service.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "services") // Creates a table named 'services' in MySQL
public class HomeTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // e.g., "Plumbing"
    private String description; // e.g., "Fixing leaks and pipes"
    private Double price;       // e.g., 49.99

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}