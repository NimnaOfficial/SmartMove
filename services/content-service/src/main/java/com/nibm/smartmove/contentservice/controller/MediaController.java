package com.nibm.smartmove.contentservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "*")
public class MediaController {
    @Autowired
    private org.springframework.data.mongodb.core.MongoTemplate mongoTemplate;

    /**
     * Retrieves all trip media from MongoDB trip_media collection.
     */
    @GetMapping("/api/media")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        return org.springframework.http.ResponseEntity.ok(mongoTemplate.findAll(java.util.Map.class, "trip_media"));
    }

    /**
     * Retrieves media for a specific trip. Used in trip detail pages for multimedia content.
     */
    @GetMapping("/api/media/trip/{tripId}")
    public org.springframework.http.ResponseEntity<?> endpoint1(@PathVariable Long tripId) {
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query(org.springframework.data.mongodb.core.query.Criteria.where("tripId").is(tripId));
        return org.springframework.http.ResponseEntity.ok(mongoTemplate.find(query, java.util.Map.class, "trip_media"));
    }

    /**
     * Uploads trip media (image/video metadata). Stores in MongoDB trip_media collection.
     */
    @PostMapping("/api/media")
    public org.springframework.http.ResponseEntity<?> endpoint2(@RequestBody java.util.Map<String, Object> payload) {
        mongoTemplate.save(payload, "trip_media");
        return org.springframework.http.ResponseEntity.ok(payload);
    }

    /**
     * Deletes trip media from MongoDB by ObjectId.
     */
    @DeleteMapping("/api/media/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable String id) {
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query(org.springframework.data.mongodb.core.query.Criteria.where("_id").is(id));
        mongoTemplate.remove(query, "trip_media");
        return org.springframework.http.ResponseEntity.ok().build();
    }
}
