package com.nibm.smartmove.vehicleservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "VEHICLE")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VEHICLE_ID")
    private Long vehicleId;

    @Column(name = "REGISTRATION_NUMBER")
    private String registrationNumber;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "CAPACITY")
    private Double capacity;

    @Column(name = "MODEL")
    private String model;

    @Column(name = "YEAR")
    private Double year;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "CREATED_AT")
    private java.time.LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private java.time.LocalDateTime updatedAt;


}
