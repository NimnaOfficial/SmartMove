package com.nibm.smartmove.contentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaItemDto {
    private String id;
    private String entityType; // "VEHICLE" or "TRIP"
    private Long vehicleId;
    private Long tripId;
    private Long routeId;
    private Long driverId;
    private String registration;
    private String title;
    private String description;
    private String category;
    private String mediaType; // "IMAGE", "DOCUMENT", "VIDEO"
    private String originalFileName;
    private String storedFileName;
    private String storageKey;
    private String contentType;
    private Long fileSize;
    private String formattedFileSize;
    private String streamUrl;
    private String downloadUrl;
    private String externalUrl;
    private String uploadedBy;
    private String uploaderRole;
    private String status;
    private Boolean isPublic;
    private String approvalStatus;
    private boolean isLocalFile;
    private Instant createdAt;

    public static String formatBytes(Long bytes) {
        if (bytes == null || bytes <= 0) return "0 B";
        final String[] units = new String[]{"B", "KB", "MB", "GB"};
        int digitGroups = (int) (Math.log10(bytes) / Math.log10(1024));
        digitGroups = Math.min(digitGroups, units.length - 1);
        return String.format("%.1f %s", bytes / Math.pow(1024, digitGroups), units[digitGroups]);
    }
}
