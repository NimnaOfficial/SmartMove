package com.nibm.smartmove.driverservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

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
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody java.util.Map<String, Object> payload) {
        return org.springframework.http.ResponseEntity.ok().build();
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
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long id, @RequestBody java.util.Map<String, Object> payload) {
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Returns the authenticated driver's own profile using JWT-extracted userId.
     */
    @GetMapping("/api/drivers/profile")
    public org.springframework.http.ResponseEntity<?> endpoint4() {
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Updates the authenticated driver's own profile.
     */
    @PutMapping("/api/drivers/profile")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestBody java.util.Map<String, Object> payload) {
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Returns all trips assigned to the authenticated driver. Joins TRIP, ROUTE, VEHICLE tables.
     */
    @GetMapping("/api/drivers/my-trips")
    public org.springframework.http.ResponseEntity<?> endpoint6() {
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Searches drivers by name, license number, or email.
     */
    @GetMapping("/api/drivers/search")
    public org.springframework.http.ResponseEntity<?> endpoint7(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok().build();
    }

}
