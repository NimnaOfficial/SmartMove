package com.nibm.smartmove.maintenanceservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
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

    @com.fasterxml.jackson.annotation.JsonSetter("maintenanceDate")
    public void parseMaintenanceDate(Object val) {
        if (val == null) {
            this.maintenanceDate = java.time.LocalDateTime.now();
            return;
        }
        String s = val.toString().trim();
        if (s.isEmpty()) {
            this.maintenanceDate = java.time.LocalDateTime.now();
            return;
        }
        try {
            if (s.length() == 10) {
                this.maintenanceDate = java.time.LocalDate.parse(s).atStartOfDay();
            } else if (s.contains("T")) {
                this.maintenanceDate = java.time.LocalDateTime.parse(s.substring(0, Math.min(19, s.length())));
            } else {
                this.maintenanceDate = java.time.LocalDateTime.now();
            }
        } catch (Exception e) {
            this.maintenanceDate = java.time.LocalDateTime.now();
        }
    }
}
