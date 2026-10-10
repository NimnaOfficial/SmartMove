package com.nibm.smartmove.tripservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "TRIP")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TRIP_ID")
    private Long tripId;

    @Column(name = "ROUTE_ID")
    private Long routeId;

    @Column(name = "VEHICLE_ID")
    private Long vehicleId;

    @Column(name = "DRIVER_ID")
    private Long driverId;

    @Column(name = "DEPARTURE_TIME")
    private java.time.LocalDateTime departureTime;

    @Column(name = "ARRIVAL_TIME")
    private java.time.LocalDateTime arrivalTime;

    @Column(name = "AVAILABLE_SEATS")
    private Double availableSeats;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "CREATED_AT")
    private java.time.LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private java.time.LocalDateTime updatedAt;


}
