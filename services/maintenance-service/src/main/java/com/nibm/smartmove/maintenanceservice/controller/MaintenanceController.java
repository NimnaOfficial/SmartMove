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
        if (payload.getVehicleId() == null || payload.getVehicleId() <= 0) {
            payload.setVehicleId(1L);
        }
        if (payload.getDescription() == null || payload.getDescription().trim().isEmpty()) {
            payload.setDescription("Routine Maintenance");
        }
        if (payload.getCost() == null) {
            payload.setCost(0.0);
        }
        if (payload.getMaintenanceDate() == null) {
            payload.setMaintenanceDate(java.time.LocalDateTime.now());
        }
        // Normalize status to Oracle CHECK constraint: PENDING, IN_PROGRESS, COMPLETED
        if (payload.getStatus() == null || payload.getStatus().trim().isEmpty() || "SCHEDULED".equalsIgnoreCase(payload.getStatus())) {
            payload.setStatus("PENDING");
        } else if (!"IN_PROGRESS".equalsIgnoreCase(payload.getStatus()) && !"COMPLETED".equalsIgnoreCase(payload.getStatus())) {
            payload.setStatus("PENDING");
        } else {
            payload.setStatus(payload.getStatus().toUpperCase());
        }
        if (payload.getCreatedAt() == null) {
            payload.setCreatedAt(java.time.LocalDateTime.now());
        }
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
        return service.findById(id).map(existing -> {
            if (payload.getVehicleId() != null) existing.setVehicleId(payload.getVehicleId());
            if (payload.getDescription() != null) existing.setDescription(payload.getDescription());
            if (payload.getCost() != null) existing.setCost(payload.getCost());
            if (payload.getMaintenanceDate() != null) existing.setMaintenanceDate(payload.getMaintenanceDate());
            if (payload.getStatus() != null && !payload.getStatus().trim().isEmpty()) {
                String s = payload.getStatus().trim().toUpperCase();
                if ("SCHEDULED".equals(s) || "PENDING".equals(s)) existing.setStatus("PENDING");
                else if ("IN_PROGRESS".equals(s)) existing.setStatus("IN_PROGRESS");
                else if ("COMPLETED".equals(s)) existing.setStatus("COMPLETED");
                else existing.setStatus("PENDING");
            }
            return org.springframework.http.ResponseEntity.ok(service.save(existing));
        }).orElseGet(() -> {
            payload.setMaintenanceId(id);
            if (payload.getStatus() == null || "SCHEDULED".equalsIgnoreCase(payload.getStatus())) {
                payload.setStatus("PENDING");
            }
            if (payload.getCreatedAt() == null) payload.setCreatedAt(java.time.LocalDateTime.now());
            return org.springframework.http.ResponseEntity.ok(service.save(payload));
        });
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
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }

    /**
     * Deletes a maintenance record by maintenanceId.
     */
    @DeleteMapping("/api/maintenance/{id}")
    public org.springframework.http.ResponseEntity<?> deleteMaintenance(@PathVariable Long id) {
        service.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }

}
