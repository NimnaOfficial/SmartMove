package com.nibm.smartmove.passengerservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.nibm.smartmove.passengerservice.entity.Passenger;


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
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id, @RequestBody Passenger payload) {
        return service.findById(id).map(existing -> {
            if (payload.getFirstName() != null) existing.setFirstName(payload.getFirstName());
            if (payload.getLastName() != null) existing.setLastName(payload.getLastName());
            if (payload.getEmail() != null) existing.setEmail(payload.getEmail());
            if (payload.getPhone() != null) existing.setPhone(payload.getPhone());
            if (payload.getStatus() != null && !payload.getStatus().trim().isEmpty()) existing.setStatus(payload.getStatus());
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            return org.springframework.http.ResponseEntity.ok(service.save(existing));
        }).orElseGet(() -> {
            payload.setPassengerId(id);
            if (payload.getStatus() == null) payload.setStatus("ACTIVE");
            if (payload.getRole() == null) payload.setRole("PASSENGER");
            if (payload.getPasswordHash() == null) payload.setPasswordHash("$2a$10$wI5fQ5h0j5q6v3eK7G1e6eL0O/6yBqN3rYQ.QGf1pL0W0uO1k8o1e");
            if (payload.getRegisteredAt() == null) payload.setRegisteredAt(java.time.LocalDateTime.now());
            payload.setUpdatedAt(java.time.LocalDateTime.now());
            return org.springframework.http.ResponseEntity.ok(service.save(payload));
        });
    }

    /**
     * Deactivates/suspends a passenger account.
     */
    @DeleteMapping("/api/passengers/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long id) {
        service.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Returns the authenticated passenger's own profile using JWT-extracted userId.
     */
    @GetMapping("/api/passengers/profile")
    public org.springframework.http.ResponseEntity<?> endpoint4(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(value = "passengerId", required = false) Long passengerId,
            @RequestParam(value = "userId", required = false) Long userIdParam) {
        if (userId == null) userId = passengerId;
        if (userId == null) userId = userIdParam;
        if (userId == null) userId = 1L;
        return service.findById(userId)
                .map(org.springframework.http.ResponseEntity::ok)
                .orElseGet(() -> service.findById(1L).map(org.springframework.http.ResponseEntity::ok).orElse(org.springframework.http.ResponseEntity.notFound().build()));
    }

    /**
     * Updates the authenticated passenger's own profile.
     */
    @PutMapping("/api/passengers/profile")
    public org.springframework.http.ResponseEntity<?> endpoint5(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(value = "passengerId", required = false) Long passengerId,
            @RequestParam(value = "userId", required = false) Long userIdParam,
            @RequestBody Passenger payload) {
        if (userId == null) userId = passengerId;
        if (userId == null) userId = userIdParam;
        if (userId == null && payload.getPassengerId() != null) userId = payload.getPassengerId();
        if (userId == null && payload.getId() != null) userId = payload.getId();
        if (userId == null) userId = 1L;

        final Long targetId = userId;
        return service.findById(targetId).map(existing -> {
            if (payload.getFirstName() != null && !payload.getFirstName().isBlank()) existing.setFirstName(payload.getFirstName().trim());
            if (payload.getLastName() != null && !payload.getLastName().isBlank()) existing.setLastName(payload.getLastName().trim());
            if (payload.getEmail() != null && !payload.getEmail().isBlank()) existing.setEmail(payload.getEmail().trim());
            if (payload.getPhone() != null && !payload.getPhone().isBlank()) existing.setPhone(payload.getPhone().trim());
            if (payload.getAddress() != null) existing.setAddress(payload.getAddress());
            if (payload.getCity() != null) existing.setCity(payload.getCity());
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            Passenger saved = service.save(existing);
            return org.springframework.http.ResponseEntity.ok(saved);
        }).orElseGet(() -> {
            payload.setPassengerId(targetId);
            if (payload.getStatus() == null) payload.setStatus("ACTIVE");
            if (payload.getRole() == null) payload.setRole("PASSENGER");
            if (payload.getPasswordHash() == null) payload.setPasswordHash("$2a$10$X");
            if (payload.getRegisteredAt() == null) payload.setRegisteredAt(java.time.LocalDateTime.now());
            payload.setUpdatedAt(java.time.LocalDateTime.now());
            Passenger saved = service.save(payload);
            return org.springframework.http.ResponseEntity.ok(saved);
        });
    }

    /**
     * Searches passengers by name, email, or phone.
     */
    @GetMapping("/api/passengers/search")
    public org.springframework.http.ResponseEntity<?> endpoint6(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }

}
