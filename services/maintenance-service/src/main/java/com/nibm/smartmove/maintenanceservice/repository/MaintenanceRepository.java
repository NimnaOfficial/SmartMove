package com.nibm.smartmove.maintenanceservice.repository;
import com.nibm.smartmove.maintenanceservice.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
}
