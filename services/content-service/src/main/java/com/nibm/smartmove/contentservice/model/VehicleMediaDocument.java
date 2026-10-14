package com.nibm.smartmove.contentservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "vehicle_documents")
public class VehicleMediaDocument {

    @Id
    private String id;

    @Indexed
    private Long vehicleId;

    private String registration;
    private String title;
    private String description;
    
    // Category: INSURANCE, REGISTRATION, REVENUE_LICENSE, EMISSION_TEST, ROUTE_PERMIT, INSPECTION, IMAGE, OTHER
    @Indexed
    private String category;

    // MediaType: DOCUMENT, IMAGE
    @Indexed
    private String mediaType;

    @Indexed
    private Boolean isPublic; // true if approved for public passenger gallery viewing

    private String originalFileName;
    private String storedFileName;
    private String storageKey; // relative path: "vehicles/<storedFileName>"
    private String contentType;
    private Long fileSize;
    private String uploadedBy;
    private String status; // VALID, EXPIRED, PENDING, ACTIVE

    private Instant createdAt;
    private Instant updatedAt;

    // Compatibility fields for legacy seed format ({ vehicleId: 1, documents: [...], images: [...] })
    private List<Map<String, Object>> documents;
    private List<Map<String, Object>> images;
}
