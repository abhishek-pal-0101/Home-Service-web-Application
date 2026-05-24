package com.ap.Home.Service.backend.controller;

import com.ap.Home.Service.backend.model.HomeTask;
import com.ap.Home.Service.backend.service.HomeTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173")
public class HomeTaskController {

    @Autowired
    private HomeTaskService homeTaskService;

    // GET: http://localhost:8080/api/services
    @GetMapping
    public ResponseEntity<List<HomeTask>> getAllServices() {
        return ResponseEntity.ok(homeTaskService.getAllAvailableServices());
    }

    // POST: http://localhost:8080/api/services (Used later for Admin panel)
    @PostMapping
    public ResponseEntity<HomeTask> addService(@RequestBody HomeTask task) {
        return ResponseEntity.ok(homeTaskService.addService(task));
    }
}