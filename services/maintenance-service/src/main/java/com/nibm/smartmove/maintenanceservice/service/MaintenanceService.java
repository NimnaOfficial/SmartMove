package com.nibm.smartmove.maintenanceservice.service;
import com.nibm.smartmove.maintenanceservice.entity.Maintenance;
import com.nibm.smartmove.maintenanceservice.repository.MaintenanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MaintenanceService {
    private final MaintenanceRepository repository;
    public MaintenanceService(MaintenanceRepository repository) { this.repository = repository; }
    public List<Maintenance> findAll() { return repository.findAll(); }
    public Optional<Maintenance> findById(Long id) { return repository.findById(id); }
    public Maintenance save(Maintenance entity) { return repository.save(entity); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
