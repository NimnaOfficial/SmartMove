package com.nibm.smartmove.bookingservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
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

    @com.fasterxml.jackson.annotation.JsonProperty("ticketQuantity")
    public void setTicketQuantity(Double qty) {
        if (this.seatsBooked == null) {
            this.seatsBooked = qty;
        }
    }

    @com.fasterxml.jackson.annotation.JsonProperty("totalAmount")
    public void setTotalAmount(Double amt) {
        if (this.totalFare == null) {
            this.totalFare = amt;
        }
    }

    @com.fasterxml.jackson.annotation.JsonProperty("amount")
    public void setAmount(Double amt) {
        if (this.totalFare == null) {
            this.totalFare = amt;
        }
    }
}
