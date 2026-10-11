package com.nibm.smartmove.routeservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
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


}
