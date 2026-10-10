package com.nibm.smartmove.maintenanceservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "MAINTENANCE")
public class Maintenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MAINTENANCE_ID")
    private Long maintenanceId;

    @Column(name = "VEHICLE_ID")
    private Long vehicleId;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "COST")
    private Double cost;

    @Column(name = "MAINTENANCE_DATE")
    private java.time.LocalDateTime maintenanceDate;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "CREATED_AT")
    private java.time.LocalDateTime createdAt;


}
