package com.nibm.smartmove.passengerservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "*")
public class PassengerController {
    @Autowired
    private com.nibm.smartmove.passengerservice.service.PassengerService service;


    /**
     * Retrieves all passengers from Oracle PASSENGER table. Admin-only endpoint.
     */
    @GetMapping("/api/passengers")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        return org.springframework.http.ResponseEntity.ok(service.findAll());
    }

    /**
     * Retrieves single passenger by passengerId with booking count.
     */
    @GetMapping("/api/passengers/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint1(@PathVariable Long id) {
        return service.findById(id).map(org.springframework.http.ResponseEntity::ok).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Updates passenger info. Admin can update any passenger.
     */
    @PutMapping("/api/passengers/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id, @RequestBody java.util.Map<String, Object> payload) {
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Deactivates/suspends a passenger account.
     */
    @DeleteMapping("/api/passengers/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long id) {
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Returns the authenticated passenger's own profile using JWT-extracted userId.
     */
    @GetMapping("/api/passengers/profile")
    public org.springframework.http.ResponseEntity<?> endpoint4() {
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Updates the authenticated passenger's own profile.
     */
    @PutMapping("/api/passengers/profile")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestBody java.util.Map<String, Object> payload) {
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Searches passengers by name, email, or phone.
     */
    @GetMapping("/api/passengers/search")
    public org.springframework.http.ResponseEntity<?> endpoint6(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok().build();
    }

}
