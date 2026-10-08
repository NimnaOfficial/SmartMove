// ===================================================================
// SMARTMOVE - MONGODB COLLECTION CREATION & INDEXING SCRIPT
// ===================================================================

// 1. REVIEWS COLLECTION
db.createCollection("reviews");
db.reviews.createIndex({ routeId: 1 });
db.reviews.createIndex({ rating: -1 });
db.reviews.createIndex({ comment: "text" });

db.runCommand({
  collMod: "reviews",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["routeId", "passengerId", "rating", "comment"],
      properties: {
        routeId: { bsonType: "number" },
        vehicleId: { bsonType: "number" },
        driverId: { bsonType: "number" },
        passengerId: { bsonType: "number" },
        rating: { bsonType: "number", minimum: 1, maximum: 5 },
        comment: { bsonType: "string" },
        type: { bsonType: "string", enum: ["REVIEW", "COMPLAINT"] }
      }
    }
  }
});

// 2. ANNOUNCEMENTS COLLECTION
db.createCollection("announcements");
db.announcements.createIndex({ status: 1 });
db.announcements.createIndex({ targetAudience: 1 });

// 3. VEHICLE DOCUMENTS COLLECTION
db.createCollection("vehicle_documents");
db.vehicle_documents.createIndex({ vehicleId: 1 });

// 4. TRIP MEDIA COLLECTION
db.createCollection("trip_media");
db.trip_media.createIndex({ tripId: 1 });
db.trip_media.createIndex({ routeId: 1 });

print("MongoDB Setup Complete!");
