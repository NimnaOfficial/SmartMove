package com.nibm.smartmove.reportservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "*")
public class ReportController {
    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    /**
     * Report 1: Most Frequently Used Routes (Member 2).
     */
    @GetMapping("/api/reports/routes")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        String sql = "SELECT r.route_id, r.origin, r.destination, COUNT(b.booking_id) as total_bookings, " +
                     "       RANK() OVER (ORDER BY COUNT(b.booking_id) DESC) as ranking " +
                     "FROM ROUTE r " +
                     "LEFT JOIN TRIP t ON r.route_id = t.route_id " +
                     "LEFT JOIN BOOKING b ON t.trip_id = b.trip_id AND b.status != 'CANCELLED' " +
                     "GROUP BY r.route_id, r.origin, r.destination " +
                     "ORDER BY ranking";
        return org.springframework.http.ResponseEntity.ok(jdbcTemplate.queryForList(sql));
    }

    /**
     * Report 2: Revenue Within Given Period (Member 2).
     */
    @GetMapping("/api/reports/revenue")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestParam(required = false) String startDate, 
                                                                @RequestParam(required = false) String endDate) {
        String sql = "SELECT COALESCE(SUM(amount), 0) as total, COUNT(payment_id) as tickets_sold, ROUND(COALESCE(AVG(amount), 0), 2) as avg_ticket " +
                     "FROM PAYMENT WHERE status = 'SUCCESS'";
        if (startDate != null && !startDate.isBlank() && endDate != null && !endDate.isBlank()) {
            sql += " AND TRUNC(payment_date) BETWEEN TO_DATE('" + startDate + "', 'YYYY-MM-DD') AND TO_DATE('" + endDate + "', 'YYYY-MM-DD')";
        }
        return org.springframework.http.ResponseEntity.ok(jdbcTemplate.queryForMap(sql));
    }

    /**
     * Report 3: Passenger Travel History (Member 2).
     */
    @GetMapping("/api/reports/passenger-history/{passengerId}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long passengerId) {
        String sql = "SELECT p.first_name || ' ' || p.last_name AS passenger_name, " +
                     "       r.origin || ' to ' || r.destination AS route_details, " +
                     "       t.departure_time, " +
                     "       v.registration_number, " +
                     "       b.status as booking_status, " +
                     "       pay.status as payment_status " +
                     "FROM PASSENGER p " +
                     "JOIN BOOKING b ON p.passenger_id = b.passenger_id " +
                     "JOIN TRIP t ON b.trip_id = t.trip_id " +
                     "JOIN ROUTE r ON t.route_id = r.route_id " +
                     "JOIN VEHICLE v ON t.vehicle_id = v.vehicle_id " +
                     "LEFT JOIN PAYMENT pay ON b.booking_id = pay.booking_id " +
                     "WHERE p.passenger_id = ? " +
                     "ORDER BY t.departure_time DESC";
        return org.springframework.http.ResponseEntity.ok(jdbcTemplate.queryForList(sql, passengerId));
    }

    /**
     * Report 4: Vehicles Due for Maintenance (Member 3).
     */
    @GetMapping("/api/reports/maintenance")
    public org.springframework.http.ResponseEntity<?> endpoint3() {
        String sql = "SELECT v.vehicle_id, v.registration_number, " +
                     "       MAX(m.maintenance_date) AS last_maintenance_date, " +
                     "       ADD_MONTHS(MAX(m.maintenance_date), 6) AS due_date, " +
                     "       v.status " +
                     "FROM VEHICLE v " +
                     "LEFT JOIN MAINTENANCE m ON v.vehicle_id = m.vehicle_id " +
                     "GROUP BY v.vehicle_id, v.registration_number, v.status " +
                     "HAVING ADD_MONTHS(MAX(m.maintenance_date), 6) < SYSDATE OR MAX(m.maintenance_date) IS NULL " +
                     "ORDER BY due_date ASC";
        return org.springframework.http.ResponseEntity.ok(jdbcTemplate.queryForList(sql));
    }

    /**
     * Report 5: Trip Occupancy & Performance (Member 3).
     */
    @GetMapping("/api/reports/trip-performance")
    public org.springframework.http.ResponseEntity<?> endpoint4() {
        String sql = "SELECT t.trip_id, r.origin || ' - ' || r.destination AS route_name, " +
                     "       v.capacity, " +
                     "       (v.capacity - t.available_seats) AS booked_seats, " +
                     "       ROUND(((v.capacity - t.available_seats) / v.capacity) * 100, 2) AS occ_rate, " +
                     "       NVL(SUM(pay.amount), 0) AS generated_revenue " +
                     "FROM TRIP t " +
                     "JOIN ROUTE r ON t.route_id = r.route_id " +
                     "JOIN VEHICLE v ON t.vehicle_id = v.vehicle_id " +
                     "LEFT JOIN BOOKING b ON t.trip_id = b.trip_id AND b.status != 'CANCELLED' " +
                     "LEFT JOIN PAYMENT pay ON b.booking_id = pay.booking_id AND pay.status = 'SUCCESS' " +
                     "GROUP BY t.trip_id, r.origin, r.destination, v.capacity, t.available_seats " +
                     "ORDER BY occ_rate DESC";
        return org.springframework.http.ResponseEntity.ok(jdbcTemplate.queryForList(sql));
    }

    /**
     * Dashboard aggregation endpoint. Returns totalVehicles, activeDrivers, todaysTrips, todaysBookings, todaysRevenue, maintenanceDue counts.
     */
    @GetMapping("/api/reports/dashboard")
    public org.springframework.http.ResponseEntity<?> endpoint5() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalVehicles", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM VEHICLE", Integer.class));
        stats.put("activeDrivers", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM DRIVER", Integer.class));
        stats.put("todaysTrips", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM TRIP WHERE TRUNC(CREATED_AT) = TRUNC(SYSDATE)", Integer.class));
        stats.put("todaysBookings", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM BOOKING WHERE TRUNC(BOOKING_DATE) = TRUNC(SYSDATE)", Integer.class));
        stats.put("todaysRevenue", jdbcTemplate.queryForObject("SELECT COALESCE(SUM(TOTAL_FARE), 0) FROM BOOKING WHERE TRUNC(BOOKING_DATE) = TRUNC(SYSDATE) AND STATUS = 'CONFIRMED'", Integer.class));
        stats.put("maintenanceDue", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM MAINTENANCE WHERE STATUS = 'SCHEDULED' OR STATUS = 'PENDING'", Integer.class));
        return org.springframework.http.ResponseEntity.ok(stats);
    }
}
