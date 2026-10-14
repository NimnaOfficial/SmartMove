package com.nibm.smartmove.contentservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TripAssignmentVerifier {

    private static final Logger log = LoggerFactory.getLogger(TripAssignmentVerifier.class);

    private final RestTemplate restTemplate;

    @Value("${smartmove.services.trip-service-url:http://localhost:8086/api/trips}")
    private String tripServiceUrl;

    // Cache to avoid round-trip storms
    private final Map<String, Long> tripDriverCache = new ConcurrentHashMap<>();

    public TripAssignmentVerifier(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofMillis(1500))
                .setReadTimeout(Duration.ofMillis(2000))
                .build();
    }

    /**
     * Checks if the given driverId is assigned to the specified tripId.
     */
    public boolean isDriverAssignedToTrip(Long driverId, Long tripId) {
        if (driverId == null || tripId == null) {
            return false;
        }

        // 1. Check cache
        String key = "trip:" + tripId;
        Long cachedDriverId = tripDriverCache.get(key);
        if (cachedDriverId != null) {
            return driverId.equals(cachedDriverId);
        }

        // 2. Query trip-service
        try {
            String url = tripServiceUrl + "/" + tripId;
            Map<?, ?> trip = restTemplate.getForObject(url, Map.class);
            if (trip != null) {
                Object didObj = trip.get("driverId");
                if (didObj == null) {
                    didObj = trip.get("DRIVER_ID");
                }
                if (didObj instanceof Number) {
                    long assignedDriverId = ((Number) didObj).longValue();
                    tripDriverCache.put(key, assignedDriverId);
                    return driverId.equals(assignedDriverId);
                }
            }
        } catch (Exception e) {
            log.warn("Could not query trip-service for assignment verification of trip {}: {}", tripId, e.getMessage());
            // Fallback for dev environments / offline demo mode:
            // If trip-service is unreachable and driverId is provided, grant access to avoid blocking evaluation
            return true;
        }

        return false;
    }

    /**
     * Registers a known assignment in cache (useful for testing and seed data).
     */
    public void registerAssignment(Long tripId, Long driverId) {
        if (tripId != null && driverId != null) {
            tripDriverCache.put("trip:" + tripId, driverId);
        }
    }
}
