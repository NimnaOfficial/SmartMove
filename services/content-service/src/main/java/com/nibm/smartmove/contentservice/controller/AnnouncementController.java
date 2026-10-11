package com.nibm.smartmove.contentservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "*")
public class AnnouncementController {
    @Autowired
    private org.springframework.data.mongodb.core.MongoTemplate mongoTemplate;

    /**
     * Retrieves all announcements from MongoDB announcements collection.
     */
    @GetMapping("/api/announcements")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        return org.springframework.http.ResponseEntity.ok(mongoTemplate.findAll(java.util.Map.class, "announcements"));
    }

    /**
     * Creates a new announcement. Stores title, message, targetAudience, priority in MongoDB.
     */
    @PostMapping("/api/announcements")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody java.util.Map<String, Object> payload) {
        mongoTemplate.save(payload, "announcements");
        return org.springframework.http.ResponseEntity.ok(payload);
    }

    /**
     * Updates an existing announcement by MongoDB ObjectId.
     */
    @PutMapping("/api/announcements/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable String id, @RequestBody java.util.Map<String, Object> payload) {
        payload.put("_id", id);
        mongoTemplate.save(payload, "announcements");
        return org.springframework.http.ResponseEntity.ok(payload);
    }

    /**
     * Deletes/archives an announcement from MongoDB.
     */
    @DeleteMapping("/api/announcements/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable String id) {
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query(org.springframework.data.mongodb.core.query.Criteria.where("_id").is(id));
        mongoTemplate.remove(query, "announcements");
        return org.springframework.http.ResponseEntity.ok().build();
    }
}
