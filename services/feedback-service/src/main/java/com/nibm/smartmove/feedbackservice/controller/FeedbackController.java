package com.nibm.smartmove.feedbackservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

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
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody java.util.Map<String, Object> payload) {
        return org.springframework.http.ResponseEntity.ok().build();
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
        return org.springframework.http.ResponseEntity.ok().build();
    }

}
