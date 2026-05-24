package com.ap.Home.Service.backend.controller;

import com.ap.Home.Service.backend.model.ServiceItem;
import com.ap.Home.Service.backend.repository.ServiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173") // Crucial for React!
public class ServiceController {

    @Autowired
    private ServiceItemRepository serviceRepository;

    @GetMapping("/all")
    public List<ServiceItem> getAllServices() {
        return serviceRepository.findAll();
    }

    @PostMapping("/add")
    public ServiceItem addService(@RequestBody ServiceItem service) {
        return serviceRepository.save(service);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        serviceRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
