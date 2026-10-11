package com.nibm.smartmove.contentservice.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "*")
public class ReviewController {
    @Autowired
    private org.springframework.data.mongodb.core.MongoTemplate mongoTemplate;

    /**
     * Retrieves all reviews from MongoDB reviews collection. Dynamic schema-flexible documents.
     */
    @GetMapping("/api/reviews")
    public org.springframework.http.ResponseEntity<?> endpoint0() {
        java.util.List<java.util.Map> reviews = mongoTemplate.findAll(java.util.Map.class, "reviews");
        return org.springframework.http.ResponseEntity.ok(reviews);
    }

    /**
     * Submits a new review to MongoDB. Stores rating, comment, routeId, vehicleId, driverId, tags.
     */
    @PostMapping("/api/reviews")
    public org.springframework.http.ResponseEntity<?> endpoint1(@RequestBody java.util.Map<String, Object> payload) {
        mongoTemplate.save(payload, "reviews");
        return org.springframework.http.ResponseEntity.ok(payload);
    }

    /**
     * MongoDB Query 1: Retrieve all passenger reviews for a specific route. Uses db.reviews.find({routeId: N}).
     */
    @GetMapping("/api/reviews/route/{routeId}")
    public org.springframework.http.ResponseEntity<?> endpoint2(@PathVariable Long routeId) {
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query(org.springframework.data.mongodb.core.query.Criteria.where("routeId").is(routeId));
        return org.springframework.http.ResponseEntity.ok(mongoTemplate.find(query, java.util.Map.class, "reviews"));
    }

    @GetMapping("/api/reviews/top-rated")
    public org.springframework.http.ResponseEntity<?> endpoint3() {
        org.springframework.data.mongodb.core.aggregation.Aggregation aggregation = org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation(
            org.springframework.data.mongodb.core.aggregation.Aggregation.group("vehicleId").avg("rating").as("avgRating"),
            org.springframework.data.mongodb.core.aggregation.Aggregation.sort(org.springframework.data.domain.Sort.Direction.DESC, "avgRating")
        );
        org.springframework.data.mongodb.core.aggregation.AggregationResults<java.util.Map> results = mongoTemplate.aggregate(aggregation, "reviews", java.util.Map.class);
        return org.springframework.http.ResponseEntity.ok(results.getMappedResults());
    }

    /**
     * MongoDB Query 3: Search complaints/feedback by keyword. Uses $regex text matching on comment field.
     */
    @GetMapping("/api/reviews/search")
    public org.springframework.http.ResponseEntity<?> endpoint4(@RequestParam String keyword) {
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query(org.springframework.data.mongodb.core.query.Criteria.where("comment").regex(keyword, "i"));
        return org.springframework.http.ResponseEntity.ok(mongoTemplate.find(query, java.util.Map.class, "reviews"));
    }
}
