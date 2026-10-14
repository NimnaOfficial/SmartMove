package com.nibm.smartmove.contentservice.repository;

import com.nibm.smartmove.contentservice.model.TripMediaDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripMediaRepository extends MongoRepository<TripMediaDocument, String> {
    List<TripMediaDocument> findByTripId(Long tripId);
    List<TripMediaDocument> findByTripIdAndMediaType(Long tripId, String mediaType);
    List<TripMediaDocument> findByRouteId(Long routeId);
    long countByMediaType(String mediaType);
}
