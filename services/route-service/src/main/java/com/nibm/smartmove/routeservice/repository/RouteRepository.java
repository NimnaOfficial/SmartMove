package com.nibm.smartmove.routeservice.repository;
import com.nibm.smartmove.routeservice.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
}
