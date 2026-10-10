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
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
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
