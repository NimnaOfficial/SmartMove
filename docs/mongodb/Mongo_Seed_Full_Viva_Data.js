// ===================================================================
// SMARTMOVE ENTERPRISE TRANSIT SYSTEM
// MongoDB Full Viva Demonstration Seed Script
// Database: smartmove
// Purpose : Sets up collections, JSON Schema validators, indexes,
//           and populates rich test data for live viva examination.
// ===================================================================

// Automatically detect database casing (SMARTMOVE on Atlas or smartmove on Local)
var currentDb = db.getName();
var targetDb = "SMARTMOVE";

try {
    var existingDbs = db.getMongo().getDBNames();
    var found = existingDbs.find(function(n) { return n.toUpperCase() === "SMARTMOVE"; });
    if (found) {
        targetDb = found;
    } else if (currentDb && currentDb.toUpperCase() === "SMARTMOVE") {
        targetDb = currentDb;
    }
} catch (e) {
    if (currentDb && currentDb.toUpperCase() === "SMARTMOVE") {
        targetDb = currentDb;
    }
}

db = db.getSiblingDB(targetDb);

print("===================================================================");
print("  SMARTMOVE - INITIALIZING MONGODB FOR LIVE VIVA DEMONSTRATION     ");
print("  Database target: " + db.getName());
print("===================================================================");

// -------------------------------------------------------------------
// 1. CLEAR EXISTING COLLECTIONS
// -------------------------------------------------------------------
print("\n[Step 1] Dropping existing collections for clean data initialization...");
db.reviews.drop();
db.announcements.drop();
db.vehicle_documents.drop();
db.trip_media.drop();
print(" -> Existing collections dropped.");


// -------------------------------------------------------------------
// 2. CREATE COLLECTIONS WITH JSON SCHEMA VALIDATORS
// -------------------------------------------------------------------
print("\n[Step 2] Creating collections with JSON Schema validation rules...");

// 2.1 reviews collection
db.createCollection("reviews", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["routeId", "passengerId", "rating", "comment", "type"],
            properties: {
                routeId: { bsonType: "number", description: "Route ID from Oracle" },
                vehicleId: { bsonType: ["number", "null"], description: "Vehicle ID from Oracle" },
                driverId: { bsonType: ["number", "null"], description: "Driver ID from Oracle" },
                passengerId: { bsonType: "number", description: "Passenger ID from Oracle" },
                rating: { bsonType: "number", minimum: 1, maximum: 5, description: "Rating between 1 and 5" },
                comment: { bsonType: "string", description: "Feedback or complaint comment" },
                type: { enum: ["REVIEW", "COMPLAINT"], description: "Feedback category: REVIEW or COMPLAINT" },
                tags: { bsonType: "array", items: { bsonType: "string" } },
                createdAt: { bsonType: ["date", "string"] }
            }
        }
    }
});
print(" -> Collection 'reviews' created.");

// 2.2 announcements collection
db.createCollection("announcements", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "message", "targetAudience", "priority", "status"],
            properties: {
                title: { bsonType: "string" },
                message: { bsonType: "string" },
                publishedAt: { bsonType: ["date", "string"] },
                targetAudience: { enum: ["ALL", "PASSENGERS", "DRIVERS"] },
                priority: { enum: ["LOW", "MEDIUM", "HIGH"] },
                status: { enum: ["ACTIVE", "ARCHIVED"] },
                createdAt: { bsonType: ["date", "string"] },
                updatedAt: { bsonType: ["date", "string"] }
            }
        }
    }
});
print(" -> Collection 'announcements' created.");

// 2.3 vehicle_documents collection
db.createCollection("vehicle_documents", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["vehicleId", "registration", "documents"],
            properties: {
                vehicleId: { bsonType: "number" },
                registration: { bsonType: "string" },
                documents: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["type", "fileName", "url", "status"],
                        properties: {
                            type: { enum: ["INSURANCE", "REGISTRATION", "REVENUE_LICENSE", "EMISSION_TEST", "ROUTE_PERMIT"] },
                            fileName: { bsonType: "string" },
                            url: { bsonType: "string" },
                            uploadedAt: { bsonType: ["date", "string"] },
                            status: { enum: ["VALID", "EXPIRED", "PENDING"] }
                        }
                    }
                },
                images: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["url"],
                        properties: {
                            type: { bsonType: "string" },
                            url: { bsonType: "string" },
                            caption: { bsonType: "string" }
                        }
                    }
                }
            }
        }
    }
});
print(" -> Collection 'vehicle_documents' created.");

// 2.4 trip_media collection
db.createCollection("trip_media", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["tripId", "mediaType", "url"],
            properties: {
                tripId: { bsonType: "number" },
                routeId: { bsonType: "number" },
                mediaType: { enum: ["IMAGE", "VIDEO"] },
                url: { bsonType: "string" },
                caption: { bsonType: "string" },
                uploadedAt: { bsonType: ["date", "string"] }
            }
        }
    }
});
print(" -> Collection 'trip_media' created.");


// -------------------------------------------------------------------
// 3. CREATE PERFORMANCE & FULL-TEXT INDEXES
// -------------------------------------------------------------------
print("\n[Step 3] Creating performance indexes & full-text search index...");

// Reviews indexes
db.reviews.createIndex({ routeId: 1 }, { name: "idx_reviews_routeId" });
db.reviews.createIndex({ vehicleId: 1 }, { name: "idx_reviews_vehicleId" });
db.reviews.createIndex({ driverId: 1 }, { name: "idx_reviews_driverId" });
db.reviews.createIndex({ rating: -1 }, { name: "idx_reviews_rating_desc" });
db.reviews.createIndex({ type: 1 }, { name: "idx_reviews_type" });

// FULL-TEXT SEARCH INDEX on 'comment' field (Required for Query 3!)
db.reviews.createIndex(
    { comment: "text" },
    { name: "idx_reviews_comment_text", default_language: "english" }
);

// Announcements indexes
db.announcements.createIndex({ status: 1, targetAudience: 1 });
db.announcements.createIndex({ publishedAt: -1 });

// Vehicle documents index
db.vehicle_documents.createIndex({ vehicleId: 1 }, { unique: true });

// Trip media indexes
db.trip_media.createIndex({ tripId: 1 });
db.trip_media.createIndex({ routeId: 1 });
db.trip_media.createIndex({ uploadedAt: -1 });

print(" -> Indexes created successfully (including full-text index on reviews.comment).");


// -------------------------------------------------------------------
// 4. INGEST RICH TEST DATA
// -------------------------------------------------------------------
print("\n[Step 4] Ingesting realistic test data for live viva queries...");

// 4.1 Ingest Reviews (15 diverse records specifically matching Query 1, Query 2, and Query 3)
db.reviews.insertMany([
    // Route 1 (Colombo to Kandy) - Vehicle 1, Driver 1
    {
        routeId: 1,
        vehicleId: 1,
        driverId: 1,
        passengerId: 1,
        rating: 5,
        comment: "Excellent trip! The luxury coach was extremely comfortable and arrived on time in Kandy without any delay.",
        type: "REVIEW",
        tags: ["On Time", "Comfortable", "Clean", "Polite Driver"],
        createdAt: new Date("2026-10-15T11:30:00Z")
    },
    {
        routeId: 1,
        vehicleId: 1,
        driverId: 1,
        passengerId: 2,
        rating: 5,
        comment: "Outstanding service! Comfortable reclining seats and clean cabin. The journey was smooth and punctual.",
        type: "REVIEW",
        tags: ["Clean", "Smooth Ride", "Punctual"],
        createdAt: new Date("2026-10-14T09:15:00Z")
    },
    {
        routeId: 1,
        vehicleId: 1,
        driverId: 2,
        passengerId: 3,
        rating: 4,
        comment: "Very good highway driving. The coach was clean, but slight delay at Kadugannawa due to minor road work.",
        type: "REVIEW",
        tags: ["Safe Driving", "Expressway"],
        createdAt: new Date("2026-10-13T14:20:00Z")
    },
    {
        routeId: 1,
        vehicleId: 1,
        driverId: 2,
        passengerId: 5,
        rating: 2,
        comment: "Departure delay of 45 minutes at Colombo terminal. No breakdown explanation given to waiting passengers.",
        type: "COMPLAINT",
        tags: ["Delay", "Late Departure", "Poor Communication"],
        createdAt: new Date("2026-10-12T16:45:00Z")
    },
    {
        routeId: 1,
        vehicleId: 2,
        driverId: 1,
        passengerId: 4,
        rating: 5,
        comment: "Great experience travelling on Route 1. Fast boarding and very courteous staff.",
        type: "REVIEW",
        tags: ["Fast Boarding", "Friendly"],
        createdAt: new Date("2026-10-11T08:00:00Z")
    },

    // Route 2 (Colombo to Galle Expressway) - Vehicle 2, Driver 2
    {
        routeId: 2,
        vehicleId: 2,
        driverId: 2,
        passengerId: 2,
        rating: 4,
        comment: "Good service on the expressway, but the air conditioning was a bit too cold throughout the journey.",
        type: "REVIEW",
        tags: ["Safe Driving", "Expressway", "AC Issue"],
        createdAt: new Date("2026-10-10T12:00:00Z")
    },
    {
        routeId: 2,
        vehicleId: 2,
        driverId: 2,
        passengerId: 1,
        rating: 5,
        comment: "Fastest trip to Galle! Scania coach was in top condition and reached Galle within 1 hour 45 minutes.",
        type: "REVIEW",
        tags: ["Speedy", "Expressway", "Top Condition"],
        createdAt: new Date("2026-10-09T17:30:00Z")
    },
    {
        routeId: 2,
        vehicleId: 2,
        driverId: 3,
        passengerId: 3,
        rating: 4,
        comment: "Comfortable seats and polite driver. Arrived strictly according to timetable.",
        type: "REVIEW",
        tags: ["Punctual", "Comfortable"],
        createdAt: new Date("2026-10-08T10:15:00Z")
    },

    // Route 3 (Kandy to Nuwara Eliya) - Vehicle 4, Driver 1
    {
        routeId: 3,
        vehicleId: 4,
        driverId: 1,
        passengerId: 3,
        rating: 1,
        comment: "The bus suffered an unexpected breakdown near Kadugannawa. Major delay of 2 hours waiting for replacement coach.",
        type: "COMPLAINT",
        tags: ["Delay", "Breakdown", "Mechanical Failure"],
        createdAt: new Date("2026-09-25T14:00:00Z")
    },
    {
        routeId: 3,
        vehicleId: 4,
        driverId: 3,
        passengerId: 5,
        rating: 2,
        comment: "Engine breakdown in the hills caused a massive delay of 90 minutes. Maintenance check is urgently needed.",
        type: "COMPLAINT",
        tags: ["Breakdown", "Delay", "Engine Trouble"],
        createdAt: new Date("2026-09-28T11:00:00Z")
    },
    {
        routeId: 3,
        vehicleId: 3,
        driverId: 1,
        passengerId: 2,
        rating: 4,
        comment: "Beautiful mountain views on the way to Nuwara Eliya. Careful driving on sharp hairpin bends.",
        type: "REVIEW",
        tags: ["Scenic", "Safe Driving"],
        createdAt: new Date("2026-09-30T15:45:00Z")
    },

    // Route 4 (Colombo to Matara) - Vehicle 3, Driver 3
    {
        routeId: 4,
        vehicleId: 3,
        driverId: 3,
        passengerId: 4,
        rating: 5,
        comment: "Highly recommend this route. Beautiful ocean scenery, polite driver and very smooth ride to Matara.",
        type: "REVIEW",
        tags: ["Scenic", "Smooth Ride", "Polite Driver"],
        createdAt: new Date("2026-08-15T09:00:00Z")
    },
    {
        routeId: 4,
        vehicleId: 3,
        driverId: 3,
        passengerId: 1,
        rating: 5,
        comment: "Punctual departure, spacious seating, and zero delays. Exceptional journey on the Southern Expressway.",
        type: "REVIEW",
        tags: ["Punctual", "Spacious", "Clean"],
        createdAt: new Date("2026-08-20T16:00:00Z")
    },
    {
        routeId: 4,
        vehicleId: 1,
        driverId: 2,
        passengerId: 5,
        rating: 3,
        comment: "Journey was okay, but ticketing system had a slight delay during check-in.",
        type: "REVIEW",
        tags: ["Check-in Delay"],
        createdAt: new Date("2026-09-02T13:10:00Z")
    },
    {
        routeId: 1,
        vehicleId: 4,
        driverId: 2,
        passengerId: 2,
        rating: 2,
        comment: "Severe AC breakdown during the afternoon heat. Uncomfortable trip with 30 minutes delay arriving in Kandy.",
        type: "COMPLAINT",
        tags: ["Breakdown", "Delay", "AC Breakdown"],
        createdAt: new Date("2026-10-04T15:30:00Z")
    }
]);
print(" -> Inserted 15 rich review documents.");


// 4.2 Ingest Announcements
db.announcements.insertMany([
    {
        title: "System Maintenance Notice",
        message: "SmartMove booking services will undergo scheduled database maintenance this Sunday from 2 AM to 4 AM.",
        publishedAt: new Date("2026-10-09T08:00:00Z"),
        targetAudience: "ALL",
        priority: "HIGH",
        status: "ACTIVE",
        createdAt: new Date("2026-10-09T08:00:00Z"),
        updatedAt: new Date("2026-10-09T08:00:00Z")
    },
    {
        title: "New Route Added: Colombo to Jaffna Superline",
        message: "We are pleased to introduce our new luxury sleeper coach service connecting Colombo Bastian Mawatha and Jaffna Central Station.",
        publishedAt: new Date("2026-10-05T10:00:00Z"),
        targetAudience: "PASSENGERS",
        priority: "MEDIUM",
        status: "ACTIVE",
        createdAt: new Date("2026-10-05T10:00:00Z"),
        updatedAt: new Date("2026-10-05T10:00:00Z")
    },
    {
        title: "Mandatory Driver Monsoon Safety Briefing",
        message: "All rostered drivers must attend the mandatory monsoon season road safety briefing at the Central Depot on October 20th.",
        publishedAt: new Date("2026-10-01T09:00:00Z"),
        targetAudience: "DRIVERS",
        priority: "HIGH",
        status: "ACTIVE",
        createdAt: new Date("2026-10-01T09:00:00Z"),
        updatedAt: new Date("2026-10-01T09:00:00Z")
    },
    {
        title: "Hill Country Monsoon Weather Warning",
        message: "Heavy fog and rains reported along Route 3 (Kandy to Nuwara Eliya). Please anticipate 20-30 minutes delay for safety.",
        publishedAt: new Date("2026-09-15T07:00:00Z"),
        targetAudience: "ALL",
        priority: "MEDIUM",
        status: "ARCHIVED",
        createdAt: new Date("2026-09-15T07:00:00Z"),
        updatedAt: new Date("2026-09-15T07:00:00Z")
    },
    {
        title: "Kandy Esala Perahera Special Holiday Transit",
        message: "Special express coaches will operate hourly from Colombo to Kandy throughout the Perahera festival week.",
        publishedAt: new Date("2026-08-01T12:00:00Z"),
        targetAudience: "PASSENGERS",
        priority: "MEDIUM",
        status: "ACTIVE",
        createdAt: new Date("2026-08-01T12:00:00Z"),
        updatedAt: new Date("2026-08-01T12:00:00Z")
    }
]);
print(" -> Inserted 5 announcement documents.");


// 4.3 Ingest Vehicle Documents (4 complete vehicles with nested certificates & photos)
db.vehicle_documents.insertMany([
    {
        vehicleId: 1,
        registration: "ND-4521",
        documents: [
            {
                type: "INSURANCE",
                fileName: "ins_ND-4521_2026.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/ins_ND-4521_2026.pdf",
                uploadedAt: new Date("2026-01-10T10:00:00Z"),
                status: "VALID"
            },
            {
                type: "REGISTRATION",
                fileName: "reg_ND-4521.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/reg_ND-4521.pdf",
                uploadedAt: new Date("2022-05-15T09:00:00Z"),
                status: "VALID"
            },
            {
                type: "REVENUE_LICENSE",
                fileName: "rev_ND-4521_2026.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/rev_ND-4521_2026.pdf",
                uploadedAt: new Date("2026-01-05T09:30:00Z"),
                status: "VALID"
            },
            {
                type: "EMISSION_TEST",
                fileName: "eco_ND-4521_2026.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/eco_ND-4521_2026.pdf",
                uploadedAt: new Date("2026-01-08T11:00:00Z"),
                status: "VALID"
            },
            {
                type: "ROUTE_PERMIT",
                fileName: "permit_ND-4521.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/permit_ND-4521.pdf",
                uploadedAt: new Date("2026-01-02T14:00:00Z"),
                status: "VALID"
            }
        ],
        images: [
            {
                type: "EXTERIOR_FRONT",
                url: "https://smartmove-storage.s3.amazonaws.com/media/ND-4521_front.jpg",
                caption: "Volvo 9900 Luxury Coach - Front exterior view"
            },
            {
                type: "INTERIOR_CABIN",
                url: "https://smartmove-storage.s3.amazonaws.com/media/ND-4521_interior.jpg",
                caption: "Executive reclining seats with individual USB charging"
            },
            {
                type: "EXTERIOR_SIDE",
                url: "https://smartmove-storage.s3.amazonaws.com/media/ND-4521_side.jpg",
                caption: "Highway livery and luggage bay"
            }
        ]
    },
    {
        vehicleId: 2,
        registration: "ND-3210",
        documents: [
            {
                type: "INSURANCE",
                fileName: "ins_ND-3210_2026.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/ins_ND-3210_2026.pdf",
                uploadedAt: new Date("2026-02-14T08:00:00Z"),
                status: "VALID"
            },
            {
                type: "ROUTE_PERMIT",
                fileName: "permit_ND-3210.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/permit_ND-3210.pdf",
                uploadedAt: new Date("2026-03-01T11:15:00Z"),
                status: "VALID"
            },
            {
                type: "REGISTRATION",
                fileName: "reg_ND-3210.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/reg_ND-3210.pdf",
                uploadedAt: new Date("2023-04-10T10:00:00Z"),
                status: "VALID"
            }
        ],
        images: [
            {
                type: "EXTERIOR_SIDE",
                url: "https://smartmove-storage.s3.amazonaws.com/media/ND-3210_side.jpg",
                caption: "Scania Touring HD - Expressway livery"
            },
            {
                type: "DRIVER_CAB",
                url: "https://smartmove-storage.s3.amazonaws.com/media/ND-3210_driver.jpg",
                caption: "Ergonomic driver cockpit with digital instrument cluster"
            }
        ]
    },
    {
        vehicleId: 3,
        registration: "ND-8891",
        documents: [
            {
                type: "INSURANCE",
                fileName: "ins_ND-8891_2026.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/ins_ND-8891_2026.pdf",
                uploadedAt: new Date("2026-06-11T10:00:00Z"),
                status: "VALID"
            },
            {
                type: "EMISSION_TEST",
                fileName: "eco_ND-8891_2025.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/eco_ND-8891_2025.pdf",
                uploadedAt: new Date("2025-08-20T14:30:00Z"),
                status: "EXPIRED" // Shows realistic compliance monitoring!
            },
            {
                type: "REVENUE_LICENSE",
                fileName: "rev_ND-8891_2026.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/rev_ND-8891_2026.pdf",
                uploadedAt: new Date("2026-02-10T09:00:00Z"),
                status: "VALID"
            }
        ],
        images: [
            {
                type: "DEPOT_CHECK",
                url: "https://smartmove-storage.s3.amazonaws.com/media/ND-8891_depot.jpg",
                caption: "Ashok Leyland Viking undergoing daily maintenance check"
            }
        ]
    },
    {
        vehicleId: 4,
        registration: "WP-CAD-1029",
        documents: [
            {
                type: "INSURANCE",
                fileName: "ins_WP-CAD-1029_2026.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/ins_WP-CAD-1029_2026.pdf",
                uploadedAt: new Date("2026-10-01T08:00:00Z"),
                status: "PENDING" // Demonstrates pending status workflow!
            },
            {
                type: "REGISTRATION",
                fileName: "reg_WP-CAD-1029.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/reg_WP-CAD-1029.pdf",
                uploadedAt: new Date("2024-01-15T09:00:00Z"),
                status: "VALID"
            }
        ],
        images: [
            {
                type: "VIP_SEATING",
                url: "https://smartmove-storage.s3.amazonaws.com/media/WP-CAD-1029_vip.jpg",
                caption: "Yutong ZK6122HD 2+1 Luxury VIP leather seats"
            }
        ]
    }
]);
print(" -> Inserted 4 vehicle document profiles with nested compliance arrays.");


// 4.4 Ingest Trip Multimedia (8 assets across multiple scheduled trips)
db.trip_media.insertMany([
    // Trip 1 (Colombo to Kandy)
    {
        tripId: 1,
        routeId: 1,
        mediaType: "IMAGE",
        url: "https://smartmove-storage.s3.amazonaws.com/media/trip1_departure.jpg",
        caption: "Volvo 9900 ready for departure at Colombo Bastian Mawatha terminal.",
        uploadedAt: new Date("2026-10-15T07:45:00Z")
    },
    {
        tripId: 1,
        routeId: 1,
        mediaType: "IMAGE",
        url: "https://smartmove-storage.s3.amazonaws.com/media/trip1_boarding.jpg",
        caption: "On-schedule passenger QR ticket scanning and boarding at Platform 3.",
        uploadedAt: new Date("2026-10-15T08:00:00Z")
    },
    {
        tripId: 1,
        routeId: 1,
        mediaType: "IMAGE",
        url: "https://smartmove-storage.s3.amazonaws.com/media/trip1_kadugannawa.jpg",
        caption: "Scenic ascent through Kadugannawa mountain pass under clear weather.",
        uploadedAt: new Date("2026-10-15T09:40:00Z")
    },

    // Trip 2 (Colombo to Galle)
    {
        tripId: 2,
        routeId: 2,
        mediaType: "VIDEO",
        url: "https://smartmove-storage.s3.amazonaws.com/media/trip2_highway_dashcam.mp4",
        caption: "HD Dashcam footage: Clear cruising conditions on Southern Expressway E01.",
        uploadedAt: new Date("2026-10-10T09:30:00Z")
    },
    {
        tripId: 2,
        routeId: 2,
        mediaType: "IMAGE",
        url: "https://smartmove-storage.s3.amazonaws.com/media/trip2_galle_arrival.jpg",
        caption: "Punctual arrival at Galle Central Bus Stand terminal.",
        uploadedAt: new Date("2026-10-10T11:00:00Z")
    },

    // Trip 3 (Kandy to Nuwara Eliya)
    {
        tripId: 3,
        routeId: 3,
        mediaType: "IMAGE",
        url: "https://smartmove-storage.s3.amazonaws.com/media/trip3_scenery.jpg",
        caption: "Picturesque tea plantation estates near Ramboda Falls on Route 3.",
        uploadedAt: new Date("2026-09-25T08:30:00Z")
    },
    {
        tripId: 3,
        routeId: 3,
        mediaType: "VIDEO",
        url: "https://smartmove-storage.s3.amazonaws.com/media/trip3_fog_dashcam.mp4",
        caption: "Dashcam record: Heavy hill country mist requiring fog lamp illumination.",
        uploadedAt: new Date("2026-09-25T09:15:00Z")
    },

    // Trip 4 (Colombo to Matara)
    {
        tripId: 4,
        routeId: 4,
        mediaType: "IMAGE",
        url: "https://smartmove-storage.s3.amazonaws.com/media/trip4_matara.jpg",
        caption: "Arrival and baggage offloading at Matara terminal bay.",
        uploadedAt: new Date("2026-10-20T16:30:00Z")
    }
]);
print(" -> Inserted 8 multimedia assets.");

print("\n===================================================================");
print("  DATA INGESTION COMPLETE! CURRENT DOCUMENT COUNTS:                ");
print("===================================================================");
print(" - reviews            : " + db.reviews.countDocuments() + " documents");
print(" - announcements      : " + db.announcements.countDocuments() + " documents");
print(" - vehicle_documents  : " + db.vehicle_documents.countDocuments() + " documents");
print(" - trip_media         : " + db.trip_media.countDocuments() + " documents");
print("===================================================================");
print("  ALL 4 VIVA QUERIES ARE READY TO EXECUTE!                         ");
print("===================================================================\n");
