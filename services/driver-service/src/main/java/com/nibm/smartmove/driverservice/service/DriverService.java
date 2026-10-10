package com.nibm.smartmove.driverservice.service;
import com.nibm.smartmove.driverservice.entity.Driver;
import com.nibm.smartmove.driverservice.repository.DriverRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DriverService {
    private final DriverRepository repository;
    public DriverService(DriverRepository repository) { this.repository = repository; }
    public List<Driver> findAll() { return repository.findAll(); }
    public Optional<Driver> findById(Long id) { return repository.findById(id); }
    public Driver save(Driver entity) { return repository.save(entity); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
