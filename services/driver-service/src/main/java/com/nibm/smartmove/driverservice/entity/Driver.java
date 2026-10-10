package com.nibm.smartmove.driverservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "DRIVER")
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DRIVER_ID")
    private Long driverId;

    @Column(name = "FIRST_NAME")
    private String firstName;

    @Column(name = "LAST_NAME")
    private String lastName;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "PHONE")
    private String phone;

    @Column(name = "LICENSE_NUMBER")
    private String licenseNumber;

    @Column(name = "PASSWORD_HASH")
    private String passwordHash;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "RATING")
    private Double rating;

    @Column(name = "TOTAL_TRIPS")
    private Double totalTrips;

    @Column(name = "ROLE")
    private String role;

    @Column(name = "CREATED_AT")
    private java.time.LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private java.time.LocalDateTime updatedAt;


}
