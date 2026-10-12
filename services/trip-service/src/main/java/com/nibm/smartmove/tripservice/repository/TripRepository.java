package com.nibm.smartmove.tripservice.repository;
import com.nibm.smartmove.tripservice.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    @Query(value = "SELECT t.* FROM TRIP t LEFT JOIN ROUTE r ON t.ROUTE_ID = r.ROUTE_ID WHERE (:origin IS NULL OR LOWER(r.ORIGIN) LIKE LOWER('%' || :origin || '%')) AND (:destination IS NULL OR LOWER(r.DESTINATION) LIKE LOWER('%' || :destination || '%')) AND (:maxPrice IS NULL OR r.BASE_FARE <= :maxPrice) AND (:date IS NULL OR TO_CHAR(t.DEPARTURE_TIME, 'YYYY-MM-DD') = :date)", nativeQuery = true)
    List<Trip> search(@Param("origin") String origin, @Param("destination") String destination, @Param("date") String date, @Param("maxPrice") Double maxPrice);
}
