package com.nibm.smartmove.bookingservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "BOOKING")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOOKING_ID")
    private Long bookingId;

    @Column(name = "PASSENGER_ID")
    private Long passengerId;

    @Column(name = "TRIP_ID")
    private Long tripId;

    @Column(name = "SEATS_BOOKED")
    private Double seatsBooked;

    @Column(name = "TOTAL_FARE")
    private Double totalFare;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "PAYMENT_STATUS")
    private String paymentStatus;

    @Column(name = "BOOKING_DATE")
    private java.time.LocalDateTime bookingDate;

    @Column(name = "UPDATED_AT")
    private java.time.LocalDateTime updatedAt;


}
