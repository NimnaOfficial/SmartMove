package com.nibm.smartmove.passengerservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "PASSENGER")
public class Passenger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PASSENGER_ID")
    private Long passengerId;

    @Column(name = "FIRST_NAME")
    private String firstName;

    @Column(name = "LAST_NAME")
    private String lastName;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "PHONE")
    private String phone;

    @Column(name = "PASSWORD_HASH")
    private String passwordHash;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "ROLE")
    private String role;

    @Column(name = "REGISTERED_AT")
    private java.time.LocalDateTime registeredAt;

    @Column(name = "UPDATED_AT")
    private java.time.LocalDateTime updatedAt;


}
