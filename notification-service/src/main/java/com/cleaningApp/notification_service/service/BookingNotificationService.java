package com.cleaningApp.notification_service.service;

import com.cleaningApp.notification_service.entity.Booking; // Ensure this import points to your Booking entity in notification-service
import com.cleaningApp.notification_service.entity.BookingResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean; // Import Bean annotation
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.function.Consumer; // Import Java's Consumer interface

@Service
public class BookingNotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Bean
    public Consumer<BookingResponse> handleBookingEvent() {
        return bookingResponse -> {
            String message = "Booking update for " + bookingResponse.getBooking().getFirstName() + " " + bookingResponse.getBooking().getLastName() +
                             " at " + this.getFormatedDate(bookingResponse.getBooking().getBookingDetails().getBookingDateTime()) +
                             ". Current Status: " + (bookingResponse.getStatus());

            messagingTemplate.convertAndSend("/topic/booking", message);
            System.out.println("Sent WebSocket notification: " + message);
        };
    }

    private String getFormatedDate(LocalDateTime localDateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d, yyyy, h:mm a", Locale.US);
        String formattedDateTime = localDateTime.format(formatter);
        System.out.println(formattedDateTime);
        return formattedDateTime;
    }
}