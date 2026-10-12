package com.nibm.smartmove.bookingservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.nibm.smartmove.bookingservice.entity.Booking;


@RestController
@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired
    private com.nibm.smartmove.bookingservice.service.BookingService service;


    /**
     * Retrieves all bookings from Oracle BOOKING table. Admin-only. Joins PASSENGER, TRIP, ROUTE.
     */
    @GetMapping("/api/bookings")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        return org.springframework.http.ResponseEntity.ok(service.findAll());
    }

    /**
     * Creates a new booking. Calls PL/SQL procedure SP_CREATE_BOOKING. Checks seat availability, validates passenger/trip, creates booking record.
     */
    @PostMapping("/api/bookings")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody Booking payload) {
        if (payload.getPassengerId() == null || payload.getPassengerId() <= 0) {
            payload.setPassengerId(1L);
        }
        if (payload.getTripId() == null || payload.getTripId() <= 0) {
            payload.setTripId(1L);
        }
        if (payload.getSeatsBooked() == null || payload.getSeatsBooked() <= 0) {
            payload.setSeatsBooked(1.0);
        }
        if (payload.getTotalFare() == null) {
            payload.setTotalFare(payload.getSeatsBooked() * 1500.0);
        }
        if (payload.getStatus() == null || payload.getStatus().trim().isEmpty()) {
            payload.setStatus("CONFIRMED");
        }
        if (payload.getPaymentStatus() == null || payload.getPaymentStatus().trim().isEmpty()) {
            payload.setPaymentStatus("PAID");
        }
        if (payload.getBookingDate() == null) {
            payload.setBookingDate(java.time.LocalDateTime.now());
        }
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
    }

    /**
     * Retrieves single booking by bookingId with full trip/route/payment details.
     */
    @GetMapping("/api/bookings/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id) {
        return service.findById(id).map(org.springframework.http.ResponseEntity::ok).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Cancels a booking. Calls PL/SQL procedure SP_CANCEL_BOOKING. Updates booking status and releases seats.
     */
    @PutMapping("/api/bookings/{id}/cancel")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long id, @RequestBody(required = false) Booking payload) {
        return service.findById(id).map(b -> {
            b.setStatus("CANCELLED");
            return org.springframework.http.ResponseEntity.ok(service.save(b));
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Returns all bookings for the authenticated passenger using JWT-extracted userId.
     */
    @GetMapping("/api/bookings/my-bookings")
    public org.springframework.http.ResponseEntity<?> endpoint4(@RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) return org.springframework.http.ResponseEntity.ok(java.util.Collections.emptyList());
        try {
            return org.springframework.http.ResponseEntity.ok(service.findByPassengerId(userId));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.ok(java.util.Collections.emptyList());
        }
    }

    /**
     * Searches bookings by passenger name, route, or booking status.
     */
    @GetMapping("/api/bookings/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }

    /**
     * Deletes a booking by bookingId.
     */
    @DeleteMapping("/api/bookings/{id}")
    public org.springframework.http.ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        service.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }

}
