package com.cleaningApp.booking_service.controller;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cleaningApp.booking_service.dto.BookingListResponse;
import com.cleaningApp.booking_service.entity.Booking;
import com.cleaningApp.booking_service.service.BookingService;

@RestController
@RequestMapping()
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/bookings")
    public ResponseEntity<Booking> create(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.saveBooking(booking));
    }

    @GetMapping("/bookings")
    public BookingListResponse getBookings(
    		@RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize,
            @RequestParam(name = "search", required = false) String search
    ) {
        return bookingService.getAllBookings(page, pageSize, search);
    }
    
    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/bookings/{id}")
    public Booking updateById(@PathVariable("id") Long Id, @RequestBody Booking updatedBooking) {
    	return bookingService.updateBooking(Id, updatedBooking);
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable("id") Long Id) {
        bookingService.deleteBooking(Id);
        return ResponseEntity.noContent().build(); // HTTP 204
    }
}
