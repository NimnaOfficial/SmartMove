package com.nibm.smartmove.contentservice.config;

import com.nibm.smartmove.contentservice.model.TripMediaDocument;
import com.nibm.smartmove.contentservice.model.VehicleMediaDocument;
import com.nibm.smartmove.contentservice.repository.TripMediaRepository;
import com.nibm.smartmove.contentservice.repository.VehicleMediaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;

/**
 * Repeatable, idempotent sample data initializer.
 * Ensures local storage directory contains initial valid demo assets (PDF, PNG)
 * and synchronizes corresponding MongoDB metadata records.
 */
@Component
public class SampleMediaInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SampleMediaInitializer.class);

    private final MediaStorageConfig storageConfig;
    private final VehicleMediaRepository vehicleMediaRepository;
    private final TripMediaRepository tripMediaRepository;

    public SampleMediaInitializer(MediaStorageConfig storageConfig,
                                  VehicleMediaRepository vehicleMediaRepository,
                                  TripMediaRepository tripMediaRepository) {
        this.storageConfig = storageConfig;
        this.vehicleMediaRepository = vehicleMediaRepository;
        this.tripMediaRepository = tripMediaRepository;
    }

    // 1x1 purple PNG bytes (valid PNG header + chunks)
    private static final byte[] SAMPLE_PNG_BYTES = new byte[]{
            (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, (byte) 0xC4, (byte) 0x89, 0x00, 0x00, 0x00,
            0x0D, 0x49, 0x44, 0x41, 0x54, 0x78, (byte) 0x9C, 0x63, (byte) 0xF8, (byte) 0xCF,
            (byte) 0xC0, 0x00, 0x00, 0x03, 0x01, 0x01, 0x00, 0x18, (byte) 0xDD, (byte) 0x8D,
            (byte) 0xB0, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, (byte) 0xAE, 0x42, 0x60, (byte) 0x82
    };

    // Minimal valid PDF text
    private static final String SAMPLE_PDF_TEXT = "%PDF-1.4\n" +
            "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n" +
            "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n" +
            "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n" +
            "4 0 obj\n<< /Length 55 >>\nstream\n" +
            "BT /F1 12 Tf 72 712 Td (SmartMove Certificate of Transit Compliance) Tj ET\n" +
            "endstream\nendobj\n" +
            "xref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000204 00000 n\n" +
            "trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n310\n%%EOF\n";

    @Override
    public void run(ApplicationArguments args) {
        try {
            initSampleFilesAndRecords();
        } catch (Exception e) {
            log.warn("Sample media initialization skipped or encountered non-fatal notice: {}", e.getMessage());
        }
    }

    public void initSampleFilesAndRecords() throws IOException {
        Path vehicleDir = storageConfig.getVehicleStoragePath();
        Path tripDir = storageConfig.getTripStoragePath();

        // 1. Sample Vehicle Insurance PDF
        String vDocKey = "vehicles/demo_insurance_ND-4521.pdf";
        Path vDocPath = storageConfig.getRootStoragePath().resolve(vDocKey);
        if (!Files.exists(vDocPath)) {
            Files.write(vDocPath, SAMPLE_PDF_TEXT.getBytes(StandardCharsets.UTF_8));
            log.info("Created demo local file: {}", vDocPath);
        }

        // Check if MongoDB record exists
        List<VehicleMediaDocument> existingVDocs = vehicleMediaRepository.findByVehicleId(1L);
        boolean hasVDocRecord = existingVDocs.stream().anyMatch(d -> vDocKey.equals(d.getStorageKey()));
        if (!hasVDocRecord) {
            VehicleMediaDocument doc = VehicleMediaDocument.builder()
                    .vehicleId(1L)
                    .registration("ND-4521")
                    .title("Annual Fleet Insurance Policy 2026")
                    .description("Sri Lanka Insurance Corporation - Comprehensive commercial passenger coverage")
                    .category("INSURANCE")
                    .mediaType("DOCUMENT")
                    .originalFileName("ins_ND-4521_2026.pdf")
                    .storedFileName("demo_insurance_ND-4521.pdf")
                    .storageKey(vDocKey)
                    .contentType("application/pdf")
                    .fileSize(Files.size(vDocPath))
                    .uploadedBy("admin@smartmove.lk")
                    .status("VALID")
                    .isPublic(false)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
            vehicleMediaRepository.save(doc);
            log.info("Inserted demo VehicleMediaDocument for Vehicle 1: {}", doc.getId());
        }

        // 2. Sample Vehicle Photo PNG (Public Vehicle Gallery)
        String vImgKey = "vehicles/demo_volvo9900_front.png";
        Path vImgPath = storageConfig.getRootStoragePath().resolve(vImgKey);
        if (!Files.exists(vImgPath)) {
            Files.write(vImgPath, SAMPLE_PNG_BYTES);
            log.info("Created demo local file: {}", vImgPath);
        }

        boolean hasVImgRecord = existingVDocs.stream().anyMatch(d -> vImgKey.equals(d.getStorageKey()));
        if (!hasVImgRecord) {
            VehicleMediaDocument imgDoc = VehicleMediaDocument.builder()
                    .vehicleId(1L)
                    .registration("ND-4521")
                    .title("Volvo 9900 Front Livery Inspection")
                    .description("Exterior frontal photograph showing LED route displays and registration plate")
                    .category("IMAGE")
                    .mediaType("IMAGE")
                    .originalFileName("ND-4521_front.png")
                    .storedFileName("demo_volvo9900_front.png")
                    .storageKey(vImgKey)
                    .contentType("image/png")
                    .fileSize(Files.size(vImgPath))
                    .uploadedBy("admin@smartmove.lk")
                    .status("VALID")
                    .isPublic(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
            vehicleMediaRepository.save(imgDoc);
            log.info("Inserted demo VehiclePhotoDocument for Vehicle 1: {}", imgDoc.getId());
        }

        // 3. Sample Trip Photo (Public Passenger Approved)
        String tImgKey = "trips/demo_trip1_departure.png";
        Path tImgPath = storageConfig.getRootStoragePath().resolve(tImgKey);
        if (!Files.exists(tImgPath)) {
            Files.write(tImgPath, SAMPLE_PNG_BYTES);
            log.info("Created demo local file: {}", tImgPath);
        }

        List<TripMediaDocument> existingTDocs = tripMediaRepository.findByTripId(1L);
        boolean hasTImgRecord = existingTDocs.stream().anyMatch(d -> tImgKey.equals(d.getStorageKey()));
        if (!hasTImgRecord) {
            TripMediaDocument tripDoc = TripMediaDocument.builder()
                    .tripId(1L)
                    .routeId(1L)
                    .driverId(1L)
                    .title("Bastian Mawatha Departure Snapshot")
                    .description("Boarding verification and luggage bay clearance at Colombo Platform 3")
                    .caption("Colombo Bastian Mawatha departure on-time snapshot")
                    .category("PHOTO")
                    .mediaType("IMAGE")
                    .originalFileName("trip1_colombo_departure.png")
                    .storedFileName("demo_trip1_departure.png")
                    .storageKey(tImgKey)
                    .contentType("image/png")
                    .fileSize(Files.size(tImgPath))
                    .uploadedBy("saman.k@smartmove.lk")
                    .uploaderRole("DRIVER")
                    .status("ACTIVE")
                    .isPublic(true)
                    .approvalStatus("APPROVED")
                    .createdAt(Instant.now())
                    .uploadedAt(Instant.now())
                    .build();
            tripMediaRepository.save(tripDoc);
            log.info("Inserted demo TripMediaDocument for Trip 1: {}", tripDoc.getId());
        }

        // 4. Sample Driver Pre-Trip Inspection Evidence (Restricted Driver/Admin only, hidden from Passengers)
        String tInspectKey = "trips/demo_trip1_inspection.png";
        Path tInspectPath = storageConfig.getRootStoragePath().resolve(tInspectKey);
        if (!Files.exists(tInspectPath)) {
            Files.write(tInspectPath, SAMPLE_PNG_BYTES);
            log.info("Created demo local inspection file: {}", tInspectPath);
        }

        boolean hasInspectRecord = existingTDocs.stream().anyMatch(d -> tInspectKey.equals(d.getStorageKey()));
        if (!hasInspectRecord) {
            TripMediaDocument inspectDoc = TripMediaDocument.builder()
                    .tripId(1L)
                    .routeId(1L)
                    .driverId(1L)
                    .title("Pre-Trip Brake & Tire Pressure Verification")
                    .description("Driver pre-departure checklist physical tire tread and brake line inspection")
                    .caption("Pre-departure inspection evidence recorded before passenger boarding")
                    .category("PRE_TRIP_INSPECTION")
                    .mediaType("IMAGE")
                    .originalFileName("pretrip_inspection_ND-4521.png")
                    .storedFileName("demo_trip1_inspection.png")
                    .storageKey(tInspectKey)
                    .contentType("image/png")
                    .fileSize(Files.size(tInspectPath))
                    .uploadedBy("saman.k@smartmove.lk")
                    .uploaderRole("DRIVER")
                    .status("ACTIVE")
                    .isPublic(false) // Restricted from Passengers!
                    .approvalStatus("PENDING_REVIEW")
                    .createdAt(Instant.now())
                    .uploadedAt(Instant.now())
                    .build();
            tripMediaRepository.save(inspectDoc);
            log.info("Inserted demo Driver Inspection TripMediaDocument for Trip 1: {}", inspectDoc.getId());
        }
    }
}
