package com.cleaningApp.booking_service.service; 
import com.cleaningApp.booking_service.dto.BookingListResponse;
import com.cleaningApp.booking_service.entity.Booking;
import com.cleaningApp.booking_service.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.function.StreamBridge; // Import StreamBridge
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final StreamBridge streamBridge; // Declare StreamBridge
    private final EmailService emailService;
    
    // Constructor injection for BookingRepository and StreamBridge
    @Autowired
    public BookingService(BookingRepository bookingRepository, EmailService emailService, StreamBridge streamBridge) {
        this.bookingRepository = bookingRepository;
        this.streamBridge = streamBridge; // Initialize StreamBridge
        this.emailService = emailService;
    }

    // Save a single booking
    public Booking saveBooking(Booking booking) {
        Booking saved = bookingRepository.save(booking);
        // Publish a "booking created" event to Kafka
        streamBridge.send("bookingEvents-out-0", saved); // "bookingEvents-out-0" is the binding name from application.yml
        emailService.sendBookingConfirmation(
            booking.getEmail(),
            "Booking Confirmed",
            "Hi " + booking.getFirstName() + booking.getLastName() + ", your booking is confirmed."
        );
        
        return saved;
    }

    // Get all bookings
    public BookingListResponse getAllBookings(int page, int pageSize, String search) {
        int safePage = Math.max(page - 1, 0);
        Pageable pageable = PageRequest.of(safePage, pageSize, Sort.by("id").descending());

        Page<Booking> bookingPage;

        if (search == null || search.isBlank()) {
            bookingPage = bookingRepository.findAll(pageable);
        } else {
            bookingPage = bookingRepository.searchBookings(search, pageable);
        }
        long count = bookingPage.getTotalElements();

        return new BookingListResponse(bookingPage.getContent(), count);
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking updateBooking(Long id, Booking updatedBooking) {
        return bookingRepository.findById(id).map(existingBooking -> {

            // Manually update fields
            existingBooking.setFirstName(updatedBooking.getFirstName());
            existingBooking.setLastName(updatedBooking.getLastName());
            existingBooking.setEmail(updatedBooking.getEmail());
            existingBooking.setPhone(updatedBooking.getPhone());
            existingBooking.setMessage(updatedBooking.getMessage());
            existingBooking.setCountry(updatedBooking.getCountry());
            existingBooking.setBookingDetails(updatedBooking.getBookingDetails());

            Booking saved = bookingRepository.save(existingBooking);
            // Publish a "booking updated" event to Kafka
            streamBridge.send("bookingEvents-out-0", saved); // Use the same binding name
            return saved;
        }).orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
        // Optionally, publish a "booking deleted" event
        // streamBridge.send("bookingEvents-out-0", "Booking with ID " + id + " deleted.");
    }
}