package com.cleaningApp.booking_service.dto;

import java.util.List;

import com.cleaningApp.booking_service.entity.Booking;

public class BookingListResponse {
    private List<Booking> bookings;
    private long total;

    public BookingListResponse(List<Booking> bookings, long total) {
        this.bookings = bookings;
        this.total = total;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }
}