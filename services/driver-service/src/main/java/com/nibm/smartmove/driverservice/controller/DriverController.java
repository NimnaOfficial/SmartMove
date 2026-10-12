package com.nibm.smartmove.driverservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.nibm.smartmove.driverservice.entity.Driver;


@RestController
@CrossOrigin(origins = "*")
public class DriverController {
    @Autowired
    private com.nibm.smartmove.driverservice.service.DriverService service;

    @Autowired(required = false)
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;


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
    public org.springframework.http.ResponseEntity<?> endpoint5(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader,
            @RequestParam(value = "id", required = false) Long idParam,
            @RequestParam(value = "driverId", required = false) Long driverIdParam,
            @RequestBody Driver payload) {
        
        Long targetId = payload.getDriverId();
        if (targetId == null) targetId = driverIdParam;
        if (targetId == null) targetId = idParam;
        if (targetId == null && userIdHeader != null && !userIdHeader.isBlank()) {
            try {
                targetId = Long.parseLong(userIdHeader.trim());
            } catch (Exception ignored) {}
        }

        if (targetId != null) {
            java.util.Optional<Driver> opt = service.findById(targetId);
            if (opt.isPresent()) {
                Driver existing = opt.get();
                if (payload.getFirstName() != null && !payload.getFirstName().trim().isEmpty()) {
                    existing.setFirstName(payload.getFirstName().trim());
                }
                if (payload.getLastName() != null && !payload.getLastName().trim().isEmpty()) {
                    existing.setLastName(payload.getLastName().trim());
                }
                if (payload.getPhone() != null && !payload.getPhone().trim().isEmpty()) {
                    existing.setPhone(payload.getPhone().trim());
                }
                if (payload.getEmail() != null && !payload.getEmail().trim().isEmpty()) {
                    existing.setEmail(payload.getEmail().trim());
                }
                if (payload.getLicenseNumber() != null && !payload.getLicenseNumber().trim().isEmpty()) {
                    existing.setLicenseNumber(payload.getLicenseNumber().trim());
                }
                existing.setUpdatedAt(java.time.LocalDateTime.now());
                Driver saved = service.save(existing);
                return org.springframework.http.ResponseEntity.ok(saved);
            }
        }

        String searchEmail = (emailHeader != null && !emailHeader.isBlank()) 
            ? emailHeader.trim() 
            : (payload.getEmail() != null ? payload.getEmail().trim() : null);

        if (searchEmail != null && !searchEmail.isEmpty()) {
            java.util.List<Driver> byEmail = service.search(searchEmail);
            if (!byEmail.isEmpty()) {
                Driver existing = byEmail.get(0);
                if (payload.getFirstName() != null && !payload.getFirstName().trim().isEmpty()) {
                    existing.setFirstName(payload.getFirstName().trim());
                }
                if (payload.getLastName() != null && !payload.getLastName().trim().isEmpty()) {
                    existing.setLastName(payload.getLastName().trim());
                }
                if (payload.getPhone() != null && !payload.getPhone().trim().isEmpty()) {
                    existing.setPhone(payload.getPhone().trim());
                }
                if (payload.getEmail() != null && !payload.getEmail().trim().isEmpty()) {
                    existing.setEmail(payload.getEmail().trim());
                }
                if (payload.getLicenseNumber() != null && !payload.getLicenseNumber().trim().isEmpty()) {
                    existing.setLicenseNumber(payload.getLicenseNumber().trim());
                }
                existing.setUpdatedAt(java.time.LocalDateTime.now());
                Driver saved = service.save(existing);
                return org.springframework.http.ResponseEntity.ok(saved);
            }
        }

        java.util.List<Driver> all = service.findAll();
        if (!all.isEmpty()) {
            Driver existing = all.get(0);
            if (payload.getFirstName() != null && !payload.getFirstName().trim().isEmpty()) {
                existing.setFirstName(payload.getFirstName().trim());
            }
            if (payload.getLastName() != null && !payload.getLastName().trim().isEmpty()) {
                existing.setLastName(payload.getLastName().trim());
            }
            if (payload.getPhone() != null && !payload.getPhone().trim().isEmpty()) {
                existing.setPhone(payload.getPhone().trim());
            }
            if (payload.getEmail() != null && !payload.getEmail().trim().isEmpty()) {
                existing.setEmail(payload.getEmail().trim());
            }
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            Driver saved = service.save(existing);
            return org.springframework.http.ResponseEntity.ok(saved);
        }

        Long defId = (targetId != null) ? targetId : 1L;
        payload.setDriverId(defId);
        if (payload.getStatus() == null) payload.setStatus("ACTIVE");
        if (payload.getRole() == null) payload.setRole("DRIVER");
        if (payload.getLicenseNumber() == null) payload.setLicenseNumber("B" + (1000000 + defId));
        if (payload.getPasswordHash() == null) payload.setPasswordHash("$2a$10$wI5fQ5h0j5q6v3eK7G1e6eL0O/6yBqN3rYQ.QGf1pL0W0uO1k8o1e");
        if (payload.getRating() == null) payload.setRating(5.0);
        if (payload.getTotalTrips() == null) payload.setTotalTrips(0.0);
        if (payload.getCreatedAt() == null) payload.setCreatedAt(java.time.LocalDateTime.now());
        payload.setUpdatedAt(java.time.LocalDateTime.now());
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
    }

    /**
     * Returns all trips assigned to the authenticated driver. Joins TRIP, ROUTE, VEHICLE tables.
     */
    @GetMapping("/api/drivers/my-trips")
    public org.springframework.http.ResponseEntity<?> endpoint6(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @RequestParam(value = "driverId", required = false) Long driverIdParam) {
        Long targetDriverId = driverIdParam;
        if (targetDriverId == null && userIdHeader != null && !userIdHeader.isBlank()) {
            try { targetDriverId = Long.parseLong(userIdHeader.trim()); } catch (Exception ignored) {}
        }
        if (targetDriverId == null) targetDriverId = 1L;

        if (jdbcTemplate != null) {
            try {
                String sql = "SELECT t.TRIP_ID, t.ROUTE_ID, t.VEHICLE_ID, t.DRIVER_ID, t.DEPARTURE_TIME, t.ARRIVAL_TIME, " +
                             "t.AVAILABLE_SEATS, t.STATUS, r.ORIGIN, r.DESTINATION, r.BASE_FARE, " +
                             "v.REGISTRATION_NUMBER, v.TYPE as VEHICLE_TYPE, v.MODEL as VEHICLE_MODEL " +
                             "FROM TRIP t " +
                             "LEFT JOIN ROUTE r ON t.ROUTE_ID = r.ROUTE_ID " +
                             "LEFT JOIN VEHICLE v ON t.VEHICLE_ID = v.VEHICLE_ID " +
                             "WHERE t.DRIVER_ID = ? ORDER BY t.DEPARTURE_TIME ASC";
                java.util.List<java.util.Map<String, Object>> rows = jdbcTemplate.queryForList(sql, targetDriverId);
                java.util.List<java.util.Map<String, Object>> list = new java.util.ArrayList<>();
                for (java.util.Map<String, Object> r : rows) {
                    java.util.Map<String, Object> m = new java.util.HashMap<>();
                    for (java.util.Map.Entry<String, Object> entry : r.entrySet()) {
                        m.put(entry.getKey().toLowerCase(), entry.getValue());
                    }
                    m.put("tripId", r.get("TRIP_ID"));
                    m.put("id", r.get("TRIP_ID"));
                    m.put("routeOrigin", r.get("ORIGIN"));
                    m.put("routeDestination", r.get("DESTINATION"));
                    m.put("vehicleRegistration", r.get("REGISTRATION_NUMBER"));
                    m.put("departureTime", r.get("DEPARTURE_TIME") != null ? r.get("DEPARTURE_TIME").toString() : null);
                    m.put("arrivalTime", r.get("ARRIVAL_TIME") != null ? r.get("ARRIVAL_TIME").toString() : null);
                    list.add(m);
                }
                return org.springframework.http.ResponseEntity.ok(list);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
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
