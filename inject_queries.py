import re
import os

filepath = r"ALLmems/SmartMove_Relational_Schema.md"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Oracle markers to section 5
content = content.replace("### 5.1 PASSENGER", "### 5.1 PASSENGER 🛢️ (OracleDB)")
content = content.replace("### 5.2 DRIVER", "### 5.2 DRIVER 🛢️ (OracleDB)")
content = content.replace("### 5.3 VEHICLE", "### 5.3 VEHICLE 🛢️ (OracleDB)")
content = content.replace("### 5.4 ROUTE", "### 5.4 ROUTE 🛢️ (OracleDB)")
content = content.replace("### 5.5 TRIP", "### 5.5 TRIP 🛢️ (OracleDB)")
content = content.replace("### 5.6 BOOKING", "### 5.6 BOOKING 🛢️ (OracleDB)")
content = content.replace("### 5.7 PAYMENT", "### 5.7 PAYMENT 🛢️ (OracleDB)")
content = content.replace("### 5.8 MAINTENANCE", "### 5.8 MAINTENANCE 🛢️ (OracleDB)")
content = content.replace("### 5.9 FEEDBACK", "### 5.9 FEEDBACK 🛢️ (OracleDB)")

# Add MongoDB markers to section 7
content = content.replace("### 7.1 reviews", "### 7.1 reviews 🍃 (MongoDB)")
content = content.replace("### 7.2 announcements", "### 7.2 announcements 🍃 (MongoDB)")
content = content.replace("### 7.3 vehicle_documents", "### 7.3 vehicle_documents 🍃 (MongoDB)")
content = content.replace("### 7.4 trip_media", "### 7.4 trip_media 🍃 (MongoDB)")

passenger_sql = """
**Implementing Query (Oracle SQL):**
```sql
CREATE SEQUENCE SEQ_PASSENGER START WITH 1 INCREMENT BY 1;

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
```
"""
content = re.sub(r"(\*\*Index:\*\* `IDX_PASSENGER_EMAIL` on EMAIL\n)", r"\1\n" + passenger_sql.replace('\\', '\\\\'), content)


driver_sql = """
**Implementing Query (Oracle SQL):**
```sql
CREATE SEQUENCE SEQ_DRIVER START WITH 1 INCREMENT BY 1;

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
```
"""
content = re.sub(r"(\*\*Index:\*\* `IDX_DRIVER_EMAIL` on EMAIL\n)", r"\1\n" + driver_sql.replace('\\', '\\\\'), content)

vehicle_sql = """
**Implementing Query (Oracle SQL):**
```sql
CREATE SEQUENCE SEQ_VEHICLE START WITH 1 INCREMENT BY 1;

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
```
"""
content = re.sub(r"(\*\*Index:\*\* `IDX_VEHICLE_REG` on REGISTRATION_NUMBER\n)", r"\1\n" + vehicle_sql.replace('\\', '\\\\'), content)

route_sql = """
**Implementing Query (Oracle SQL):**
```sql
CREATE SEQUENCE SEQ_ROUTE START WITH 1 INCREMENT BY 1;

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
"""
content = re.sub(r"(\*\*Index:\*\* `IDX_ROUTE_OD` on ORIGIN, DESTINATION\n)", r"\1\n" + route_sql.replace('\\', '\\\\'), content)

trip_sql = """
**Implementing Query (Oracle SQL):**
```sql
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
```
"""
content = re.sub(r"(\*\*Index:\*\* `IDX_TRIP_DEPARTURE` on DEPARTURE_TIME\n)", r"\1\n" + trip_sql.replace('\\', '\\\\'), content)

booking_sql = """
**Implementing Query (Oracle SQL):**
```sql
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
```
"""
content = re.sub(r"(\*\*Index:\*\* `IDX_BOOKING_PASSENGER` on PASSENGER_ID\n)", r"\1\n" + booking_sql.replace('\\', '\\\\'), content)

payment_sql = """
**Implementing Query (Oracle SQL):**
```sql
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
```
"""
content = re.sub(r"(\*\*Index:\*\* `IDX_PAYMENT_BOOKING` on BOOKING_ID\n)", r"\1\n" + payment_sql.replace('\\', '\\\\'), content)

maintenance_sql = """
**Implementing Query (Oracle SQL):**
```sql
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
```
"""
content = re.sub(r"(\*\*Index:\*\* `IDX_MAINTENANCE_VEHICLE` on VEHICLE_ID\n)", r"\1\n" + maintenance_sql.replace('\\', '\\\\'), content)

feedback_sql = """
**Implementing Query (Oracle SQL):**
```sql
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
"""
content = re.sub(r"(\*\*Index:\*\* `IDX_FEEDBACK_STATUS` on STATUS\n)", r"\1\n" + feedback_sql.replace('\\', '\\\\'), content)

reviews_mongo = """
**Implementing Query (MongoDB Collection Creation & Indexing):**
```javascript
db.createCollection("reviews");
db.reviews.createIndex({ routeId: 1 });
db.reviews.createIndex({ rating: -1 });
db.reviews.createIndex({ comment: "text" });

// Schema Validation (Optional but Recommended)
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
```
"""
content = re.sub(r"(\*\*Links to Oracle:\*\* `routeId` -> ROUTE\.ROUTE_ID.*?\n)", r"\1\n" + reviews_mongo.replace('\\', '\\\\'), content)

announcements_mongo = """
**Implementing Query (MongoDB Collection Creation & Indexing):**
```javascript
db.createCollection("announcements");
db.announcements.createIndex({ status: 1 });
db.announcements.createIndex({ targetAudience: 1 });
```
"""
content = re.sub(r"(\*\*Indexes:\*\* `\{ status: 1 \}`, `\{ targetAudience: 1 \}`\n)", r"\1\n" + announcements_mongo.replace('\\', '\\\\'), content)

vehicle_docs_mongo = """
**Implementing Query (MongoDB Collection Creation & Indexing):**
```javascript
db.createCollection("vehicle_documents");
db.vehicle_documents.createIndex({ vehicleId: 1 });
```
"""
content = re.sub(r"(\*\*Links to Oracle:\*\* `vehicleId` -> VEHICLE\.VEHICLE_ID\n)", r"\1\n" + vehicle_docs_mongo.replace('\\', '\\\\'), content)

trip_media_mongo = """
**Implementing Query (MongoDB Collection Creation & Indexing):**
```javascript
db.createCollection("trip_media");
db.trip_media.createIndex({ tripId: 1 });
db.trip_media.createIndex({ routeId: 1 });
```
"""
content = re.sub(r"(\*\*Links to Oracle:\*\* `tripId` -> TRIP\.TRIP_ID, `routeId` -> ROUTE\.ROUTE_ID\n)", r"\1\n" + trip_media_mongo.replace('\\', '\\\\'), content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected all SQL and MongoDB queries!")
