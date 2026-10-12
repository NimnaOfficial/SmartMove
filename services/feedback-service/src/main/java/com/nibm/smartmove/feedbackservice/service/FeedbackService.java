package com.nibm.smartmove.feedbackservice.service;
import com.nibm.smartmove.feedbackservice.entity.Feedback;
import com.nibm.smartmove.feedbackservice.repository.FeedbackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FeedbackService {
    private final FeedbackRepository repository;
    public FeedbackService(FeedbackRepository repository) { this.repository = repository; }
    public List<Feedback> findAll() { return repository.findAll(); }
    public Optional<Feedback> findById(Long id) { return repository.findById(id); }
    public Feedback save(Feedback entity) { return repository.save(entity); }
    public void deleteById(Long id) { repository.deleteById(id); }
    public List<Feedback> search(String q) { return repository.search(q); }
    public List<Feedback> findByPassengerId(Long passengerId) { return repository.findByPassengerIdOrderByFeedbackIdDesc(passengerId); }
    public List<Feedback> findAllDesc() { return repository.findAllByOrderByFeedbackIdDesc(); }
}
