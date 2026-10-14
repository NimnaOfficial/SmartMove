package com.nibm.smartmove.contentservice.controller;

import com.nibm.smartmove.contentservice.security.SecurityHelper;
import com.nibm.smartmove.contentservice.security.UserPrincipal;
import com.nibm.smartmove.contentservice.service.MediaManagementService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ReviewController {

    private final MongoTemplate mongoTemplate;
    private final MediaManagementService mediaService;
    private final SecurityHelper securityHelper;

    @Autowired
    public ReviewController(MongoTemplate mongoTemplate,
                            MediaManagementService mediaService,
                            SecurityHelper securityHelper) {
        this.mongoTemplate = mongoTemplate;
        this.mediaService = mediaService;
        this.securityHelper = securityHelper;
    }

    /**
     * Retrieves all reviews from MongoDB reviews collection. Dynamic schema-flexible documents.
     */
    @GetMapping("/api/reviews")
    public ResponseEntity<?> endpoint0() {
        List<Map> reviews = mongoTemplate.findAll(Map.class, "reviews");
        return ResponseEntity.ok(reviews);
    }

    /**
     * Submits a new review to MongoDB. Stores rating, comment, routeId, vehicleId, driverId, passengerId.
     */
    @PostMapping("/api/reviews")
    public ResponseEntity<?> endpoint1(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        UserPrincipal user = securityHelper.extractUser(request);
        if (user.isDriver()) {
            throw new SecurityException("Drivers are not authorized to submit passenger reviews");
        }
        if (user.getUserId() != null && !payload.containsKey("passengerId")) {
            payload.put("passengerId", user.getUserId());
        }
        if (!payload.containsKey("createdAt")) {
            payload.put("createdAt", java.time.Instant.now().toString());
        }
        mongoTemplate.save(payload, "reviews");
        return ResponseEntity.ok(payload);
    }

    /**
     * Upload an image attachment to an existing review (Passenger feature).
     * Validates file size (<= 5MB) and image type (JPG, PNG, WEBP).
     */
    @PostMapping(value = "/api/reviews/{reviewId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadReviewAttachment(
            @PathVariable String reviewId,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {

        UserPrincipal user = securityHelper.extractUser(request);
        if (user.isDriver()) {
            throw new SecurityException("Drivers cannot upload passenger review attachments");
        }

        Map<String, Object> attachmentMeta = mediaService.uploadReviewAttachment(reviewId, file, user);
        return new ResponseEntity<>(attachmentMeta, HttpStatus.CREATED);
    }

    /**
     * Streams review attachment for inline preview.
     */
    @GetMapping("/api/reviews/{reviewId}/attachments/{attachmentId}")
    public ResponseEntity<Resource> streamReviewAttachment(
            @PathVariable String reviewId,
            @PathVariable String attachmentId) {

        Query query = new Query(Criteria.where("_id").is(reviewId));
        Map review = mongoTemplate.findOne(query, Map.class, "reviews");
        if (review == null) {
            return ResponseEntity.notFound().build();
        }

        List<Map<String, Object>> attachments = (List<Map<String, Object>>) review.get("attachments");
        if (attachments == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> matched = null;
        for (Map<String, Object> att : attachments) {
            if (attachmentId.equals(att.get("id"))) {
                matched = att;
                break;
            }
        }

        if (matched == null) {
            return ResponseEntity.notFound().build();
        }

        String storageKey = (String) matched.get("storageKey");
        String contentType = (String) matched.getOrDefault("contentType", "image/jpeg");
        String fileName = (String) matched.getOrDefault("fileName", "attachment.jpg");

        Resource resource = mediaService.getReviewAttachmentResource(storageKey);
        String encodedFilename = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + encodedFilename + "\"; filename*=UTF-8''" + encodedFilename)
                .header("X-Content-Type-Options", "nosniff")
                .body(resource);
    }

    /**
     * MongoDB Query 1: Retrieve all passenger reviews for a specific route. Uses db.reviews.find({routeId: N}).
     */
    @GetMapping("/api/reviews/route/{routeId}")
    public ResponseEntity<?> endpoint2(@PathVariable Long routeId) {
        Query query = new Query(Criteria.where("routeId").is(routeId));
        return ResponseEntity.ok(mongoTemplate.find(query, Map.class, "reviews"));
    }

    @GetMapping("/api/reviews/top-rated")
    public ResponseEntity<?> endpoint3() {
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.group("vehicleId").avg("rating").as("avgRating"),
            Aggregation.sort(org.springframework.data.domain.Sort.Direction.DESC, "avgRating")
        );
        AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "reviews", Map.class);
        return ResponseEntity.ok(results.getMappedResults());
    }

    /**
     * MongoDB Query 3: Search complaints/feedback by keyword. Uses $regex text matching on comment field.
     */
    @GetMapping("/api/reviews/search")
    public ResponseEntity<?> endpoint4(@RequestParam String keyword) {
        Query query = new Query(Criteria.where("comment").regex(keyword, "i"));
        return ResponseEntity.ok(mongoTemplate.find(query, Map.class, "reviews"));
    }
}
