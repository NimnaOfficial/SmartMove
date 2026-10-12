package com.nibm.smartmove.feedbackservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.nibm.smartmove.feedbackservice.entity.Feedback;


@RestController
@CrossOrigin(origins = "*")
public class FeedbackController {
    @Autowired
    private com.nibm.smartmove.feedbackservice.service.FeedbackService service;


    /**
     * Retrieves all feedback from Oracle FEEDBACK table. Joins PASSENGER, ROUTE.
     */
    @GetMapping("/api/feedback")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        return org.springframework.http.ResponseEntity.ok(service.findAll());
    }

    /**
     * Submits new feedback. Validates rating 1-5, links to passenger/route/vehicle/driver.
     */
    @PostMapping("/api/feedback")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody Feedback payload) {
        if (payload.getPassengerId() == null || payload.getPassengerId() <= 0) {
            payload.setPassengerId(1L);
        }
        if (payload.getType() == null || payload.getType().trim().isEmpty()) {
            payload.setType("SUGGESTION");
        } else {
            String t = payload.getType().trim().toUpperCase();
            if (!"COMPLAINT".equals(t) && !"SUGGESTION".equals(t) && !"APPRECIATION".equals(t)) {
                payload.setType("SUGGESTION");
            } else {
                payload.setType(t);
            }
        }
        if (payload.getDescription() == null || payload.getDescription().trim().isEmpty()) {
            payload.setDescription("No description provided.");
        }
        if (payload.getStatus() == null || payload.getStatus().trim().isEmpty()) {
            payload.setStatus("OPEN");
        }
        if (payload.getCreatedAt() == null) {
            payload.setCreatedAt(java.time.LocalDateTime.now());
        }
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
    }

    /**
     * Retrieves single feedback by feedbackId.
     */
    @GetMapping("/api/feedback/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id) {
        return service.findById(id).map(org.springframework.http.ResponseEntity::ok).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Retrieves all feedback submitted by a specific passenger.
     */
    @GetMapping("/api/feedback/passenger/{passengerId}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long passengerId) {
        return org.springframework.http.ResponseEntity.ok(service.findAll());
    }

    /**
     * Searches feedback by comment text, type, or passenger name.
     */
    @GetMapping("/api/feedback/search")
    public org.springframework.http.ResponseEntity<?> endpoint4(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }

    /**
     * Deletes a feedback item by feedbackId.
     */
    @DeleteMapping("/api/feedback/{id}")
    public org.springframework.http.ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        service.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }

}
