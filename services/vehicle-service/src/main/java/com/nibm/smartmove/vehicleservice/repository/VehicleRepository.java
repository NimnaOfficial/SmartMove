package com.nibm.smartmove.vehicleservice.repository;
import com.nibm.smartmove.vehicleservice.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    @Query("SELECT v FROM Vehicle v WHERE LOWER(v.registrationNumber) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(v.type) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(v.model) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Vehicle> search(@Param("q") String q);
}
