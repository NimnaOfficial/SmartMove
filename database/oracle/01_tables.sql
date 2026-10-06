-- ============================================================
-- SmartMove Transport Solutions — Oracle Tables
-- Run as: smartmove/smartmove123@localhost:1521/XEPDB1
-- ============================================================

-- ============================================================
-- SEQUENCES (for auto-generating IDs)
-- ============================================================

CREATE SEQUENCE SEQ_PASSENGER START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_DRIVER START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_VEHICLE START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_ROUTE START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_TRIP START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_BOOKING START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_PAYMENT START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_MAINTENANCE START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_FEEDBACK START WITH 1 INCREMENT BY 1 NOCACHE;

-- ============================================================
-- TABLE: PASSENGER
-- ============================================================
CREATE TABLE PASSENGER (
    passenger_id    NUMBER DEFAULT SEQ_PASSENGER.NEXTVAL PRIMARY KEY,
    name            VARCHAR2(100)   NOT NULL,
    email           VARCHAR2(150)   NOT NULL UNIQUE,
    phone           VARCHAR2(20),
    password_hash   VARCHAR2(255)   NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: DRIVER
-- ============================================================
CREATE TABLE DRIVER (
    driver_id       NUMBER DEFAULT SEQ_DRIVER.NEXTVAL PRIMARY KEY,
    name            VARCHAR2(100)   NOT NULL,
    license_number  VARCHAR2(50)    NOT NULL UNIQUE,
    phone           VARCHAR2(20),
    email           VARCHAR2(150)   UNIQUE,
    password_hash   VARCHAR2(255),
    status          VARCHAR2(20)    DEFAULT 'AVAILABLE'
                    CHECK (status IN ('AVAILABLE', 'BUSY', 'OFF_DUTY', 'ON_LEAVE')),
    rating          NUMBER(3,2)     DEFAULT 0.00,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: VEHICLE
-- ============================================================
CREATE TABLE VEHICLE (
    vehicle_id          NUMBER DEFAULT SEQ_VEHICLE.NEXTVAL PRIMARY KEY,
    registration_number VARCHAR2(20)    NOT NULL UNIQUE,
    type                VARCHAR2(50)    NOT NULL,
    capacity            NUMBER          NOT NULL CHECK (capacity > 0),
    status              VARCHAR2(20)    DEFAULT 'ACTIVE'
                        CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED')),
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: ROUTE
-- ============================================================
CREATE TABLE ROUTE (
    route_id        NUMBER DEFAULT SEQ_ROUTE.NEXTVAL PRIMARY KEY,
    origin          VARCHAR2(100)   NOT NULL,
    destination     VARCHAR2(100)   NOT NULL,
    distance        NUMBER(10,2),
    estimated_time  VARCHAR2(50),
    status          VARCHAR2(20)    DEFAULT 'ACTIVE'
                    CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: TRIP
-- ============================================================
CREATE TABLE TRIP (
    trip_id         NUMBER DEFAULT SEQ_TRIP.NEXTVAL PRIMARY KEY,
    route_id        NUMBER          NOT NULL,
    vehicle_id      NUMBER          NOT NULL,
    driver_id       NUMBER          NOT NULL,
    trip_date       DATE            NOT NULL,
    departure_time  TIMESTAMP,
    arrival_time    TIMESTAMP,
    fare            NUMBER(10,2)    NOT NULL CHECK (fare >= 0),
    status          VARCHAR2(20)    DEFAULT 'SCHEDULED'
                    CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_route    FOREIGN KEY (route_id)   REFERENCES ROUTE(route_id),
    CONSTRAINT fk_trip_vehicle  FOREIGN KEY (vehicle_id) REFERENCES VEHICLE(vehicle_id),
    CONSTRAINT fk_trip_driver   FOREIGN KEY (driver_id)  REFERENCES DRIVER(driver_id)
);

-- ============================================================
-- TABLE: BOOKING
-- ============================================================
CREATE TABLE BOOKING (
    booking_id      NUMBER DEFAULT SEQ_BOOKING.NEXTVAL PRIMARY KEY,
    passenger_id    NUMBER          NOT NULL,
    trip_id         NUMBER          NOT NULL,
    seat_number     NUMBER,
    fare            NUMBER(10,2)    NOT NULL CHECK (fare >= 0),
    status          VARCHAR2(20)    DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
    booking_date    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_passenger FOREIGN KEY (passenger_id) REFERENCES PASSENGER(passenger_id),
    CONSTRAINT fk_booking_trip      FOREIGN KEY (trip_id)      REFERENCES TRIP(trip_id)
);

-- ============================================================
-- TABLE: PAYMENT
-- ============================================================
CREATE TABLE PAYMENT (
    payment_id      NUMBER DEFAULT SEQ_PAYMENT.NEXTVAL PRIMARY KEY,
    booking_id      NUMBER          NOT NULL,
    amount          NUMBER(10,2)    NOT NULL CHECK (amount > 0),
    method          VARCHAR2(20)    DEFAULT 'CASH'
                    CHECK (method IN ('CASH', 'CARD', 'ONLINE')),
    status          VARCHAR2(20)    DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    payment_date    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES BOOKING(booking_id)
);

-- ============================================================
-- TABLE: MAINTENANCE
-- ============================================================
CREATE TABLE MAINTENANCE (
    maintenance_id      NUMBER DEFAULT SEQ_MAINTENANCE.NEXTVAL PRIMARY KEY,
    vehicle_id          NUMBER          NOT NULL,
    description         VARCHAR2(500),
    maintenance_date    DATE            NOT NULL,
    next_maintenance_date DATE,
    cost                NUMBER(10,2)    DEFAULT 0 CHECK (cost >= 0),
    status              VARCHAR2(20)    DEFAULT 'SCHEDULED'
                        CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED')),
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_maintenance_vehicle FOREIGN KEY (vehicle_id) REFERENCES VEHICLE(vehicle_id)
);

-- ============================================================
-- TABLE: FEEDBACK
-- ============================================================
CREATE TABLE FEEDBACK (
    feedback_id     NUMBER DEFAULT SEQ_FEEDBACK.NEXTVAL PRIMARY KEY,
    passenger_id    NUMBER          NOT NULL,
    trip_id         NUMBER          NOT NULL,
    rating          NUMBER(1)       NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         VARCHAR2(1000),
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_passenger FOREIGN KEY (passenger_id) REFERENCES PASSENGER(passenger_id),
    CONSTRAINT fk_feedback_trip      FOREIGN KEY (trip_id)      REFERENCES TRIP(trip_id)
);

-- ============================================================
-- INDEXES (for query performance)
-- ============================================================
CREATE INDEX idx_trip_route      ON TRIP(route_id);
CREATE INDEX idx_trip_vehicle    ON TRIP(vehicle_id);
CREATE INDEX idx_trip_driver     ON TRIP(driver_id);
CREATE INDEX idx_trip_date       ON TRIP(trip_date);
CREATE INDEX idx_booking_passenger ON BOOKING(passenger_id);
CREATE INDEX idx_booking_trip    ON BOOKING(trip_id);
CREATE INDEX idx_payment_booking ON PAYMENT(booking_id);
CREATE INDEX idx_payment_date    ON PAYMENT(payment_date);
CREATE INDEX idx_maintenance_vehicle ON MAINTENANCE(vehicle_id);
CREATE INDEX idx_maintenance_next ON MAINTENANCE(next_maintenance_date);
CREATE INDEX idx_feedback_passenger ON FEEDBACK(passenger_id);
CREATE INDEX idx_feedback_trip   ON FEEDBACK(trip_id);

COMMIT;

-- ============================================================
-- Verify tables
-- ============================================================
SELECT table_name FROM user_tables ORDER BY table_name;
