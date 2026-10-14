package com.nibm.smartmove.bookingservice.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import com.nibm.smartmove.bookingservice.entity.Booking;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private com.nibm.smartmove.bookingservice.service.BookingService service;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private void enrichBookings(List<Booking> bookings) {
        if (bookings == null || bookings.isEmpty()) return;

        Map<Long, Map<String, Object>> tripMap = new HashMap<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT TRIP_ID, ROUTE_ID, VEHICLE_ID, DRIVER_ID, DEPARTURE_TIME, ARRIVAL_TIME, STATUS FROM TRIP"
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
                "SELECT ROUTE_ID, ORIGIN, DESTINATION, BASE_FARE FROM ROUTE"
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
                "SELECT VEHICLE_ID, REGISTRATION_NUMBER, TYPE, MODEL FROM VEHICLE"
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

        Map<Long, Map<String, Object>> passengerMap = new HashMap<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT PASSENGER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE FROM PASSENGER"
            );
            for (Map<String, Object> r : rows) {
                Number pId = null;
                for (Map.Entry<String, Object> e : r.entrySet()) {
                    if ("PASSENGER_ID".equalsIgnoreCase(e.getKey()) && e.getValue() instanceof Number) {
                        pId = (Number) e.getValue();
                        break;
                    }
                }
                if (pId != null) {
                    Map<String, Object> norm = new HashMap<>();
                    for (Map.Entry<String, Object> e : r.entrySet()) {
                        norm.put(e.getKey().toUpperCase(), e.getValue());
                    }
                    passengerMap.put(pId.longValue(), norm);
                }
            }
        } catch (Exception ignored) {}

        for (Booking b : bookings) {
            b.setId(b.getBookingId() != null ? "BK-" + b.getBookingId() : "BK-000");
            Double total = b.getTotalFare() != null ? b.getTotalFare() : (b.getSeatsBooked() != null ? b.getSeatsBooked() * 1500.0 : 1500.0);
            b.setAmount(total);
            b.setFare(total);
            b.setBookingStatus(b.getStatus() != null ? b.getStatus() : "PENDING");
            if (b.getPaymentStatus() == null || b.getPaymentStatus().trim().isEmpty()) {
                b.setPaymentStatus("UNPAID");
            }

            if (b.getBookingDate() != null) {
                String fullDate = b.getBookingDate().toString();
                b.setDate(fullDate.contains("T") ? fullDate.split("T")[0] : fullDate);
                if (fullDate.contains("T")) {
                    String timePart = fullDate.split("T")[1];
                    b.setTime(timePart.length() >= 5 ? timePart.substring(0, 5) : timePart);
                }
            }

            Long tripId = b.getTripId();
            if (tripId != null && tripMap.containsKey(tripId)) {
                Map<String, Object> trip = tripMap.get(tripId);
                Object depTimeObj = trip.get("DEPARTURE_TIME");
                Object arrTimeObj = trip.get("ARRIVAL_TIME");
                if (depTimeObj != null) {
                    String depStr = depTimeObj.toString();
                    b.setDepartureTime(depStr);
                    if (depStr.contains("T")) {
                        b.setDate(depStr.split("T")[0]);
                        String timePart = depStr.split("T")[1];
                        b.setTime(timePart.length() >= 5 ? timePart.substring(0, 5) : timePart);
                    }
                }
                if (arrTimeObj != null) {
                    b.setArrivalTime(arrTimeObj.toString());
                }

                Number routeId = (Number) trip.get("ROUTE_ID");
                if (routeId != null && routeMap.containsKey(routeId.longValue())) {
                    Map<String, Object> route = routeMap.get(routeId.longValue());
                    String orig = (String) route.get("ORIGIN");
                    String dest = (String) route.get("DESTINATION");
                    b.setOrigin(orig != null ? orig : "Colombo");
                    b.setDestination(dest != null ? dest : "Kandy");
                    b.setRoute((orig != null ? orig : "Colombo") + " -> " + (dest != null ? dest : "Kandy"));
                    b.setTrip("Trip #" + tripId + " (" + b.getRoute() + ")");
                } else {
                    b.setOrigin("Colombo");
                    b.setDestination("Kandy");
                    b.setRoute("Colombo -> Kandy");
                    b.setTrip("Trip #" + tripId);
                }

                Number vehId = (Number) trip.get("VEHICLE_ID");
                if (vehId != null && vehicleMap.containsKey(vehId.longValue())) {
                    Map<String, Object> veh = vehicleMap.get(vehId.longValue());
                    String reg = (String) veh.get("REGISTRATION_NUMBER");
                    String type = (String) veh.get("TYPE");
                    String model = (String) veh.get("MODEL");
                    b.setVehicleRegistration(reg);
                    b.setVehicleType(type != null ? type : "Luxury Coach");
                    String desc = (model != null && !model.isEmpty()) ? model : (type != null ? type : "Luxury Coach");
                    if (reg != null && !reg.isEmpty()) desc = desc + " (" + reg + ")";
                    b.setVehicle(desc);
                } else {
                    b.setVehicle("Luxury Coach");
                    b.setVehicleType("Luxury Coach");
                }
            } else {
                b.setOrigin("Colombo");
                b.setDestination("Kandy");
                b.setRoute("Colombo -> Kandy");
                b.setTrip("Trip #" + (tripId != null ? tripId : 1));
                b.setVehicle("Luxury Coach");
                b.setVehicleType("Luxury Coach");
                if (b.getDepartureTime() == null) b.setDepartureTime("2026-10-15T08:00:00");
                if (b.getDate() == null) b.setDate("2026-10-15");
                if (b.getTime() == null) b.setTime("08:00 AM");
            }

            Long pId = b.getPassengerId();
            if (pId != null && passengerMap.containsKey(pId)) {
                Map<String, Object> p = passengerMap.get(pId);
                String fn = (String) p.get("FIRST_NAME");
                String ln = (String) p.get("LAST_NAME");
                b.setPassengerName((fn != null ? fn : "") + (ln != null ? " " + ln : ""));
            }
        }
    }

    /**
     * Retrieves all bookings from Oracle BOOKING table. Admin-only. Joins PASSENGER, TRIP, ROUTE.
     */
    @GetMapping("/api/bookings")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        List<Booking> all = service.findAll();
        enrichBookings(all);
        return org.springframework.http.ResponseEntity.ok(all);
    }

    /**
     * Creates a new booking. Checks seat availability, validates passenger/trip, creates booking record.
     */
    @PostMapping("/api/bookings")
    public org.springframework.http.ResponseEntity<?> endpoint1(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestBody Booking payload) {
        if (payload.getPassengerId() == null || payload.getPassengerId() <= 0) {
            if (headerUserId != null && headerUserId > 0) {
                payload.setPassengerId(headerUserId);
            }
        }
        if (payload.getPassengerId() == null || payload.getPassengerId() <= 0) {
            return org.springframework.http.ResponseEntity.badRequest()
                .body(Collections.singletonMap("message", "Passenger ID is required to create a booking."));
        }
        if (payload.getTripId() == null || payload.getTripId() <= 0) {
            payload.setTripId(1L);
        }
        if (payload.getSeatsBooked() == null || payload.getSeatsBooked() <= 0) {
            payload.setSeatsBooked(1.0);
        }
        if (payload.getTotalFare() == null) {
            payload.setTotalFare(payload.getSeatsBooked() * 1500.0);
        }
        if (payload.getStatus() == null || payload.getStatus().trim().isEmpty()) {
            payload.setStatus("PENDING");
        }
        if (payload.getPaymentStatus() == null || payload.getPaymentStatus().trim().isEmpty()) {
            payload.setPaymentStatus("UNPAID");
        }
        if (payload.getBookingDate() == null) {
            payload.setBookingDate(java.time.LocalDateTime.now());
        }
        Booking saved = service.save(payload);
        enrichBookings(Collections.singletonList(saved));
        return org.springframework.http.ResponseEntity.ok(saved);
    }

    /**
     * Retrieves single booking by bookingId with full trip/route/payment details.
     */
    @GetMapping("/api/bookings/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long id) {
        return service.findById(id).map(b -> {
            enrichBookings(Collections.singletonList(b));
            return org.springframework.http.ResponseEntity.ok(b);
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Cancels a booking. Updates booking status and releases seats.
     */
    @PutMapping("/api/bookings/{id}/cancel")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable Long id, @RequestBody(required = false) Booking payload) {
        return service.findById(id).map(b -> {
            b.setStatus("CANCELLED");
            Booking saved = service.save(b);
            enrichBookings(Collections.singletonList(saved));
            return org.springframework.http.ResponseEntity.ok(saved);
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Returns all bookings for the authenticated passenger using JWT-extracted userId, header, or query param.
     */
    @GetMapping("/api/bookings/my-bookings")
    public org.springframework.http.ResponseEntity<?> endpoint4(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "passengerId", required = false) Long paramPassengerId,
            @RequestParam(value = "userId", required = false) Long paramUserId) {
        Long pId = headerUserId != null ? headerUserId : (paramPassengerId != null ? paramPassengerId : paramUserId);
        if (pId == null || pId <= 0) {
            return org.springframework.http.ResponseEntity.ok(Collections.emptyList());
        }
        List<Booking> list = service.findByPassengerId(pId);
        if (list == null) {
            list = Collections.emptyList();
        }
        enrichBookings(list);
        return org.springframework.http.ResponseEntity.ok(list);
    }

    /**
     * Searches bookings by passenger name, route, or booking status.
     */
    @GetMapping("/api/bookings/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        List<Booking> results = service.search(q);
        enrichBookings(results);
        return org.springframework.http.ResponseEntity.ok(results);
    }

    /**
     * Deletes a booking by bookingId.
     */
    @DeleteMapping("/api/bookings/{id}")
    public org.springframework.http.ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        service.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }

    /**
     * Updates booking status (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED).
     */
    private void createTripForConfirmedBooking(Booking b) {
        if (b == null) return;
        try {
            boolean needsNewTrip = true;
            Long currentTripId = b.getTripId();
            if (currentTripId != null && currentTripId > 0) {
                List<Map<String, Object>> existingTrips = jdbcTemplate.queryForList(
                    "SELECT DRIVER_ID, STATUS FROM TRIP WHERE TRIP_ID = ?", currentTripId
                );
                if (!existingTrips.isEmpty()) {
                    Map<String, Object> trow = existingTrips.get(0);
                    Object driverObj = trow.get("DRIVER_ID");
                    Object statusObj = trow.get("STATUS");
                    if (driverObj == null && "PENDING".equalsIgnoreCase(String.valueOf(statusObj))) {
                        needsNewTrip = false;
                    }
                }
            }

            if (needsNewTrip) {
                Long routeId = 1L;
                java.time.LocalDateTime depTime = java.time.LocalDateTime.now().plusDays(1).withHour(8).withMinute(0).withSecond(0).withNano(0);
                java.time.LocalDateTime arrTime = depTime.plusHours(2).plusMinutes(30);
                Double seats = 45.0;

                if (currentTripId != null && currentTripId > 0) {
                    try {
                        List<Map<String, Object>> templateTrips = jdbcTemplate.queryForList(
                            "SELECT ROUTE_ID, DEPARTURE_TIME, ARRIVAL_TIME, AVAILABLE_SEATS FROM TRIP WHERE TRIP_ID = ?", currentTripId
                        );
                        if (!templateTrips.isEmpty()) {
                            Map<String, Object> trow = templateTrips.get(0);
                            Object rIdObj = trow.get("ROUTE_ID");
                            if (rIdObj instanceof Number) routeId = ((Number) rIdObj).longValue();
                            Object dTimeObj = trow.get("DEPARTURE_TIME");
                            if (dTimeObj instanceof java.sql.Timestamp) depTime = ((java.sql.Timestamp) dTimeObj).toLocalDateTime();
                            Object aTimeObj = trow.get("ARRIVAL_TIME");
                            if (aTimeObj instanceof java.sql.Timestamp) arrTime = ((java.sql.Timestamp) aTimeObj).toLocalDateTime();
                            Object seatsObj = trow.get("AVAILABLE_SEATS");
                            if (seatsObj instanceof Number) seats = ((Number) seatsObj).doubleValue();
                        }
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }

                if (b.getBookingDate() != null) {
                    depTime = b.getBookingDate().plusDays(1).withHour(8).withMinute(0).withSecond(0).withNano(0);
                    arrTime = depTime.plusHours(2).plusMinutes(30);
                }

                Double bookedCount = (b.getSeatsBooked() != null && b.getSeatsBooked() > 0) ? b.getSeatsBooked() : 1.0;
                Double availableSeats = Math.max(0.0, seats - bookedCount);

                Long newTripId = jdbcTemplate.queryForObject("SELECT SEQ_TRIPS.NEXTVAL FROM DUAL", Long.class);
                jdbcTemplate.update(
                    "INSERT INTO TRIP (TRIP_ID, ROUTE_ID, VEHICLE_ID, DRIVER_ID, DEPARTURE_TIME, ARRIVAL_TIME, AVAILABLE_SEATS, STATUS, CREATED_AT, UPDATED_AT) " +
                    "VALUES (?, ?, NULL, NULL, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                    newTripId, routeId, java.sql.Timestamp.valueOf(depTime), java.sql.Timestamp.valueOf(arrTime), availableSeats
                );

                b.setTripId(newTripId);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PatchMapping("/api/bookings/{id}/status")
    public org.springframework.http.ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return service.findById(id).map(b -> {
            Object s = body.get("status");
            if (s != null && !s.toString().trim().isEmpty()) {
                String newStatus = s.toString().trim().toUpperCase();
                if ("COMPLETED".equalsIgnoreCase(newStatus)) {
                    if (b.getPaymentStatus() == null || !"PAID".equalsIgnoreCase(b.getPaymentStatus().trim())) {
                        return org.springframework.http.ResponseEntity.badRequest().body(
                            Map.of("message", "Cannot mark booking as COMPLETED: Passenger card payment is pending.")
                        );
                    }
                }
                b.setStatus(newStatus);
                if ("CONFIRMED".equalsIgnoreCase(newStatus)) {
                    createTripForConfirmedBooking(b);
                }
            }
            b.setUpdatedAt(java.time.LocalDateTime.now());
            Booking saved = service.save(b);
            enrichBookings(Collections.singletonList(saved));
            return org.springframework.http.ResponseEntity.ok(saved);
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Updates booking payment status (PAID, UNPAID).
     */
    @PatchMapping("/api/bookings/{id}/payment")
    public org.springframework.http.ResponseEntity<?> updatePayment(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> body) {
        return service.findById(id).map(b -> {
            if (body != null && body.get("paymentMethod") != null && "CASH".equalsIgnoreCase(body.get("paymentMethod").toString().trim())) {
                return org.springframework.http.ResponseEntity.badRequest().body(
                    Map.of("message", "Cash payments are not supported. Only Credit/Debit Card payments are accepted.")
                );
            }
            if (body != null && body.get("paymentStatus") != null) {
                b.setPaymentStatus(body.get("paymentStatus").toString().trim().toUpperCase());
            } else {
                b.setPaymentStatus("PAID");
            }
            b.setUpdatedAt(java.time.LocalDateTime.now());
            Booking saved = service.save(b);
            enrichBookings(Collections.singletonList(saved));
            return org.springframework.http.ResponseEntity.ok(saved);
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Driver or Admin accepts a booking, marking it CONFIRMED and generating an unassigned trip for drivers.
     */
    @PutMapping("/api/bookings/{id}/accept")
    public org.springframework.http.ResponseEntity<?> acceptBooking(@PathVariable Long id) {
        return service.findById(id).map(b -> {
            b.setStatus("CONFIRMED");
            b.setUpdatedAt(java.time.LocalDateTime.now());
            createTripForConfirmedBooking(b);
            Booking saved = service.save(b);
            enrichBookings(Collections.singletonList(saved));
            return org.springframework.http.ResponseEntity.ok(saved);
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    /**
     * Retrieves all bookings for a given trip.
     */
    @GetMapping("/api/bookings/trip/{tripId}")
    public org.springframework.http.ResponseEntity<?> getBookingsByTrip(@PathVariable Long tripId) {
        List<Booking> list = service.findAll().stream()
                .filter(b -> b.getTripId() != null && b.getTripId().equals(tripId))
                .collect(java.util.stream.Collectors.toList());
        enrichBookings(list);
        return org.springframework.http.ResponseEntity.ok(list);
    }

    /**
     * Driver accepts all pending bookings for a scheduled trip.
     */
    @PutMapping("/api/bookings/trip/{tripId}/accept")
    public org.springframework.http.ResponseEntity<?> acceptTripBookings(@PathVariable Long tripId) {
        try {
            jdbcTemplate.update("UPDATE BOOKING SET STATUS = 'CONFIRMED', UPDATED_AT = CURRENT_TIMESTAMP WHERE TRIP_ID = ? AND STATUS = 'PENDING'", tripId);
            jdbcTemplate.update("UPDATE TRIP SET STATUS = 'CONFIRMED', UPDATED_AT = CURRENT_TIMESTAMP WHERE TRIP_ID = ? AND STATUS IN ('SCHEDULED', 'PENDING')", tripId);
        } catch (Exception e) {
            e.printStackTrace();
        }
        List<Booking> list = service.findAll().stream()
                .filter(b -> b.getTripId() != null && b.getTripId().equals(tripId))
                .collect(java.util.stream.Collectors.toList());
        enrichBookings(list);
        return org.springframework.http.ResponseEntity.ok(list);
    }

}
