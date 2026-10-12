package com.nibm.smartmove.routeservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "ROUTE")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ROUTE_ID")
    private Long routeId;

    @Column(name = "ORIGIN")
    private String origin;

    @Column(name = "DESTINATION")
    private String destination;

    @Column(name = "DISTANCE_KM")
    private Double distanceKm;

    @Column(name = "ESTIMATED_DURATION")
    private String estimatedDuration;

    @Column(name = "BASE_FARE")
    private Double baseFare;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "CREATED_AT")
    private java.time.LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private java.time.LocalDateTime updatedAt;

    @com.fasterxml.jackson.annotation.JsonProperty("distance")
    public void setDistance(Double distance) {
        if (this.distanceKm == null) {
            this.distanceKm = distance;
        }
    }

    @com.fasterxml.jackson.annotation.JsonProperty("duration")
    public void setDuration(String duration) {
        if (this.estimatedDuration == null) {
            this.estimatedDuration = duration;
        }
    }

    @com.fasterxml.jackson.annotation.JsonProperty("distance")
    public Double getDistance() {
        return this.distanceKm;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("duration")
    public String getDuration() {
        return this.estimatedDuration;
    }
}
