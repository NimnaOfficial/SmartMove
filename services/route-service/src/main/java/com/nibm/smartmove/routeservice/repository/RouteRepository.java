package com.nibm.smartmove.routeservice.repository;
import com.nibm.smartmove.routeservice.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    @Query("SELECT r FROM Route r WHERE LOWER(r.origin) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(r.destination) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Route> search(@Param("q") String q);
}
