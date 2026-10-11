package com.nibm.smartmove.paymentservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "PAYMENT")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAYMENT_ID")
    private Long paymentId;

    @Column(name = "BOOKING_ID")
    private Long bookingId;

    @Column(name = "AMOUNT")
    private Double amount;

    @Column(name = "PAYMENT_METHOD")
    private String paymentMethod;

    @Column(name = "PAYMENT_DATE")
    private java.time.LocalDateTime paymentDate;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "TRANSACTION_REF")
    private String transactionRef;


}
