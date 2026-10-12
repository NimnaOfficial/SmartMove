package com.nibm.smartmove.feedbackservice.repository;
import com.nibm.smartmove.feedbackservice.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @Query("SELECT f FROM Feedback f WHERE LOWER(f.description) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(f.type) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Feedback> search(@Param("q") String q);

    List<Feedback> findByPassengerIdOrderByFeedbackIdDesc(Long passengerId);

    List<Feedback> findAllByOrderByFeedbackIdDesc();
}
