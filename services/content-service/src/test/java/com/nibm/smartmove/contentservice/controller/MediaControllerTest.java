package com.nibm.smartmove.contentservice.controller;

import com.nibm.smartmove.contentservice.dto.MediaItemDto;
import com.nibm.smartmove.contentservice.dto.MediaSummaryDto;
import com.nibm.smartmove.contentservice.exception.GlobalExceptionHandler;
import com.nibm.smartmove.contentservice.exception.InvalidFileException;
import com.nibm.smartmove.contentservice.model.TripMediaDocument;
import com.nibm.smartmove.contentservice.model.VehicleMediaDocument;
import com.nibm.smartmove.contentservice.security.SecurityHelper;
import com.nibm.smartmove.contentservice.service.MediaManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class MediaControllerTest {

    private MockMvc mockMvc;
    private MediaManagementService mediaService;

    @BeforeEach
    public void setup() {
        mediaService = Mockito.mock(MediaManagementService.class);
        SecurityHelper securityHelper = new SecurityHelper();
        MediaController controller = new MediaController(mediaService, securityHelper);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    public void testGetSummary() throws Exception {
        MediaSummaryDto summary = MediaSummaryDto.builder()
                .totalVehicleDocuments(4)
                .totalVehicleImages(3)
                .totalTripMedia(8)
                .totalStorageSizeBytes(1024L * 1024L)
                .formattedTotalSize("1.0 MB")
                .build();

        when(mediaService.getMediaSummary()).thenReturn(summary);

        mockMvc.perform(get("/api/media/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalVehicleDocuments").value(4))
                .andExpect(jsonPath("$.totalTripMedia").value(8))
                .andExpect(jsonPath("$.formattedTotalSize").value("1.0 MB"));
    }

    @Test
    public void testGetVehicleMediaAsAdmin() throws Exception {
        MediaItemDto item = MediaItemDto.builder()
                .id("v123")
                .vehicleId(1L)
                .title("Insurance Certificate")
                .category("INSURANCE")
                .mediaType("DOCUMENT")
                .originalFileName("insurance.pdf")
                .createdAt(Instant.now())
                .build();

        when(mediaService.getVehicleMediaForRole(eq(1L), any())).thenReturn(List.of(item));

        mockMvc.perform(get("/api/media/vehicles/1")
                        .header("X-User-Role", "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("v123"))
                .andExpect(jsonPath("$[0].title").value("Insurance Certificate"))
                .andExpect(jsonPath("$[0].mediaType").value("DOCUMENT"));
    }

    @Test
    public void testPassengerCanGetPublicVehicleImages() throws Exception {
        MediaItemDto img = MediaItemDto.builder()
                .id("v_img1")
                .vehicleId(1L)
                .title("Bus Front Livery")
                .category("IMAGE")
                .mediaType("IMAGE")
                .isPublic(true)
                .status("VALID")
                .originalFileName("bus_front.png")
                .build();

        when(mediaService.getPublicVehicleImages(1L)).thenReturn(List.of(img));

        mockMvc.perform(get("/api/media/vehicles/1/public-images")
                        .header("X-User-Role", "PASSENGER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("v_img1"))
                .andExpect(jsonPath("$[0].mediaType").value("IMAGE"))
                .andExpect(jsonPath("$[0].isPublic").value(true));
    }

    @Test
    public void testPassengerCannotStreamPrivateVehicleDocument() throws Exception {
        doThrow(new SecurityException("Passengers are not authorized to view private vehicle documents"))
                .when(mediaService).checkVehicleMediaAccess(eq(1L), eq("priv_doc_1"), any());

        mockMvc.perform(get("/api/media/vehicles/1/media/priv_doc_1")
                        .header("X-User-Role", "PASSENGER"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Passengers are not authorized to view private vehicle documents"));
    }

    @Test
    public void testPassengerCannotViewRestrictedTripEvidence() throws Exception {
        doThrow(new SecurityException("Passengers are not authorized to access restricted trip evidence"))
                .when(mediaService).checkTripMediaAccess(eq(1L), eq("incident_99"), any());

        mockMvc.perform(get("/api/media/trips/1/media/incident_99")
                        .header("X-User-Role", "PASSENGER"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Passengers are not authorized to access restricted trip evidence"));
    }

    @Test
    public void testPassengerCannotUploadTripMedia() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "photo.png", "image/png", new byte[]{0x01, 0x02}
        );

        mockMvc.perform(multipart("/api/media/trips/1")
                        .file(file)
                        .header("X-User-Role", "PASSENGER"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Passengers are not authorized to upload trip media or driver evidence"));
    }

    @Test
    public void testDriverCanUploadTripEvidence() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "tire_check.png", "image/png", new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47}
        );

        MediaItemDto created = MediaItemDto.builder()
                .id("ev_101")
                .tripId(1L)
                .title("Pre-trip inspection")
                .category("PRE_TRIP_INSPECTION")
                .mediaType("IMAGE")
                .driverId(1L)
                .uploaderRole("DRIVER")
                .isPublic(false)
                .approvalStatus("PENDING_REVIEW")
                .build();

        when(mediaService.uploadDriverTripEvidence(eq(1L), any(), any(), any(), any(), any(), any()))
                .thenReturn(created);

        mockMvc.perform(multipart("/api/media/trips/1")
                        .file(file)
                        .header("X-User-Role", "DRIVER")
                        .header("X-User-Id", "1")
                        .header("X-User-Email", "driver@smartmove.lk")
                        .param("title", "Pre-trip inspection")
                        .param("category", "PRE_TRIP_INSPECTION"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("ev_101"))
                .andExpect(jsonPath("$.uploaderRole").value("DRIVER"))
                .andExpect(jsonPath("$.isPublic").value(false));
    }

    @Test
    public void testDriverCannotDeleteOtherDriverUpload() throws Exception {
        doThrow(new SecurityException("Drivers are only authorized to delete their own uploads"))
                .when(mediaService).deleteTripMediaForUser(eq(1L), eq("other_driver_upload"), any());

        mockMvc.perform(delete("/api/media/trips/1/media/other_driver_upload")
                        .header("X-User-Role", "DRIVER")
                        .header("X-User-Id", "2")
                        .header("X-User-Email", "driver2@smartmove.lk"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Drivers are only authorized to delete their own uploads"));
    }

    @Test
    public void testOversizedFileRejected() throws Exception {
        MockMultipartFile largeFile = new MockMultipartFile(
                "file", "huge.png", "image/png", new byte[100]
        );

        when(mediaService.uploadDriverTripEvidence(eq(1L), any(), any(), any(), any(), any(), any()))
                .thenThrow(new InvalidFileException("Driver uploads cannot exceed 5MB"));

        mockMvc.perform(multipart("/api/media/trips/1/driver-upload")
                        .file(largeFile)
                        .header("X-User-Role", "DRIVER")
                        .header("X-User-Id", "1"))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message").value("Driver uploads cannot exceed 5MB"));
    }

    @Test
    public void testAdminUploadVehicleMedia() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "cert.pdf", "application/pdf", new byte[]{0x25, 0x50, 0x44, 0x46}
        );

        MediaItemDto created = MediaItemDto.builder()
                .id("doc_999")
                .vehicleId(1L)
                .title("Annual Inspection")
                .category("INSPECTION")
                .mediaType("DOCUMENT")
                .originalFileName("cert.pdf")
                .build();

        when(mediaService.uploadVehicleMedia(eq(1L), any(), any(), any(), any(), any(), any()))
                .thenReturn(created);

        mockMvc.perform(multipart("/api/media/vehicles/1")
                        .file(file)
                        .header("X-User-Role", "ADMIN")
                        .param("title", "Annual Inspection")
                        .param("category", "INSPECTION")
                        .param("status", "VALID"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("doc_999"))
                .andExpect(jsonPath("$.title").value("Annual Inspection"));
    }

    @Test
    public void testAdminDeleteVehicleMedia() throws Exception {
        when(mediaService.deleteVehicleMedia(1L, "v123")).thenReturn(true);

        mockMvc.perform(delete("/api/media/vehicles/1/media/v123")
                        .header("X-User-Role", "ADMIN"))
                .andExpect(status().isNoContent());
    }
}
