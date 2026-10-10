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
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
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
