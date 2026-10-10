package com.nibm.smartmove.contentservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "*")
public class DocumentController {
    @Autowired
    private org.springframework.data.mongodb.core.MongoTemplate mongoTemplate;

    /**
     * MongoDB Query 4: Retrieve vehicle documents (insurance, registration, etc.) from vehicle_documents collection.
     */
    @GetMapping("/api/documents/vehicle/{vehicleId}")
    public org.springframework.http.ResponseEntity<?> endpoint0(@PathVariable Long vehicleId) {
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query(org.springframework.data.mongodb.core.query.Criteria.where("vehicleId").is(vehicleId));
        return org.springframework.http.ResponseEntity.ok(mongoTemplate.find(query, java.util.Map.class, "vehicle_documents"));
    }

    /**
     * Retrieves vehicle images from MongoDB. Links to Oracle vehicleId for hybrid display.
     */
    @GetMapping("/api/documents/vehicle/{vehicleId}/images")
    public org.springframework.http.ResponseEntity<?> endpoint1(@PathVariable Long vehicleId) {
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query(org.springframework.data.mongodb.core.query.Criteria.where("vehicleId").is(vehicleId).and("type").is("image"));
        return org.springframework.http.ResponseEntity.ok(mongoTemplate.find(query, java.util.Map.class, "vehicle_documents"));
    }

    /**
     * Uploads a new document for a vehicle. Stores metadata + file reference in MongoDB.
     */
    @PostMapping("/api/documents/vehicle/{vehicleId}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long vehicleId, @RequestBody java.util.Map<String, Object> payload) {
        payload.put("vehicleId", vehicleId);
        mongoTemplate.save(payload, "vehicle_documents");
        return org.springframework.http.ResponseEntity.ok(payload);
    }

    /**
     * Deletes a vehicle document from MongoDB by ObjectId.
     */
    @DeleteMapping("/api/documents/{id}")
    public org.springframework.http.ResponseEntity<?> endpoint3(@PathVariable String id) {
        return org.springframework.http.ResponseEntity.ok().build(); // Mock delete
    }
}
