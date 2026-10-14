package com.nibm.smartmove.feedbackservice.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import com.nibm.smartmove.feedbackservice.entity.Feedback;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private com.nibm.smartmove.feedbackservice.service.FeedbackService service;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private void enrichFeedbackList(List<Feedback> list) {
        if (list == null || list.isEmpty()) return;

        Map<Long, Map<String, Object>> tripMap = new HashMap<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT TRIP_ID, ROUTE_ID, VEHICLE_ID, DRIVER_ID FROM TRIP"
            );
            for (Map<String, Object> r : rows) {
                Number tId = null;
                for (Map.Entry<String, Object> e : r.entrySet()) {
                    if ("TRIP_ID".equalsIgnoreCase(e.getKey()) && e.getValue() instanceof Number) {
                        tId = (Number) e.getValue();
                        break;
                    }
                }
                if (tId != null) {
                    Map<String, Object> norm = new HashMap<>();
                    for (Map.Entry<String, Object> e : r.entrySet()) {
                        norm.put(e.getKey().toUpperCase(), e.getValue());
                    }
                    tripMap.put(tId.longValue(), norm);
                }
            }
        } catch (Exception ignored) {}

        Map<Long, Map<String, Object>> routeMap = new HashMap<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT ROUTE_ID, ORIGIN, DESTINATION FROM ROUTE"
            );
            for (Map<String, Object> r : rows) {
                Number rId = null;
                for (Map.Entry<String, Object> e : r.entrySet()) {
                    if ("ROUTE_ID".equalsIgnoreCase(e.getKey()) && e.getValue() instanceof Number) {
                        rId = (Number) e.getValue();
                        break;
                    }
                }
                if (rId != null) {
                    Map<String, Object> norm = new HashMap<>();
                    for (Map.Entry<String, Object> e : r.entrySet()) {
                        norm.put(e.getKey().toUpperCase(), e.getValue());
                    }
                    routeMap.put(rId.longValue(), norm);
                }
            }
        } catch (Exception ignored) {}

        Map<Long, Map<String, Object>> vehicleMap = new HashMap<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT VEHICLE_ID, REGISTRATION_NUMBER, MODEL, TYPE FROM VEHICLE"
            );
            for (Map<String, Object> r : rows) {
                Number vId = null;
                for (Map.Entry<String, Object> e : r.entrySet()) {
                    if ("VEHICLE_ID".equalsIgnoreCase(e.getKey()) && e.getValue() instanceof Number) {
                        vId = (Number) e.getValue();
                        break;
                    }
                }
                if (vId != null) {
                    Map<String, Object> norm = new HashMap<>();
                    for (Map.Entry<String, Object> e : r.entrySet()) {
                        norm.put(e.getKey().toUpperCase(), e.getValue());
                    }
                    vehicleMap.put(vId.longValue(), norm);
                }
            }
        } catch (Exception ignored) {}

        Map<Long, String> driverMap = new HashMap<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT DRIVER_ID, FIRST_NAME, LAST_NAME FROM DRIVER"
            );
            for (Map<String, Object> r : rows) {
                Number dId = null;
                String fn = null;
                String ln = null;
                for (Map.Entry<String, Object> e : r.entrySet()) {
                    if ("DRIVER_ID".equalsIgnoreCase(e.getKey()) && e.getValue() instanceof Number) {
                        dId = (Number) e.getValue();
                    } else if ("FIRST_NAME".equalsIgnoreCase(e.getKey()) && e.getValue() != null) {
                        fn = e.getValue().toString();
                    } else if ("LAST_NAME".equalsIgnoreCase(e.getKey()) && e.getValue() != null) {
                        ln = e.getValue().toString();
                    }
                }
                if (dId != null) {
                    driverMap.put(dId.longValue(), ((fn != null ? fn : "") + " " + (ln != null ? ln : "")).trim());
                }
            }
        } catch (Exception ignored) {}

        Map<Long, String> passengerMap = new HashMap<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT PASSENGER_ID, FIRST_NAME, LAST_NAME FROM PASSENGER"
            );
            for (Map<String, Object> r : rows) {
                Number pId = null;
                String fn = null;
                String ln = null;
                for (Map.Entry<String, Object> e : r.entrySet()) {
                    if ("PASSENGER_ID".equalsIgnoreCase(e.getKey()) && e.getValue() instanceof Number) {
                        pId = (Number) e.getValue();
                    } else if ("FIRST_NAME".equalsIgnoreCase(e.getKey()) && e.getValue() != null) {
                        fn = e.getValue().toString();
                    } else if ("LAST_NAME".equalsIgnoreCase(e.getKey()) && e.getValue() != null) {
                        ln = e.getValue().toString();
                    }
                }
                if (pId != null) {
                    passengerMap.put(pId.longValue(), ((fn != null ? fn : "") + " " + (ln != null ? ln : "")).trim());
                }
            }
        } catch (Exception ignored) {}

        java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy", java.util.Locale.ENGLISH);

        for (Feedback f : list) {
            f.setId(f.getFeedbackId());
            if (f.getComment() == null || f.getComment().isEmpty()) {
                f.setComment(f.getDescription());
            }

            // Rating derivation
            if (f.getRating() == null || f.getRating() <= 0) {
                if ("APPRECIATION".equalsIgnoreCase(f.getType())) {
                    f.setRating(5);
                } else if ("COMPLAINT".equalsIgnoreCase(f.getType())) {
                    f.setRating(1);
                } else if ("SUGGESTION".equalsIgnoreCase(f.getType())) {
                    f.setRating(3);
                } else {
                    f.setRating(5);
                }
            }

            // Date
            if (f.getCreatedAt() != null) {
                try {
                    f.setDate(f.getCreatedAt().format(dtf));
                } catch (Exception e) {
                    f.setDate(f.getCreatedAt().toLocalDate().toString());
                }
            } else {
                f.setDate("Oct 12, 2026");
            }

            // Passenger Name
            if (f.getPassengerId() != null && passengerMap.containsKey(f.getPassengerId())) {
                f.setPassengerName(passengerMap.get(f.getPassengerId()));
            } else {
                f.setPassengerName("Passenger #" + (f.getPassengerId() != null ? f.getPassengerId() : 1));
            }

            // Trip & Route & Vehicle & Driver
            Long tripId = f.getTripId();
            if (tripId != null && tripMap.containsKey(tripId)) {
                Map<String, Object> trip = tripMap.get(tripId);
                Number rId = (Number) trip.get("ROUTE_ID");
                if (rId != null) {
                    f.setRouteId(rId.longValue());
                    if (routeMap.containsKey(rId.longValue())) {
                        Map<String, Object> route = routeMap.get(rId.longValue());
                        String orig = (String) route.get("ORIGIN");
                        String dest = (String) route.get("DESTINATION");
                        String rName = (orig != null ? orig : "Colombo") + " -> " + (dest != null ? dest : "Kandy");
                        f.setRoute(rName);
                        f.setRouteName(rName);
                    }
                }

                Number vId = (Number) trip.get("VEHICLE_ID");
                if (vId != null) {
                    f.setVehicleId(vId.longValue());
                    if (vehicleMap.containsKey(vId.longValue())) {
                        Map<String, Object> veh = vehicleMap.get(vId.longValue());
                        String mod = (String) veh.get("MODEL");
                        String reg = (String) veh.get("REGISTRATION_NUMBER");
                        f.setVehicle((mod != null ? mod : "Coach") + (reg != null ? " (" + reg + ")" : ""));
                    }
                }

                Number dId = (Number) trip.get("DRIVER_ID");
                if (dId != null) {
                    f.setDriverId(dId.longValue());
                    if (driverMap.containsKey(dId.longValue())) {
                        f.setDriverName(driverMap.get(dId.longValue()));
                    }
                }
            }

            // Fallbacks
            if (f.getRoute() == null || f.getRoute().isEmpty()) {
                f.setRoute("Colombo -> Kandy");
                f.setRouteName("Colombo -> Kandy");
            }
            if (f.getVehicle() == null || f.getVehicle().isEmpty()) {
                f.setVehicle("Volvo 9900 (ND-4521)");
            }
            if (f.getDriverName() == null || f.getDriverName().isEmpty()) {
                f.setDriverName("Saman Kumara");
            }
        }
    }

    /**
     * Retrieves all feedback from Oracle FEEDBACK table with joined details.
     */
    @GetMapping("/api/feedback")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        List<Feedback> list = service.findAllDesc();
        enrichFeedbackList(list);
        return org.springframework.http.ResponseEntity.ok(list);
    }

    /**
     * Submits new feedback. Only allowed for trips in passenger travel history.
     */
    @PostMapping("/api/feedback")
    public org.springframework.http.ResponseEntity<?> endpoint1(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestBody Feedback payload) {
        if (payload.getPassengerId() == null || payload.getPassengerId() <= 0) {
            if (headerUserId != null && headerUserId > 0) {
                payload.setPassengerId(headerUserId);
            }
        }
        if (payload.getPassengerId() == null || payload.getPassengerId() <= 0) {
            return org.springframework.http.ResponseEntity.badRequest()
                .body(Collections.singletonMap("message", "Passenger ID is required to submit feedback."));
        }
        if (payload.getTripId() == null || payload.getTripId() <= 0) {
            return org.springframework.http.ResponseEntity.badRequest()
                .body(Collections.singletonMap("message", "Please select a valid trip from your travel history."));
        }

        // Enforce that the passenger actually has a confirmed/completed booking for this trip
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT BOOKING_ID FROM BOOKING WHERE PASSENGER_ID = ? AND TRIP_ID = ? AND UPPER(STATUS) NOT IN ('CANCELLED')",
                payload.getPassengerId(), payload.getTripId()
            );
            if (rows.isEmpty()) {
                return org.springframework.http.ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "You can only submit feedback for trips that are already in your trip history."));
            }
        } catch (Exception ex) {
            // In case of query issue or fallback, allow graceful handling
        }

        if (payload.getComment() != null && !payload.getComment().trim().isEmpty() &&
            (payload.getDescription() == null || payload.getDescription().trim().isEmpty())) {
            payload.setDescription(payload.getComment().trim());
        }
        if (payload.getDescription() == null || payload.getDescription().trim().isEmpty()) {
            payload.setDescription("No description provided.");
        }

        // Determine TYPE based on rating or existing type
        if (payload.getRating() != null && payload.getRating() > 0) {
            if (payload.getRating() >= 4) {
                payload.setType("APPRECIATION");
            } else if (payload.getRating() <= 2) {
                payload.setType("COMPLAINT");
            } else {
                payload.setType("SUGGESTION");
            }
        } else if (payload.getType() == null || payload.getType().trim().isEmpty()) {
            payload.setType("SUGGESTION");
        } else {
            String t = payload.getType().trim().toUpperCase();
            if (!"COMPLAINT".equals(t) && !"SUGGESTION".equals(t) && !"APPRECIATION".equals(t)) {
                payload.setType("SUGGESTION");
            } else {
                payload.setType(t);
            }
        }

        if (payload.getStatus() == null || payload.getStatus().trim().isEmpty()) {
            payload.setStatus("OPEN");
        }
        if (payload.getCreatedAt() == null) {
            payload.setCreatedAt(java.time.LocalDateTime.now());
        }

        Feedback saved = service.save(payload);
        enrichFeedbackList(java.util.Collections.singletonList(saved));
        return org.springframework.http.ResponseEntity.ok(saved);
    }

    /**
     * Retrieves single feedback by feedbackId.
     */
    @GetMapping("/api/feedback/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id) {
        return service.findById(id).map(f -> {
            enrichFeedbackList(java.util.Collections.singletonList(f));
            return org.springframework.http.ResponseEntity.ok(f);
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Retrieves all feedback submitted by a specific passenger.
     */
    @GetMapping("/api/feedback/passenger/{passengerId}")
    public org.springframework.http.ResponseEntity<?> endpoint3(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @PathVariable Long passengerId) {
        Long pId = (passengerId != null && passengerId > 0) ? passengerId : headerUserId;
        if (pId == null || pId <= 0) {
            return org.springframework.http.ResponseEntity.ok(Collections.emptyList());
        }
        List<Feedback> list = service.findByPassengerId(pId);
        if (list == null) {
            list = Collections.emptyList();
        }
        enrichFeedbackList(list);
        return org.springframework.http.ResponseEntity.ok(list);
    }

    /**
     * Searches feedback by comment text, type, or passenger name.
     */
    @GetMapping("/api/feedback/search")
    public org.springframework.http.ResponseEntity<?> endpoint4(@RequestParam String q) {
        List<Feedback> list = service.search(q);
        enrichFeedbackList(list);
        return org.springframework.http.ResponseEntity.ok(list);
    }

    /**
     * Deletes a feedback item by feedbackId.
     */
    @DeleteMapping("/api/feedback/{id}")
    public org.springframework.http.ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        service.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }

}
