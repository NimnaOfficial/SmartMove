package com.nibm.smartmove.contentservice.controller;

import com.nibm.smartmove.contentservice.dto.MediaItemDto;
import com.nibm.smartmove.contentservice.dto.MediaSummaryDto;
import com.nibm.smartmove.contentservice.model.TripMediaDocument;
import com.nibm.smartmove.contentservice.model.VehicleMediaDocument;
import com.nibm.smartmove.contentservice.security.SecurityHelper;
import com.nibm.smartmove.contentservice.security.UserPrincipal;
import com.nibm.smartmove.contentservice.service.MediaManagementService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/media")
public class MediaController {

    private static final Logger log = LoggerFactory.getLogger(MediaController.class);
    private final MediaManagementService mediaService;
    private final SecurityHelper securityHelper;

    public MediaController(MediaManagementService mediaService, SecurityHelper securityHelper) {
        this.mediaService = mediaService;
        this.securityHelper = securityHelper;
    }

    // ────────────────────────────────────────────────────────────────
    // SUMMARY & GENERAL LISTING / SEARCH
    // ────────────────────────────────────────────────────────────────

    /**
     * Dashboard Summary statistics: total vehicle docs, images, trip media, storage size.
     */
    @GetMapping("/summary")
    public ResponseEntity<MediaSummaryDto> getSummary() {
        return ResponseEntity.ok(mediaService.getMediaSummary());
    }

    /**
     * Search and list all media across vehicles and trips.
     */
    @GetMapping
    public ResponseEntity<List<MediaItemDto>> getAllMedia(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long vehicleId,
            @RequestParam(required = false) Long tripId,
            HttpServletRequest request) {
        UserPrincipal user = securityHelper.extractUser(request);
        if (user.isPassenger()) {
            if (vehicleId != null) {
                return ResponseEntity.ok(mediaService.getPublicVehicleImages(vehicleId));
            }
            if (tripId != null) {
                return ResponseEntity.ok(mediaService.getTripMediaForRole(tripId, user));
            }
        }
        return ResponseEntity.ok(mediaService.searchMedia(type, category, search, vehicleId, tripId));
    }

    // ────────────────────────────────────────────────────────────────
    // VEHICLE MEDIA ENDPOINTS (ROLE-BASED AUTHORIZATION)
    // ────────────────────────────────────────────────────────────────

    /**
     * Lists media metadata for a specific vehicle with role-based filtering:
     * - PASSENGER: Only public approved vehicle images. Private documents are never returned.
     * - DRIVER: Public images and operational vehicle documents.
     * - ADMIN: All vehicle documents and images.
     */
    @GetMapping("/vehicles/{vehicleId}")
    public ResponseEntity<List<MediaItemDto>> getVehicleMedia(
            @PathVariable Long vehicleId,
            HttpServletRequest request) {
        UserPrincipal user = securityHelper.extractUser(request);
        return ResponseEntity.ok(mediaService.getVehicleMediaForRole(vehicleId, user));
    }

    /**
     * Public vehicle images endpoint specifically for Passenger galleries.
     */
    @GetMapping("/vehicles/{vehicleId}/public-images")
    public ResponseEntity<List<MediaItemDto>> getPublicVehicleImages(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(mediaService.getPublicVehicleImages(vehicleId));
    }

    /**
     * Lists documents only for a specific vehicle (compliance certificates, insurance, etc.).
     */
    @GetMapping("/vehicles/{vehicleId}/documents")
    public ResponseEntity<List<MediaItemDto>> getVehicleDocuments(
            @PathVariable Long vehicleId,
            HttpServletRequest request) {
        UserPrincipal user = securityHelper.extractUser(request);
        if (user.isPassenger()) {
            throw new SecurityException("Passengers are not authorized to view vehicle compliance documents");
        }
        return ResponseEntity.ok(mediaService.getVehicleDocumentsOnly(vehicleId));
    }

    /**
     * Uploads a new vehicle media file. Only ADMIN can manage official vehicle compliance documents.
     */
    @PostMapping(value = "/vehicles/{vehicleId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaItemDto> uploadVehicleMedia(
            @PathVariable Long vehicleId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false, defaultValue = "OTHER") String category,
            @RequestParam(value = "status", required = false, defaultValue = "VALID") String status,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            HttpServletRequest request) {

        UserPrincipal user = securityHelper.extractUser(request);
        if (!user.isAdmin()) {
            throw new SecurityException("Only administrators are authorized to upload official vehicle documents");
        }

        MediaItemDto item = mediaService.uploadVehicleMedia(
                vehicleId, file, title, description, category, status, userEmail
        );
        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    /**
     * Streams vehicle media for inline browser preview (image, PDF, etc.).
     * Enforces authorization: Passengers cannot stream private documents!
     */
    @GetMapping("/vehicles/{vehicleId}/media/{mediaId}")
    public ResponseEntity<Resource> streamVehicleMedia(
            @PathVariable Long vehicleId,
            @PathVariable String mediaId,
            HttpServletRequest request) {

        UserPrincipal user = securityHelper.extractUser(request);
        mediaService.checkVehicleMediaAccess(vehicleId, mediaId, user);

        VehicleMediaDocument doc = mediaService.getVehicleMediaDocument(mediaId);
        Resource resource = mediaService.getVehicleMediaResource(vehicleId, mediaId);

        String contentType = (doc.getContentType() != null) ? doc.getContentType() : "application/octet-stream";
        String encodedFilename = URLEncoder.encode(doc.getOriginalFileName(), StandardCharsets.UTF_8).replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + encodedFilename + "\"; filename*=UTF-8''" + encodedFilename)
                .header("X-Content-Type-Options", "nosniff")
                .body(resource);
    }

    /**
     * Downloads vehicle media with attachment header.
     * Enforces authorization: Passengers cannot download private compliance documents!
     */
    @GetMapping("/vehicles/{vehicleId}/media/{mediaId}/download")
    public ResponseEntity<Resource> downloadVehicleMedia(
            @PathVariable Long vehicleId,
            @PathVariable String mediaId,
            HttpServletRequest request) {

        UserPrincipal user = securityHelper.extractUser(request);
        mediaService.checkVehicleMediaAccess(vehicleId, mediaId, user);

        VehicleMediaDocument doc = mediaService.getVehicleMediaDocument(mediaId);
        Resource resource = mediaService.getVehicleMediaResource(vehicleId, mediaId);

        String encodedFilename = URLEncoder.encode(doc.getOriginalFileName(), StandardCharsets.UTF_8).replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFilename + "\"; filename*=UTF-8''" + encodedFilename)
                .header("X-Content-Type-Options", "nosniff")
                .body(resource);
    }

    /**
     * Deletes vehicle media item. Restricted to ADMIN.
     */
    @DeleteMapping("/vehicles/{vehicleId}/media/{mediaId}")
    public ResponseEntity<Void> deleteVehicleMedia(
            @PathVariable Long vehicleId,
            @PathVariable String mediaId,
            HttpServletRequest request) {

        UserPrincipal user = securityHelper.extractUser(request);
        if (!user.isAdmin()) {
            throw new SecurityException("Only administrators are authorized to delete vehicle documents");
        }

        boolean deleted = mediaService.deleteVehicleMedia(vehicleId, mediaId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ────────────────────────────────────────────────────────────────
    // TRIP MEDIA ENDPOINTS (ROLE-BASED AUTHORIZATION)
    // ────────────────────────────────────────────────────────────────

    /**
     * Lists media metadata for a specific trip:
     * - PASSENGER: Only approved public scenic/trip photos. Restricted driver evidence (incidents, inspections) is hidden.
     * - DRIVER: Operational photos, inspection photos, and incident evidence for this trip.
     * - ADMIN: All trip media.
     */
    @GetMapping("/trips/{tripId}")
    public ResponseEntity<List<MediaItemDto>> getTripMedia(
            @PathVariable Long tripId,
            HttpServletRequest request) {
        UserPrincipal user = securityHelper.extractUser(request);
        return ResponseEntity.ok(mediaService.getTripMediaForRole(tripId, user));
    }

    /**
     * Uploads new trip media:
     * - DRIVER: Uploads permitted evidence (inspection, incident, vehicle condition) for assigned trips. Max 5MB.
     * - ADMIN: Uploads operational/scenic media.
     * - PASSENGER: Forbidden (cannot upload driver evidence).
     */
    @PostMapping(value = "/trips/{tripId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaItemDto> uploadTripMedia(
            @PathVariable Long tripId,
            @RequestParam(value = "routeId", required = false) Long routeId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false, defaultValue = "PHOTO") String category,
            @RequestParam(value = "mediaType", required = false) String mediaType,
            @RequestParam(value = "status", required = false, defaultValue = "ACTIVE") String status,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            HttpServletRequest request) {

        UserPrincipal user = securityHelper.extractUser(request);

        if (user.isPassenger()) {
            throw new SecurityException("Passengers are not authorized to upload trip media or driver evidence");
        }

        if (user.isDriver()) {
            MediaItemDto item = mediaService.uploadDriverTripEvidence(
                    tripId, routeId, file, title, description, category, user
            );
            return new ResponseEntity<>(item, HttpStatus.CREATED);
        }

        // Admin upload path
        MediaItemDto item = mediaService.uploadTripMedia(
                tripId, routeId, file, title, description, category, mediaType, status,
                userEmail != null ? userEmail : user.getEmail()
        );
        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    /**
     * Dedicated Driver upload endpoint for trip incident and inspection evidence.
     */
    @PostMapping(value = "/trips/{tripId}/driver-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaItemDto> uploadDriverTripEvidence(
            @PathVariable Long tripId,
            @RequestParam(value = "routeId", required = false) Long routeId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false, defaultValue = "INCIDENT") String category,
            HttpServletRequest request) {

        UserPrincipal user = securityHelper.extractUser(request);
        MediaItemDto item = mediaService.uploadDriverTripEvidence(
                tripId, routeId, file, title, description, category, user
        );
        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    /**
     * Streams trip media for inline browser preview.
     * Passengers cannot access restricted driver incident/inspection evidence!
     */
    @GetMapping("/trips/{tripId}/media/{mediaId}")
    public ResponseEntity<Resource> streamTripMedia(
            @PathVariable Long tripId,
            @PathVariable String mediaId,
            HttpServletRequest request) {

        UserPrincipal user = securityHelper.extractUser(request);
        mediaService.checkTripMediaAccess(tripId, mediaId, user);

        TripMediaDocument doc = mediaService.getTripMediaDocument(mediaId);
        Resource resource = mediaService.getTripMediaResource(tripId, mediaId);

        String contentType = (doc.getContentType() != null) ? doc.getContentType() : "application/octet-stream";
        String encodedFilename = URLEncoder.encode(doc.getOriginalFileName(), StandardCharsets.UTF_8).replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + encodedFilename + "\"; filename*=UTF-8''" + encodedFilename)
                .header("X-Content-Type-Options", "nosniff")
                .body(resource);
    }

    /**
     * Downloads trip media with attachment header.
     */
    @GetMapping("/trips/{tripId}/media/{mediaId}/download")
    public ResponseEntity<Resource> downloadTripMedia(
            @PathVariable Long tripId,
            @PathVariable String mediaId,
            HttpServletRequest request) {

        UserPrincipal user = securityHelper.extractUser(request);
        mediaService.checkTripMediaAccess(tripId, mediaId, user);

        TripMediaDocument doc = mediaService.getTripMediaDocument(mediaId);
        Resource resource = mediaService.getTripMediaResource(tripId, mediaId);

        String encodedFilename = URLEncoder.encode(doc.getOriginalFileName(), StandardCharsets.UTF_8).replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFilename + "\"; filename*=UTF-8''" + encodedFilename)
                .header("X-Content-Type-Options", "nosniff")
                .body(resource);
    }

    /**
     * Deletes trip media item:
     * - Drivers can ONLY delete their own uploads on their assigned trips.
     * - Admins can delete any media.
     * - Passengers cannot delete.
     */
    @DeleteMapping("/trips/{tripId}/media/{mediaId}")
    public ResponseEntity<Void> deleteTripMedia(
            @PathVariable Long tripId,
            @PathVariable String mediaId,
            HttpServletRequest request) {

        UserPrincipal user = securityHelper.extractUser(request);
        boolean deleted = mediaService.deleteTripMediaForUser(tripId, mediaId, user);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ────────────────────────────────────────────────────────────────
    // BACKWARD COMPATIBILITY ENDPOINTS (matches previous client calls)
    // ────────────────────────────────────────────────────────────────

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<MediaItemDto>> legacyGetTripMedia(@PathVariable Long tripId, HttpServletRequest request) {
        UserPrincipal user = securityHelper.extractUser(request);
        return ResponseEntity.ok(mediaService.getTripMediaForRole(tripId, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> legacyDeleteMedia(@PathVariable String id, HttpServletRequest request) {
        UserPrincipal user = securityHelper.extractUser(request);
        if (!user.isAdmin()) {
            throw new SecurityException("Only administrators can perform legacy global deletes");
        }
        boolean deleted = mediaService.deleteTripMedia(null, id);
        if (!deleted) {
            deleted = mediaService.deleteVehicleMedia(null, id);
        }
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
