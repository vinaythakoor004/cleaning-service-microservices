package com.cleaningApp.notification_service.service;

import com.cleaningApp.notification_service.entity.Booking; // Ensure this import points to your Booking entity in notification-service
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

    // Define a bean that consumes Booking objects from Kafka
    // The bean name (e.g., "handleBookingEvent") will be linked to your Kafka binding
    @Bean
    public Consumer<Booking> handleBookingEvent() {
        return booking -> {
            // You can add logic here to differentiate between new and updated bookings
            // For example, by checking a status field in the Booking object or having different topics/event types

            String message = "Booking update for " + booking.getFirstName() + " " + booking.getLastName() +
                             " at " + this.getFormatedDate(booking.getBookingDetails().getBookingDateTime()) +
                             ". Current Status: " + (booking.getId() == null ? "New Booking" : "Updated Booking"); // Example status based on ID presence

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