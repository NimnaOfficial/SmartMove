-- Member 1 — Oracle Schema Foundation, References & Security

-- 1. Master Table Implementation

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

-- 2. User Management & Security Roles

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

-- 3. Validation Queries for MongoDB Reference

-- Find Valid Vehicle IDs for MongoDB Vehicle Documents & Trip Media
SELECT VEHICLE_ID, REGISTRATION_NUMBER FROM VEHICLE WHERE STATUS = 'ACTIVE';

-- Find Valid Route IDs for MongoDB Reviews
SELECT ROUTE_ID, ORIGIN, DESTINATION FROM ROUTE;

-- 4.