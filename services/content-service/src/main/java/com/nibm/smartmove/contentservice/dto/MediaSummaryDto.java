package com.nibm.smartmove.contentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaSummaryDto {
    private long totalVehicleDocuments;
    private long totalVehicleImages;
    private long totalTripMedia;
    private long totalStorageSizeBytes;
    private String formattedTotalSize;
}
