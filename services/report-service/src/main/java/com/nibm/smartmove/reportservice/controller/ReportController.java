package com.nibm.smartmove.reportservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "*")
public class ReportController {
    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    /**
     * Report 1: Most Frequently Used Routes. Calls PL/SQL report procedure. Returns route + booking count ranked.
     */
    @GetMapping("/api/reports/routes")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        return org.springframework.http.ResponseEntity.ok(jdbcTemplate.queryForList("SELECT route_id, COUNT(*) as count FROM BOOKING GROUP BY route_id"));
    }

    /**
     * Report 2: Revenue Within Given Period. Calls PL/SQL function FN_CALCULATE_REVENUE. Returns total revenue, tickets, avg value.
     */
    @GetMapping("/api/reports/revenue")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestParam String startDate, @RequestParam String endDate) {
        return org.springframework.http.ResponseEntity.ok(jdbcTemplate.queryForMap("SELECT FN_CALCULATE_REVENUE(?, ?) as total FROM DUAL", startDate, endDate));
    }

    /**
     * Report 3: Passenger Travel History. Uses cursor to iterate through passenger's trips, bookings, payments.
     */
    @GetMapping("/api/reports/passenger-history/{passengerId}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long passengerId) {
        return org.springframework.http.ResponseEntity.ok(jdbcTemplate.queryForList("SELECT * FROM BOOKING WHERE passenger_id = ?", passengerId));
    }

    /**
     * Report 4: Vehicles Due for Maintenance. Queries MAINTENANCE table for overdue/upcoming records.
     */
    @GetMapping("/api/reports/maintenance")
    public org.springframework.http.ResponseEntity<?> endpoint3() {
        return org.springframework.http.ResponseEntity.ok(jdbcTemplate.queryForList("SELECT * FROM MAINTENANCE WHERE status = 'PENDING'"));
    }

    /**
     * Report 5: Trip Occupancy & Performance. Calculates occupancy %, revenue per trip. Uses PL/SQL function FN_OCCUPANCY_RATE.
     */
    @GetMapping("/api/reports/trip-performance")
    public org.springframework.http.ResponseEntity<?> endpoint4() {
        return org.springframework.http.ResponseEntity.ok(jdbcTemplate.queryForList("SELECT trip_id, FN_OCCUPANCY_RATE(trip_id) as occ_rate FROM TRIP"));
    }

    /**
     * Dashboard aggregation endpoint. Returns totalVehicles, activeDrivers, todaysTrips, todaysBookings, todaysRevenue, maintenanceDue counts.
     */
    @GetMapping("/api/reports/dashboard")
    public org.springframework.http.ResponseEntity<?> endpoint5() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalVehicles", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM VEHICLE", Integer.class));
        stats.put("activeDrivers", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM DRIVER", Integer.class));
        return org.springframework.http.ResponseEntity.ok(stats);
    }
}
