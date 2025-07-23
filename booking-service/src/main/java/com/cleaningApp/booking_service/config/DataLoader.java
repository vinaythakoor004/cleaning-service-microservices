package com.cleaningApp.booking_service.config;

import com.cleaningApp.booking_service.entity.Booking;
import com.cleaningApp.booking_service.repository.BookingRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final BookingRepository bookingRepository;
    private final ObjectMapper objectMapper;

    public DataLoader(BookingRepository bookingRepository, ObjectMapper objectMapper) {
        this.bookingRepository = bookingRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (bookingRepository.count() == 0) {
            InputStream inputStream = getClass().getResourceAsStream("/data/booking_data.json");
            List<Booking> bookings = objectMapper.readValue(inputStream, new TypeReference<>() {});
            bookingRepository.saveAll(bookings);
            System.out.println("✅ Mock bookings inserted into DB.");
        }
    }
}
