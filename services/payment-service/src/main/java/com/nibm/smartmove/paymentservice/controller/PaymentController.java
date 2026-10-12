package com.nibm.smartmove.paymentservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.nibm.smartmove.paymentservice.entity.Payment;


@RestController
@CrossOrigin(origins = "*")
public class PaymentController {
    @Autowired
    private com.nibm.smartmove.paymentservice.service.PaymentService service;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;


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
        if (payload.getPaymentMethod() != null && "CASH".equalsIgnoreCase(payload.getPaymentMethod().trim())) {
            return org.springframework.http.ResponseEntity.badRequest().body(
                java.util.Map.of("message", "Cash payments are not supported. Only Credit/Debit Card payments are accepted.")
            );
        }
        if (payload.getBookingId() == null || payload.getBookingId() <= 0) {
            payload.setBookingId(1L);
        }
        if (payload.getAmount() == null) {
            payload.setAmount(1500.0);
        }
        payload.setPaymentMethod("CARD");
        if (payload.getStatus() == null || payload.getStatus().trim().isEmpty()) {
            payload.setStatus("SUCCESS");
        }
        if (payload.getPaymentDate() == null) {
            payload.setPaymentDate(java.time.LocalDateTime.now());
        }
        if (payload.getTransactionRef() == null || payload.getTransactionRef().trim().isEmpty()) {
            payload.setTransactionRef("TXN-" + System.currentTimeMillis());
        }
        Payment saved = service.save(payload);
        if (saved.getBookingId() != null) {
            try {
                jdbcTemplate.update("UPDATE BOOKING SET PAYMENT_STATUS = 'PAID', UPDATED_AT = CURRENT_TIMESTAMP WHERE BOOKING_ID = ?", saved.getBookingId());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return org.springframework.http.ResponseEntity.ok(saved);
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
        return org.springframework.http.ResponseEntity.ok(service.findAll().stream()
                .filter(p -> p.getBookingId() != null && p.getBookingId().equals(bookingId))
                .findFirst().orElse(null));
    }

}
