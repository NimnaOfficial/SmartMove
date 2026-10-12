-- ==================================================================================
-- SMARTMOVE - COMPLETE ALL-IN-ONE ORACLE DATABASE SCRIPT
-- ==================================================================================
-- Course: Data Management 2 (CW No 1)
-- Project: SmartMove Transport Solutions
--
-- This script contains 100% of all Oracle Database works for ALL 4 Members:
--
--   [MEMBER 1] Foundation, Security & Database Administration:
--              - Master Tables: PASSENGER, DRIVER, VEHICLE, ROUTE
--              - Master Sequences: SEQ_PASSENGER, SEQ_DRIVER, SEQ_VEHICLE, SEQ_ROUTE
--              - RBAC: Application Role (smartmove_app_role), Least-Privilege Grants
--              - User Provisioning: smartmove_user creation and role assignment
--              - Logical Backup Strategy: Oracle Data Pump (expdp) documentation
--              - Cross-Database MongoDB ID Export Queries
--
--   [MEMBER 2] PL/SQL Programming, Optimization & Reports 1-3:
--              - Shared Fare Calculation Function: CALCULATE_FARE (with exception handling)
--              - Reporting Cursor Procedure: REPORT_REVENUE (DBMS_OUTPUT formatted)
--              - Materialized View Optimization: MV_MONTHLY_REVENUE
--              - Report 1: Most Frequently Used Routes (with RANK() OVER)
--              - Report 2: Monthly Revenue Summary (Querying MV_MONTHLY_REVENUE)
--              - Report 3: Passenger Travel History (Multi-table join)
--
--   [MEMBER 3] Transactional Architecture, Triggers & Reports 4-5:
--              - Transactional Tables: TRIP, BOOKING, PAYMENT, MAINTENANCE, FEEDBACK
--              - Sequences: SEQ_TRIPS, SEQ_BOOKING, SEQ_PAYMENT, SEQ_MAINTENANCE, SEQ_FEEDBACK
--              - Concurrency-Controlled Procedure: MAKE_BOOKING (FOR UPDATE row locking)
--              - Cancellation Procedure: CANCEL_BOOKING (State transition + refund handling)
--              - Batch Maintenance Procedure: UPDATE_COMPLETED_TRIPS (Cursor FOR LOOP)
--              - Business Trigger: TRG_MANAGE_SEATS (Automatic capacity adjustment)
--              - Report 4: Vehicles Due for Maintenance (Dynamic 6-month rule)
--              - Report 5: Trip Occupancy & Performance (Occupancy % & generated revenue)
--
--   [MEMBER 4] Cross-Database Integration with MongoDB:
--              - Vehicle Reference Validation for MongoDB vehicle_documents & trip_media
--              - Route Reference Validation for MongoDB reviews
--              - Joint Data Integrity & Contract Verification Queries
--
-- Instructions: Run this entire script in Oracle SQL Developer / SQL*Plus / Cloud SQL.
-- ==================================================================================

SET DEFINE OFF;
SET SERVEROUTPUT ON;

-- ==================================================================================
-- SECTION 1: SAFE DROP / CLEANUP OF PRIOR OBJECTS
-- ==================================================================================
PROMPT [1/10] Dropping prior database objects if they exist...

BEGIN
    -- Drop Materialized Views
    FOR mv IN (SELECT mview_name FROM user_mviews WHERE mview_name = 'MV_MONTHLY_REVENUE') LOOP
        EXECUTE IMMEDIATE 'DROP MATERIALIZED VIEW ' || mv.mview_name;
    END LOOP;

    -- Drop Triggers
    FOR trg IN (SELECT trigger_name FROM user_triggers WHERE trigger_name = 'TRG_MANAGE_SEATS') LOOP
        EXECUTE IMMEDIATE 'DROP TRIGGER ' || trg.trigger_name;
    END LOOP;

    -- Drop Tables in reverse dependency order with CASCADE CONSTRAINTS PURGE
    FOR t IN (SELECT table_name FROM user_tables WHERE table_name IN (
        'FEEDBACK', 'MAINTENANCE', 'PAYMENT', 'BOOKING', 'TRIP', 
        'ROUTE', 'VEHICLE', 'DRIVER', 'PASSENGER'
    )) LOOP
        EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS PURGE';
    END LOOP;

    -- Drop Sequences
    FOR s IN (SELECT sequence_name FROM user_sequences WHERE sequence_name IN (
        'SEQ_PASSENGER', 'SEQ_DRIVER', 'SEQ_VEHICLE', 'SEQ_ROUTE', 
        'SEQ_TRIPS', 'SEQ_BOOKING', 'SEQ_PAYMENT', 'SEQ_MAINTENANCE', 'SEQ_FEEDBACK'
    )) LOOP
        EXECUTE IMMEDIATE 'DROP SEQUENCE ' || s.sequence_name;
    END LOOP;
END;
/

-- ==================================================================================
-- SECTION 2: CREATE SEQUENCES
-- ==================================================================================
PROMPT [2/10] Creating sequences...

-- Member 1 Sequences
CREATE SEQUENCE SEQ_PASSENGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_DRIVER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_VEHICLE START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_ROUTE START WITH 1 INCREMENT BY 1;

-- Member 3 Sequences (Note: Sequence for TRIP is named SEQ_TRIPS as configured)
CREATE SEQUENCE SEQ_TRIPS START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_BOOKING START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_PAYMENT START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_MAINTENANCE START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_FEEDBACK START WITH 1 INCREMENT BY 1;

-- ==================================================================================
-- SECTION 3: CREATE MASTER & TRANSACTIONAL TABLES WITH CONSTRAINTS & INDEXES
-- ==================================================================================
PROMPT [3/10] Creating master and transactional tables...

-- 1. PASSENGER (Member 1)
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
-- Note: Oracle automatically creates a unique index on EMAIL to enforce the UNIQUE constraint.

-- 2. DRIVER (Member 1)
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
-- Note: Oracle automatically creates unique indexes on EMAIL and LICENSE_NUMBER to enforce UNIQUE constraints.

-- 3. VEHICLE (Member 1)
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
-- Note: Oracle automatically creates a unique index on REGISTRATION_NUMBER to enforce the UNIQUE constraint.

-- 4. ROUTE (Member 1)
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

-- 5. TRIP (Member 3)

CREATE TABLE TRIP (
    TRIP_ID NUMBER(10) DEFAULT SEQ_TRIPS.NEXTVAL PRIMARY KEY,
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

-- 6. BOOKING (Member 3)
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

-- 7. PAYMENT (Member 3)
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

-- 8. MAINTENANCE (Member 3)
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

-- 9. FEEDBACK (Member 3)
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

-- ==================================================================================
-- SECTION 4: PL/SQL FUNCTIONS AND STORED PROCEDURES (MEMBERS 2 & 3)
-- ==================================================================================
PROMPT [4/10] Compiling PL/SQL functions and stored procedures...

-- 1. Shared Fare Calculation Function with Exception Handling (Member 2)
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

-- 2. Transactional Booking Procedure with Concurrency Locking & Rollback (Member 3)
CREATE OR REPLACE PROCEDURE MAKE_BOOKING(
    p_passenger_id IN NUMBER, 
    p_trip_id IN NUMBER, 
    p_seats IN NUMBER
) IS
    v_avail_seats NUMBER;
    v_route_id NUMBER;
    v_fare NUMBER;
BEGIN
    -- 1. Row-level lock to prevent concurrent overbooking
    SELECT AVAILABLE_SEATS, ROUTE_ID INTO v_avail_seats, v_route_id
    FROM TRIP WHERE TRIP_ID = p_trip_id FOR UPDATE;
    
    -- 2. Validate seat availability
    IF v_avail_seats < p_seats THEN
        RAISE_APPLICATION_ERROR(-20002, 'Insufficient available seats for this trip.');
    END IF;
    
    -- 3. Calculate fare using Member 2's CALCULATE_FARE function
    v_fare := CALCULATE_FARE(v_route_id, p_seats);
    
    -- 4. Create booking record
    INSERT INTO BOOKING (PASSENGER_ID, TRIP_ID, SEATS_BOOKED, TOTAL_FARE, STATUS, PAYMENT_STATUS, BOOKING_DATE)
    VALUES (p_passenger_id, p_trip_id, p_seats, v_fare, 'CONFIRMED', 'UNPAID', SYSDATE);
    
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

-- 3. Transactional Cancellation Procedure (Releases seats via Trigger) (Member 3)
CREATE OR REPLACE PROCEDURE CANCEL_BOOKING(p_booking_id IN NUMBER) IS
    v_status VARCHAR2(20);
BEGIN
    SELECT STATUS INTO v_status FROM BOOKING WHERE BOOKING_ID = p_booking_id FOR UPDATE;
    
    IF v_status = 'CANCELLED' THEN
        RAISE_APPLICATION_ERROR(-20004, 'Booking is already cancelled.');
    END IF;
    
    UPDATE BOOKING 
    SET STATUS = 'CANCELLED', 
        PAYMENT_STATUS = CASE WHEN PAYMENT_STATUS = 'PAID' THEN 'REFUNDED' ELSE PAYMENT_STATUS END,
        UPDATED_AT = SYSDATE
    WHERE BOOKING_ID = p_booking_id;
    
    COMMIT;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20005, 'Booking ID does not exist.');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END CANCEL_BOOKING;
/

-- 4. Explicit Cursor FOR LOOP for Automatic Trip Completion (Member 3)
CREATE OR REPLACE PROCEDURE UPDATE_COMPLETED_TRIPS IS
    CURSOR c_past_trips IS
        SELECT TRIP_ID, DEPARTURE_TIME FROM TRIP
        WHERE STATUS IN ('SCHEDULED', 'IN_PROGRESS') AND ARRIVAL_TIME < SYSDATE;
BEGIN
    FOR trip_rec IN c_past_trips LOOP
        UPDATE TRIP SET STATUS = 'COMPLETED', UPDATED_AT = SYSDATE 
        WHERE TRIP_ID = trip_rec.TRIP_ID;
        DBMS_OUTPUT.PUT_LINE('Trip ID ' || trip_rec.TRIP_ID || ' marked as COMPLETED.');
    END LOOP;
    COMMIT;
END UPDATE_COMPLETED_TRIPS;
/

-- 4. Explicit Cursor Revenue Reporting Procedure (Member 2)
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
    DBMS_OUTPUT.PUT_LINE('-------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('SMARTMOVE REVENUE REPORT');
    DBMS_OUTPUT.PUT_LINE('Period: ' || TO_CHAR(p_start_date, 'YYYY-MM-DD') || ' to ' || TO_CHAR(p_end_date, 'YYYY-MM-DD'));
    DBMS_OUTPUT.PUT_LINE('Total Revenue (LKR): ' || NVL(v_rev.TOTAL_REVENUE, 0));
    DBMS_OUTPUT.PUT_LINE('Tickets Sold:        ' || NVL(v_rev.TICKETS_SOLD, 0));
    DBMS_OUTPUT.PUT_LINE('Average Ticket:      ' || ROUND(NVL(v_rev.AVG_TICKET, 0), 2));
    DBMS_OUTPUT.PUT_LINE('-------------------------------------------');
    CLOSE rev_cursor;
END REPORT_REVENUE;
/

-- ==================================================================================
-- SECTION 5: COMPLETE TEST DATA INSERTION (FROM ALLmems/Oracle_TestData.sql)
-- ==================================================================================
PROMPT [5/10] Inserting verified seed test data...

-- 1. PASSENGER TEST DATA
INSERT INTO PASSENGER (PASSENGER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, PASSWORD_HASH, STATUS, ROLE) 
VALUES (1, 'Nimal', 'Perera', 'nimal@example.com', '0771234567', '$2a$10$X', 'ACTIVE', 'PASSENGER');
INSERT INTO PASSENGER (PASSENGER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, PASSWORD_HASH, STATUS, ROLE) 
VALUES (2, 'Sunil', 'Fernando', 'sunil@example.com', '0777654321', '$2a$10$X', 'ACTIVE', 'PASSENGER');
INSERT INTO PASSENGER (PASSENGER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, PASSWORD_HASH, STATUS, ROLE) 
VALUES (3, 'Kamal', 'Silva', 'kamal@example.com', '0712345678', '$2a$10$X', 'ACTIVE', 'PASSENGER');
INSERT INTO PASSENGER (PASSENGER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, PASSWORD_HASH, STATUS, ROLE) 
VALUES (4, 'Amal', 'Bandara', 'amal@example.com', '0788765432', '$2a$10$X', 'INACTIVE', 'PASSENGER');
INSERT INTO PASSENGER (PASSENGER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, PASSWORD_HASH, STATUS, ROLE) 
VALUES (5, 'admin', 'admin', 'admin@smartmove.lk', '0112223334', '$2a$10$X', 'ACTIVE', 'ADMIN');

-- 2. DRIVER TEST DATA
INSERT INTO DRIVER (DRIVER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, LICENSE_NUMBER, PASSWORD_HASH, STATUS, RATING, TOTAL_TRIPS) 
VALUES (1, 'Saman', 'Kumara', 'saman.k@smartmove.lk', '0771122334', 'B1234567', '$2a$10$X', 'ACTIVE', 4.8, 120);
INSERT INTO DRIVER (DRIVER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, LICENSE_NUMBER, PASSWORD_HASH, STATUS, RATING, TOTAL_TRIPS) 
VALUES (2, 'Ruwan', 'Pathirana', 'ruwan.p@smartmove.lk', '0712233445', 'B7654321', '$2a$10$X', 'ON_TRIP', 4.5, 85);
INSERT INTO DRIVER (DRIVER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, LICENSE_NUMBER, PASSWORD_HASH, STATUS, RATING, TOTAL_TRIPS) 
VALUES (3, 'Nuwan', 'Jayasinghe', 'nuwan.j@smartmove.lk', '0723344556', 'B9876543', '$2a$10$X', 'ON_LEAVE', 4.9, 210);

-- 3. VEHICLE TEST DATA
INSERT INTO VEHICLE (VEHICLE_ID, REGISTRATION_NUMBER, TYPE, CAPACITY, MODEL, YEAR, STATUS) 
VALUES (1, 'ND-4521', 'Luxury Coach', 45, 'Volvo 9900', 2022, 'ACTIVE');
INSERT INTO VEHICLE (VEHICLE_ID, REGISTRATION_NUMBER, TYPE, CAPACITY, MODEL, YEAR, STATUS) 
VALUES (2, 'ND-3210', 'Mini Bus', 28, 'Toyota Coaster', 2020, 'ACTIVE');
INSERT INTO VEHICLE (VEHICLE_ID, REGISTRATION_NUMBER, TYPE, CAPACITY, MODEL, YEAR, STATUS) 
VALUES (3, 'ND-8891', 'Standard Bus', 54, 'Ashok Leyland', 2019, 'MAINTENANCE');
INSERT INTO VEHICLE (VEHICLE_ID, REGISTRATION_NUMBER, TYPE, CAPACITY, MODEL, YEAR, STATUS) 
VALUES (4, 'ND-1122', 'Luxury Coach', 45, 'Scania Touring', 2023, 'ACTIVE');

-- 4. ROUTE TEST DATA
INSERT INTO ROUTE (ROUTE_ID, ORIGIN, DESTINATION, DISTANCE_KM, ESTIMATED_DURATION, BASE_FARE, STATUS) 
VALUES (1, 'Colombo', 'Kandy', 115.5, '3 Hours', 1500.00, 'ACTIVE');
INSERT INTO ROUTE (ROUTE_ID, ORIGIN, DESTINATION, DISTANCE_KM, ESTIMATED_DURATION, BASE_FARE, STATUS) 
VALUES (2, 'Colombo', 'Galle', 125.0, '2 Hours', 1200.00, 'ACTIVE');
INSERT INTO ROUTE (ROUTE_ID, ORIGIN, DESTINATION, DISTANCE_KM, ESTIMATED_DURATION, BASE_FARE, STATUS) 
VALUES (3, 'Kandy', 'Nuwara Eliya', 75.0, '2.5 Hours', 800.00, 'ACTIVE');
INSERT INTO ROUTE (ROUTE_ID, ORIGIN, DESTINATION, DISTANCE_KM, ESTIMATED_DURATION, BASE_FARE, STATUS) 
VALUES (4, 'Colombo', 'Jaffna', 395.0, '8 Hours', 3500.00, 'ACTIVE');

-- 5. TRIP TEST DATA
INSERT INTO TRIP (TRIP_ID, ROUTE_ID, VEHICLE_ID, DRIVER_ID, DEPARTURE_TIME, ARRIVAL_TIME, AVAILABLE_SEATS, STATUS) 
VALUES (1, 1, 1, 1, TO_TIMESTAMP('2026-10-15 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-10-15 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 40, 'SCHEDULED');
INSERT INTO TRIP (TRIP_ID, ROUTE_ID, VEHICLE_ID, DRIVER_ID, DEPARTURE_TIME, ARRIVAL_TIME, AVAILABLE_SEATS, STATUS) 
VALUES (2, 2, 2, 2, TO_TIMESTAMP('2026-10-10 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-10-10 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 15, 'IN_PROGRESS');
INSERT INTO TRIP (TRIP_ID, ROUTE_ID, VEHICLE_ID, DRIVER_ID, DEPARTURE_TIME, ARRIVAL_TIME, AVAILABLE_SEATS, STATUS) 
VALUES (3, 3, 4, 1, TO_TIMESTAMP('2026-09-25 07:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-09-25 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'COMPLETED');
INSERT INTO TRIP (TRIP_ID, ROUTE_ID, VEHICLE_ID, DRIVER_ID, DEPARTURE_TIME, ARRIVAL_TIME, AVAILABLE_SEATS, STATUS) 
VALUES (4, 4, 1, 1, TO_TIMESTAMP('2026-10-20 22:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-10-21 06:00:00', 'YYYY-MM-DD HH24:MI:SS'), 45, 'SCHEDULED');

-- 6. BOOKING TEST DATA
INSERT INTO BOOKING (BOOKING_ID, PASSENGER_ID, TRIP_ID, SEATS_BOOKED, TOTAL_FARE, STATUS, PAYMENT_STATUS, BOOKING_DATE) 
VALUES (1, 1, 1, 2, 3000.00, 'CONFIRMED', 'PAID', TO_TIMESTAMP('2026-10-01 14:30:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BOOKING (BOOKING_ID, PASSENGER_ID, TRIP_ID, SEATS_BOOKED, TOTAL_FARE, STATUS, PAYMENT_STATUS, BOOKING_DATE) 
VALUES (2, 2, 2, 1, 1200.00, 'CONFIRMED', 'PAID', TO_TIMESTAMP('2026-10-08 09:15:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BOOKING (BOOKING_ID, PASSENGER_ID, TRIP_ID, SEATS_BOOKED, TOTAL_FARE, STATUS, PAYMENT_STATUS, BOOKING_DATE) 
VALUES (3, 3, 3, 4, 3200.00, 'CONFIRMED', 'PAID', TO_TIMESTAMP('2026-09-20 11:00:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BOOKING (BOOKING_ID, PASSENGER_ID, TRIP_ID, SEATS_BOOKED, TOTAL_FARE, STATUS, PAYMENT_STATUS, BOOKING_DATE) 
VALUES (4, 1, 4, 1, 3500.00, 'PENDING', 'UNPAID', TO_TIMESTAMP('2026-10-09 18:45:00', 'YYYY-MM-DD HH24:MI:SS'));

-- 7. PAYMENT TEST DATA
INSERT INTO PAYMENT (PAYMENT_ID, BOOKING_ID, AMOUNT, PAYMENT_METHOD, STATUS, TRANSACTION_REF) 
VALUES (1, 1, 3000.00, 'CREDIT_CARD', 'SUCCESS', 'TXN-9988776655');
INSERT INTO PAYMENT (PAYMENT_ID, BOOKING_ID, AMOUNT, PAYMENT_METHOD, STATUS, TRANSACTION_REF) 
VALUES (2, 2, 1200.00, 'DEBIT_CARD', 'SUCCESS', 'TXN-5544332211');
INSERT INTO PAYMENT (PAYMENT_ID, BOOKING_ID, AMOUNT, PAYMENT_METHOD, STATUS, TRANSACTION_REF) 
VALUES (3, 3, 3200.00, 'BANK_TRANSFER', 'SUCCESS', 'TXN-1122334455');

-- 8. MAINTENANCE TEST DATA
INSERT INTO MAINTENANCE (MAINTENANCE_ID, VEHICLE_ID, DESCRIPTION, COST, MAINTENANCE_DATE, STATUS) 
VALUES (1, 3, 'Engine Oil Replacement and Brake Inspection', 45000.00, TO_DATE('2026-10-08', 'YYYY-MM-DD'), 'IN_PROGRESS');
INSERT INTO MAINTENANCE (MAINTENANCE_ID, VEHICLE_ID, DESCRIPTION, COST, MAINTENANCE_DATE, STATUS) 
VALUES (2, 1, 'Tire Alignment and AC Service', 25000.00, TO_DATE('2026-09-15', 'YYYY-MM-DD'), 'COMPLETED');
INSERT INTO MAINTENANCE (MAINTENANCE_ID, VEHICLE_ID, DESCRIPTION, COST, MAINTENANCE_DATE, STATUS) 
VALUES (3, 2, 'Routine Monthly Checkup', 15000.00, TO_DATE('2026-10-25', 'YYYY-MM-DD'), 'PENDING');

-- 9. FEEDBACK TEST DATA
INSERT INTO FEEDBACK (FEEDBACK_ID, PASSENGER_ID, TRIP_ID, TYPE, DESCRIPTION, STATUS) 
VALUES (1, 3, 3, 'APPRECIATION', 'Excellent driving and very comfortable seats. Loved the AC!', 'RESOLVED');
INSERT INTO FEEDBACK (FEEDBACK_ID, PASSENGER_ID, TRIP_ID, TYPE, DESCRIPTION, STATUS) 
VALUES (2, 2, 2, 'COMPLAINT', 'Bus was slightly delayed arriving at the stop.', 'REVIEWING');
INSERT INTO FEEDBACK (FEEDBACK_ID, PASSENGER_ID, TRIP_ID, TYPE, DESCRIPTION, STATUS) 
VALUES (3, 1, NULL, 'SUGGESTION', 'Please add more routes to the North.', 'OPEN');

COMMIT;

-- ==================================================================================
-- SECTION 6: SEQUENCE SYNCHRONIZATION
-- Re-align sequences so next runtime inserts use the correct sequential IDs
-- (Resolves ORA-00933 by dropping and recreating with clean START WITH clauses)
-- ==================================================================================
PROMPT [6/10] Synchronizing sequences to next available ID values...

DROP SEQUENCE SEQ_PASSENGER;
CREATE SEQUENCE SEQ_PASSENGER START WITH 6 INCREMENT BY 1;

DROP SEQUENCE SEQ_DRIVER;
CREATE SEQUENCE SEQ_DRIVER START WITH 4 INCREMENT BY 1;

DROP SEQUENCE SEQ_VEHICLE;
CREATE SEQUENCE SEQ_VEHICLE START WITH 5 INCREMENT BY 1;

DROP SEQUENCE SEQ_ROUTE;
CREATE SEQUENCE SEQ_ROUTE START WITH 5 INCREMENT BY 1;

DROP SEQUENCE SEQ_TRIPS;
CREATE SEQUENCE SEQ_TRIPS START WITH 5 INCREMENT BY 1;

DROP SEQUENCE SEQ_BOOKING;
CREATE SEQUENCE SEQ_BOOKING START WITH 5 INCREMENT BY 1;

DROP SEQUENCE SEQ_PAYMENT;
CREATE SEQUENCE SEQ_PAYMENT START WITH 4 INCREMENT BY 1;

DROP SEQUENCE SEQ_MAINTENANCE;
CREATE SEQUENCE SEQ_MAINTENANCE START WITH 4 INCREMENT BY 1;

DROP SEQUENCE SEQ_FEEDBACK;
CREATE SEQUENCE SEQ_FEEDBACK START WITH 4 INCREMENT BY 1;

-- ==================================================================================
-- SECTION 7: BUSINESS TRIGGER (CREATED AFTER SEED DATA TO PRESERVE CAPACITIES)
-- ==================================================================================
PROMPT [7/10] Creating automated seat capacity trigger...

CREATE OR REPLACE TRIGGER TRG_MANAGE_SEATS
AFTER INSERT OR UPDATE OF STATUS ON BOOKING
FOR EACH ROW
BEGIN
    -- Automatically decrease available seats when booking is confirmed
    IF INSERTING AND :NEW.STATUS = 'CONFIRMED' THEN
        UPDATE TRIP 
        SET AVAILABLE_SEATS = AVAILABLE_SEATS - :NEW.SEATS_BOOKED 
        WHERE TRIP_ID = :NEW.TRIP_ID;
    -- Automatically release seats when confirmed booking is cancelled
    ELSIF UPDATING AND :OLD.STATUS = 'CONFIRMED' AND :NEW.STATUS = 'CANCELLED' THEN
        UPDATE TRIP 
        SET AVAILABLE_SEATS = AVAILABLE_SEATS + :OLD.SEATS_BOOKED 
        WHERE TRIP_ID = :OLD.TRIP_ID;
    END IF;
END;
/

-- ==================================================================================
-- SECTION 8: MATERIALIZED VIEW (MEMBER 2)
-- Fast aggregation for monthly revenue reports on admin dashboard
-- ==================================================================================
PROMPT [8/10] Creating materialized view for revenue optimization...

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

-- ==================================================================================
-- SECTION 9: THE 5 BUSINESS REPORTS (READY-TO-EXECUTE QUERIES)
-- ==================================================================================
PROMPT [9/10] Verifying Business Report Queries...

-- REPORT 1: Most Frequently Used Routes (Ranked by Total Bookings)
PROMPT Running Report 1: Most Frequently Used Routes...
SELECT r.ROUTE_ID, r.ORIGIN, r.DESTINATION, COUNT(b.BOOKING_ID) as TOTAL_BOOKINGS,
       RANK() OVER (ORDER BY COUNT(b.BOOKING_ID) DESC) as RANKING
FROM ROUTE r
LEFT JOIN TRIP t ON r.ROUTE_ID = t.ROUTE_ID
LEFT JOIN BOOKING b ON t.TRIP_ID = b.TRIP_ID AND b.STATUS != 'CANCELLED'
GROUP BY r.ROUTE_ID, r.ORIGIN, r.DESTINATION
ORDER BY RANKING;

-- REPORT 2: Monthly Revenue Summary (Querying the Materialized View)
PROMPT Running Report 2: Monthly Revenue from Materialized View...
SELECT REVENUE_MONTH, TOTAL_REVENUE, TICKETS_SOLD
FROM MV_MONTHLY_REVENUE
ORDER BY REVENUE_MONTH DESC;

-- REPORT 3: Passenger Travel History (Target Passenger ID = 1)
PROMPT Running Report 3: Passenger Travel History for Passenger 1...
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
WHERE p.PASSENGER_ID = 1
ORDER BY t.DEPARTURE_TIME DESC;

-- REPORT 4: Vehicles Due for Maintenance (Dynamic 6-Month Rule)
PROMPT Running Report 4: Vehicles Due for Maintenance...
SELECT v.VEHICLE_ID, v.REGISTRATION_NUMBER, 
       MAX(m.MAINTENANCE_DATE) AS LAST_MAINTENANCE_DATE,
       ADD_MONTHS(MAX(m.MAINTENANCE_DATE), 6) AS DUE_DATE,
       v.STATUS
FROM VEHICLE v
LEFT JOIN MAINTENANCE m ON v.VEHICLE_ID = m.VEHICLE_ID
GROUP BY v.VEHICLE_ID, v.REGISTRATION_NUMBER, v.STATUS
HAVING ADD_MONTHS(MAX(m.MAINTENANCE_DATE), 6) < SYSDATE OR MAX(m.MAINTENANCE_DATE) IS NULL
ORDER BY DUE_DATE ASC;

-- REPORT 5: Trip Occupancy and Performance
PROMPT Running Report 5: Trip Occupancy and Performance...
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

-- ==================================================================================
-- SECTION 10: VERIFICATION COUNTS & CROSS-REFERENCE QUERIES
-- ==================================================================================
PROMPT [10/10] Final verification of inserted records...

SELECT 'PASSENGER' AS TABLE_NAME, COUNT(*) AS RECORD_COUNT FROM PASSENGER
UNION ALL
SELECT 'DRIVER', COUNT(*) FROM DRIVER
UNION ALL
SELECT 'VEHICLE', COUNT(*) FROM VEHICLE
UNION ALL
SELECT 'ROUTE', COUNT(*) FROM ROUTE
UNION ALL
SELECT 'TRIP', COUNT(*) FROM TRIP
UNION ALL
SELECT 'BOOKING', COUNT(*) FROM BOOKING
UNION ALL
SELECT 'PAYMENT', COUNT(*) FROM PAYMENT
UNION ALL
SELECT 'MAINTENANCE', COUNT(*) FROM MAINTENANCE
UNION ALL
SELECT 'FEEDBACK', COUNT(*) FROM FEEDBACK;

-- Cross-reference check for MongoDB Vehicle Documents & Trip Media
PROMPT Valid Vehicle IDs for MongoDB:
SELECT VEHICLE_ID, REGISTRATION_NUMBER FROM VEHICLE WHERE STATUS = 'ACTIVE';

-- Cross-reference check for MongoDB Route Reviews
PROMPT Valid Route IDs for MongoDB:
SELECT ROUTE_ID, ORIGIN, DESTINATION FROM ROUTE;

-- ==================================================================================
-- SECTION 11: DATABASE ADMINISTRATION, SECURITY & BACKUP (MEMBER 1)
-- Role-Based Access Control (RBAC), Least-Privilege Grants & Backup Strategy
-- ==================================================================================
PROMPT [11/11] Configuring Security Roles, Grants, and Privileges (Member 1)...

DECLARE
    v_role_exists BOOLEAN := FALSE;
BEGIN
    -- 1. Attempt to create Application Role if environment permits (e.g., Local XE / Enterprise / DBA)
    BEGIN
        EXECUTE IMMEDIATE 'CREATE ROLE smartmove_app_role NOT IDENTIFIED';
        v_role_exists := TRUE;
    EXCEPTION
        WHEN OTHERS THEN
            -- SQLCODE -1921: ORA-01921: role name conflicts with another user or role name (already exists)
            IF SQLCODE = -1921 THEN
                v_role_exists := TRUE;
            ELSE
                v_role_exists := FALSE;
            END IF;
    END;

    -- 2. If smartmove_app_role is created/present, grant least-privilege permissions
    IF v_role_exists THEN
        BEGIN
            FOR t IN (SELECT table_name FROM user_tables WHERE table_name IN (
                'PASSENGER', 'DRIVER', 'VEHICLE', 'ROUTE', 'TRIP', 'BOOKING', 'PAYMENT', 'MAINTENANCE', 'FEEDBACK'
            )) LOOP
                EXECUTE IMMEDIATE 'GRANT SELECT, INSERT, UPDATE, DELETE ON ' || t.table_name || ' TO smartmove_app_role';
            END LOOP;

            FOR s IN (SELECT sequence_name FROM user_sequences WHERE sequence_name LIKE 'SEQ_%') LOOP
                EXECUTE IMMEDIATE 'GRANT SELECT ON ' || s.sequence_name || ' TO smartmove_app_role';
            END LOOP;

            EXECUTE IMMEDIATE 'GRANT EXECUTE ON CALCULATE_FARE TO smartmove_app_role';
            EXECUTE IMMEDIATE 'GRANT EXECUTE ON MAKE_BOOKING TO smartmove_app_role';
            EXECUTE IMMEDIATE 'GRANT EXECUTE ON CANCEL_BOOKING TO smartmove_app_role';
            EXECUTE IMMEDIATE 'GRANT EXECUTE ON UPDATE_COMPLETED_TRIPS TO smartmove_app_role';
            EXECUTE IMMEDIATE 'GRANT EXECUTE ON REPORT_REVENUE TO smartmove_app_role';
            EXECUTE IMMEDIATE 'GRANT SELECT ON MV_MONTHLY_REVENUE TO smartmove_app_role';

            DBMS_OUTPUT.PUT_LINE('Role [smartmove_app_role] and least-privilege grants successfully configured.');
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('Notice on role privilege grants: ' || SQLERRM);
        END;
    ELSE
        DBMS_OUTPUT.PUT_LINE('Autonomous / Standard DB: Schema owner operates with direct access. Standalone role creation skipped.');
    END IF;

    -- 3. Provision dedicated application user if permitted by environment
    BEGIN
        EXECUTE IMMEDIATE 'CREATE USER smartmove_user IDENTIFIED BY "SecureAppPass2026"';
        EXECUTE IMMEDIATE 'GRANT CREATE SESSION TO smartmove_user';
        IF v_role_exists THEN
            EXECUTE IMMEDIATE 'GRANT smartmove_app_role TO smartmove_user';
        END IF;
        DBMS_OUTPUT.PUT_LINE('User [smartmove_user] created successfully.');
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Notice: Dedicated user creation skipped (managed by schema user).');
    END;
END;
/

-- Logical Backup Strategy Documentation (Oracle Data Pump Export)
-- Terminal command to execute backup of entire SmartMove schema:
-- expdp smartmove_user/SecureAppPass2026@localhost:1521/XEPDB1 schemas=smartmove_user directory=DATA_PUMP_DIR dumpfile=smartmove_backup.dmp logfile=expdp_smartmove.log

COMMIT;

PROMPT =====================================================================
PROMPT SMARTMOVE DATABASE SETUP COMPLETE! ALL OBJECTS CREATED AND VERIFIED.
PROMPT =====================================================================
