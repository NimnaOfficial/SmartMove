# SmartMove Transit System — Member 4 Implementation & Theory Guide
## Data Management 2 (CW No. 1)

* **Student Name:** K.G.L. Sandanimne  
* **Student ID:** COHNDSE261F-004  
* **Role:** Member 4 — MongoDB Setup, Schema Validation, Indexing, Seed Documents & Queries 3–4  
* **Assigned Database:** MongoDB NoSQL (Atlas / Local mongod)  
* **Key Files:** `mongo.js`

---

## 1. Overview of Member 4 Responsibilities

Member 4 is responsible for architecting and executing the non-relational (NoSQL) document layer of the SmartMove enterprise platform:
1. **MongoDB Collection Architecture:** Defining flexible, document-oriented collections (`reviews`, `announcements`, `vehicle_documents`, `trip_media`) to store unstructured and dynamic content that does not fit neatly into relational tables.
2. **Schema Validation Rules:** Enforcing structural integrity via MongoDB `$jsonSchema` validators to validate field types, mandatory properties, and allowed enumeration values while preserving schema evolution flexibility.
3. **Index Optimization:** Establishing single-field, compound, unique, and **Full-Text indexes** (`comment: "text"`) for sub-millisecond retrieval.
4. **Rich Hierarchical Seed Documents:** Populating collections with nested document arrays (e.g. legal compliance certificates with statuses `VALID`/`EXPIRED`, photo galleries with captions, dashcam video URLs).
5. **Operational Full-Text & Media Queries (Queries 3 & 4):**
   - **Query 3:** Full-text keyword search across customer complaints using text indexes, ranked by relevance score (`$meta: "textScore"`).
   - **Query 4A & 4B:** Targeted retrieval of vehicle compliance documents and trip multimedia assets.

---

## 2. Part-by-Part Code Breakdown & Lecture Note Mapping (`ALL.pdf`)

---

### Part 1: Collection Creation & JSON Schema Validators

#### Code Snippet (Example: `reviews` and `vehicle_documents`):
```javascript
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
```

#### What is it?
MongoDB Data Definition commands utilizing JSON Schema Draft 4 validation syntax (`$jsonSchema`) to enforce document contracts.

#### What does it do?
- **Type Checking:** Ensures attributes conform to specified BSON types (`number`, `string`, `array`, `object`, `date`).
- **Required Fields:** Mandates essential attributes (`routeId`, `passengerId`, `rating`, `comment`, `type`).
- **Value Constraints:** Enforces numeric ranges (`minimum: 1, maximum: 5` on star ratings) and strict enumerations (`enum: ["REVIEW", "COMPLAINT"]`).
- **Nested Array Validation:** In `vehicle_documents`, validates that the embedded `documents` array contains structured objects with valid compliance statuses (`VALID`, `EXPIRED`, `PENDING`).

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 143–157 (`Key Features of Non-Relational Databases`, `MongoDB Features`) & Slides 178–185 (`Create Database`, `Create Document`).
- *Slide 143–147:* Contrasts relational vs non-relational: NoSQL databases handle unstructured, semi-structured, and polymorphic data without rigid schema migrations.
- *Slide 183–185:* Explains document structure: In MongoDB, data is stored as BSON (Binary JSON) key-value documents. Using `$jsonSchema` validators provides the best of both worlds: runtime schema governance while maintaining document flexibility.

---

### Part 2: Index Creation & Full-Text Search Indexing

#### Code Snippet:
```javascript
// Single and compound indexes for fast lookup
db.reviews.createIndex({ routeId: 1 });
db.reviews.createIndex({ rating: -1 });

// Full-text search index on comment field (Required for Query 3)
db.reviews.createIndex({ comment: "text" });

db.announcements.createIndex({ status: 1 });
db.announcements.createIndex({ targetAudience: 1 });

db.vehicle_documents.createIndex({ vehicleId: 1 }, { unique: true });

db.trip_media.createIndex({ tripId: 1 });
db.trip_media.createIndex({ routeId: 1 });
```

#### What is it?
MongoDB Index creation commands that build B-Tree and Inverted-Index search structures.

#### What does it do?
- `db.reviews.createIndex({ routeId: 1 })`: Speeds up equality filters on route lookups from O(N) collection scans to O(log N) index lookups.
- `db.vehicle_documents.createIndex({ vehicleId: 1 }, { unique: true })`: Enforces uniqueness, preventing duplicate document envelopes for the same vehicle.
- `db.reviews.createIndex({ comment: "text" })`: **Full-Text Index:** Builds a tokenized inverted index over English words in customer feedback, enabling stemming, stop-word elimination, and linguistic keyword search.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 180–195 (`MongoDB Shell Operations`, Indexing & Sorting).
- Explains index efficiency: Without indexes, MongoDB must scan every document in a collection (`COLLSCAN`). With indexes (`IXSCAN`), memory usage is minimized and search query latency drops drastically.

---

### Part 3: Nested Documents & Embedded Document Arrays

#### Code Snippet:
```javascript
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
            }
        ],
        images: [
            {
                type: "EXTERIOR_FRONT",
                url: "https://smartmove-storage.s3.amazonaws.com/media/ND-4521_front.jpg",
                caption: "Volvo 9900 Luxury Coach - Front view"
            }
        ]
    }
]);
```

#### What is it?
Denormalized **Embedded Document Pattern** storing 1-to-Many relationships inside a single parent document envelope.

#### What does it do?
- Embeds multiple compliance certificates (`documents` array) and photos (`images` array) inside the parent vehicle document.
- In relational databases, retrieving this requires multi-table `JOIN` operations across 3 tables (`VEHICLE`, `VEHICLE_DOCS`, `VEHICLE_IMAGES`).
- In MongoDB, the entire vehicle profile is retrieved in a **single atomic read operation**, optimizing performance for mobile applications and real-time dispatch systems.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 188–192 (`Nested Document`).
- *Slide 188:* Teaches how nested documents and sub-arrays represent complex real-world entities naturally without requiring artificial foreign key surrogate tables.

---

### Part 4: Query 3 — Full-Text Keyword Search on Customer Complaints

#### Code Snippet:
```javascript
db.reviews.find(
    {
        $text: {
            $search: "delay breakdown"
        }
    },
    {
        score: { $meta: "textScore" },
        _id: 0,
        passengerId: 1,
        routeId: 1,
        rating: 1,
        type: 1,
        tags: 1,
        comment: 1,
        createdAt: 1
    }
).sort({ score: { $meta: "textScore" } });

-- Targeted check for COMPLAINT category:
db.reviews.find(
    { type: "COMPLAINT" },
    { _id: 0, routeId: 1, rating: 1, tags: 1, comment: 1 }
);
```

#### What is it?
MongoDB Text Search query utilizing the `$text` operator and relevance score projection (`$meta: "textScore"`).

#### What does it do?
- Scans the inverted text index for terms `"delay"` and `"breakdown"`.
- Projects a mathematical relevance score representing term frequency and proximity.
- Sorts results descending by relevance (`sort({ score: { $meta: "textScore" } })`), ensuring the most critical passenger complaints appear at the very top of customer service dashboards.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 193–197 (`Querying, Projection & Sorting`).
- *Slide 193:* Explains projection: Suppressing `_id: 0` and selecting only the required fields reduces network payload.
- *Slide 194–196:* Explains `.sort()`: Sorting by numeric attributes and metadata scores.

---

### Part 5: Query 4 — Vehicle Documents & Trip Multimedia Retrieval

#### Code Snippet:
```javascript
-- 4A. Retrieve compliance documents and images for Vehicle ID 1:
db.vehicle_documents.find(
    { vehicleId: 1 },
    { _id: 0, vehicleId: 1, registration: 1, documents: 1, images: 1 }
);

-- 4B. Retrieve operational multimedia (images & videos) for Trip ID 1:
db.trip_media.find(
    { tripId: 1 },
    { _id: 0, tripId: 1, routeId: 1, mediaType: 1, caption: 1, url: 1, uploadedAt: 1 }
).sort({ uploadedAt: -1 });
```

#### What is it?
Targeted document retrieval matching foreign keys from Oracle relational entities (`vehicleId: 1`, `tripId: 1`).

#### What does it do?
- Links Oracle transactional records to rich binary multimedia stored in cloud object storage (Amazon S3).
- Allows fleet inspectors to check vehicle insurance policies, revenue licenses, and emission certificates prior to clearing a bus for departure.
- Delivers passenger boarding photos and dashcam video surveillance for security verification.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 148–155 & Slides 180–185.
- Demonstrates the **Polyglot Persistence Architecture**: Using Oracle 21c for ACID financial transactions (Bookings, Payments, Seats) and MongoDB for dynamic multimedia metadata and documents.
