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

    @Transient
    private String id;

    @Transient
    private String route;

    @Transient
    private String origin;

    @Transient
    private String destination;

    @Transient
    private String trip;

    @Transient
    private String departureTime;

    @Transient
    private String arrivalTime;

    @Transient
    private String date;

    @Transient
    private String time;

    @Transient
    private String vehicle;

    @Transient
    private String vehicleType;

    @Transient
    private String vehicleRegistration;

    @Transient
    private String passengerName;

    @Transient
    private Double fare;

    @Transient
    private Double amount;

    @Transient
    private Double seats;

    @Transient
    private String bookingStatus;

    public String getId() {
        if (this.id != null) return this.id;
        return this.bookingId != null ? "BK-" + this.bookingId : "BK-000";
    }

    public Double getAmount() {
        if (this.amount != null) return this.amount;
        return this.totalFare != null ? this.totalFare : 0.0;
    }

    public Double getFare() {
        if (this.fare != null) return this.fare;
        return this.totalFare != null ? this.totalFare : 0.0;
    }

    public Double getSeats() {
        if (this.seats != null) return this.seats;
        return this.seatsBooked != null ? this.seatsBooked : 1.0;
    }

    public String getBookingStatus() {
        if (this.bookingStatus != null) return this.bookingStatus;
        return this.status != null ? this.status : "CONFIRMED";
    }

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
        this.amount = amt;
        if (this.totalFare == null) {
            this.totalFare = amt;
        }
    }
}
