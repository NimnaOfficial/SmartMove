# SmartMove — EER & Relational Schema Technical Documentation

This directory contains the database design artifacts for the **SmartMove Enterprise Transit System**, bridging the early Phase 1 Conceptual EER modeling and the final Phase 2 Third Normal Form (3NF) Oracle 21c physical schema.

---

## Deliverables in this Directory

| File | Type | Description |
|---|---|---|
| [`DM02_SCHEMA_3NF.pdf`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/diagrams/DM02_SCHEMA_3NF.pdf) | **Vector PDF** | High-resolution production 3NF relational schema diagram with all 9 tables, PKs, FKs, and data types. |
| [`DM02_SCHEMA_3NF.png`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/diagrams/DM02_SCHEMA_3NF.png) | **Raster Image** | 300 DPI diagram embedded directly into Slide 6 and Slide 7 of the Viva PowerPoint presentation. |
| [`DM02_ER_3NF.pdf`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/diagrams/DM02_ER_3NF.pdf) | **Vector PDF** | Enhanced Entity-Relationship (EER) diagram reflecting the production normalized design. |
| [`DM02_ER.pdf`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/diagrams/DM02_ER.pdf) | Original PDF | Phase 1 Conceptual EER model submitted in initial coursework milestones. |
| [`DM02_SCHEMA.pdf`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/diagrams/DM02_SCHEMA.pdf) | Original PDF | Phase 1 Logical Schema diagram submitted in initial coursework milestones. |

---

## Evolution: Conceptual Model (Phase 1) ➔ Normalized 3NF Schema (Phase 2)

During database implementation in Oracle Database 21c XE and Spring Boot JPA, the conceptual data model was refined to **Third Normal Form (3NF)** to ensure transactional integrity, eliminate partial/transitive dependencies, and optimize concurrency.

### Key Normalization Refinements:

1. **Decoupling Driver from Vehicle into Trip:**
   * *Phase 1 Concept:* `VEHICLE` table had a `DRIVER_ID` foreign key.
   * *3NF Physical Design:* In real-world fleet transit, drivers are not statically bound to a single bus. Multiple drivers operate different shifts on the same vehicle. Therefore, `DRIVER_ID` and `VEHICLE_ID` are both referenced dynamically in the **`TRIP`** junction table.

2. **Standardizing Date & Time Representation:**
   * *Phase 1 Concept:* Separate `departure_date`, `departure_time`, `arrival_time` as text/date strings.
   * *3NF Physical Design:* Converted to standard Oracle `TIMESTAMP` columns (`DEPARTURE_TIME`, `ARRIVAL_TIME`) supporting microsecond precision, timezone calculations, and chronological indexing (`IDX_TRIP_DEPARTURE`).

3. **Booking Seat & Fare Columns:**
   * *Phase 1 Concept:* `ticket_quantity` and `total_amount`.
   * *3NF Physical Design:* Formatted as `SEATS_BOOKED NUMBER(2)` and `TOTAL_FARE NUMBER(10,2)` to align with Oracle monetary standards and the deterministic PL/SQL fare calculation engine `CALCULATE_FARE(route_id, seats)`.

4. **Multi-Criteria Feedback Partitioning (Hybrid DB Synergy):**
   * *Phase 1 Concept:* Storing star ratings, tags, and reviews directly in the Oracle `FEEDBACK` table.
   * *3NF Physical Design:* Transactional customer complaints remain in Oracle `FEEDBACK` (`PASSENGER_ID`, `TRIP_ID`, `TYPE`, `DESCRIPTION`, `STATUS`). Unstructured passenger reviews, multi-criteria star ratings, and tags are stored in MongoDB `db.reviews` with full-text search indexing (`$text`).

---

## 3NF Relational Tables Specification

### 1. `PASSENGER` (Member 1)
* **Primary Key:** `PASSENGER_ID` (backed by `SEQ_PASSENGER`)
* **Columns:** `FIRST_NAME`, `LAST_NAME`, `EMAIL` (Unique), `PHONE`, `PASSWORD_HASH`, `STATUS` (`ACTIVE`, `INACTIVE`, `SUSPENDED`), `ROLE` (Default `'PASSENGER'`), `REGISTERED_AT`, `UPDATED_AT`.

### 2. `DRIVER` (Member 1)
* **Primary Key:** `DRIVER_ID` (backed by `SEQ_DRIVER`)
* **Columns:** `FIRST_NAME`, `LAST_NAME`, `EMAIL` (Unique), `PHONE`, `LICENSE_NUMBER` (Unique), `PASSWORD_HASH`, `STATUS` (`ACTIVE`, `INACTIVE`, `ON_TRIP`, `ON_LEAVE`), `RATING` (Check 1.00..5.00), `TOTAL_TRIPS`, `ROLE` (Default `'DRIVER'`), `CREATED_AT`.

### 3. `VEHICLE` (Member 1)
* **Primary Key:** `VEHICLE_ID` (backed by `SEQ_VEHICLE`)
* **Columns:** `REGISTRATION_NUMBER` (Unique), `TYPE`, `CAPACITY`, `MODEL`, `YEAR`, `STATUS` (`ACTIVE`, `INACTIVE`, `MAINTENANCE`), `CREATED_AT`.

### 4. `ROUTE` (Member 1)
* **Primary Key:** `ROUTE_ID` (backed by `SEQ_ROUTE`)
* **Columns:** `ORIGIN`, `DESTINATION`, `DISTANCE_KM`, `ESTIMATED_DURATION`, `BASE_FARE`, `STATUS` (`ACTIVE`, `INACTIVE`), `CREATED_AT`.
* **Index:** Composite index `IDX_ROUTE_OD` on `(ORIGIN, DESTINATION)`.

### 5. `TRIP` (Member 3)
* **Primary Key:** `TRIP_ID` (backed by `SEQ_TRIPS`)
* **Foreign Keys:** `ROUTE_ID` -> `ROUTE(ROUTE_ID)`, `VEHICLE_ID` -> `VEHICLE(VEHICLE_ID)`, `DRIVER_ID` -> `DRIVER(DRIVER_ID)`
* **Columns:** `DEPARTURE_TIME`, `ARRIVAL_TIME`, `AVAILABLE_SEATS`, `STATUS` (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`), `CREATED_AT`.
* **Index:** `IDX_TRIP_DEPARTURE` on `DEPARTURE_TIME`.

### 6. `BOOKING` (Member 3)
* **Primary Key:** `BOOKING_ID` (backed by `SEQ_BOOKING`)
* **Foreign Keys:** `PASSENGER_ID` -> `PASSENGER(PASSENGER_ID)`, `TRIP_ID` -> `TRIP(TRIP_ID)`
* **Columns:** `SEATS_BOOKED`, `TOTAL_FARE`, `STATUS` (`PENDING`, `CONFIRMED`, `CANCELLED`), `PAYMENT_STATUS` (`UNPAID`, `PAID`, `REFUNDED`), `BOOKING_DATE`.
* **Index:** `IDX_BOOKING_PASSENGER` on `PASSENGER_ID`.
* **Trigger:** `TRG_MANAGE_SEATS` automatically increments/decrements `TRIP.AVAILABLE_SEATS`.

### 7. `PAYMENT` (Member 3)
* **Primary Key:** `PAYMENT_ID` (backed by `SEQ_PAYMENT`)
* **Foreign Key:** `BOOKING_ID` -> `BOOKING(BOOKING_ID)`
* **Columns:** `AMOUNT`, `PAYMENT_METHOD` (`CREDIT_CARD`, `DEBIT_CARD`), `PAYMENT_DATE`, `STATUS` (`SUCCESS`, `FAILED`, `REFUNDED`), `TRANSACTION_REF` (Unique).

### 8. `MAINTENANCE` (Member 3)
* **Primary Key:** `MAINTENANCE_ID` (backed by `SEQ_MAINTENANCE`)
* **Foreign Key:** `VEHICLE_ID` -> `VEHICLE(VEHICLE_ID)`
* **Columns:** `DESCRIPTION`, `COST`, `MAINTENANCE_DATE`, `STATUS` (`PENDING`, `IN_PROGRESS`, `COMPLETED`), `CREATED_AT`.
* **Index:** `IDX_MAINTENANCE_VEHICLE` on `VEHICLE_ID`.

### 9. `FEEDBACK` (Member 3)
* **Primary Key:** `FEEDBACK_ID` (backed by `SEQ_FEEDBACK`)
* **Foreign Keys:** `PASSENGER_ID` -> `PASSENGER(PASSENGER_ID)`, `TRIP_ID` -> `TRIP(TRIP_ID)` (Nullable)
* **Columns:** `TYPE` (`COMPLAINT`, `SUGGESTION`, `APPRECIATION`), `DESCRIPTION`, `STATUS` (`OPEN`, `REVIEWING`, `RESOLVED`), `CREATED_AT`.
