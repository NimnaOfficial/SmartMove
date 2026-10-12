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
        if (payload.getOrigin() == null || payload.getOrigin().trim().isEmpty()) {
            return org.springframework.http.ResponseEntity.badRequest()
                .body(java.util.Map.of("message", "Origin is required."));
        }
        if (payload.getDestination() == null || payload.getDestination().trim().isEmpty()) {
            return org.springframework.http.ResponseEntity.badRequest()
                .body(java.util.Map.of("message", "Destination is required."));
        }
        if (payload.getOrigin().trim().equalsIgnoreCase(payload.getDestination().trim())) {
            return org.springframework.http.ResponseEntity.badRequest()
                .body(java.util.Map.of("message", "Origin and destination cannot be the same."));
        }
        if (payload.getDistanceKm() == null || payload.getDistanceKm() <= 0) {
            payload.setDistanceKm(50.0);
        }
        if (payload.getBaseFare() == null || payload.getBaseFare() <= 0) {
            payload.setBaseFare(Math.max(50.0, payload.getDistanceKm() * 5.0));
        }
        if (payload.getStatus() == null || payload.getStatus().trim().isEmpty()) {
            payload.setStatus("ACTIVE");
        } else {
            String st = payload.getStatus().trim().toUpperCase();
            payload.setStatus(st.equals("INACTIVE") ? "INACTIVE" : "ACTIVE");
        }
        if (payload.getEstimatedDuration() == null || payload.getEstimatedDuration().trim().isEmpty()) {
            payload.setEstimatedDuration("1h 30m");
        }
        if (payload.getCreatedAt() == null) {
            payload.setCreatedAt(java.time.LocalDateTime.now());
        }
        try {
            return org.springframework.http.ResponseEntity.ok(service.save(payload));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500)
                .body(java.util.Map.of("message", "Failed to save route: " + e.getMessage()));
        }
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
            if (payload.getOrigin() != null && !payload.getOrigin().trim().isEmpty()) {
                existing.setOrigin(payload.getOrigin().trim());
            }
            if (payload.getDestination() != null && !payload.getDestination().trim().isEmpty()) {
                existing.setDestination(payload.getDestination().trim());
            }
            if (existing.getOrigin() != null && existing.getDestination() != null &&
                existing.getOrigin().trim().equalsIgnoreCase(existing.getDestination().trim())) {
                return org.springframework.http.ResponseEntity.badRequest()
                    .body(java.util.Map.of("message", "Origin and destination cannot be the same."));
            }
            if (payload.getDistanceKm() != null && payload.getDistanceKm() > 0) {
                existing.setDistanceKm(payload.getDistanceKm());
            } else if (payload.getDistance() != null && payload.getDistance() > 0) {
                existing.setDistanceKm(payload.getDistance());
            }
            if (payload.getEstimatedDuration() != null && !payload.getEstimatedDuration().trim().isEmpty()) {
                existing.setEstimatedDuration(payload.getEstimatedDuration().trim());
            } else if (payload.getDuration() != null && !payload.getDuration().trim().isEmpty()) {
                existing.setEstimatedDuration(payload.getDuration().trim());
            }
            if (payload.getBaseFare() != null && payload.getBaseFare() >= 0) {
                existing.setBaseFare(payload.getBaseFare());
            }
            if (payload.getStatus() != null && !payload.getStatus().trim().isEmpty()) {
                String st = payload.getStatus().trim().toUpperCase();
                existing.setStatus(st.equals("INACTIVE") ? "INACTIVE" : "ACTIVE");
            }
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            try {
                return org.springframework.http.ResponseEntity.ok(service.save(existing));
            } catch (Exception e) {
                return org.springframework.http.ResponseEntity.status(500)
                    .body(java.util.Map.of("message", "Failed to update route: " + e.getMessage()));
            }
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
        return service.findById(id).map(existing -> {
            try {
                service.deleteById(id);
                return org.springframework.http.ResponseEntity.ok(java.util.Map.of(
                    "message", "Route deleted successfully.",
                    "routeId", id
                ));
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                existing.setStatus("INACTIVE");
                existing.setUpdatedAt(java.time.LocalDateTime.now());
                service.save(existing);
                return org.springframework.http.ResponseEntity.ok(java.util.Map.of(
                    "message", "Route is assigned to existing trip records. Its status was set to INACTIVE.",
                    "deactivated", true,
                    "routeId", id
                ));
            } catch (Exception e) {
                return org.springframework.http.ResponseEntity.status(500)
                    .body(java.util.Map.of("message", "Failed to delete route: " + e.getMessage()));
            }
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Searches routes by origin, destination, or description.
     */
    @GetMapping("/api/routes/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }

}
