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
        java.util.List<java.util.Map> list = mongoTemplate.findAll(java.util.Map.class, "announcements");
        for (java.util.Map doc : list) {
            Object idObj = doc.get("_id");
            if (idObj != null) {
                String idStr = idObj.toString();
                doc.put("_id", idStr);
                doc.put("id", idStr);
                doc.put("announcementId", idStr);
            }
            if (!doc.containsKey("publishedAt") || doc.get("publishedAt") == null) {
                if (doc.containsKey("createdAt") && doc.get("createdAt") != null) {
                    doc.put("publishedAt", doc.get("createdAt"));
                }
            }
            if (!doc.containsKey("status") || doc.get("status") == null) {
                doc.put("status", "ACTIVE");
            }
        }
        return org.springframework.http.ResponseEntity.ok(list);
    }

    /**
     * Creates a new announcement. Stores title, message, targetAudience, priority in MongoDB.
     */
    @PostMapping("/api/announcements")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody java.util.Map<String, Object> payload) {
        if (!payload.containsKey("publishedAt") || payload.get("publishedAt") == null) {
            payload.put("publishedAt", java.time.Instant.now().toString());
        }
        if (!payload.containsKey("createdAt") || payload.get("createdAt") == null) {
            payload.put("createdAt", java.time.Instant.now().toString());
        }
        if (!payload.containsKey("status") || payload.get("status") == null) {
            payload.put("status", "ACTIVE");
        }
        if (!payload.containsKey("targetAudience") || payload.get("targetAudience") == null) {
            payload.put("targetAudience", "ALL");
        }
        if (!payload.containsKey("priority") || payload.get("priority") == null) {
            payload.put("priority", "MEDIUM");
        }
        mongoTemplate.save(payload, "announcements");
        Object idObj = payload.get("_id");
        if (idObj != null) {
            String idStr = idObj.toString();
            payload.put("_id", idStr);
            payload.put("id", idStr);
            payload.put("announcementId", idStr);
        }
        return org.springframework.http.ResponseEntity.ok(payload);
    }

    /**
     * Updates an existing announcement by MongoDB ObjectId or String id.
     */
    @PutMapping("/api/announcements/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable String id, @RequestBody java.util.Map<String, Object> payload) {
        org.bson.types.ObjectId objectId = null;
        if (org.bson.types.ObjectId.isValid(id)) {
            objectId = new org.bson.types.ObjectId(id);
        }
        
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query();
        if (objectId != null) {
            query.addCriteria(new org.springframework.data.mongodb.core.query.Criteria().orOperator(
                org.springframework.data.mongodb.core.query.Criteria.where("_id").is(objectId),
                org.springframework.data.mongodb.core.query.Criteria.where("_id").is(id)
            ));
        } else {
            query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("_id").is(id));
        }
        
        java.util.Map existing = mongoTemplate.findOne(query, java.util.Map.class, "announcements");
        if (existing == null) {
            existing = new java.util.HashMap();
            existing.put("_id", objectId != null ? objectId : id);
        }
        
        for (java.util.Map.Entry<String, Object> entry : payload.entrySet()) {
            String key = entry.getKey();
            if (!"_id".equals(key) && !"id".equals(key) && !"announcementId".equals(key)) {
                existing.put(key, entry.getValue());
            }
        }
        existing.put("updatedAt", java.time.Instant.now().toString());
        if (!existing.containsKey("status") || existing.get("status") == null) {
            existing.put("status", "ACTIVE");
        }
        if (!existing.containsKey("publishedAt") || existing.get("publishedAt") == null) {
            existing.put("publishedAt", java.time.Instant.now().toString());
        }
        
        mongoTemplate.save(existing, "announcements");
        
        Object idObj = existing.get("_id");
        if (idObj != null) {
            String idStr = idObj.toString();
            existing.put("_id", idStr);
            existing.put("id", idStr);
            existing.put("announcementId", idStr);
        }
        return org.springframework.http.ResponseEntity.ok(existing);
    }

    /**
     * Deletes/archives an announcement from MongoDB.
     */
    @DeleteMapping("/api/announcements/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable String id) {
        org.bson.types.ObjectId objectId = null;
        if (org.bson.types.ObjectId.isValid(id)) {
            objectId = new org.bson.types.ObjectId(id);
        }
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query();
        if (objectId != null) {
            query.addCriteria(new org.springframework.data.mongodb.core.query.Criteria().orOperator(
                org.springframework.data.mongodb.core.query.Criteria.where("_id").is(objectId),
                org.springframework.data.mongodb.core.query.Criteria.where("_id").is(id)
            ));
        } else {
            query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("_id").is(id));
        }
        mongoTemplate.remove(query, "announcements");
        return org.springframework.http.ResponseEntity.ok().build();
    }
}
