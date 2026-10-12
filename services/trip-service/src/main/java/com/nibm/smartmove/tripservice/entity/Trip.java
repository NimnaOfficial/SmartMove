package com.nibm.smartmove.tripservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
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

    @Transient
    private Long id;

    @Transient
    private String origin;

    @Transient
    private String destination;

    @Transient
    private String route;

    @Transient
    private String routeOrigin;

    @Transient
    private String routeDestination;

    @Transient
    private Double fare;

    @Transient
    private String vehicle;

    @Transient
    private String vehicleRegistration;

    @Transient
    private String vehicleType;

    @Transient
    private String vehicleModel;

    @Transient
    private String driverName;

    @Transient
    private String date;

    @Transient
    private String departureDate;

    @Transient
    private Boolean isPaid;

    @Transient
    private String paymentStatus;

    public Boolean getIsPaid() {
        return this.isPaid;
    }

    public void setIsPaid(Boolean isPaid) {
        this.isPaid = isPaid;
    }

    public String getPaymentStatus() {
        return this.paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Long getId() {
        return this.tripId != null ? this.tripId : this.id;
    }

    public void setId(Long id) {
        this.id = id;
        if (this.tripId == null) {
            this.tripId = id;
        }
    }
}
