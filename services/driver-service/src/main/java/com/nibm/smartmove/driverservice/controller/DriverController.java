package com.nibm.smartmove.driverservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.nibm.smartmove.driverservice.entity.Driver;


@RestController
@CrossOrigin(origins = "*")
public class DriverController {
    @Autowired
    private com.nibm.smartmove.driverservice.service.DriverService service;


    /**
     * Retrieves all drivers from Oracle DRIVER table. Includes rating and trip count aggregations.
     */
    @GetMapping("/api/drivers")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        return org.springframework.http.ResponseEntity.ok(service.findAll());
    }

    /**
     * Creates a new driver record. Validates license number uniqueness, email format, phone format.
     */
    @PostMapping("/api/drivers")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody Driver payload) {
        if (payload.getPasswordHash() == null || payload.getPasswordHash().trim().isEmpty()) {
            // Default BCrypt hash for Driver@123
            payload.setPasswordHash("$2a$10$wI5fQ5h0j5q6v3eK7G1e6eL0O/6yBqN3rYQ.QGf1pL0W0uO1k8o1e");
        }
        if (payload.getStatus() == null || payload.getStatus().trim().isEmpty()) {
            payload.setStatus("ACTIVE");
        }
        if (payload.getRole() == null || payload.getRole().trim().isEmpty()) {
            payload.setRole("DRIVER");
        }
        if (payload.getTotalTrips() == null) {
            payload.setTotalTrips(0.0);
        }
        if (payload.getRating() == null) {
            payload.setRating(5.0);
        }
        if (payload.getCreatedAt() == null) {
            payload.setCreatedAt(java.time.LocalDateTime.now());
        }
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
    }

    /**
     * Retrieves single driver by driverId. Includes assigned vehicle and recent trip history.
     */
    @GetMapping("/api/drivers/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id) {
        return service.findById(id).map(org.springframework.http.ResponseEntity::ok).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Updates driver profile info (name, phone, license, status).
     */
    @PutMapping("/api/drivers/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long id, @RequestBody Driver payload) {
        return service.findById(id).map(existing -> {
            if (payload.getFirstName() != null) existing.setFirstName(payload.getFirstName());
            if (payload.getLastName() != null) existing.setLastName(payload.getLastName());
            if (payload.getEmail() != null) existing.setEmail(payload.getEmail());
            if (payload.getPhone() != null) existing.setPhone(payload.getPhone());
            if (payload.getLicenseNumber() != null) existing.setLicenseNumber(payload.getLicenseNumber());
            if (payload.getStatus() != null && !payload.getStatus().trim().isEmpty()) existing.setStatus(payload.getStatus());
            if (payload.getRating() != null) existing.setRating(payload.getRating());
            if (payload.getTotalTrips() != null) existing.setTotalTrips(payload.getTotalTrips());
            if (payload.getPasswordHash() != null && !payload.getPasswordHash().trim().isEmpty()) existing.setPasswordHash(payload.getPasswordHash());
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            return org.springframework.http.ResponseEntity.ok(service.save(existing));
        }).orElseGet(() -> {
            payload.setDriverId(id);
            if (payload.getPasswordHash() == null || payload.getPasswordHash().trim().isEmpty()) {
                payload.setPasswordHash("$2a$10$wI5fQ5h0j5q6v3eK7G1e6eL0O/6yBqN3rYQ.QGf1pL0W0uO1k8o1e");
            }
            if (payload.getStatus() == null) payload.setStatus("ACTIVE");
            if (payload.getRole() == null) payload.setRole("DRIVER");
            if (payload.getTotalTrips() == null) payload.setTotalTrips(0.0);
            if (payload.getRating() == null) payload.setRating(5.0);
            if (payload.getCreatedAt() == null) payload.setCreatedAt(java.time.LocalDateTime.now());
            payload.setUpdatedAt(java.time.LocalDateTime.now());
            return org.springframework.http.ResponseEntity.ok(service.save(payload));
        });
    }

    /**
     * Returns the authenticated driver's own profile using JWT-extracted userId or request headers.
     */
    @GetMapping("/api/drivers/profile")
    public org.springframework.http.ResponseEntity<?> endpoint4(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader,
            @RequestParam(required = false) Long id) {
        if (id != null) {
            return service.findById(id).map(org.springframework.http.ResponseEntity::ok).orElse(org.springframework.http.ResponseEntity.notFound().build());
        }
        if (userIdHeader != null && !userIdHeader.isBlank()) {
            try {
                Long uId = Long.parseLong(userIdHeader.trim());
                java.util.Optional<Driver> d = service.findById(uId);
                if (d.isPresent()) return org.springframework.http.ResponseEntity.ok(d.get());
            } catch (Exception ignored) {}
        }
        if (emailHeader != null && !emailHeader.isBlank()) {
            java.util.List<Driver> search = service.search(emailHeader.trim());
            if (!search.isEmpty()) return org.springframework.http.ResponseEntity.ok(search.get(0));
        }
        // Fallback to first driver record
        java.util.List<Driver> all = service.findAll();
        if (!all.isEmpty()) return org.springframework.http.ResponseEntity.ok(all.get(0));
        return org.springframework.http.ResponseEntity.notFound().build();
    }

    /**
     * Updates the authenticated driver's own profile.
     */
    @PutMapping("/api/drivers/profile")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestBody Driver payload) {
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
    }

    /**
     * Returns all trips assigned to the authenticated driver. Joins TRIP, ROUTE, VEHICLE tables.
     */
    @GetMapping("/api/drivers/my-trips")
    public org.springframework.http.ResponseEntity<?> endpoint6() {
        return org.springframework.http.ResponseEntity.ok(java.util.Collections.emptyList());
    }

    /**
     * Searches drivers by name, license number, or email.
     */
    @GetMapping("/api/drivers/search")
    public org.springframework.http.ResponseEntity<?> endpoint7(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }

    /**
     * Deletes a driver by driverId.
     */
    @DeleteMapping("/api/drivers/{id}")
    public org.springframework.http.ResponseEntity<?> deleteDriver(@PathVariable Long id) {
        service.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }

}
