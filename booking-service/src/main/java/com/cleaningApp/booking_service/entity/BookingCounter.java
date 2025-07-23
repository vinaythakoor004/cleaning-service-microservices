package com.cleaningApp.booking_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class BookingCounter {
	 @Id
	    private String name;
	    private int value;
	    
	    public String getName() { return this.name; }
	    public void setName(String name) { this.name = name; }
	    
	    public int getValue() { return this.value; }
	    public void setValue(int value) { this.value = value; }
}
