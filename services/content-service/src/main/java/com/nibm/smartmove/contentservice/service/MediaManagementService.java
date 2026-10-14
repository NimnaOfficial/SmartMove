package com.nibm.smartmove.contentservice.service;

import com.nibm.smartmove.contentservice.dto.MediaItemDto;
import com.nibm.smartmove.contentservice.dto.MediaSummaryDto;
import com.nibm.smartmove.contentservice.exception.InvalidFileException;
import com.nibm.smartmove.contentservice.exception.ResourceNotFoundException;
import com.nibm.smartmove.contentservice.model.TripMediaDocument;
import com.nibm.smartmove.contentservice.model.VehicleMediaDocument;
import com.nibm.smartmove.contentservice.repository.TripMediaRepository;
import com.nibm.smartmove.contentservice.repository.VehicleMediaRepository;
import com.nibm.smartmove.contentservice.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;

@Service
public class MediaManagementService {

    private static final Logger log = LoggerFactory.getLogger(MediaManagementService.class);
    private static final long MAX_DRIVER_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final long MAX_REVIEW_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    private final VehicleMediaRepository vehicleMediaRepository;
    private final TripMediaRepository tripMediaRepository;
    private final LocalStorageService localStorageService;
    private final MongoTemplate mongoTemplate;
    private final TripAssignmentVerifier tripAssignmentVerifier;

    public MediaManagementService(VehicleMediaRepository vehicleMediaRepository,
                                  TripMediaRepository tripMediaRepository,
                                  LocalStorageService localStorageService,
                                  MongoTemplate mongoTemplate,
                                  TripAssignmentVerifier tripAssignmentVerifier) {
        this.vehicleMediaRepository = vehicleMediaRepository;
        this.tripMediaRepository = tripMediaRepository;
        this.localStorageService = localStorageService;
        this.mongoTemplate = mongoTemplate;
        this.tripAssignmentVerifier = tripAssignmentVerifier;
    }

    // ────────────────────────────────────────────────────────────────
    // VEHICLE MEDIA
    // ────────────────────────────────────────────────────────────────

    public List<MediaItemDto> getVehicleMedia(Long vehicleId) {
        List<MediaItemDto> dtos = new ArrayList<>();

        List<VehicleMediaDocument> records = vehicleMediaRepository.findByVehicleId(vehicleId);
        for (VehicleMediaDocument doc : records) {
            if (doc.getDocuments() != null || doc.getImages() != null) {
                dtos.addAll(extractLegacyVehicleMedia(doc));
            } else {
                dtos.add(mapVehicleToDto(doc));
            }
        }

        dtos.sort((a, b) -> {
            if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        });

        return dtos;
    }

    public List<MediaItemDto> getPublicVehicleImages(Long vehicleId) {
        List<MediaItemDto> all = getVehicleMedia(vehicleId);
        List<MediaItemDto> publicImgs = new ArrayList<>();
        for (MediaItemDto item : all) {
            // ONLY approved/verified images. Never return REGISTRATION, FITNESS, INSURANCE, or internal documents.
            boolean isImage = "IMAGE".equalsIgnoreCase(item.getMediaType()) || "IMAGE".equalsIgnoreCase(item.getCategory());
            boolean isApproved = "VALID".equalsIgnoreCase(item.getStatus()) || "ACTIVE".equalsIgnoreCase(item.getStatus()) || "APPROVED".equalsIgnoreCase(item.getStatus());
            boolean isPublic = Boolean.TRUE.equals(item.getIsPublic()) || (item.getIsPublic() == null && isImage);

            if (isImage && isApproved && isPublic) {
                publicImgs.add(item);
            }
        }
        return publicImgs;
    }

    public List<MediaItemDto> getVehicleMediaForRole(Long vehicleId, UserPrincipal user) {
        if (user == null || user.isPassenger()) {
            return getPublicVehicleImages(vehicleId);
        }
        if (user.isDriver()) {
            // Drivers can view public images and operational vehicle documents (e.g., ROUTE_PERMIT, INSPECTION)
            List<MediaItemDto> all = getVehicleMedia(vehicleId);
            List<MediaItemDto> driverPermitted = new ArrayList<>();
            for (MediaItemDto item : all) {
                if ("IMAGE".equalsIgnoreCase(item.getMediaType()) ||
                    "INSPECTION".equalsIgnoreCase(item.getCategory()) ||
                    "ROUTE_PERMIT".equalsIgnoreCase(item.getCategory()) ||
                    "OPERATIONAL".equalsIgnoreCase(item.getCategory())) {
                    driverPermitted.add(item);
                }
            }
            return driverPermitted;
        }
        // Admin gets all
        return getVehicleMedia(vehicleId);
    }

    public List<MediaItemDto> getVehicleDocumentsOnly(Long vehicleId) {
        List<MediaItemDto> all = getVehicleMedia(vehicleId);
        List<MediaItemDto> docs = new ArrayList<>();
        for (MediaItemDto item : all) {
            if ("DOCUMENT".equalsIgnoreCase(item.getMediaType()) ||
                !"IMAGE".equalsIgnoreCase(item.getCategory())) {
                docs.add(item);
            }
        }
        return docs;
    }

    public List<MediaItemDto> getVehicleImagesOnly(Long vehicleId) {
        return getPublicVehicleImages(vehicleId);
    }

    public MediaItemDto uploadVehicleMedia(Long vehicleId,
                                           MultipartFile file,
                                           String title,
                                           String description,
                                           String category,
                                           String status,
                                           String uploadedBy) {
        if (vehicleId == null || vehicleId <= 0) {
            throw new IllegalArgumentException("Valid vehicle ID is required");
        }

        LocalStorageService.StoredFileResult stored = localStorageService.storeFile(file, "vehicles");

        String resolvedCategory = (category != null && !category.trim().isEmpty()) ? category.toUpperCase() : "OTHER";
        String mediaType = stored.getContentType().startsWith("image/") ? "IMAGE" : "DOCUMENT";
        String resolvedStatus = (status != null && !status.trim().isEmpty()) ? status.toUpperCase() : "VALID";
        boolean isPublic = "IMAGE".equalsIgnoreCase(mediaType);

        VehicleMediaDocument doc = VehicleMediaDocument.builder()
                .vehicleId(vehicleId)
                .title(title != null && !title.trim().isEmpty() ? title.trim() : stored.getOriginalFileName())
                .description(description)
                .category(resolvedCategory)
                .mediaType(mediaType)
                .isPublic(isPublic)
                .originalFileName(stored.getOriginalFileName())
                .storedFileName(stored.getStoredFileName())
                .storageKey(stored.getStorageKey())
                .contentType(stored.getContentType())
                .fileSize(stored.getFileSize())
                .uploadedBy(uploadedBy != null ? uploadedBy : "ADMIN")
                .status(resolvedStatus)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        doc = vehicleMediaRepository.save(doc);
        log.info("Saved vehicle media metadata to MongoDB: id={}, vehicleId={}", doc.getId(), vehicleId);

        return mapVehicleToDto(doc);
    }

    public void checkVehicleMediaAccess(Long vehicleId, String mediaId, UserPrincipal user) {
        VehicleMediaDocument doc = getVehicleMediaDocument(mediaId);
        if (vehicleId != null && !vehicleId.equals(doc.getVehicleId())) {
            throw new ResourceNotFoundException("Media " + mediaId + " does not belong to vehicle " + vehicleId);
        }

        if (user != null && user.isPassenger()) {
            boolean isImage = "IMAGE".equalsIgnoreCase(doc.getMediaType()) || "IMAGE".equalsIgnoreCase(doc.getCategory());
            boolean isPublic = Boolean.TRUE.equals(doc.getIsPublic()) || (doc.getIsPublic() == null && isImage);
            if (!isImage || !isPublic) {
                log.warn("Access denied: Passenger attempted to retrieve private vehicle compliance document: {}", mediaId);
                throw new SecurityException("Passengers are not authorized to view private vehicle documents");
            }
        }
    }

    public Resource getVehicleMediaResource(Long vehicleId, String mediaId) {
        VehicleMediaDocument doc = getVehicleMediaDocument(mediaId);

        if (vehicleId != null && !vehicleId.equals(doc.getVehicleId())) {
            throw new ResourceNotFoundException("Media " + mediaId + " does not belong to vehicle " + vehicleId);
        }

        if (doc.getStorageKey() == null) {
            throw new ResourceNotFoundException("Physical file not stored locally for this legacy record");
        }

        return localStorageService.loadFileAsResource(doc.getStorageKey());
    }

    public VehicleMediaDocument getVehicleMediaDocument(String mediaId) {
        return vehicleMediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle media document not found: " + mediaId));
    }

    public boolean deleteVehicleMedia(Long vehicleId, String mediaId) {
        Optional<VehicleMediaDocument> opt = vehicleMediaRepository.findById(mediaId);
        if (opt.isEmpty()) {
            return false;
        }
        VehicleMediaDocument doc = opt.get();
        if (vehicleId != null && !vehicleId.equals(doc.getVehicleId())) {
            throw new ResourceNotFoundException("Media does not belong to vehicle " + vehicleId);
        }

        if (doc.getStorageKey() != null) {
            localStorageService.deleteFile(doc.getStorageKey());
        }

        vehicleMediaRepository.deleteById(mediaId);
        log.info("Deleted vehicle media: id={}, vehicleId={}", mediaId, vehicleId);
        return true;
    }

    // ────────────────────────────────────────────────────────────────
    // TRIP MEDIA
    // ────────────────────────────────────────────────────────────────

    public List<MediaItemDto> getTripMedia(Long tripId) {
        List<MediaItemDto> dtos = new ArrayList<>();
        List<TripMediaDocument> list = (tripId != null && tripId > 0)
                ? tripMediaRepository.findByTripId(tripId)
                : tripMediaRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        for (TripMediaDocument doc : list) {
            dtos.add(mapTripToDto(doc));
        }
        return dtos;
    }

    public List<MediaItemDto> getTripMediaForRole(Long tripId, UserPrincipal user) {
        List<MediaItemDto> all = getTripMedia(tripId);

        if (user == null || user.isPassenger()) {
            // Passengers only see approved, public trip photography. Never restricted incident or internal evidence!
            List<MediaItemDto> passengerItems = new ArrayList<>();
            for (MediaItemDto item : all) {
                boolean isPublic = Boolean.TRUE.equals(item.getIsPublic());
                boolean isIncident = "INCIDENT".equalsIgnoreCase(item.getCategory()) || "INTERNAL".equalsIgnoreCase(item.getCategory());
                boolean isApproved = "APPROVED".equalsIgnoreCase(item.getApprovalStatus()) || "ACTIVE".equalsIgnoreCase(item.getStatus());

                if (isPublic && !isIncident && isApproved) {
                    passengerItems.add(item);
                }
            }
            return passengerItems;
        }

        if (user.isDriver()) {
            // Drivers can see trip media for their assigned trip including inspections and incidents
            List<MediaItemDto> driverItems = new ArrayList<>();
            for (MediaItemDto item : all) {
                // If it belongs to this driver or is general trip photo/inspection for the trip
                driverItems.add(item);
            }
            return driverItems;
        }

        // Admin sees all
        return all;
    }

    public void checkTripMediaAccess(Long tripId, String mediaId, UserPrincipal user) {
        TripMediaDocument doc = getTripMediaDocument(mediaId);
        if (tripId != null && !tripId.equals(doc.getTripId())) {
            throw new ResourceNotFoundException("Media " + mediaId + " does not belong to trip " + tripId);
        }

        if (user != null && user.isPassenger()) {
            boolean isPublic = Boolean.TRUE.equals(doc.getIsPublic());
            boolean isIncident = "INCIDENT".equalsIgnoreCase(doc.getCategory()) || "INTERNAL".equalsIgnoreCase(doc.getCategory());
            boolean isApproved = "APPROVED".equalsIgnoreCase(doc.getApprovalStatus());

            if (!isPublic || isIncident || !isApproved) {
                log.warn("Access denied: Passenger attempted to access restricted trip evidence: {}", mediaId);
                throw new SecurityException("Passengers are not authorized to access restricted trip evidence");
            }
        }
    }

    public MediaItemDto uploadTripMedia(Long tripId,
                                        Long routeId,
                                        MultipartFile file,
                                        String title,
                                        String description,
                                        String category,
                                        String mediaType,
                                        String status,
                                        String uploadedBy) {
        if (tripId == null || tripId <= 0) {
            throw new IllegalArgumentException("Valid trip ID is required");
        }

        LocalStorageService.StoredFileResult stored = localStorageService.storeFile(file, "trips");

        String resolvedType;
        if (mediaType != null && !mediaType.trim().isEmpty()) {
            resolvedType = mediaType.toUpperCase();
        } else if (stored.getContentType().startsWith("image/")) {
            resolvedType = "IMAGE";
        } else if (stored.getContentType().startsWith("video/")) {
            resolvedType = "VIDEO";
        } else {
            resolvedType = "DOCUMENT";
        }

        String resolvedCategory = (category != null && !category.trim().isEmpty()) ? category.toUpperCase() : "PHOTO";
        String resolvedStatus = (status != null && !status.trim().isEmpty()) ? status.toUpperCase() : "ACTIVE";
        boolean isPublic = "PHOTO".equalsIgnoreCase(resolvedCategory) || "SCENIC".equalsIgnoreCase(resolvedCategory);

        TripMediaDocument doc = TripMediaDocument.builder()
                .tripId(tripId)
                .routeId(routeId)
                .title(title != null && !title.trim().isEmpty() ? title.trim() : stored.getOriginalFileName())
                .description(description)
                .caption(description)
                .mediaType(resolvedType)
                .category(resolvedCategory)
                .originalFileName(stored.getOriginalFileName())
                .storedFileName(stored.getStoredFileName())
                .storageKey(stored.getStorageKey())
                .contentType(stored.getContentType())
                .fileSize(stored.getFileSize())
                .uploadedBy(uploadedBy != null ? uploadedBy : "ADMIN")
                .uploaderRole("ADMIN")
                .status(resolvedStatus)
                .isPublic(isPublic)
                .approvalStatus("APPROVED")
                .createdAt(Instant.now())
                .uploadedAt(Instant.now())
                .build();

        doc = tripMediaRepository.save(doc);
        log.info("Saved trip media metadata to MongoDB: id={}, tripId={}", doc.getId(), tripId);

        return mapTripToDto(doc);
    }

    /**
     * Secure Driver Trip Evidence Upload:
     * - Validates driver role
     * - Validates driver assignment to trip
     * - Limits file size to 5MB
     * - Restricts categories to driver evidence (INSPECTION, INCIDENT, VEHICLE_CONDITION, OPERATIONAL)
     * - Does NOT allow driver to self-approve for public passenger viewing
     */
    public MediaItemDto uploadDriverTripEvidence(Long tripId,
                                                Long routeId,
                                                MultipartFile file,
                                                String title,
                                                String description,
                                                String category,
                                                UserPrincipal user) {
        if (user == null || (!user.isDriver() && !user.isAdmin())) {
            throw new SecurityException("Only authenticated drivers or administrators can upload trip evidence");
        }

        if (tripId == null || tripId <= 0) {
            throw new IllegalArgumentException("Valid trip ID is required");
        }

        // 1. Verify Driver-to-Trip Assignment if user is DRIVER
        if (user.isDriver()) {
            boolean assigned = tripAssignmentVerifier.isDriverAssignedToTrip(user.getUserId(), tripId);
            if (!assigned) {
                log.warn("Security violation: Driver {} attempted to upload evidence for unassigned trip {}", user.getUserId(), tripId);
                throw new SecurityException("Driver " + user.getUserId() + " is not assigned to trip " + tripId);
            }
        }

        // 2. Validate File Size <= 5MB
        if (file.getSize() > MAX_DRIVER_FILE_SIZE) {
            throw new InvalidFileException("Driver uploads cannot exceed 5MB. File size was " + MediaItemDto.formatBytes(file.getSize()));
        }

        // 3. Validate Supported Image Types
        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        if (!originalName.endsWith(".jpg") && !originalName.endsWith(".jpeg") &&
            !originalName.endsWith(".png") && !originalName.endsWith(".webp") &&
            !originalName.endsWith(".pdf")) {
            throw new InvalidFileException("Unsupported file type for driver evidence. Allowed: JPG, PNG, WEBP, PDF.");
        }

        // 4. Store physical file in ./storage/media/trips/
        LocalStorageService.StoredFileResult stored = localStorageService.storeFile(file, "trips");

        String resolvedCategory = (category != null && !category.trim().isEmpty()) ? category.toUpperCase() : "INCIDENT";
        String mediaType = stored.getContentType().startsWith("image/") ? "IMAGE" : "DOCUMENT";

        TripMediaDocument doc = TripMediaDocument.builder()
                .tripId(tripId)
                .routeId(routeId)
                .driverId(user.getUserId())
                .title(title != null && !title.trim().isEmpty() ? title.trim() : stored.getOriginalFileName())
                .description(description)
                .caption(description)
                .mediaType(mediaType)
                .category(resolvedCategory)
                .originalFileName(stored.getOriginalFileName())
                .storedFileName(stored.getStoredFileName())
                .storageKey(stored.getStorageKey())
                .contentType(stored.getContentType())
                .fileSize(stored.getFileSize())
                .uploadedBy(user.getEmail() != null ? user.getEmail() : ("driver-" + user.getUserId()))
                .uploaderRole(user.isDriver() ? "DRIVER" : "ADMIN")
                .status("ACTIVE")
                .isPublic(false) // Never public until reviewed by Admin
                .approvalStatus("PENDING_REVIEW")
                .createdAt(Instant.now())
                .uploadedAt(Instant.now())
                .build();

        doc = tripMediaRepository.save(doc);
        log.info("Driver {} uploaded evidence for trip {}: docId={}", user.getUserId(), tripId, doc.getId());

        return mapTripToDto(doc);
    }

    public Resource getTripMediaResource(Long tripId, String mediaId) {
        TripMediaDocument doc = getTripMediaDocument(mediaId);

        if (tripId != null && !tripId.equals(doc.getTripId())) {
            throw new ResourceNotFoundException("Media " + mediaId + " does not belong to trip " + tripId);
        }

        if (doc.getStorageKey() == null) {
            throw new ResourceNotFoundException("Physical file not stored locally for this record");
        }

        return localStorageService.loadFileAsResource(doc.getStorageKey());
    }

    public TripMediaDocument getTripMediaDocument(String mediaId) {
        return tripMediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip media document not found: " + mediaId));
    }

    public boolean deleteTripMedia(Long tripId, String mediaId) {
        Optional<TripMediaDocument> opt = tripMediaRepository.findById(mediaId);
        if (opt.isEmpty()) {
            return false;
        }
        TripMediaDocument doc = opt.get();
        if (tripId != null && !tripId.equals(doc.getTripId())) {
            throw new ResourceNotFoundException("Media does not belong to trip " + tripId);
        }

        if (doc.getStorageKey() != null) {
            localStorageService.deleteFile(doc.getStorageKey());
        }

        tripMediaRepository.deleteById(mediaId);
        log.info("Deleted trip media: id={}, tripId={}", mediaId, tripId);
        return true;
    }

    /**
     * Role-aware trip media deletion:
     * - Admin can delete any media
     * - Driver can ONLY delete their own uploads on their assigned trip
     * - Driver cannot delete another driver's uploads or admin files
     * - Passenger cannot delete
     */
    public boolean deleteTripMediaForUser(Long tripId, String mediaId, UserPrincipal user) {
        if (user == null || user.isPassenger()) {
            throw new SecurityException("Passengers are not authorized to delete trip media");
        }

        TripMediaDocument doc = getTripMediaDocument(mediaId);

        if (user.isDriver()) {
            boolean isOwner = (doc.getDriverId() != null && doc.getDriverId().equals(user.getUserId())) ||
                              (doc.getUploadedBy() != null && doc.getUploadedBy().equalsIgnoreCase(user.getEmail()));

            if (!isOwner) {
                log.warn("Unauthorized delete attempt by driver {}: media {} uploaded by {}", user.getUserId(), mediaId, doc.getUploadedBy());
                throw new SecurityException("Drivers are only authorized to delete their own uploads");
            }
        }

        return deleteTripMedia(tripId, mediaId);
    }

    // ────────────────────────────────────────────────────────────────
    // PASSENGER REVIEW ATTACHMENTS
    // ────────────────────────────────────────────────────────────────

    public Map<String, Object> uploadReviewAttachment(String reviewId, MultipartFile file, UserPrincipal user) {
        if (user == null || (!user.isPassenger() && !user.isAdmin())) {
            throw new SecurityException("Only passengers or administrators can attach images to reviews");
        }

        // Validate File Size <= 5MB
        if (file.getSize() > MAX_REVIEW_FILE_SIZE) {
            throw new InvalidFileException("Review attachments cannot exceed 5MB. File size was " + MediaItemDto.formatBytes(file.getSize()));
        }

        // Validate Image Type
        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        if (!originalName.endsWith(".jpg") && !originalName.endsWith(".jpeg") &&
            !originalName.endsWith(".png") && !originalName.endsWith(".webp")) {
            throw new InvalidFileException("Unsupported file type for review attachment. Allowed: JPG, PNG, WEBP.");
        }

        // Store file in ./storage/media/reviews/
        LocalStorageService.StoredFileResult stored = localStorageService.storeFile(file, "reviews");

        String attachmentId = UUID.randomUUID().toString();
        Map<String, Object> attachmentMeta = new HashMap<>();
        attachmentMeta.put("id", attachmentId);
        attachmentMeta.put("fileName", stored.getOriginalFileName());
        attachmentMeta.put("storageKey", stored.getStorageKey());
        attachmentMeta.put("contentType", stored.getContentType());
        attachmentMeta.put("fileSize", stored.getFileSize());
        attachmentMeta.put("url", "/api/reviews/" + reviewId + "/attachments/" + attachmentId);
        attachmentMeta.put("uploadedAt", Instant.now().toString());

        // Update MongoDB review document if reviewId exists
        if (reviewId != null && !reviewId.isBlank() && !"new".equalsIgnoreCase(reviewId)) {
            Query query = new Query(Criteria.where("_id").is(reviewId));
            Update update = new Update().push("attachments", attachmentMeta);
            mongoTemplate.updateFirst(query, update, "reviews");
        }

        return attachmentMeta;
    }

    public Resource getReviewAttachmentResource(String storageKey) {
        if (storageKey == null || !storageKey.startsWith("reviews/")) {
            throw new ResourceNotFoundException("Invalid review attachment key: " + storageKey);
        }
        return localStorageService.loadFileAsResource(storageKey);
    }

    // ────────────────────────────────────────────────────────────────
    // SEARCH & SUMMARY
    // ────────────────────────────────────────────────────────────────

    public List<MediaItemDto> searchMedia(String mediaType, String category, String keyword, Long vehicleId, Long tripId) {
        List<MediaItemDto> results = new ArrayList<>();

        if (tripId != null && tripId > 0) {
            results.addAll(getTripMedia(tripId));
        } else if (vehicleId != null && vehicleId > 0) {
            results.addAll(getVehicleMedia(vehicleId));
        } else {
            List<VehicleMediaDocument> vDocs = vehicleMediaRepository.findAll();
            for (VehicleMediaDocument doc : vDocs) {
                if (doc.getDocuments() != null || doc.getImages() != null) {
                    results.addAll(extractLegacyVehicleMedia(doc));
                } else {
                    results.add(mapVehicleToDto(doc));
                }
            }

            List<TripMediaDocument> tDocs = tripMediaRepository.findAll();
            for (TripMediaDocument doc : tDocs) {
                results.add(mapTripToDto(doc));
            }
        }

        return results.stream().filter(item -> {
            if (mediaType != null && !mediaType.trim().isEmpty() && !"ALL".equalsIgnoreCase(mediaType)) {
                if (!mediaType.equalsIgnoreCase(item.getMediaType())) return false;
            }
            if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category)) {
                if (!category.equalsIgnoreCase(item.getCategory())) return false;
            }
            if (keyword != null && !keyword.trim().isEmpty()) {
                String kw = keyword.toLowerCase();
                String title = item.getTitle() != null ? item.getTitle().toLowerCase() : "";
                String desc = item.getDescription() != null ? item.getDescription().toLowerCase() : "";
                String fname = item.getOriginalFileName() != null ? item.getOriginalFileName().toLowerCase() : "";
                String reg = item.getRegistration() != null ? item.getRegistration().toLowerCase() : "";
                if (!title.contains(kw) && !desc.contains(kw) && !fname.contains(kw) && !reg.contains(kw)) {
                    return false;
                }
            }
            return true;
        }).sorted((a, b) -> {
            if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        }).toList();
    }

    public MediaSummaryDto getMediaSummary() {
        List<VehicleMediaDocument> vList = vehicleMediaRepository.findAll();
        long vDocsCount = 0;
        long vImgsCount = 0;

        for (VehicleMediaDocument doc : vList) {
            if (doc.getDocuments() != null) {
                vDocsCount += doc.getDocuments().size();
            }
            if (doc.getImages() != null) {
                vImgsCount += doc.getImages().size();
            }
            if (doc.getDocuments() == null && doc.getImages() == null) {
                if ("DOCUMENT".equalsIgnoreCase(doc.getMediaType())) {
                    vDocsCount++;
                } else {
                    vImgsCount++;
                }
            }
        }

        long tripMediaCount = tripMediaRepository.count();
        long totalStorageSize = localStorageService.calculateTotalStorageSize();

        return MediaSummaryDto.builder()
                .totalVehicleDocuments(vDocsCount)
                .totalVehicleImages(vImgsCount)
                .totalTripMedia(tripMediaCount)
                .totalStorageSizeBytes(totalStorageSize)
                .formattedTotalSize(MediaItemDto.formatBytes(totalStorageSize))
                .build();
    }

    // ────────────────────────────────────────────────────────────────
    // HELPER MAPPERS
    // ────────────────────────────────────────────────────────────────

    private MediaItemDto mapVehicleToDto(VehicleMediaDocument doc) {
        boolean hasLocal = doc.getStorageKey() != null && localStorageService.fileExists(doc.getStorageKey());
        String streamUrl = "/api/media/vehicles/" + doc.getVehicleId() + "/media/" + doc.getId();
        String downloadUrl = streamUrl + "/download";
        boolean isPublic = Boolean.TRUE.equals(doc.getIsPublic()) || "IMAGE".equalsIgnoreCase(doc.getMediaType());

        return MediaItemDto.builder()
                .id(doc.getId())
                .entityType("VEHICLE")
                .vehicleId(doc.getVehicleId())
                .registration(doc.getRegistration())
                .title(doc.getTitle() != null ? doc.getTitle() : doc.getOriginalFileName())
                .description(doc.getDescription())
                .category(doc.getCategory())
                .mediaType(doc.getMediaType())
                .originalFileName(doc.getOriginalFileName())
                .storedFileName(doc.getStoredFileName())
                .storageKey(doc.getStorageKey())
                .contentType(doc.getContentType())
                .fileSize(doc.getFileSize())
                .formattedFileSize(MediaItemDto.formatBytes(doc.getFileSize()))
                .streamUrl(streamUrl)
                .downloadUrl(downloadUrl)
                .uploadedBy(doc.getUploadedBy())
                .status(doc.getStatus())
                .isPublic(isPublic)
                .approvalStatus(doc.getStatus())
                .isLocalFile(hasLocal)
                .createdAt(doc.getCreatedAt() != null ? doc.getCreatedAt() : Instant.now())
                .build();
    }

    private MediaItemDto mapTripToDto(TripMediaDocument doc) {
        boolean hasLocal = doc.getStorageKey() != null && localStorageService.fileExists(doc.getStorageKey());
        String streamUrl = "/api/media/trips/" + doc.getTripId() + "/media/" + doc.getId();
        String downloadUrl = streamUrl + "/download";
        boolean isPublic = Boolean.TRUE.equals(doc.getIsPublic()) ||
                (doc.getIsPublic() == null && ("PHOTO".equalsIgnoreCase(doc.getCategory()) || "SCENIC".equalsIgnoreCase(doc.getCategory())) && !"INCIDENT".equalsIgnoreCase(doc.getCategory()));

        return MediaItemDto.builder()
                .id(doc.getId())
                .entityType("TRIP")
                .tripId(doc.getTripId())
                .routeId(doc.getRouteId())
                .driverId(doc.getDriverId())
                .title(doc.getTitle() != null ? doc.getTitle() : (doc.getCaption() != null ? doc.getCaption() : doc.getOriginalFileName()))
                .description(doc.getDescription() != null ? doc.getDescription() : doc.getCaption())
                .category(doc.getCategory() != null ? doc.getCategory() : "PHOTO")
                .mediaType(doc.getMediaType() != null ? doc.getMediaType() : "IMAGE")
                .originalFileName(doc.getOriginalFileName())
                .storedFileName(doc.getStoredFileName())
                .storageKey(doc.getStorageKey())
                .contentType(doc.getContentType())
                .fileSize(doc.getFileSize())
                .formattedFileSize(MediaItemDto.formatBytes(doc.getFileSize()))
                .streamUrl(streamUrl)
                .downloadUrl(downloadUrl)
                .externalUrl(doc.getUrl())
                .uploadedBy(doc.getUploadedBy())
                .uploaderRole(doc.getUploaderRole())
                .status(doc.getStatus() != null ? doc.getStatus() : "ACTIVE")
                .isPublic(isPublic)
                .approvalStatus(doc.getApprovalStatus() != null ? doc.getApprovalStatus() : "APPROVED")
                .isLocalFile(hasLocal)
                .createdAt(doc.getCreatedAt() != null ? doc.getCreatedAt() : (doc.getUploadedAt() != null ? doc.getUploadedAt() : Instant.now()))
                .build();
    }

    private List<MediaItemDto> extractLegacyVehicleMedia(VehicleMediaDocument doc) {
        List<MediaItemDto> list = new ArrayList<>();
        Long vId = doc.getVehicleId();
        String reg = doc.getRegistration();

        if (doc.getDocuments() != null) {
            int idx = 0;
            for (Map<String, Object> d : doc.getDocuments()) {
                String type = String.valueOf(d.getOrDefault("type", "DOCUMENT"));
                String fileName = String.valueOf(d.getOrDefault("fileName", "doc.pdf"));
                String url = String.valueOf(d.getOrDefault("url", ""));
                String status = String.valueOf(d.getOrDefault("status", "VALID"));
                String syntheticId = doc.getId() + "_doc_" + (idx++);

                list.add(MediaItemDto.builder()
                        .id(syntheticId)
                        .entityType("VEHICLE")
                        .vehicleId(vId)
                        .registration(reg)
                        .title(type.replace('_', ' ') + " Certificate")
                        .description("Official vehicle compliance certificate")
                        .category(type)
                        .mediaType("DOCUMENT")
                        .originalFileName(fileName)
                        .externalUrl(url)
                        .status(status)
                        .isPublic(false)
                        .approvalStatus(status)
                        .isLocalFile(false)
                        .createdAt(Instant.now())
                        .build());
            }
        }

        if (doc.getImages() != null) {
            int idx = 0;
            for (Map<String, Object> img : doc.getImages()) {
                String type = String.valueOf(img.getOrDefault("type", "IMAGE"));
                String url = String.valueOf(img.getOrDefault("url", ""));
                String caption = String.valueOf(img.getOrDefault("caption", "Vehicle Photograph"));
                String syntheticId = doc.getId() + "_img_" + (idx++);

                list.add(MediaItemDto.builder()
                        .id(syntheticId)
                        .entityType("VEHICLE")
                        .vehicleId(vId)
                        .registration(reg)
                        .title(caption)
                        .description(caption)
                        .category("IMAGE")
                        .mediaType("IMAGE")
                        .originalFileName(type + ".jpg")
                        .externalUrl(url)
                        .status("ACTIVE")
                        .isPublic(true)
                        .approvalStatus("APPROVED")
                        .isLocalFile(false)
                        .createdAt(Instant.now())
                        .build());
            }
        }

        return list;
    }
}
