package com.nibm.smartmove.contentservice.service;

import com.nibm.smartmove.contentservice.config.MediaStorageConfig;
import com.nibm.smartmove.contentservice.exception.InvalidFileException;
import com.nibm.smartmove.contentservice.exception.ResourceNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

public class LocalStorageServiceTest {

    @TempDir
    Path tempDir;

    private LocalStorageService storageService;
    private MediaStorageConfig storageConfig;

    @BeforeEach
    public void setUp() {
        storageConfig = new MediaStorageConfig();
        storageConfig.setStorageDir(tempDir.toString());
        storageConfig.init();
        storageService = new LocalStorageService(storageConfig);
    }

    @Test
    public void testStoreAllowedPngFile() {
        // PNG magic bytes: 0x89 0x50 0x4E 0x47
        byte[] pngContent = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0};
        MockMultipartFile file = new MockMultipartFile("file", "bus-front.png", "image/png", pngContent);

        LocalStorageService.StoredFileResult result = storageService.storeFile(file, "vehicles");

        assertNotNull(result);
        assertEquals("bus-front.png", result.getOriginalFileName());
        assertTrue(result.getStoredFileName().endsWith(".png"));
        assertTrue(result.getStorageKey().startsWith("vehicles/"));
        assertEquals("image/png", result.getContentType());
        assertTrue(storageService.fileExists(result.getStorageKey()));

        // Test Resource loading
        Resource resource = storageService.loadFileAsResource(result.getStorageKey());
        assertTrue(resource.exists());

        // Test Deletion
        assertTrue(storageService.deleteFile(result.getStorageKey()));
        assertFalse(storageService.fileExists(result.getStorageKey()));
    }

    @Test
    public void testStoreAllowedPdfFile() {
        // PDF magic bytes: %PDF (0x25 0x50 0x44 0x46)
        byte[] pdfContent = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35, 0, 0, 0, 0};
        MockMultipartFile file = new MockMultipartFile("file", "insurance.pdf", "application/pdf", pdfContent);

        LocalStorageService.StoredFileResult result = storageService.storeFile(file, "vehicles");

        assertNotNull(result);
        assertEquals("insurance.pdf", result.getOriginalFileName());
        assertEquals("application/pdf", result.getContentType());
        assertTrue(storageService.fileExists(result.getStorageKey()));
    }

    @Test
    public void testRejectEmptyFile() {
        MockMultipartFile file = new MockMultipartFile("file", "empty.png", "image/png", new byte[0]);
        assertThrows(InvalidFileException.class, () -> storageService.storeFile(file, "vehicles"));
    }

    @Test
    public void testRejectDisallowedExtension() {
        byte[] scriptContent = "echo 'danger'".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "script.sh", "text/plain", scriptContent);
        assertThrows(InvalidFileException.class, () -> storageService.storeFile(file, "vehicles"));
    }

    @Test
    public void testRejectMismatchedMagicBytes() {
        // File claims to be png but has invalid header
        byte[] fakeContent = new byte[]{0x00, 0x01, 0x02, 0x03, 0x04, 0x05};
        MockMultipartFile file = new MockMultipartFile("file", "fake.png", "image/png", fakeContent);
        assertThrows(InvalidFileException.class, () -> storageService.storeFile(file, "vehicles"));
    }

    @Test
    public void testLoadNonExistentFileThrows() {
        assertThrows(ResourceNotFoundException.class, () -> storageService.loadFileAsResource("vehicles/non_existent.pdf"));
    }

    @Test
    public void testCalculateStorageSize() {
        byte[] content = new byte[]{0x25, 0x50, 0x44, 0x46, 1, 2, 3, 4, 5, 6, 7, 8};
        MockMultipartFile file = new MockMultipartFile("file", "cert.pdf", "application/pdf", content);
        storageService.storeFile(file, "vehicles");

        long size = storageService.calculateTotalStorageSize();
        assertTrue(size >= content.length);
    }
}
