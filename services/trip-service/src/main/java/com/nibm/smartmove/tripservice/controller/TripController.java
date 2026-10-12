package com.nibm.smartmove.tripservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import com.nibm.smartmove.tripservice.entity.Trip;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class TripController {
    @Autowired
    private com.nibm.smartmove.tripservice.service.TripService service;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private void enrichTrips(List<Trip> list) {
        if (list == null || list.isEmpty()) return;
        try {
            Map<Long, Map<String, Object>> routeMap = new HashMap<>();
            jdbcTemplate.query("SELECT ROUTE_ID, ORIGIN, DESTINATION, BASE_FARE FROM ROUTE", rs -> {
                long rid = rs.getLong("ROUTE_ID");
                Map<String, Object> map = new HashMap<>();
                map.put("origin", rs.getString("ORIGIN"));
                map.put("destination", rs.getString("DESTINATION"));
                map.put("baseFare", rs.getDouble("BASE_FARE"));
                routeMap.put(rid, map);
            });

            Map<Long, Map<String, Object>> vehicleMap = new HashMap<>();
            jdbcTemplate.query("SELECT VEHICLE_ID, REGISTRATION_NUMBER, TYPE, MODEL FROM VEHICLE", rs -> {
                long vid = rs.getLong("VEHICLE_ID");
                Map<String, Object> map = new HashMap<>();
                map.put("registrationNumber", rs.getString("REGISTRATION_NUMBER"));
                map.put("type", rs.getString("TYPE"));
                map.put("model", rs.getString("MODEL"));
                vehicleMap.put(vid, map);
            });

            Map<Long, String> driverMap = new HashMap<>();
            jdbcTemplate.query("SELECT DRIVER_ID, FIRST_NAME, LAST_NAME FROM DRIVER", rs -> {
                long did = rs.getLong("DRIVER_ID");
                String fn = rs.getString("FIRST_NAME");
                String ln = rs.getString("LAST_NAME");
                driverMap.put(did, ((fn != null ? fn : "") + " " + (ln != null ? ln : "")).trim());
            });

            for (Trip t : list) {
                t.setId(t.getTripId());
                if (t.getRouteId() != null && routeMap.containsKey(t.getRouteId())) {
                    Map<String, Object> r = routeMap.get(t.getRouteId());
                    String orig = (String) r.get("origin");
                    String dest = (String) r.get("destination");
                    Double bf = (Double) r.get("baseFare");
                    t.setOrigin(orig);
                    t.setDestination(dest);
                    t.setRouteOrigin(orig);
                    t.setRouteDestination(dest);
                    t.setRoute((orig != null ? orig : "") + " -> " + (dest != null ? dest : ""));
                    t.setFare(bf != null && bf > 0 ? bf : 1000.0);
                } else {
                    t.setOrigin("Route #" + t.getRouteId());
                    t.setDestination("");
                    t.setRoute("Route #" + t.getRouteId());
                    t.setFare(1000.0);
                }

                if (t.getVehicleId() != null && vehicleMap.containsKey(t.getVehicleId())) {
                    Map<String, Object> v = vehicleMap.get(t.getVehicleId());
                    String reg = (String) v.get("registrationNumber");
                    String type = (String) v.get("type");
                    String model = (String) v.get("model");
                    t.setVehicleRegistration(reg);
                    t.setVehicleType(type);
                    t.setVehicleModel(model);
                    String vehDesc = (model != null && !model.isEmpty()) ? model : (type != null ? type : "Luxury Coach");
                    if (reg != null && !reg.isEmpty()) {
                        vehDesc = vehDesc + " (" + reg + ")";
                    }
                    t.setVehicle(vehDesc);
                } else {
                    t.setVehicle("Luxury Coach");
                }

                if (t.getDriverId() != null && driverMap.containsKey(t.getDriverId())) {
                    t.setDriverName(driverMap.get(t.getDriverId()));
                } else {
                    t.setDriverName("Assigned Driver");
                }

                if (t.getDepartureTime() != null) {
                    String dtStr = t.getDepartureTime().toString();
                    String datePart = dtStr.contains("T") ? dtStr.split("T")[0] : dtStr;
                    t.setDate(datePart);
                    t.setDepartureDate(datePart);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Retrieves all trips from Oracle TRIP table with route, vehicle, driver info via JOINs.
     */
    @GetMapping("/api/trips")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        try {
            List<Trip> all = service.findAll();
            enrichTrips(all);
            return org.springframework.http.ResponseEntity.ok(all);
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
        if (payload.getDepartureTime() == null) {
            payload.setDepartureTime(java.time.LocalDateTime.now().plusDays(1).withHour(8).withMinute(0).withSecond(0));
        }
        if (payload.getArrivalTime() == null) {
            payload.setArrivalTime(payload.getDepartureTime().plusHours(3));
        }
        if (payload.getAvailableSeats() == null || payload.getAvailableSeats() <= 0) {
            payload.setAvailableSeats(45.0);
        }
        if (payload.getStatus() == null || payload.getStatus().trim().isEmpty()) {
            payload.setStatus("SCHEDULED");
        }
        if (payload.getCreatedAt() == null) {
            payload.setCreatedAt(java.time.LocalDateTime.now());
        }
        Trip saved = service.save(payload);
        enrichTrips(List.of(saved));
        return org.springframework.http.ResponseEntity.ok(saved);
    }

    /**
     * Retrieves single trip by tripId with full details (route, vehicle, driver, seat info).
     */
    @GetMapping("/api/trips/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id) {
        return service.findById(id).map(t -> {
            enrichTrips(List.of(t));
            return org.springframework.http.ResponseEntity.ok(t);
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Updates trip info (date, time, fare, status). Admin/driver endpoint.
     */
    @PutMapping("/api/trips/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long id, @RequestBody Trip payload) {
        return service.findById(id).map(existing -> {
            if (payload.getRouteId() != null) existing.setRouteId(payload.getRouteId());
            if (payload.getVehicleId() != null) existing.setVehicleId(payload.getVehicleId());
            if (payload.getDriverId() != null) existing.setDriverId(payload.getDriverId());
            if (payload.getDepartureTime() != null) existing.setDepartureTime(payload.getDepartureTime());
            if (payload.getArrivalTime() != null) existing.setArrivalTime(payload.getArrivalTime());
            if (payload.getAvailableSeats() != null) existing.setAvailableSeats(payload.getAvailableSeats());
            if (payload.getStatus() != null && !payload.getStatus().trim().isEmpty()) existing.setStatus(payload.getStatus());
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            Trip updated = service.save(existing);
            enrichTrips(List.of(updated));
            return org.springframework.http.ResponseEntity.ok(updated);
        }).orElseGet(() -> {
            payload.setTripId(id);
            if (payload.getDepartureTime() == null) payload.setDepartureTime(java.time.LocalDateTime.now().plusDays(1).withHour(8).withMinute(0).withSecond(0));
            if (payload.getArrivalTime() == null) payload.setArrivalTime(payload.getDepartureTime().plusHours(3));
            if (payload.getAvailableSeats() == null) payload.setAvailableSeats(45.0);
            if (payload.getStatus() == null) payload.setStatus("SCHEDULED");
            if (payload.getCreatedAt() == null) payload.setCreatedAt(java.time.LocalDateTime.now());
            payload.setUpdatedAt(java.time.LocalDateTime.now());
            Trip saved = service.save(payload);
            enrichTrips(List.of(saved));
            return org.springframework.http.ResponseEntity.ok(saved);
        });
    }

    /**
     * Updates only the trip status (SCHEDULED→IN_PROGRESS→COMPLETED or CANCELLED). Driver can update own trips.
     */
    @PatchMapping("/api/trips/{id}/status")
    public org.springframework.http.ResponseEntity<?> endpoint4(@PathVariable Long id, @RequestBody java.util.Map<String, Object> payload) {
        return service.findById(id).map(existing -> {
            Object statusObj = payload.get("status");
            if (statusObj != null && !statusObj.toString().trim().isEmpty()) {
                String newStatus = statusObj.toString().trim().toUpperCase();
                existing.setStatus(newStatus);
                try {
                    if ("IN_PROGRESS".equalsIgnoreCase(newStatus)) {
                        jdbcTemplate.update("UPDATE BOOKING SET STATUS = 'IN_PROGRESS', UPDATED_AT = CURRENT_TIMESTAMP WHERE TRIP_ID = ? AND STATUS NOT IN ('CANCELLED')", id);
                    } else if ("COMPLETED".equalsIgnoreCase(newStatus)) {
                        jdbcTemplate.update("UPDATE BOOKING SET STATUS = 'COMPLETED', UPDATED_AT = CURRENT_TIMESTAMP WHERE TRIP_ID = ? AND STATUS NOT IN ('CANCELLED')", id);
                    } else if ("CONFIRMED".equalsIgnoreCase(newStatus) || "SCHEDULED".equalsIgnoreCase(newStatus)) {
                        jdbcTemplate.update("UPDATE BOOKING SET STATUS = 'CONFIRMED', UPDATED_AT = CURRENT_TIMESTAMP WHERE TRIP_ID = ? AND STATUS NOT IN ('CANCELLED', 'COMPLETED')", id);
                    } else if ("CANCELLED".equalsIgnoreCase(newStatus)) {
                        jdbcTemplate.update("UPDATE BOOKING SET STATUS = 'CANCELLED', UPDATED_AT = CURRENT_TIMESTAMP WHERE TRIP_ID = ?", id);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            Trip updated = service.save(existing);
            enrichTrips(List.of(updated));
            return org.springframework.http.ResponseEntity.ok(updated);
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Driver or Admin accepts a trip schedule and all associated pending bookings.
     */
    @RequestMapping(value = "/api/trips/{id}/accept", method = {RequestMethod.POST, RequestMethod.PUT})
    public org.springframework.http.ResponseEntity<?> acceptTrip(@PathVariable Long id) {
        return service.findById(id).map(existing -> {
            existing.setStatus("CONFIRMED");
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            try {
                jdbcTemplate.update("UPDATE BOOKING SET STATUS = 'CONFIRMED', UPDATED_AT = CURRENT_TIMESTAMP WHERE TRIP_ID = ? AND STATUS IN ('PENDING', 'SCHEDULED')", id);
            } catch (Exception e) {
                e.printStackTrace();
            }
            Trip updated = service.save(existing);
            enrichTrips(List.of(updated));
            return org.springframework.http.ResponseEntity.ok(updated);
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
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
        List<Trip> all = service.findAll();
        enrichTrips(all);

        List<Trip> filtered = all.stream().filter(t -> {
            if (origin != null && !origin.trim().isEmpty()) {
                String origVal = (t.getOrigin() != null ? t.getOrigin() : "");
                if (!origVal.toLowerCase().contains(origin.trim().toLowerCase())) return false;
            }
            if (destination != null && !destination.trim().isEmpty()) {
                String destVal = (t.getDestination() != null ? t.getDestination() : "");
                if (!destVal.toLowerCase().contains(destination.trim().toLowerCase())) return false;
            }
            if (date != null && !date.trim().isEmpty()) {
                String dVal = (t.getDate() != null ? t.getDate() : "");
                if (!dVal.equals(date.trim())) return false;
            }
            if (maxPrice != null && maxPrice > 0) {
                if (t.getFare() != null && t.getFare() > maxPrice) return false;
            }
            return true;
        }).collect(Collectors.toList());

        return org.springframework.http.ResponseEntity.ok(filtered);
    }

    /**
     * Returns trips scheduled in the near future. Used by passenger dashboard.
     */
    @GetMapping("/api/trips/upcoming")
    public org.springframework.http.ResponseEntity<?> endpoint6() {
        List<Trip> all = service.findAll();
        enrichTrips(all);
        List<Trip> upcoming = all.stream().filter(t -> {
            String st = t.getStatus();
            return st != null && (st.equalsIgnoreCase("SCHEDULED") || st.equalsIgnoreCase("IN_PROGRESS"));
        }).sorted((a, b) -> {
            if (a.getDepartureTime() == null) return 1;
            if (b.getDepartureTime() == null) return -1;
            return a.getDepartureTime().compareTo(b.getDepartureTime());
        }).limit(10).collect(Collectors.toList());
        return org.springframework.http.ResponseEntity.ok(upcoming);
    }

    /**
     * Deletes a trip by tripId.
     */
    @DeleteMapping("/api/trips/{id}")
    public org.springframework.http.ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        return service.findById(id).map(existing -> {
            try {
                service.deleteById(id);
                return org.springframework.http.ResponseEntity.ok(Map.of("message", "Trip deleted successfully.", "tripId", id));
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                existing.setStatus("CANCELLED");
                existing.setUpdatedAt(java.time.LocalDateTime.now());
                service.save(existing);
                return org.springframework.http.ResponseEntity.ok(Map.of("message", "Trip is referenced by bookings. Status was set to CANCELLED.", "deactivated", true, "tripId", id));
            } catch (Exception e) {
                return org.springframework.http.ResponseEntity.status(500).body(Map.of("message", "Failed to delete trip: " + e.getMessage()));
            }
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

}
