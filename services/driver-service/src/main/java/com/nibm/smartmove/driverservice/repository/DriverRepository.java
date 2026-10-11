package com.nibm.smartmove.driverservice.repository;
import com.nibm.smartmove.driverservice.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    @Query("SELECT d FROM Driver d WHERE LOWER(d.firstName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(d.lastName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(d.licenseNumber) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(d.email) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Driver> search(@Param("q") String q);
}
