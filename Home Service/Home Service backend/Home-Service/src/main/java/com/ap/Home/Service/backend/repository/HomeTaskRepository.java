package com.ap.Home.Service.backend.repository;

import com.ap.Home.Service.backend.model.HomeTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HomeTaskRepository extends JpaRepository<HomeTask, Long> {
    // Spring Boot automatically provides findAll(), save(), and deleteById() here!
}