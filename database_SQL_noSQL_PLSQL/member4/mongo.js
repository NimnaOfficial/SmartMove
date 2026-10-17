
// Collection 1: reviews
// Stores unstructured passenger reviews, star ratings, and complaints
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
                type: { enum: ["REVIEW", "COMPLAINT"], description: "REVIEW or COMPLAINT" },
                tags: { bsonType: "array", items: { bsonType: "string" } },
                createdAt: { bsonType: ["date", "string"] }
            }
        }
    }
});

// Collection 2: announcements
// Stores travel bulletins, weather alerts, and maintenance notices
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
                status: { enum: ["ACTIVE", "ARCHIVED"] }
            }
        }
    }
});

// Collection 3: vehicle_documents
// Stores vehicle legal certificates (Insurance, License) and vehicle photos
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

// Collection 4: trip_media
// Stores trip-related photos, boarding snapshots, and highway dashcam footage
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


// -------------------------------------------------------------------
// 2. CREATE INDEXES FOR PERFORMANCE & SEARCH
// -------------------------------------------------------------------

// Indexes on reviews
db.reviews.createIndex({ routeId: 1 });
db.reviews.createIndex({ rating: -1 });

// Full-text index on comment field (Required for Query 3 keyword search)
db.reviews.createIndex({ comment: "text" });

// Indexes on announcements
db.announcements.createIndex({ status: 1 });
db.announcements.createIndex({ targetAudience: 1 });

// Indexes on vehicle_documents
db.vehicle_documents.createIndex({ vehicleId: 1 }, { unique: true });

// Indexes on trip_media
db.trip_media.createIndex({ tripId: 1 });
db.trip_media.createIndex({ routeId: 1 });


// -------------------------------------------------------------------
// 3. SAMPLE TEST DATA INSERTION
// -------------------------------------------------------------------

// Insert reviews (including complaints with keywords for Query 3)
db.reviews.insertMany([
    {
        routeId: 1,
        vehicleId: 1,
        driverId: 1,
        passengerId: 1,
        rating: 5,
        comment: "Excellent trip! The luxury coach was very comfortable and arrived on time in Kandy.",
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
        comment: "Good service on the expressway, but the air conditioning was a bit too cold.",
        type: "REVIEW",
        tags: ["Safe Driving", "Expressway"],
        createdAt: new Date("2026-10-10T12:00:00Z")
    },
    {
        routeId: 3,
        vehicleId: 4,
        driverId: 1,
        passengerId: 3,
        rating: 2,
        comment: "The bus suffered an unexpected breakdown near Kadugannawa. Delay of 2 hours waiting for replacement coach.",
        type: "COMPLAINT",
        tags: ["Delay", "Breakdown"],
        createdAt: new Date("2026-09-25T14:00:00Z")
    },
    {
        routeId: 4,
        vehicleId: 3,
        driverId: 3,
        passengerId: 4,
        rating: 5,
        comment: "Highly recommend this route. Beautiful scenery and very smooth ride to Matara.",
        type: "REVIEW",
        tags: ["Scenic", "Smooth"],
        createdAt: new Date("2026-08-15T09:00:00Z")
    },
    {
        routeId: 1,
        vehicleId: 1,
        driverId: 2,
        passengerId: 5,
        rating: 2,
        comment: "Departure delay of 45 minutes at Colombo terminal. No breakdown explanation given.",
        type: "COMPLAINT",
        tags: ["Delay", "Late Departure"],
        createdAt: new Date("2026-10-12T16:45:00Z")
    }
]);

// Insert announcements
db.announcements.insertMany([
    {
        title: "System Maintenance Notice",
        message: "SmartMove booking services will undergo scheduled database maintenance this Sunday from 2 AM to 4 AM.",
        publishedAt: new Date("2026-10-09T08:00:00Z"),
        targetAudience: "ALL",
        priority: "HIGH",
        status: "ACTIVE"
    },
    {
        title: "New Route Added: Colombo to Jaffna",
        message: "We are pleased to introduce our new luxury coach service connecting Colombo and Jaffna.",
        publishedAt: new Date("2026-10-05T10:00:00Z"),
        targetAudience: "PASSENGERS",
        priority: "MEDIUM",
        status: "ACTIVE"
    },
    {
        title: "Driver Safety Briefing",
        message: "All drivers must attend the mandatory monsoon season safety briefing at the central depot.",
        publishedAt: new Date("2026-10-01T09:00:00Z"),
        targetAudience: "DRIVERS",
        priority: "HIGH",
        status: "ACTIVE"
    }
]);

// Insert vehicle documents
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
            }
        ],
        images: [
            {
                type: "EXTERIOR_FRONT",
                url: "https://smartmove-storage.s3.amazonaws.com/media/ND-4521_front.jpg",
                caption: "Volvo 9900 Luxury Coach - Front view"
            },
            {
                type: "INTERIOR",
                url: "https://smartmove-storage.s3.amazonaws.com/media/ND-4521_interior.jpg",
                caption: "Executive recliners with air conditioning"
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
            }
        ],
        images: []
    },
    {
        vehicleId: 3,
        registration: "ND-8891",
        documents: [
            {
                type: "EMISSION_TEST",
                fileName: "eco_ND-8891_2025.pdf",
                url: "https://smartmove-storage.s3.amazonaws.com/docs/eco_ND-8891_2025.pdf",
                uploadedAt: new Date("2025-08-20T14:30:00Z"),
                status: "EXPIRED"
            }
        ],
        images: []
    }
]);

// Insert trip media
db.trip_media.insertMany([
    {
        tripId: 1,
        routeId: 1,
        mediaType: "IMAGE",
        url: "https://smartmove-storage.s3.amazonaws.com/media/trip1_departure.jpg",
        caption: "Volvo 9900 ready for departure at Colombo.",
        uploadedAt: new Date("2026-10-15T07:45:00Z")
    },
    {
        tripId: 2,
        routeId: 2,
        mediaType: "VIDEO",
        url: "https://smartmove-storage.s3.amazonaws.com/media/trip2_highway_dashcam.mp4",
        caption: "Dashcam video on Southern Expressway.",
        uploadedAt: new Date("2026-10-10T09:30:00Z")
    },
    {
        tripId: 3,
        routeId: 3,
        mediaType: "IMAGE",
        url: "https://smartmove-storage.s3.amazonaws.com/media/trip3_scenery.jpg",
        caption: "Tea estates on the route to Nuwara Eliya.",
        uploadedAt: new Date("2026-09-25T08:30:00Z")
    }
]);
