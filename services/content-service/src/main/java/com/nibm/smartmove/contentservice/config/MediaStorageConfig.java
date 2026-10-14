package com.nibm.smartmove.contentservice.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@Getter
@Setter
public class MediaStorageConfig {

    private static final Logger log = LoggerFactory.getLogger(MediaStorageConfig.class);

    @Value("${smartmove.media.storage-dir:./storage/media}")
    private String storageDir;

    @Value("${smartmove.media.max-file-size:10MB}")
    private String maxFileSize;

    private Path rootStoragePath;
    private Path vehicleStoragePath;
    private Path tripStoragePath;
    private Path reviewsStoragePath;

    @PostConstruct
    public void init() {
        try {
            this.rootStoragePath = Paths.get(storageDir).toAbsolutePath().normalize();
            this.vehicleStoragePath = this.rootStoragePath.resolve("vehicles");
            this.tripStoragePath = this.rootStoragePath.resolve("trips");
            this.reviewsStoragePath = this.rootStoragePath.resolve("reviews");

            Files.createDirectories(this.vehicleStoragePath);
            Files.createDirectories(this.tripStoragePath);
            Files.createDirectories(this.reviewsStoragePath);

            log.info("SmartMove Media Storage initialized at: {}", this.rootStoragePath);
            log.info("Vehicle media directory: {}", this.vehicleStoragePath);
            log.info("Trip media directory: {}", this.tripStoragePath);
            log.info("Reviews media directory: {}", this.reviewsStoragePath);
        } catch (IOException e) {
            log.error("Failed to initialize media storage directory: {}", storageDir, e);
            throw new RuntimeException("Could not create media storage directories", e);
        }
    }
}
