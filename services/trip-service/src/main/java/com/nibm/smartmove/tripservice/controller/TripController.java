package com.nibm.smartmove.tripservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.nibm.smartmove.tripservice.entity.Trip;


@RestController
@CrossOrigin(origins = "*")
public class TripController {
    @Autowired
    private com.nibm.smartmove.tripservice.service.TripService service;


    /**
     * Retrieves all trips from Oracle TRIP table with route, vehicle, driver info via JOINs.
     */
    @GetMapping("/api/trips")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        try {
            return org.springframework.http.ResponseEntity.ok(service.findAll());
        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity.status(500).body("Trip error: " + e.getMessage());
        }
    }

    /**
     * Schedules a new trip. Calls PL/SQL procedure SP_SCHEDULE_TRIP. Validates route/vehicle/driver exist, vehicle and driver available.
     */
    @PostMapping("/api/trips")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody Trip payload) {
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
    }

    /**
     * Retrieves single trip by tripId with full details (route, vehicle, driver, seat info).
     */
    @GetMapping("/api/trips/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id) {
        return service.findById(id).map(org.springframework.http.ResponseEntity::ok).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Updates trip info (date, time, fare, status). Admin/driver endpoint.
     */
    @PutMapping("/api/trips/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long id, @RequestBody Trip payload) {
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
    }

    /**
     * Updates only the trip status (SCHEDULED→IN_PROGRESS→COMPLETED or CANCELLED). Driver can update own trips.
     */
    @PatchMapping("/api/trips/{id}/status")
    public org.springframework.http.ResponseEntity<?> endpoint4(@PathVariable Long id, @RequestBody Trip payload) {
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
    }

    /**
     * Searches trips by origin, destination, date, maxPrice. Public endpoint for passengers to find available trips.
     */
    @GetMapping("/api/trips/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Double maxPrice) {
        return org.springframework.http.ResponseEntity.ok(service.search(origin, destination, date, maxPrice));
    }

    /**
     * Returns trips scheduled in the near future. Used by passenger dashboard.
     */
    @GetMapping("/api/trips/upcoming")
    public org.springframework.http.ResponseEntity<?> endpoint6() {
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Deletes a trip by tripId.
     */
    @DeleteMapping("/api/trips/{id}")
    public org.springframework.http.ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        service.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }

}
