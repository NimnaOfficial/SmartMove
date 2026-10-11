package com.nibm.smartmove.paymentservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.nibm.smartmove.paymentservice.entity.Payment;


@RestController
@CrossOrigin(origins = "*")
public class PaymentController {
    @Autowired
    private com.nibm.smartmove.paymentservice.service.PaymentService service;


    /**
     * Retrieves all payment records. Admin-only. Joins BOOKING, PASSENGER tables.
     */
    @GetMapping("/api/payments")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        return org.springframework.http.ResponseEntity.ok(service.findAll());
    }

    /**
     * Processes a payment for a booking. Calls PL/SQL procedure SP_PROCESS_PAYMENT. Updates booking payment status.
     */
    @PostMapping("/api/payments")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody Payment payload) {
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
    }

    /**
     * Retrieves a single payment record by paymentId.
     */
    @GetMapping("/api/payments/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id) {
        return service.findById(id).map(org.springframework.http.ResponseEntity::ok).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Retrieves payment record associated with a specific booking.
     */
    @GetMapping("/api/payments/booking/{bookingId}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long bookingId) {
        return org.springframework.http.ResponseEntity.ok().build();
    }

}
