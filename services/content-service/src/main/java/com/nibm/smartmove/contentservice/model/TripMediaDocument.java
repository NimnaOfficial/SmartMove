package com.nibm.smartmove.contentservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "trip_media")
public class TripMediaDocument {

    @Id
    private String id;

    @Indexed
    private Long tripId;

    @Indexed
    private Long routeId;

    private String title;
    private String description;
    private String caption;

    // MediaType: IMAGE, VIDEO, DOCUMENT
    @Indexed
    private String mediaType;

    // Category: PHOTO, DASHCAM, SCHEDULE, DOCUMENT, OTHER
    @Indexed
    private String category;

    @Indexed
    private Long driverId;

    @Indexed
    private Long vehicleId;

    @Indexed
    private Boolean isPublic; // true if approved for passenger viewing

    @Indexed
    private String approvalStatus; // APPROVED, PENDING_REVIEW, REJECTED

    private String uploaderRole; // ADMIN, DRIVER, PASSENGER

    private String originalFileName;
    private String storedFileName;
    private String storageKey; // relative path: "trips/<storedFileName>"
    private String contentType;
    private Long fileSize;
    private String url; // external CDN URL or null if local
    private String uploadedBy;
    private String status; // ACTIVE, ARCHIVED

    private Instant createdAt;
    private Instant uploadedAt;
}
