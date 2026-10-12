package com.nibm.smartmove.feedbackservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "FEEDBACK")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FEEDBACK_ID")
    private Long feedbackId;

    @Column(name = "PASSENGER_ID")
    private Long passengerId;

    @Column(name = "TRIP_ID")
    private Long tripId;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "CREATED_AT")
    private java.time.LocalDateTime createdAt;

    @Transient
    private Long id;

    @Transient
    private String route;

    @Transient
    private String routeName;

    @Transient
    private Long routeId;

    @Transient
    private Long vehicleId;

    @Transient
    private String vehicle;

    @Transient
    private Long driverId;

    @Transient
    private String driverName;

    @Transient
    private String passengerName;

    @Transient
    private Integer rating;

    @Transient
    private String comment;

    @Transient
    private String date;

    public Long getId() {
        return id != null ? id : feedbackId;
    }

    public String getComment() {
        return (comment != null && !comment.isEmpty()) ? comment : description;
    }

    public void setComment(String comment) {
        this.comment = comment;
        if (this.description == null || this.description.isEmpty()) {
            this.description = comment;
        }
    }
}
