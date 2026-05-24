package com.ap.Home.Service.backend.repository;

import com.ap.Home.Service.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Only searching by userEmail now!
    List<Booking> findByUserEmailOrderByBookingDateDesc(String userEmail);

}