package com.nibm.smartmove.routeservice.service;
import com.nibm.smartmove.routeservice.entity.Route;
import com.nibm.smartmove.routeservice.repository.RouteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RouteService {
    private final RouteRepository repository;
    public RouteService(RouteRepository repository) { this.repository = repository; }
    public List<Route> findAll() { return repository.findAll(); }
    public Optional<Route> findById(Long id) { return repository.findById(id); }
    public Route save(Route entity) { return repository.save(entity); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
