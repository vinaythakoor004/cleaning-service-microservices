package com.cleaningApp.booking_service.entity;

public class BookingResponse {
	Booking booking;
	String Status;
	
	public BookingResponse(Booking booking, String status) {
		super();
		this.booking = booking;
		Status = status;
	}

	public Booking getBooking() {
		return booking;
	}
	public void setBooking(Booking booking) {
		this.booking = booking;
	}
	public String getStatus() {
		return Status;
	}
	public void setStatus(String status) {
		Status = status;
	}
}
