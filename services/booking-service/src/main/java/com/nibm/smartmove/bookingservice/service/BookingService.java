package com.nibm.smartmove.bookingservice.service;
import com.nibm.smartmove.bookingservice.entity.Booking;
import com.nibm.smartmove.bookingservice.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookingService {
    private final BookingRepository repository;
    public BookingService(BookingRepository repository) { this.repository = repository; }
    public List<Booking> findAll() { return repository.findAll(); }
    public Optional<Booking> findById(Long id) { return repository.findById(id); }
    public Booking save(Booking entity) { return repository.save(entity); }
    public void deleteById(Long id) { repository.deleteById(id); }
    public List<Booking> search(String q) { return repository.search(q); }
}
