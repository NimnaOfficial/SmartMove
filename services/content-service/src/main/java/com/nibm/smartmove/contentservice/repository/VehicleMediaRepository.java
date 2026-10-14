package com.nibm.smartmove.contentservice.repository;

import com.nibm.smartmove.contentservice.model.VehicleMediaDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleMediaRepository extends MongoRepository<VehicleMediaDocument, String> {
    List<VehicleMediaDocument> findByVehicleId(Long vehicleId);
    List<VehicleMediaDocument> findByVehicleIdAndMediaType(Long vehicleId, String mediaType);
    List<VehicleMediaDocument> findByVehicleIdAndCategory(Long vehicleId, String category);
    long countByMediaType(String mediaType);
}
