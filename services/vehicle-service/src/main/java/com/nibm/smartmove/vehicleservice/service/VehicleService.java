package com.nibm.smartmove.vehicleservice.service;
import com.nibm.smartmove.vehicleservice.entity.Vehicle;
import com.nibm.smartmove.vehicleservice.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VehicleService {
    private final VehicleRepository repository;
    public VehicleService(VehicleRepository repository) { this.repository = repository; }
    public List<Vehicle> findAll() { return repository.findAll(); }
    public Optional<Vehicle> findById(Long id) { return repository.findById(id); }
    public Vehicle save(Vehicle entity) { return repository.save(entity); }
    public void deleteById(Long id) { repository.deleteById(id); }
    public List<Vehicle> search(String q) { return repository.search(q); }
}
