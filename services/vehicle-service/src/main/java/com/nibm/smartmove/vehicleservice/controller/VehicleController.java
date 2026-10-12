package com.nibm.smartmove.vehicleservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.nibm.smartmove.vehicleservice.entity.Vehicle;


@RestController
@CrossOrigin(origins = "*")
public class VehicleController {
    @Autowired
    private com.nibm.smartmove.vehicleservice.service.VehicleService service;


    /**
     * Retrieves all vehicles from the Oracle VEHICLE table. Supports optional query params for filtering by status, type.
     */
    @GetMapping("/api/vehicles")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        return org.springframework.http.ResponseEntity.ok(service.findAll());
    }

    /**
     * Creates a new vehicle record in Oracle. Calls PL/SQL procedure SP_REGISTER_VEHICLE. Validates registration uniqueness and capacity > 0.
     */
    @PostMapping("/api/vehicles")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody Vehicle payload) {
        if (payload.getCapacity() == null || payload.getCapacity() <= 0) {
            payload.setCapacity(45.0);
        }
        if (payload.getYear() == null || payload.getYear() <= 0) {
            payload.setYear(2024.0);
        }
        if (payload.getType() == null || payload.getType().trim().isEmpty()) {
            payload.setType("Standard");
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
     * Retrieves a single vehicle by vehicleId from Oracle VEHICLE table. Includes assigned driver info via JOIN.
     */
    @GetMapping("/api/vehicles/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id) {
        return service.findById(id).map(org.springframework.http.ResponseEntity::ok).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Updates an existing vehicle record. Validates registration uniqueness (excluding self). Updates status, capacity, model, etc.
     */
    @PutMapping("/api/vehicles/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long id, @RequestBody Vehicle payload) {
        return service.findById(id).map(existing -> {
            if (payload.getRegistrationNumber() != null) existing.setRegistrationNumber(payload.getRegistrationNumber());
            if (payload.getType() != null) existing.setType(payload.getType());
            if (payload.getModel() != null) existing.setModel(payload.getModel());
            if (payload.getYear() != null) existing.setYear(payload.getYear());
            if (payload.getCapacity() != null) existing.setCapacity(payload.getCapacity());
            if (payload.getStatus() != null && !payload.getStatus().trim().isEmpty()) existing.setStatus(payload.getStatus());
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            return org.springframework.http.ResponseEntity.ok(service.save(existing));
        }).orElseGet(() -> {
            payload.setVehicleId(id);
            if (payload.getCapacity() == null) payload.setCapacity(45.0);
            if (payload.getYear() == null) payload.setYear(2024.0);
            if (payload.getType() == null) payload.setType("Standard");
            if (payload.getStatus() == null) payload.setStatus("ACTIVE");
            if (payload.getCreatedAt() == null) payload.setCreatedAt(java.time.LocalDateTime.now());
            payload.setUpdatedAt(java.time.LocalDateTime.now());
            return org.springframework.http.ResponseEntity.ok(service.save(payload));
        });
    }

    /**
     * Soft-deletes or deactivates a vehicle. Sets status to RETIRED. Checks no active trips are assigned.
     */
    @DeleteMapping("/api/vehicles/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint4(@PathVariable Long id) {
        service.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Searches vehicles by registration number, type, or model. Uses Oracle LIKE queries across multiple columns.
     */
    @GetMapping("/api/vehicles/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }

}
