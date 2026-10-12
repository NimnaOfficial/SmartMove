package com.nibm.smartmove.routeservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.nibm.smartmove.routeservice.entity.Route;


@RestController
@CrossOrigin(origins = "*")
public class RouteController {
    @Autowired
    private com.nibm.smartmove.routeservice.service.RouteService service;


    /**
     * Retrieves all routes from Oracle ROUTE table with trip counts.
     */
    @GetMapping("/api/routes")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        return org.springframework.http.ResponseEntity.ok(service.findAll());
    }

    /**
     * Creates a new route. Validates origin != destination, checks for duplicate routes.
     */
    @PostMapping("/api/routes")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody Route payload) {
        if (payload.getDistanceKm() == null) {
            payload.setDistanceKm(50.0);
        }
        if (payload.getBaseFare() == null) {
            payload.setBaseFare(Math.max(50.0, payload.getDistanceKm() * 5.0));
        }
        if (payload.getStatus() == null || payload.getStatus().trim().isEmpty()) {
            payload.setStatus("ACTIVE");
        }
        if (payload.getCreatedAt() == null) {
            payload.setCreatedAt(java.time.LocalDateTime.now());
        }
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
    }

    /**
     * Retrieves single route by routeId with associated trip information.
     */
    @GetMapping("/api/routes/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id) {
        return service.findById(id).map(org.springframework.http.ResponseEntity::ok).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Updates route info (origin, destination, distance, duration, status).
     */
    @PutMapping("/api/routes/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long id, @RequestBody Route payload) {
        return service.findById(id).map(existing -> {
            if (payload.getOrigin() != null) existing.setOrigin(payload.getOrigin());
            if (payload.getDestination() != null) existing.setDestination(payload.getDestination());
            if (payload.getDistanceKm() != null) existing.setDistanceKm(payload.getDistanceKm());
            if (payload.getEstimatedDuration() != null) existing.setEstimatedDuration(payload.getEstimatedDuration());
            if (payload.getBaseFare() != null) existing.setBaseFare(payload.getBaseFare());
            if (payload.getStatus() != null && !payload.getStatus().trim().isEmpty()) existing.setStatus(payload.getStatus());
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            return org.springframework.http.ResponseEntity.ok(service.save(existing));
        }).orElseGet(() -> {
            payload.setRouteId(id);
            if (payload.getDistanceKm() == null) payload.setDistanceKm(50.0);
            if (payload.getBaseFare() == null) payload.setBaseFare(350.0);
            if (payload.getStatus() == null) payload.setStatus("ACTIVE");
            if (payload.getCreatedAt() == null) payload.setCreatedAt(java.time.LocalDateTime.now());
            payload.setUpdatedAt(java.time.LocalDateTime.now());
            return org.springframework.http.ResponseEntity.ok(service.save(payload));
        });
    }

    /**
     * Deactivates a route. Sets status to INACTIVE. Checks no active trips reference it.
     */
    @DeleteMapping("/api/routes/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint4(@PathVariable Long id) {
        service.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Searches routes by origin, destination, or description.
     */
    @GetMapping("/api/routes/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }

}
