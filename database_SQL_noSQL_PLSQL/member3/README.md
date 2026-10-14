# SmartMove Transit System — Member 3 Implementation & Theory Guide
## Data Management 2 (CW No. 1)

* **Student Name:** D.D. Kandeepan  
* **Student ID:** COHNDSE261F-028  
* **Role:** Member 3 — Transactional Engine, Database Triggers, Concurrency Procedures & Reports 4–5  
* **Assigned Database:** Oracle Database 21c Express Edition (XE)  
* **Key Files:** `oracle.sql` / `orcale.sql`

---

## 1. Overview of Member 3 Responsibilities

Member 3 is responsible for the operational transactional heartbeat of the SmartMove enterprise transit platform:
1. **Transactional Schema (3NF):** Creating the core operational tables (`TRIP`, `BOOKING`, `PAYMENT`, `MAINTENANCE`, `FEEDBACK`) and enforcing referential integrity with Member 1's master tables.
2. **Database Trigger (`TRG_MANAGE_SEATS`):** Implementing a row-level trigger to automate seat decrement, restoration, and adjustment synchronously with booking lifecycle states.
3. **Concurrency-Safe Stored Procedures:**
   - `MAKE_BOOKING`: Implements **pessimistic row-level locking (`SELECT ... FOR UPDATE`)** to prevent race conditions during concurrent passenger seat reservations.
   - `CANCEL_BOOKING`: Atomically cancels bookings and handles payment refund status transitions.
   - `UPDATE_COMPLETED_TRIPS`: Timetable-driven procedure marking elapsed trips as completed.
4. **Preventative Maintenance & Operational Capacity Reports (Reports 4 & 5):**
   - **Report 4:** Fleet Maintenance Due Analysis using date math (`ADD_MONTHS(..., 6)`).
   - **Report 5:** Trip Operational Performance & Seat Occupancy Analysis.

---

## 2. Part-by-Part Code Breakdown & Lecture Note Mapping (`ALL.pdf`)

---

### Part 1: Transactional Tables DDL & Referential Integrity

#### Code Snippet (Example: `TRIP` and `BOOKING`):
```sql
CREATE TABLE TRIP (
    TRIP_ID          NUMBER(10)     DEFAULT SEQ_TRIP.NEXTVAL,
    ROUTE_ID         NUMBER(10)     NOT NULL,
    VEHICLE_ID       NUMBER(10)     NOT NULL,
    DRIVER_ID        NUMBER(10)     NOT NULL,
    DEPARTURE_TIME   TIMESTAMP      NOT NULL,
    ARRIVAL_TIME     TIMESTAMP      NOT NULL,
    AVAILABLE_SEATS  NUMBER(3)      NOT NULL,
    STATUS           VARCHAR2(20)   DEFAULT 'SCHEDULED' NOT NULL,
    CREATED_AT       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UPDATED_AT       TIMESTAMP,

    CONSTRAINT PK_TRIP PRIMARY KEY (TRIP_ID),
    CONSTRAINT FK_TRIP_ROUTE FOREIGN KEY (ROUTE_ID) REFERENCES ROUTE (ROUTE_ID),
    CONSTRAINT FK_TRIP_VEHICLE FOREIGN KEY (VEHICLE_ID) REFERENCES VEHICLE (VEHICLE_ID),
    CONSTRAINT FK_TRIP_DRIVER FOREIGN KEY (DRIVER_ID) REFERENCES DRIVER (DRIVER_ID),
    CONSTRAINT CK_TRIP_TIME CHECK (ARRIVAL_TIME > DEPARTURE_TIME),
    CONSTRAINT CK_TRIP_SEATS CHECK (AVAILABLE_SEATS >= 0),
    CONSTRAINT CK_TRIP_STATUS CHECK (STATUS IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DELAYED'))
);

CREATE TABLE BOOKING (
    BOOKING_ID      NUMBER(10)     DEFAULT SEQ_BOOKING.NEXTVAL,
    PASSENGER_ID    NUMBER(10)     NOT NULL,
    TRIP_ID         NUMBER(10)     NOT NULL,
    SEATS_BOOKED    NUMBER(2)      NOT NULL,
    TOTAL_FARE      NUMBER(10,2)   NOT NULL,
    STATUS          VARCHAR2(20)   DEFAULT 'CONFIRMED' NOT NULL,
    PAYMENT_STATUS  VARCHAR2(20)   DEFAULT 'UNPAID' NOT NULL,
    BOOKING_TIME    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UPDATED_AT      TIMESTAMP,

    CONSTRAINT PK_BOOKING PRIMARY KEY (BOOKING_ID),
    CONSTRAINT FK_BOOKING_PASSENGER FOREIGN KEY (PASSENGER_ID) REFERENCES PASSENGER (PASSENGER_ID),
    CONSTRAINT FK_BOOKING_TRIP FOREIGN KEY (TRIP_ID) REFERENCES TRIP (TRIP_ID),
    CONSTRAINT CK_BOOKING_SEATS CHECK (SEATS_BOOKED BETWEEN 1 AND 10),
    CONSTRAINT CK_BOOKING_FARE CHECK (TOTAL_FARE > 0),
    CONSTRAINT CK_BOOKING_STATUS CHECK (STATUS IN ('CONFIRMED', 'CANCELLED', 'PENDING', 'COMPLETED')),
    CONSTRAINT CK_BOOKING_PAYSTATUS CHECK (PAYMENT_STATUS IN ('UNPAID', 'PAID', 'REFUNDED'))
);
```

#### What is it?
Relational DDL establishing the operational relationships connecting Passengers, Trips, Routes, Buses, and Drivers.

#### What does it do?
- Enforces strict foreign keys (`REFERENCES ROUTE`, `REFERENCES VEHICLE`, `REFERENCES PASSENGER`).
- Enforces chronological validity: `CHECK (ARRIVAL_TIME > DEPARTURE_TIME)`.
- Prevents overbooking at the schema level: `CHECK (AVAILABLE_SEATS >= 0)`. If available seats drop below 0, Oracle aborts the transaction with an integrity violation.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Relational Integrity & Constraint Validation.
- Schema constraints enforce ACID properties (Atomicity, Consistency, Isolation, Durability), guaranteeing that invalid bookings can never be persisted.

---

### Part 2: Database Trigger `TRG_MANAGE_SEATS`

#### Code Snippet:
```sql
CREATE OR REPLACE TRIGGER TRG_MANAGE_SEATS
AFTER INSERT OR UPDATE OR DELETE ON BOOKING
FOR EACH ROW
BEGIN
    -- Scenario A: New booking inserted
    IF INSERTING THEN
        IF :NEW.STATUS = 'CONFIRMED' THEN
            UPDATE TRIP
            SET AVAILABLE_SEATS = AVAILABLE_SEATS - :NEW.SEATS_BOOKED
            WHERE TRIP_ID = :NEW.TRIP_ID;
        END IF;

    -- Scenario B: Booking updated (e.g. cancelled)
    ELSIF UPDATING THEN
        IF :OLD.STATUS = 'CONFIRMED' AND :NEW.STATUS = 'CANCELLED' THEN
            UPDATE TRIP
            SET AVAILABLE_SEATS = AVAILABLE_SEATS + :OLD.SEATS_BOOKED
            WHERE TRIP_ID = :NEW.TRIP_ID;
        ELSIF :OLD.STATUS = 'CONFIRMED' AND :NEW.STATUS = 'CONFIRMED' AND :OLD.SEATS_BOOKED != :NEW.SEATS_BOOKED THEN
            UPDATE TRIP
            SET AVAILABLE_SEATS = AVAILABLE_SEATS + (:OLD.SEATS_BOOKED - :NEW.SEATS_BOOKED)
            WHERE TRIP_ID = :NEW.TRIP_ID;
        END IF;

    -- Scenario C: Booking deleted
    ELSIF DELETING THEN
        IF :OLD.STATUS = 'CONFIRMED' THEN
            UPDATE TRIP
            SET AVAILABLE_SEATS = AVAILABLE_SEATS + :OLD.SEATS_BOOKED
            WHERE TRIP_ID = :OLD.TRIP_ID;
        END IF;
    END IF;
END;
/
```

#### What is it?
A Row-Level Database Trigger that fires automatically in response to DML operations on the `BOOKING` table.

#### What does it do?
- `AFTER INSERT OR UPDATE OR DELETE`: Executes after the modifying statement succeeds.
- `FOR EACH ROW`: Fires once for every row affected by the DML operation.
- **Correlation Qualifiers (`:NEW` and `:OLD`):**
  - On `INSERT`: Decrements `AVAILABLE_SEATS` on the associated `TRIP` row using `:NEW.SEATS_BOOKED`.
  - On `UPDATE` (status changes to `CANCELLED`): Restores the seats using `:OLD.SEATS_BOOKED`.
  - On `DELETE`: Restores the reserved seats back to the fleet inventory.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 71–75 (`PL/SQL Trigger`).
- *Slide 71–72:* Defines a Trigger: A stored PL/SQL block associated with a table that Oracle executes automatically when a specific SQL event occurs.
- *Slide 73–74:* Explains **Trigger Timing** (`BEFORE` vs `AFTER`), **Trigger Levels** (Statement-level vs Row-level with `FOR EACH ROW`), and **Trigger Event Predicates** (`IF INSERTING THEN`, `ELSIF UPDATING THEN`, `ELSIF DELETING THEN`).
- *Slide 75:* Explains **`:NEW` and `:OLD` pseudo-records**: In row-level triggers, `:OLD` represents column values before the modification, and `:NEW` represents the proposed values.

---

### Part 3: Stored Procedure `MAKE_BOOKING` (Pessimistic Concurrency Locking)

#### Code Snippet:
```sql
CREATE OR REPLACE PROCEDURE MAKE_BOOKING (
    p_passenger_id IN NUMBER,
    p_trip_id      IN NUMBER,
    p_seats        IN NUMBER
) AS
    v_avail_seats  TRIP.AVAILABLE_SEATS%TYPE;
    v_route_id     TRIP.ROUTE_ID%TYPE;
    v_base_fare    ROUTE.BASE_FARE%TYPE;
    v_total_fare   NUMBER(10,2);
BEGIN
    IF p_seats <= 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Seat count must be at least 1.');
    END IF;

    -- Lock the trip record exclusively for concurrency protection
    SELECT AVAILABLE_SEATS, ROUTE_ID
    INTO v_avail_seats, v_route_id
    FROM TRIP
    WHERE TRIP_ID = p_trip_id
    FOR UPDATE;

    IF v_avail_seats < p_seats THEN
        RAISE_APPLICATION_ERROR(-20002, 'Not enough seats available. Available seats: ' || v_avail_seats);
    END IF;

    SELECT BASE_FARE INTO v_base_fare
    FROM ROUTE
    WHERE ROUTE_ID = v_route_id;

    v_total_fare := v_base_fare * p_seats;

    INSERT INTO BOOKING (
        BOOKING_ID, PASSENGER_ID, TRIP_ID, SEATS_BOOKED, TOTAL_FARE, STATUS, PAYMENT_STATUS, BOOKING_TIME
    ) VALUES (
        SEQ_BOOKING.NEXTVAL, p_passenger_id, p_trip_id, p_seats, v_total_fare, 'CONFIRMED', 'UNPAID', SYSDATE
    );

    COMMIT;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20003, 'Trip ID ' || p_trip_id || ' does not exist.');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END MAKE_BOOKING;
/
```

#### What is it?
A transactional Stored Procedure implementing **row-level locking (`SELECT ... FOR UPDATE`)** to guarantee ACID Isolation during ticket reservation.

#### What does it do?
- **Pessimistic Concurrency Control:** When a passenger initiates a booking, `SELECT ... FOR UPDATE` acquires an exclusive lock on that specific `TRIP` row in the database buffer cache.
- Any concurrent passenger attempting to book the same trip is queued until the first transaction completes.
- Verifies that `v_avail_seats >= p_seats`. If seats are insufficient, rolls back and raises error `-20002`.
- Computes `TOTAL_FARE` and records the booking. Trigger `TRG_MANAGE_SEATS` automatically decrements available seats.
- Issues `COMMIT` to persist changes and release the row lock.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 34–40 (`Cursors` and Row Locking) & Slides 55–64 (`PL/SQL Procedure`).
- Explains **`SELECT ... FOR UPDATE`**: In multi-user transaction environments, simple `SELECT` queries are vulnerable to "race conditions" where two users see 1 seat available and both purchase it. `FOR UPDATE` serializes access by acquiring exclusive locks, eliminating double-booking hazards.
- *Slide 87–92:* Demonstrates transaction rollback (`ROLLBACK`) inside exception blocks to maintain database state consistency.

---

### Part 4: Reports 4 & 5 (Fleet Maintenance & Seat Occupancy)

#### Code Snippet (Report 4 — Vehicles Due for Maintenance):
```sql
SELECT 
    v.VEHICLE_ID,
    v.REGISTRATION,
    v.MODEL,
    v.TYPE,
    MAX(m.MAINTENANCE_DATE) AS LAST_SERVICING_DATE,
    ADD_MONTHS(MAX(m.MAINTENANCE_DATE), 6) AS DUE_DATE
FROM VEHICLE v
LEFT JOIN MAINTENANCE m ON v.VEHICLE_ID = m.VEHICLE_ID
GROUP BY v.VEHICLE_ID, v.REGISTRATION, v.MODEL, v.TYPE
HAVING MAX(m.MAINTENANCE_DATE) IS NULL 
    OR ADD_MONTHS(MAX(m.MAINTENANCE_DATE), 6) <= SYSDATE
ORDER BY DUE_DATE ASC;
```

#### What is it?
Analytical SQL report utilizing date manipulation functions (`ADD_MONTHS`, `SYSDATE`), grouping aggregates (`MAX`), and post-aggregation filtering (`HAVING`).

#### What does it do?
- Implements the SmartMove 6-month preventive servicing compliance policy.
- Identifies buses that have never received maintenance (`MAX(m.MAINTENANCE_DATE) IS NULL`) or whose last inspection was more than 6 months ago (`ADD_MONTHS(...) <= SYSDATE`).
- Prevents non-compliant buses from being assigned to high-speed expressway trips.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** SQL Date Arithmetic & Aggregate Filtering (`HAVING` clause).
- Explains the critical difference between `WHERE` (filters rows before aggregation) and `HAVING` (filters aggregate results calculated by `GROUP BY`).
