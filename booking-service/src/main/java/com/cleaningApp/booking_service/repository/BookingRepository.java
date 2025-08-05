package com.cleaningApp.booking_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.cleaningApp.booking_service.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface BookingRepository extends JpaRepository<com.cleaningApp.booking_service.entity.Booking, Long> {
    // ✅ Inherits these built-in methods:
    // save(Booking booking)
    // findAll()
    // count()
    // findById(Long id)

    // Example of custom query method (optional)
    // List<Booking> findByFirstNameIgnoreCase(String firstName);
	
	@Query(
		    value = "SELECT b FROM Booking b WHERE LOWER(b.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
		            "OR LOWER(b.lastName) LIKE LOWER(CONCAT('%', :search, '%'))",
		    countQuery = "SELECT COUNT(b) FROM Booking b WHERE LOWER(b.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
		                 "OR LOWER(b.lastName) LIKE LOWER(CONCAT('%', :search, '%'))"
		)
		Page<Booking> searchBookings(@Param("search") String search, Pageable pageable);

}
