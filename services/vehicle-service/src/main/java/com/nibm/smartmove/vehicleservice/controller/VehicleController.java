package com.nibm.smartmove.vehicleservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.nibm.smartmove.vehicleservice.entity.Vehicle;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class VehicleController {
    @Autowired
    private com.nibm.smartmove.vehicleservice.service.VehicleService service;

    @Autowired(required = false)
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    private void enrichAssignedDrivers(List<Vehicle> list) {
        if (jdbcTemplate == null || list == null || list.isEmpty()) return;
        try {
            Map<Long, String> assigned = new HashMap<>();
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT t.VEHICLE_ID, d.FIRST_NAME || ' ' || d.LAST_NAME AS DRIVER_NAME " +
                "FROM TRIP t JOIN DRIVER d ON t.DRIVER_ID = d.DRIVER_ID " +
                "WHERE t.STATUS IN ('SCHEDULED', 'IN_PROGRESS')"
            );
            for (Map<String, Object> r : rows) {
                Number vId = null;
                for (Map.Entry<String, Object> e : r.entrySet()) {
                    if ("VEHICLE_ID".equalsIgnoreCase(e.getKey()) && e.getValue() instanceof Number) {
                        vId = (Number) e.getValue();
                    }
                }
                String dName = null;
                for (Map.Entry<String, Object> e : r.entrySet()) {
                    if ("DRIVER_NAME".equalsIgnoreCase(e.getKey()) && e.getValue() != null) {
                        dName = e.getValue().toString();
                    }
                }
                if (vId != null && dName != null) {
                    assigned.putIfAbsent(vId.longValue(), dName);
                }
            }
            for (Vehicle v : list) {
                if (v.getVehicleId() != null && assigned.containsKey(v.getVehicleId())) {
                    v.setDriverName(assigned.get(v.getVehicleId()));
                }
            }
        } catch (Exception ignored) {}
    }

    /**
     * Retrieves all vehicles from the Oracle VEHICLE table. Supports optional query params for filtering by status, type.
     */
    @GetMapping("/api/vehicles")
    public org.springframework.http.ResponseEntity<?> endpoint0(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        List<Vehicle> list = service.findAll();
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            list = list.stream().filter(v -> status.equalsIgnoreCase(v.getStatus())).toList();
        }
        if (type != null && !type.trim().isEmpty() && !type.equalsIgnoreCase("ALL")) {
            list = list.stream().filter(v -> type.equalsIgnoreCase(v.getType())).toList();
        }
        enrichAssignedDrivers(list);
        return org.springframework.http.ResponseEntity.ok(list);
    }

    /**
     * Creates a new vehicle record in Oracle. Calls PL/SQL procedure SP_REGISTER_VEHICLE. Validates registration uniqueness and capacity > 0.
     */
    @PostMapping("/api/vehicles")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody Vehicle payload) {
        if (payload.getRegistrationNumber() == null || payload.getRegistrationNumber().trim().isEmpty()) {
            return org.springframework.http.ResponseEntity.badRequest()
                .body(Map.of("message", "Registration number is required."));
        }
        String reg = payload.getRegistrationNumber().trim().toUpperCase();
        payload.setRegistrationNumber(reg);

        // Check if registration number already exists
        boolean exists = service.search(reg).stream()
            .anyMatch(v -> reg.equalsIgnoreCase(v.getRegistrationNumber()));
        if (exists) {
            return org.springframework.http.ResponseEntity.badRequest()
                .body(Map.of("message", "A vehicle with registration number '" + reg + "' already exists."));
        }

        if (payload.getModel() == null || payload.getModel().trim().isEmpty()) {
            return org.springframework.http.ResponseEntity.badRequest()
                .body(Map.of("message", "Vehicle model is required."));
        }

        if (payload.getCapacity() == null || payload.getCapacity() <= 0) {
            payload.setCapacity(45.0);
        }
        if (payload.getYear() == null || payload.getYear() <= 0) {
            payload.setYear((double) java.time.Year.now().getValue());
        }
        if (payload.getType() == null || payload.getType().trim().isEmpty()) {
            payload.setType("Luxury Coach");
        }
        if (payload.getStatus() == null || payload.getStatus().trim().isEmpty()) {
            payload.setStatus("ACTIVE");
        } else {
            String st = payload.getStatus().trim().toUpperCase();
            if (st.equals("ACTIVE") || st.equals("INACTIVE") || st.equals("MAINTENANCE")) {
                payload.setStatus(st);
            } else {
                payload.setStatus("ACTIVE");
            }
        }
        if (payload.getCreatedAt() == null) {
            payload.setCreatedAt(java.time.LocalDateTime.now());
        }
        try {
            Vehicle saved = service.save(payload);
            enrichAssignedDrivers(List.of(saved));
            return org.springframework.http.ResponseEntity.ok(saved);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return org.springframework.http.ResponseEntity.badRequest()
                .body(Map.of("message", "Database constraint violation: Registration number may already exist."));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500)
                .body(Map.of("message", "Failed to save vehicle: " + e.getMessage()));
        }
    }

    /**
     * Retrieves a single vehicle by vehicleId from Oracle VEHICLE table. Includes assigned driver info via JOIN.
     */
    @GetMapping("/api/vehicles/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id) {
        return service.findById(id).map(v -> {
            enrichAssignedDrivers(List.of(v));
            return org.springframework.http.ResponseEntity.ok(v);
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Updates an existing vehicle record. Validates registration uniqueness (excluding self). Updates status, capacity, model, etc.
     */
    @PutMapping("/api/vehicles/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long id, @RequestBody Vehicle payload) {
        return service.findById(id).map(existing -> {
            if (payload.getRegistrationNumber() != null && !payload.getRegistrationNumber().trim().isEmpty()) {
                String newReg = payload.getRegistrationNumber().trim().toUpperCase();
                if (!newReg.equalsIgnoreCase(existing.getRegistrationNumber())) {
                    boolean taken = service.search(newReg).stream()
                        .anyMatch(v -> !v.getVehicleId().equals(id) && newReg.equalsIgnoreCase(v.getRegistrationNumber()));
                    if (taken) {
                        return org.springframework.http.ResponseEntity.badRequest()
                            .body(Map.of("message", "Registration number '" + newReg + "' is already in use by another vehicle."));
                    }
                    existing.setRegistrationNumber(newReg);
                }
            }
            if (payload.getType() != null && !payload.getType().trim().isEmpty()) {
                existing.setType(payload.getType().trim());
            }
            if (payload.getModel() != null && !payload.getModel().trim().isEmpty()) {
                existing.setModel(payload.getModel().trim());
            }
            if (payload.getYear() != null && payload.getYear() > 0) {
                existing.setYear(payload.getYear());
            }
            if (payload.getCapacity() != null && payload.getCapacity() > 0) {
                existing.setCapacity(payload.getCapacity());
            }
            if (payload.getStatus() != null && !payload.getStatus().trim().isEmpty()) {
                String st = payload.getStatus().trim().toUpperCase();
                if (st.equals("ACTIVE") || st.equals("INACTIVE") || st.equals("MAINTENANCE")) {
                    existing.setStatus(st);
                } else if (st.equals("RETIRED")) {
                    existing.setStatus("INACTIVE");
                }
            }
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            try {
                Vehicle saved = service.save(existing);
                enrichAssignedDrivers(List.of(saved));
                return org.springframework.http.ResponseEntity.ok(saved);
            } catch (Exception e) {
                return org.springframework.http.ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to update vehicle: " + e.getMessage()));
            }
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Deletes a vehicle by ID. If child records exist in Oracle (foreign key violation), deactivates it cleanly.
     */
    @DeleteMapping("/api/vehicles/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint4(@PathVariable Long id) {
        return service.findById(id).map(existing -> {
            try {
                service.deleteById(id);
                return org.springframework.http.ResponseEntity.ok(Map.of(
                    "message", "Vehicle deleted successfully.",
                    "vehicleId", id
                ));
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                existing.setStatus("INACTIVE");
                existing.setUpdatedAt(java.time.LocalDateTime.now());
                service.save(existing);
                return org.springframework.http.ResponseEntity.ok(Map.of(
                    "message", "Vehicle is assigned to existing trip or maintenance records. Its status was set to INACTIVE.",
                    "deactivated", true,
                    "vehicleId", id
                ));
            } catch (Exception e) {
                return org.springframework.http.ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to delete vehicle: " + e.getMessage()));
            }
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Searches vehicles by registration number, type, or model. Uses Oracle LIKE queries across multiple columns.
     */
    @GetMapping("/api/vehicles/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        List<Vehicle> list = service.search(q);
        enrichAssignedDrivers(list);
        return org.springframework.http.ResponseEntity.ok(list);
    }

}
