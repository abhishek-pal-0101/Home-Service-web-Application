package com.ap.Home.Service.backend.service;

import com.ap.Home.Service.backend.model.Booking;
import com.ap.Home.Service.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Create a new booking when a user checks out
    public Booking createBooking(Booking booking) {
        booking.setStatus("PENDING"); // All new bookings start as pending
        return bookingRepository.save(booking);
    }

    // Fetch all bookings for a specific user (Used in UserDashboard.jsx)
    public List<Booking> getBookingsByUserEmail(String email) {
        return bookingRepository.findByUserEmailOrderByBookingDateDesc(email);
    }

    // Update the status of a booking (e.g., PENDING -> ACCEPTED -> COMPLETED)
    public Booking updateBookingStatus(Long bookingId, String newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(newStatus.toUpperCase());
        return bookingRepository.save(booking);
    }

    // Get all bookings (For the Admin Panel)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}