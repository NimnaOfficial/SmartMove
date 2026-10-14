package com.nibm.smartmove.contentservice.service;

import com.nibm.smartmove.contentservice.config.MediaStorageConfig;
import com.nibm.smartmove.contentservice.exception.InvalidFileException;
import com.nibm.smartmove.contentservice.exception.MediaStorageException;
import com.nibm.smartmove.contentservice.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.*;

@Service
public class LocalStorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalStorageService.class);

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    private static final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(Arrays.asList(
            "jpg", "jpeg", "png", "webp", "pdf", "mp4"
    ));

    private static final Map<String, String> EXT_TO_MIME = new HashMap<>();
    static {
        EXT_TO_MIME.put("jpg", "image/jpeg");
        EXT_TO_MIME.put("jpeg", "image/jpeg");
        EXT_TO_MIME.put("png", "image/png");
        EXT_TO_MIME.put("webp", "image/webp");
        EXT_TO_MIME.put("pdf", "application/pdf");
        EXT_TO_MIME.put("mp4", "video/mp4");
    }

    private final MediaStorageConfig storageConfig;

    public LocalStorageService(MediaStorageConfig storageConfig) {
        this.storageConfig = storageConfig;
    }

    public static class StoredFileResult {
        private final String originalFileName;
        private final String storedFileName;
        private final String storageKey;
        private final String contentType;
        private final long fileSize;

        public StoredFileResult(String originalFileName, String storedFileName, String storageKey, String contentType, long fileSize) {
            this.originalFileName = originalFileName;
            this.storedFileName = storedFileName;
            this.storageKey = storageKey;
            this.contentType = contentType;
            this.fileSize = fileSize;
        }

        public String getOriginalFileName() { return originalFileName; }
        public String getStoredFileName() { return storedFileName; }
        public String getStorageKey() { return storageKey; }
        public String getContentType() { return contentType; }
        public long getFileSize() { return fileSize; }
    }

    /**
     * Stores a multipart file into subfolder ("vehicles" or "trips").
     */
    public StoredFileResult storeFile(MultipartFile file, String subfolder) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Cannot store an empty file");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException("File exceeds maximum allowed size of 10MB");
        }

        String rawOriginalFilename = file.getOriginalFilename();
        if (rawOriginalFilename == null || rawOriginalFilename.trim().isEmpty()) {
            throw new InvalidFileException("File must have a valid filename");
        }

        String originalFilename = StringUtils.cleanPath(rawOriginalFilename);
        if (originalFilename.contains("..") || originalFilename.contains("/") || originalFilename.contains("\\")) {
            throw new InvalidFileException("Filename contains invalid path characters");
        }

        String ext = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw new InvalidFileException("Unsupported file extension ." + ext + ". Allowed extensions: jpg, jpeg, png, webp, pdf, mp4");
        }

        // Validate content type & magic bytes
        validateMagicBytes(file, ext);

        String contentType = EXT_TO_MIME.getOrDefault(ext, file.getContentType());
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        // Generate unique server-side file name
        String uniqueFileName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + "." + ext;
        String storageKey = subfolder + "/" + uniqueFileName;

        Path targetDirectory = "vehicles".equalsIgnoreCase(subfolder)
                ? storageConfig.getVehicleStoragePath()
                : storageConfig.getTripStoragePath();

        Path targetLocation = targetDirectory.resolve(uniqueFileName).normalize();

        // Path Traversal Security Verification
        if (!targetLocation.startsWith(storageConfig.getRootStoragePath())) {
            throw new MediaStorageException("Path traversal attempt detected");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            log.info("Stored file successfully: original='{}', storedKey='{}', size={} bytes",
                    originalFilename, storageKey, file.getSize());
        } catch (IOException e) {
            log.error("Failed to write file to local disk: {}", targetLocation, e);
            throw new MediaStorageException("Could not store file on disk. Please try again.", e);
        }

        return new StoredFileResult(originalFilename, uniqueFileName, storageKey, contentType, file.getSize());
    }

    /**
     * Loads a file as a Spring Resource for controlled streaming or download.
     */
    public Resource loadFileAsResource(String storageKey) {
        if (storageKey == null || storageKey.trim().isEmpty()) {
            throw new ResourceNotFoundException("Storage key cannot be empty");
        }

        Path filePath = storageConfig.getRootStoragePath().resolve(storageKey).normalize();

        // Enforce boundary check
        if (!filePath.startsWith(storageConfig.getRootStoragePath())) {
            throw new MediaStorageException("Invalid file access path");
        }

        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found on server disk: " + storageKey);
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Malformed URL for storage file: " + storageKey);
        }
    }

    /**
     * Checks if a file physically exists on disk.
     */
    public boolean fileExists(String storageKey) {
        if (storageKey == null || storageKey.trim().isEmpty()) return false;
        try {
            Path filePath = storageConfig.getRootStoragePath().resolve(storageKey).normalize();
            return filePath.startsWith(storageConfig.getRootStoragePath()) && Files.exists(filePath);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Deletes a file from disk.
     */
    public boolean deleteFile(String storageKey) {
        if (storageKey == null || storageKey.trim().isEmpty()) return false;
        try {
            Path filePath = storageConfig.getRootStoragePath().resolve(storageKey).normalize();
            if (!filePath.startsWith(storageConfig.getRootStoragePath())) {
                log.warn("Refused to delete file outside storage root: {}", storageKey);
                return false;
            }
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                log.info("Deleted physical media file: {}", storageKey);
            }
            return deleted;
        } catch (IOException e) {
            log.error("Failed to delete physical file: {}", storageKey, e);
            return false;
        }
    }

    /**
     * Calculates total bytes used by the local media storage directory.
     */
    public long calculateTotalStorageSize() {
        try {
            if (!Files.exists(storageConfig.getRootStoragePath())) {
                return 0L;
            }
            return Files.walk(storageConfig.getRootStoragePath())
                    .filter(p -> p.toFile().isFile())
                    .mapToLong(p -> p.toFile().length())
                    .sum();
        } catch (Exception e) {
            log.warn("Could not calculate total media storage size: {}", e.getMessage());
            return 0L;
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex + 1);
        }
        return "";
    }

    private void validateMagicBytes(MultipartFile file, String ext) {
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[12];
            int bytesRead = is.read(header);
            if (bytesRead < 4) {
                throw new InvalidFileException("File is corrupted or too small");
            }

            switch (ext) {
                case "png":
                    if ((header[0] & 0xFF) != 0x89 || header[1] != 0x50 || header[2] != 0x4E || header[3] != 0x47) {
                        throw new InvalidFileException("File content does not match PNG format");
                    }
                    break;
                case "jpg":
                case "jpeg":
                    if ((header[0] & 0xFF) != 0xFF || (header[1] & 0xFF) != 0xD8 || (header[2] & 0xFF) != 0xFF) {
                        throw new InvalidFileException("File content does not match JPEG format");
                    }
                    break;
                case "pdf":
                    if (header[0] != 0x25 || header[1] != 0x50 || header[2] != 0x44 || header[3] != 0x46) {
                        throw new InvalidFileException("File content does not match PDF format");
                    }
                    break;
                case "webp":
                    String riff = new String(header, 0, 4);
                    if (!"RIFF".equals(riff)) {
                        throw new InvalidFileException("File content does not match WebP format");
                    }
                    break;
                case "mp4":
                    // MP4 has 'ftyp' starting at index 4
                    if (bytesRead >= 8) {
                        String ftyp = new String(header, 4, 4);
                        if (!"ftyp".equals(ftyp)) {
                            log.warn("MP4 signature check warned: {}", ftyp);
                        }
                    }
                    break;
            }
        } catch (IOException e) {
            throw new MediaStorageException("Could not read file header for verification", e);
        }
    }
}
