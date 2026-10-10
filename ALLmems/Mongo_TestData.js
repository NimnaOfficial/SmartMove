// ===================================================================
// SMARTMOVE - MONGODB TEST DATA INSERTION SCRIPT
// ===================================================================

// Use this script to populate MongoDB collections for the SmartMove application.
// Ensure that the MongoDB setup script (Mongo_Setup.js) has been run first.

print("Clearing existing collections...");
db.reviews.deleteMany({});
db.announcements.deleteMany({});
db.vehicle_documents.deleteMany({});
db.trip_media.deleteMany({});

print("Inserting Test Data into 'reviews'...");
db.reviews.insertMany([
  {
    routeId: 1,
    vehicleId: 1,
    driverId: 1,
    passengerId: 1,
    rating: 5,
    comment: "Excellent trip! The coach was very comfortable and arrived on time.",
    type: "REVIEW",
    tags: ["On Time", "Comfortable", "Clean"],
    createdAt: new Date("2026-10-15T11:30:00Z")
  },
  {
    routeId: 2,
    vehicleId: 2,
    driverId: 2,
    passengerId: 2,
    rating: 4,
    comment: "Good service but the AC was a bit too cold.",
    type: "REVIEW",
    tags: ["Good Driving"],
    createdAt: new Date("2026-10-10T12:00:00Z")
  },
  {
    routeId: 3,
    vehicleId: 4,
    driverId: 1,
    passengerId: 3,
    rating: 2,
    comment: "The bus broke down on the way. Had to wait 2 hours for a replacement.",
    type: "COMPLAINT",
    tags: ["Delay", "Breakdown"],
    createdAt: new Date("2026-09-25T14:00:00Z")
  },
  {
    routeId: 4,
    passengerId: 4,
    rating: 5,
    comment: "Highly recommend this route. Beautiful scenery and smooth ride.",
    type: "REVIEW",
    tags: ["Scenic", "Smooth"],
    createdAt: new Date("2026-08-15T09:00:00Z")
  }
]);

print("Inserting Test Data into 'announcements'...");
db.announcements.insertMany([
  {
    title: "System Maintenance Notice",
    message: "The SmartMove system will undergo scheduled maintenance this Sunday from 2 AM to 4 AM. Booking services may be temporarily unavailable.",
    publishedAt: new Date("2026-10-09T08:00:00Z"),
    targetAudience: "ALL",
    priority: "HIGH",
    status: "ACTIVE",
    createdAt: new Date("2026-10-09T08:00:00Z"),
    updatedAt: new Date("2026-10-09T08:00:00Z")
  },
  {
    title: "New Route Added: Colombo to Jaffna",
    message: "We are excited to announce our new luxury coach service from Colombo to Jaffna starting next month. Book your tickets now!",
    publishedAt: new Date("2026-10-05T10:00:00Z"),
    targetAudience: "PASSENGERS",
    priority: "MEDIUM",
    status: "ACTIVE",
    createdAt: new Date("2026-10-05T10:00:00Z"),
    updatedAt: new Date("2026-10-05T10:00:00Z")
  },
  {
    title: "Driver Safety Briefing",
    message: "All active drivers must attend the mandatory safety briefing on October 20th at the main depot.",
    publishedAt: new Date("2026-10-01T09:00:00Z"),
    targetAudience: "DRIVERS",
    priority: "HIGH",
    status: "ACTIVE",
    createdAt: new Date("2026-10-01T09:00:00Z"),
    updatedAt: new Date("2026-10-01T09:00:00Z")
  },
  {
    title: "Monsoon Weather Warning",
    message: "Please expect delays on routes heading towards the central highlands due to heavy rain and fog.",
    publishedAt: new Date("2026-09-15T07:00:00Z"),
    targetAudience: "ALL",
    priority: "MEDIUM",
    status: "ARCHIVED",
    createdAt: new Date("2026-09-15T07:00:00Z"),
    updatedAt: new Date("2026-09-15T07:00:00Z")
  }
]);

print("Inserting Test Data into 'vehicle_documents'...");
db.vehicle_documents.insertMany([
  {
    vehicleId: 1,
    documentType: "INSURANCE",
    fileName: "ins_ND-4521_2026.pdf",
    url: "https://smartmove-storage.s3.amazonaws.com/docs/ins_ND-4521_2026.pdf",
    uploadedAt: new Date("2026-01-10T10:00:00Z"),
    status: "VALID"
  },
  {
    vehicleId: 1,
    documentType: "REGISTRATION",
    fileName: "reg_ND-4521.pdf",
    url: "https://smartmove-storage.s3.amazonaws.com/docs/reg_ND-4521.pdf",
    uploadedAt: new Date("2022-05-15T09:00:00Z"),
    status: "VALID"
  },
  {
    vehicleId: 3,
    documentType: "EMISSION_TEST",
    fileName: "eco_ND-8891_2025.pdf",
    url: "https://smartmove-storage.s3.amazonaws.com/docs/eco_ND-8891_2025.pdf",
    uploadedAt: new Date("2025-08-20T14:30:00Z"),
    status: "EXPIRED"
  },
  {
    vehicleId: 2,
    documentType: "ROUTE_PERMIT",
    fileName: "permit_ND-3210.pdf",
    url: "https://smartmove-storage.s3.amazonaws.com/docs/permit_ND-3210.pdf",
    uploadedAt: new Date("2026-03-01T11:15:00Z"),
    status: "VALID"
  }
]);

print("Inserting Test Data into 'trip_media'...");
db.trip_media.insertMany([
  {
    tripId: 1,
    routeId: 1,
    mediaType: "IMAGE",
    url: "https://smartmove-storage.s3.amazonaws.com/media/trip1_coach_exterior.jpg",
    caption: "Volvo 9900 ready for departure at Colombo.",
    uploadedAt: new Date("2026-10-15T07:45:00Z")
  },
  {
    tripId: 3,
    routeId: 3,
    mediaType: "IMAGE",
    url: "https://smartmove-storage.s3.amazonaws.com/media/trip3_scenery.jpg",
    caption: "Beautiful tea estates on the way to Nuwara Eliya.",
    uploadedAt: new Date("2026-09-25T08:30:00Z")
  },
  {
    tripId: 2,
    routeId: 2,
    mediaType: "VIDEO",
    url: "https://smartmove-storage.s3.amazonaws.com/media/trip2_highway_dashcam.mp4",
    caption: "Dashcam footage on the Southern Expressway.",
    uploadedAt: new Date("2026-10-10T09:30:00Z")
  }
]);

print("MongoDB Test Data Insertion Complete!");
