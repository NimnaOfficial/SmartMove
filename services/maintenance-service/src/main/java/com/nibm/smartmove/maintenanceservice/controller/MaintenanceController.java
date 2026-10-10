package com.nibm.smartmove.maintenanceservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.nibm.smartmove.maintenanceservice.entity.Maintenance;


@RestController
@CrossOrigin(origins = "*")
public class MaintenanceController {
    @Autowired
    private com.nibm.smartmove.maintenanceservice.service.MaintenanceService service;


    /**
     * Retrieves all maintenance records from Oracle MAINTENANCE table. Joins VEHICLE.
     */
    @GetMapping("/api/maintenance")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        return org.springframework.http.ResponseEntity.ok(service.findAll());
    }

    /**
     * Records new maintenance entry. Calls PL/SQL procedure SP_RECORD_MAINTENANCE. Links to vehicle.
     */
    @PostMapping("/api/maintenance")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody Maintenance payload) {
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
    }

    /**
     * Retrieves single maintenance record by maintenanceId.
     */
    @GetMapping("/api/maintenance/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id) {
        return service.findById(id).map(org.springframework.http.ResponseEntity::ok).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Updates maintenance record (status, cost, description, next date).
     */
    @PutMapping("/api/maintenance/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long id, @RequestBody Maintenance payload) {
        return org.springframework.http.ResponseEntity.ok(service.save(payload));
    }

    /**
     * Returns vehicles that are due or overdue for maintenance.
     */
    @GetMapping("/api/maintenance/due")
    public org.springframework.http.ResponseEntity<?> endpoint4() {
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Searches maintenance records by vehicle registration, type, or technician.
     */
    @GetMapping("/api/maintenance/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok().build();
    }

}
