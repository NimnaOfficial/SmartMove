package com.nibm.smartmove.passengerservice.service;
import com.nibm.smartmove.passengerservice.entity.Passenger;
import com.nibm.smartmove.passengerservice.repository.PassengerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PassengerService {
    private final PassengerRepository repository;
    public PassengerService(PassengerRepository repository) { this.repository = repository; }
    public List<Passenger> findAll() { return repository.findAll(); }
    public Optional<Passenger> findById(Long id) { return repository.findById(id); }
    public Passenger save(Passenger entity) { return repository.save(entity); }
    public void deleteById(Long id) { repository.deleteById(id); }
    public List<Passenger> search(String q) { return repository.search(q); }
}
