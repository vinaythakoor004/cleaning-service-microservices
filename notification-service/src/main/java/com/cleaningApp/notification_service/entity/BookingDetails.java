package com.cleaningApp.notification_service.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Embeddable;


@Embeddable
public class BookingDetails {
    private String serviceName;
    private LocalDateTime bookingDateTime;
    private String address;
    private String time;
    private String price;
    private String slot;
    
	public String getServiceName() {
		return serviceName;
	}
	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}
	public LocalDateTime getBookingDateTime() { 
		return bookingDateTime; 
	}
	public void setBookingDateTime(LocalDateTime bookingDateTime) {
		this.bookingDateTime = bookingDateTime;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getSlot() {
		return slot;
	}
	public void setSlot(String slot) {
		this.slot = slot;
	}    
}
