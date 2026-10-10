package com.nibm.smartmove.bookingservice.repository;
import com.nibm.smartmove.bookingservice.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b FROM Booking b WHERE LOWER(b.status) LIKE LOWER(CONCAT('%', :q, '%')) OR CAST(b.passengerId AS String) LIKE CONCAT('%', :q, '%')")
    List<Booking> search(@Param("q") String q);
}
