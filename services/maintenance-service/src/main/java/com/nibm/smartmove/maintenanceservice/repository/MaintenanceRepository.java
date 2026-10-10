package com.nibm.smartmove.maintenanceservice.repository;
import com.nibm.smartmove.maintenanceservice.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    @Query("SELECT m FROM Maintenance m WHERE LOWER(m.description) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Maintenance> search(@Param("q") String q);
}
