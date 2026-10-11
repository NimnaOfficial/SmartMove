package com.nibm.smartmove.tripservice.service;
import com.nibm.smartmove.tripservice.entity.Trip;
import com.nibm.smartmove.tripservice.repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TripService {
    private final TripRepository repository;
    public TripService(TripRepository repository) { this.repository = repository; }
    public List<Trip> findAll() { return repository.findAll(); }
    public Optional<Trip> findById(Long id) { return repository.findById(id); }
    public Trip save(Trip entity) { return repository.save(entity); }
    public void deleteById(Long id) { repository.deleteById(id); }
    public List<Trip> search(String origin, String destination, String date, Double maxPrice) { return repository.search(origin, destination, date, maxPrice); }
}
