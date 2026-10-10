package com.nibm.smartmove.passengerservice.repository;
import com.nibm.smartmove.passengerservice.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    @Query("SELECT p FROM Passenger p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.email) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.phone) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Passenger> search(@Param("q") String q);
}
