package com.nibm.smartmove.paymentservice.service;
import com.nibm.smartmove.paymentservice.entity.Payment;
import com.nibm.smartmove.paymentservice.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PaymentService {
    private final PaymentRepository repository;
    public PaymentService(PaymentRepository repository) { this.repository = repository; }
    public List<Payment> findAll() { return repository.findAll(); }
    public Optional<Payment> findById(Long id) { return repository.findById(id); }
    public Payment save(Payment entity) { return repository.save(entity); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
