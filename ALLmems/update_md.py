import sys

content = """# SmartMove Full Implementation Guide - Member by Member

Based on the `SmartMove_Oracle_MongoDB_Practical_Work_Allocation_4_Members.md` and the advanced requirements from `ALL.pdf` and `DM2 CW -1 (1).pdf`, this guide provides the complete PL/SQL procedures, SQL queries, NoSQL MongoDB queries, and implementation steps allocated specifically to each team member. 

This covers all 5 Business Reports, Transactions, PL/SQL Functions, Triggers, and MongoDB queries defined in the requirement structure.

---

## Member 1 — Oracle Schema Foundation, References & Security

**Responsibility:** Master tables (`PASSENGER`, `DRIVER`, `VEHICLE`, `ROUTE`), primary keys, constraints, verifying IDs for MongoDB references, User Management, and Backup strategies.

### 1. Master Table Implementation (SQL)
Member 1 handles the fundamental structural logic.

```sql
-- Create unique sequences
CREATE SEQUENCE SEQ_PASSENGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_DRIVER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_VEHICLE START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_ROUTE START WITH 1 INCREMENT BY 1;

-- Creating Master Tables with Constraints
CREATE TABLE PASSENGER (
    PASSENGER_ID NUMBER(10) DEFAULT SEQ_PASSENGER.NEXTVAL PRIMARY KEY,
    FIRST_NAME VARCHAR2(100) NOT NULL,
    LAST_NAME VARCHAR2(100) NOT NULL,
    EMAIL VARCHAR2(150) NOT NULL UNIQUE,
    PHONE VARCHAR2(20) NOT NULL,
    PASSWORD_HASH VARCHAR2(255) NOT NULL,
    STATUS VARCHAR2(20) NOT NULL CHECK (STATUS IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    ROLE VARCHAR2(20) DEFAULT 'PASSENGER',
    REGISTERED_AT TIMESTAMP DEFAULT SYSDATE,
    UPDATED_AT TIMESTAMP
);
CREATE INDEX IDX_PASSENGER_EMAIL ON PASSENGER(EMAIL);

CREATE TABLE DRIVER (
    DRIVER_ID NUMBER(10) DEFAULT SEQ_DRIVER.NEXTVAL PRIMARY KEY,
    FIRST_NAME VARCHAR2(100) NOT NULL,
    LAST_NAME VARCHAR2(100) NOT NULL,
    EMAIL VARCHAR2(150) NOT NULL UNIQUE,
    PHONE VARCHAR2(20) NOT NULL,
    LICENSE_NUMBER VARCHAR2(50) NOT NULL UNIQUE,
    PASSWORD_HASH VARCHAR2(255) NOT NULL,
    STATUS VARCHAR2(20) NOT NULL CHECK (STATUS IN ('ACTIVE', 'INACTIVE', 'ON_TRIP', 'ON_LEAVE')),
    RATING NUMBER(3,2) CHECK (RATING BETWEEN 1 AND 5),
    TOTAL_TRIPS NUMBER(10) DEFAULT 0,
    ROLE VARCHAR2(20) DEFAULT 'DRIVER',
    CREATED_AT TIMESTAMP DEFAULT SYSDATE,
    UPDATED_AT TIMESTAMP
);
CREATE INDEX IDX_DRIVER_EMAIL ON DRIVER(EMAIL);

CREATE TABLE VEHICLE (
    VEHICLE_ID NUMBER(10) DEFAULT SEQ_VEHICLE.NEXTVAL PRIMARY KEY,
    REGISTRATION_NUMBER VARCHAR2(20) NOT NULL UNIQUE,
    TYPE VARCHAR2(50) NOT NULL,
    CAPACITY NUMBER(3) NOT NULL,
    MODEL VARCHAR2(100) NOT NULL,
    YEAR NUMBER(4) NOT NULL,
    STATUS VARCHAR2(20) NOT NULL CHECK (STATUS IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
    CREATED_AT TIMESTAMP DEFAULT SYSDATE,
    UPDATED_AT TIMESTAMP
);
CREATE INDEX IDX_VEHICLE_REG ON VEHICLE(REGISTRATION_NUMBER);

CREATE TABLE ROUTE (
    ROUTE_ID NUMBER(10) DEFAULT SEQ_ROUTE.NEXTVAL PRIMARY KEY,
    ORIGIN VARCHAR2(100) NOT NULL,
    DESTINATION VARCHAR2(100) NOT NULL,
    DISTANCE_KM NUMBER(5,2) NOT NULL,
    ESTIMATED_DURATION VARCHAR2(50),
    BASE_FARE NUMBER(10,2) NOT NULL,
    STATUS VARCHAR2(20) DEFAULT 'ACTIVE' CHECK (STATUS IN ('ACTIVE', 'INACTIVE')),
    CREATED_AT TIMESTAMP DEFAULT SYSDATE,
    UPDATED_AT TIMESTAMP
);
CREATE INDEX IDX_ROUTE_OD ON ROUTE(ORIGIN, DESTINATION);
```

### 2. User Management & Security Roles
Create dedicated database users and grant specific privileges instead of running the web application as the root `SYSTEM` or `ADMIN`.

```sql
-- Create a secure application role
CREATE ROLE smartmove_app_role NOT IDENTIFIED;

-- Grant necessary DML object privileges to the role
GRANT SELECT, INSERT, UPDATE, DELETE ON PASSENGER TO smartmove_app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON VEHICLE TO smartmove_app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ROUTE TO smartmove_app_role;

-- Create the web application user
CREATE USER smartmove_user IDENTIFIED BY "SecureAppPass2026";
GRANT CREATE SESSION TO smartmove_user;
GRANT smartmove_app_role TO smartmove_user;
```

### 3. Logical Backups (Data Pump / Export)
Establish a routine to safeguard database components against data loss.
Using Oracle Data Pump (`expdp`) to export the entire schema:
```bash
# Example backup command for the terminal
expdp smartmove_user/SecureAppPass2026@localhost:1521/XEPDB1 schemas=smartmove_user directory=BACKUP_DIR dumpfile=smartmove_backup.dmp logfile=expdp_smartmove.log
```

### 4. Validation Queries for MongoDB Reference
Member 1 must provide Member 4 with the valid IDs so MongoDB sample data doesn't orphan references.

```sql
-- Find Valid Vehicle IDs for MongoDB Vehicle Documents & Trip Media
SELECT VEHICLE_ID, REGISTRATION_NUMBER FROM VEHICLE WHERE STATUS = 'ACTIVE';

-- Find Valid Route IDs for MongoDB Reviews
SELECT ROUTE_ID, ORIGIN, DESTINATION FROM ROUTE;
```

---

## Member 2 — Oracle PL/SQL, Reports 1–3 and MongoDB Queries 1–2

**Responsibility:** Shared PL/SQL business functions, Exception Handling, Business Reports 1, 2, and 3 (Materialized Views), and MongoDB Aggregations.

### 1. PL/SQL Function with Exception Handling
Create a shared function that Member 3 can call when making a booking.

```sql
CREATE OR REPLACE FUNCTION CALCULATE_FARE(p_route_id IN NUMBER, p_seats IN NUMBER) RETURN NUMBER IS
    v_base_fare NUMBER;
BEGIN
    SELECT BASE_FARE INTO v_base_fare FROM ROUTE WHERE ROUTE_ID = p_route_id;
    RETURN v_base_fare * p_seats;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20001, 'Invalid Route ID provided for fare calculation.');
END CALCULATE_FARE;
/
```

### 2. Report 1: Most Frequently Used Routes (SQL)
```sql
SELECT r.ROUTE_ID, r.ORIGIN, r.DESTINATION, COUNT(b.BOOKING_ID) as TOTAL_BOOKINGS,
       RANK() OVER (ORDER BY COUNT(b.BOOKING_ID) DESC) as RANKING
FROM ROUTE r
LEFT JOIN TRIP t ON r.ROUTE_ID = t.ROUTE_ID
LEFT JOIN BOOKING b ON t.TRIP_ID = b.TRIP_ID AND b.STATUS != 'CANCELLED'
GROUP BY r.ROUTE_ID, r.ORIGIN, r.DESTINATION
ORDER BY RANKING;
```

### 3. Report 2: Revenue within a Period (Materialized View)
To optimize Report 2, create a Materialized View for faster data retrieval since this is an aggregated metric that is heavily queried by the Admin dashboard.

```sql
CREATE MATERIALIZED VIEW MV_MONTHLY_REVENUE
BUILD IMMEDIATE
REFRESH COMPLETE ON DEMAND
AS
SELECT TO_CHAR(PAYMENT_DATE, 'YYYY-MM') AS REVENUE_MONTH,
       SUM(AMOUNT) AS TOTAL_REVENUE,
       COUNT(PAYMENT_ID) AS TICKETS_SOLD
FROM PAYMENT
WHERE STATUS = 'SUCCESS'
GROUP BY TO_CHAR(PAYMENT_DATE, 'YYYY-MM');

-- To manually refresh the materialized view before the dashboard loads:
-- EXEC DBMS_MVIEW.REFRESH('MV_MONTHLY_REVENUE');
```

Alternatively, as a PL/SQL procedure using a Cursor:
```sql
CREATE OR REPLACE PROCEDURE REPORT_REVENUE(p_start_date IN DATE, p_end_date IN DATE) IS
    CURSOR rev_cursor IS
        SELECT SUM(AMOUNT) as TOTAL_REVENUE, COUNT(PAYMENT_ID) as TICKETS_SOLD, AVG(AMOUNT) as AVG_TICKET
        FROM PAYMENT
        WHERE STATUS = 'SUCCESS' 
          AND PAYMENT_DATE BETWEEN p_start_date AND p_end_date;
    v_rev rev_cursor%ROWTYPE;
BEGIN
    OPEN rev_cursor;
    FETCH rev_cursor INTO v_rev;
    DBMS_OUTPUT.PUT_LINE('Total Revenue (LKR): ' || NVL(v_rev.TOTAL_REVENUE, 0));
    DBMS_OUTPUT.PUT_LINE('Tickets Sold: ' || NVL(v_rev.TICKETS_SOLD, 0));
    DBMS_OUTPUT.PUT_LINE('Avg Ticket Value: ' || NVL(v_rev.AVG_TICKET, 0));
    CLOSE rev_cursor;
END REPORT_REVENUE;
/
```

### 4. Report 3: Passenger Travel History (SQL)
```sql
SELECT p.FIRST_NAME || ' ' || p.LAST_NAME AS PASSENGER_NAME,
       r.ORIGIN || ' to ' || r.DESTINATION AS ROUTE_DETAILS,
       t.DEPARTURE_TIME,
       v.REGISTRATION_NUMBER,
       b.STATUS as BOOKING_STATUS,
       pay.STATUS as PAYMENT_STATUS
FROM PASSENGER p
JOIN BOOKING b ON p.PASSENGER_ID = b.PASSENGER_ID
JOIN TRIP t ON b.TRIP_ID = t.TRIP_ID
JOIN ROUTE r ON t.ROUTE_ID = r.ROUTE_ID
JOIN VEHICLE v ON t.VEHICLE_ID = v.VEHICLE_ID
LEFT JOIN PAYMENT pay ON b.BOOKING_ID = pay.BOOKING_ID
WHERE p.PASSENGER_ID = 1 -- Replace with target passenger ID
ORDER BY t.DEPARTURE_TIME DESC;
```

### 5. MongoDB Query 1 & 2
```javascript
// Query 1: Reviews by route
db.reviews.find({ routeId: 1 }).sort({ createdAt: -1 });

// Query 2: Highest-rated vehicles/drivers (Aggregation)
db.reviews.aggregate([
  { $group: { _id: "$vehicleId", avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
  { $sort: { avgRating: -1, totalReviews: -1 } },
  { $limit: 10 }
]);
```

---

## Member 3 — Oracle Transactional Tables, Triggers & Reports 4–5

**Responsibility:** Tables (`TRIP`, `BOOKING`, `PAYMENT`, `MAINTENANCE`, `FEEDBACK`), maintaining strict transaction behaviors, updating seat capacities (Triggers), Explicit Cursors, and Reports 4 & 5.

### 1. Transactional Table Implementation (SQL)

```sql
-- 5. TRIP TABLE
CREATE SEQUENCE SEQ_TRIP START WITH 1 INCREMENT BY 1;
CREATE TABLE TRIP (
    TRIP_ID NUMBER(10) DEFAULT SEQ_TRIP.NEXTVAL PRIMARY KEY,
    ROUTE_ID NUMBER(10) NOT NULL,
    VEHICLE_ID NUMBER(10) NOT NULL,
    DRIVER_ID NUMBER(10) NOT NULL,
    DEPARTURE_TIME TIMESTAMP NOT NULL,
    ARRIVAL_TIME TIMESTAMP NOT NULL,
    AVAILABLE_SEATS NUMBER(3) NOT NULL,
    STATUS VARCHAR2(20) NOT NULL CHECK (STATUS IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    CREATED_AT TIMESTAMP DEFAULT SYSDATE,
    UPDATED_AT TIMESTAMP,
    CONSTRAINT FK_TRIP_ROUTE FOREIGN KEY (ROUTE_ID) REFERENCES ROUTE(ROUTE_ID),
    CONSTRAINT FK_TRIP_VEHICLE FOREIGN KEY (VEHICLE_ID) REFERENCES VEHICLE(VEHICLE_ID),
    CONSTRAINT FK_TRIP_DRIVER FOREIGN KEY (DRIVER_ID) REFERENCES DRIVER(DRIVER_ID)
);
CREATE INDEX IDX_TRIP_DEPARTURE ON TRIP(DEPARTURE_TIME);

-- 6. BOOKING TABLE
CREATE SEQUENCE SEQ_BOOKING START WITH 1 INCREMENT BY 1;
CREATE TABLE BOOKING (
    BOOKING_ID NUMBER(10) DEFAULT SEQ_BOOKING.NEXTVAL PRIMARY KEY,
    PASSENGER_ID NUMBER(10) NOT NULL,
    TRIP_ID NUMBER(10) NOT NULL,
    SEATS_BOOKED NUMBER(2) NOT NULL,
    TOTAL_FARE NUMBER(10,2) NOT NULL,
    STATUS VARCHAR2(20) NOT NULL CHECK (STATUS IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
    PAYMENT_STATUS VARCHAR2(20) NOT NULL CHECK (PAYMENT_STATUS IN ('UNPAID', 'PAID', 'REFUNDED')),
    BOOKING_DATE TIMESTAMP DEFAULT SYSDATE,
    UPDATED_AT TIMESTAMP,
    CONSTRAINT FK_BOOKING_PASSENGER FOREIGN KEY (PASSENGER_ID) REFERENCES PASSENGER(PASSENGER_ID),
    CONSTRAINT FK_BOOKING_TRIP FOREIGN KEY (TRIP_ID) REFERENCES TRIP(TRIP_ID)
);
CREATE INDEX IDX_BOOKING_PASSENGER ON BOOKING(PASSENGER_ID);

-- 7. PAYMENT TABLE
CREATE SEQUENCE SEQ_PAYMENT START WITH 1 INCREMENT BY 1;
CREATE TABLE PAYMENT (
    PAYMENT_ID NUMBER(10) DEFAULT SEQ_PAYMENT.NEXTVAL PRIMARY KEY,
    BOOKING_ID NUMBER(10) NOT NULL,
    AMOUNT NUMBER(10,2) NOT NULL,
    PAYMENT_METHOD VARCHAR2(50) NOT NULL,
    PAYMENT_DATE TIMESTAMP DEFAULT SYSDATE,
    STATUS VARCHAR2(20) NOT NULL CHECK (STATUS IN ('SUCCESS', 'FAILED', 'REFUNDED')),
    TRANSACTION_REF VARCHAR2(100) UNIQUE,
    CONSTRAINT FK_PAYMENT_BOOKING FOREIGN KEY (BOOKING_ID) REFERENCES BOOKING(BOOKING_ID)
);

-- 8. MAINTENANCE TABLE
CREATE SEQUENCE SEQ_MAINTENANCE START WITH 1 INCREMENT BY 1;
CREATE TABLE MAINTENANCE (
    MAINTENANCE_ID NUMBER(10) DEFAULT SEQ_MAINTENANCE.NEXTVAL PRIMARY KEY,
    VEHICLE_ID NUMBER(10) NOT NULL,
    DESCRIPTION VARCHAR2(255) NOT NULL,
    COST NUMBER(10,2) NOT NULL,
    MAINTENANCE_DATE DATE NOT NULL,
    STATUS VARCHAR2(20) NOT NULL CHECK (STATUS IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
    CREATED_AT TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT FK_MAINTENANCE_VEHICLE FOREIGN KEY (VEHICLE_ID) REFERENCES VEHICLE(VEHICLE_ID)
);
CREATE INDEX IDX_MAINTENANCE_VEHICLE ON MAINTENANCE(VEHICLE_ID);

-- 9. FEEDBACK TABLE
CREATE SEQUENCE SEQ_FEEDBACK START WITH 1 INCREMENT BY 1;
CREATE TABLE FEEDBACK (
    FEEDBACK_ID NUMBER(10) DEFAULT SEQ_FEEDBACK.NEXTVAL PRIMARY KEY,
    PASSENGER_ID NUMBER(10) NOT NULL,
    TRIP_ID NUMBER(10),
    TYPE VARCHAR2(20) NOT NULL CHECK (TYPE IN ('COMPLAINT', 'SUGGESTION', 'APPRECIATION')),
    DESCRIPTION VARCHAR2(500) NOT NULL,
    STATUS VARCHAR2(20) DEFAULT 'OPEN' CHECK (STATUS IN ('OPEN', 'REVIEWING', 'RESOLVED')),
    CREATED_AT TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT FK_FEEDBACK_PASSENGER FOREIGN KEY (PASSENGER_ID) REFERENCES PASSENGER(PASSENGER_ID),
    CONSTRAINT FK_FEEDBACK_TRIP FOREIGN KEY (TRIP_ID) REFERENCES TRIP(TRIP_ID)
);
```

### 2. Database Trigger: Update Available Seats automatically
Instead of manual updates, ensure seats are handled correctly at the database level.

```sql
CREATE OR REPLACE TRIGGER TRG_MANAGE_SEATS
AFTER INSERT OR UPDATE OF STATUS ON BOOKING
FOR EACH ROW
BEGIN
    -- Decrease seats when confirmed
    IF INSERTING AND :NEW.STATUS = 'CONFIRMED' THEN
        UPDATE TRIP SET AVAILABLE_SEATS = AVAILABLE_SEATS - :NEW.SEATS_BOOKED WHERE TRIP_ID = :NEW.TRIP_ID;
    -- Increase seats when cancelled
    ELSIF UPDATING AND :OLD.STATUS = 'CONFIRMED' AND :NEW.STATUS = 'CANCELLED' THEN
        UPDATE TRIP SET AVAILABLE_SEATS = AVAILABLE_SEATS + :OLD.SEATS_BOOKED WHERE TRIP_ID = :OLD.TRIP_ID;
    END IF;
END;
/
```

### 3. PL/SQL Transaction: Booking Process
Handles booking end-to-end safely. Rolls back entirely if constraints fail.

```sql
CREATE OR REPLACE PROCEDURE MAKE_BOOKING(
    p_passenger_id IN NUMBER, p_trip_id IN NUMBER, p_seats IN NUMBER
) IS
    v_avail_seats NUMBER;
    v_route_id NUMBER;
    v_fare NUMBER;
BEGIN
    -- 1. Lock trip row to prevent race conditions
    SELECT AVAILABLE_SEATS, ROUTE_ID INTO v_avail_seats, v_route_id
    FROM TRIP WHERE TRIP_ID = p_trip_id FOR UPDATE;
    
    -- 2. Validate capacities
    IF v_avail_seats < p_seats THEN
        RAISE_APPLICATION_ERROR(-20002, 'Insufficient available seats.');
    END IF;
    
    -- 3. Calculate fare using Member 2's function
    v_fare := CALCULATE_FARE(v_route_id, p_seats);
    
    -- 4. Create booking
    INSERT INTO BOOKING (PASSENGER_ID, TRIP_ID, SEATS_BOOKED, TOTAL_FARE, STATUS, PAYMENT_STATUS)
    VALUES (p_passenger_id, p_trip_id, p_seats, v_fare, 'CONFIRMED', 'UNPAID');
    
    COMMIT;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20003, 'Requested trip does not exist.');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END MAKE_BOOKING;
/
```

### 4. Processing Data using Cursor FOR LOOP
Use an explicit cursor to process multiple rows. For example, automatically marking completed trips.

```sql
CREATE OR REPLACE PROCEDURE UPDATE_COMPLETED_TRIPS IS
    -- Declare an explicit cursor
    CURSOR c_past_trips IS
        SELECT TRIP_ID, DEPARTURE_TIME FROM TRIP
        WHERE STATUS IN ('SCHEDULED', 'IN_PROGRESS') AND ARRIVAL_TIME < SYSDATE;
BEGIN
    -- Cursor FOR LOOP handles opening, fetching, and closing automatically
    FOR trip_rec IN c_past_trips LOOP
        UPDATE TRIP SET STATUS = 'COMPLETED' WHERE TRIP_ID = trip_rec.TRIP_ID;
        DBMS_OUTPUT.PUT_LINE('Trip ' || trip_rec.TRIP_ID || ' marked as COMPLETED.');
    END LOOP;
    COMMIT;
END UPDATE_COMPLETED_TRIPS;
/
```

### 5. Report 4: Vehicles Due for Maintenance (SQL)
Addresses the missing `NEXT_MAINTENANCE_DATE` by dynamically applying a 6-month rule.

```sql
SELECT v.VEHICLE_ID, v.REGISTRATION_NUMBER, 
       MAX(m.MAINTENANCE_DATE) AS LAST_MAINTENANCE_DATE,
       ADD_MONTHS(MAX(m.MAINTENANCE_DATE), 6) AS DUE_DATE,
       v.STATUS
FROM VEHICLE v
LEFT JOIN MAINTENANCE m ON v.VEHICLE_ID = m.VEHICLE_ID
GROUP BY v.VEHICLE_ID, v.REGISTRATION_NUMBER, v.STATUS
HAVING ADD_MONTHS(MAX(m.MAINTENANCE_DATE), 6) < SYSDATE OR MAX(m.MAINTENANCE_DATE) IS NULL
ORDER BY DUE_DATE ASC;
```

### 6. Report 5: Trip Occupancy and Performance (SQL)
```sql
SELECT t.TRIP_ID, r.ORIGIN || ' - ' || r.DESTINATION AS ROUTE_NAME,
       v.CAPACITY,
       (v.CAPACITY - t.AVAILABLE_SEATS) AS BOOKED_SEATS,
       ROUND(((v.CAPACITY - t.AVAILABLE_SEATS) / v.CAPACITY) * 100, 2) AS OCCUPANCY_PERCENTAGE,
       NVL(SUM(pay.AMOUNT), 0) AS GENERATED_REVENUE
FROM TRIP t
JOIN ROUTE r ON t.ROUTE_ID = r.ROUTE_ID
JOIN VEHICLE v ON t.VEHICLE_ID = v.VEHICLE_ID
LEFT JOIN BOOKING b ON t.TRIP_ID = b.TRIP_ID AND b.STATUS != 'CANCELLED'
LEFT JOIN PAYMENT pay ON b.BOOKING_ID = pay.BOOKING_ID AND pay.STATUS = 'SUCCESS'
GROUP BY t.TRIP_ID, r.ORIGIN, r.DESTINATION, v.CAPACITY, t.AVAILABLE_SEATS
ORDER BY OCCUPANCY_PERCENTAGE DESC;
```

---

## Member 4 — MongoDB Collections, Nested Documents, Indexes & Queries 3–4

**Responsibility:** MongoDB setup, Nested Documents, creating indexes, inserting records referencing Oracle IDs, and queries for searching and retrieving documents.

### 1. MongoDB Setup & Indexes (NoSQL)
Create collections and text indexes to allow Query 3 to function properly.

```javascript
// 1. REVIEWS COLLECTION
db.createCollection("reviews");
db.reviews.createIndex({ routeId: 1 });
db.reviews.createIndex({ rating: -1 });
db.reviews.createIndex({ comment: "text" }); // Required for Query 3

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
```

### 2. Nested Documents
MongoDB schemas must support nested document flexibility. For `vehicle_documents`, embed multiple document objects (arrays) inside a single parent document to avoid relational "joins".

```javascript
db.vehicle_documents.insertOne({
  vehicleId: 1,
  registration: "ND-4521",
  documents: [
    { type: "INSURANCE", url: "https://storage/ins1.pdf", status: "VALID" },
    { type: "PERMIT", url: "https://storage/perm1.pdf", status: "EXPIRED" }
  ],
  images: [
    { type: "IMAGE", url: "https://storage/front.jpg", caption: "Front View" }
  ]
});
```

### 3. Update and Delete Operations
Demonstrate updating embedded attributes using `$set` or `$inc` and deleting stale records to maintain storage.

```javascript
// Update a nested array item (e.g., mark a permit as VALID)
db.vehicle_documents.updateOne(
  { vehicleId: 1, "documents.type": "PERMIT" },
  { $set: { "documents.$.status": "VALID" } }
);

// Delete all archived announcements older than a certain date
db.announcements.deleteMany({
  status: "ARCHIVED",
  publishedAt: { $lt: ISODate("2025-01-01T00:00:00Z") }
});
```

### 4. MongoDB Query 3: Keyword Search
Using the text index to search inside `comment` for complaints/feedback.

```javascript
// Search reviews containing 'delay', 'late', or 'break'
db.reviews.find(
  { $text: { $search: "delay late break" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });
```

### 5. MongoDB Query 4: Vehicle Documents & Trip Multimedia Retrieval
```javascript
// Retrieve valid documents for a specific vehicle (e.g., vehicleId: 1)
db.vehicle_documents.find({ 
  vehicleId: 1, 
  status: "VALID" 
}, { 
  fileName: 1, url: 1, uploadedAt: 1, _id: 0 
});

// Retrieve dashcam footage / multimedia for a specific trip
db.trip_media.find({ 
  tripId: 2 
}).sort({ uploadedAt: -1 });
```
"""

with open(r'C:\Users\SANDANIMNE\Desktop\code ss\SmartMove\SmartMove\ALLmems\SmartMove_Full_Member_Implementation_Guide.md', 'w') as f:
    f.write(content)

print("Updated Markdown")
