package com.ap.Home.Service.backend.service;

import com.ap.Home.Service.backend.model.HomeTask;
import com.ap.Home.Service.backend.repository.HomeTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HomeTaskService {

    @Autowired
    private HomeTaskRepository homeTaskRepository;

    // Fetch all available services for the public /services page
    public List<HomeTask> getAllAvailableServices() {
        return homeTaskRepository.findAll();
    }

    // Add a new service to the platform (Used by Admin)
    public HomeTask addService(HomeTask task) {
        return homeTaskRepository.save(task);
    }

    // Delete a service
    public void deleteService(Long id) {
        homeTaskRepository.deleteById(id);
    }
}
