# SmartMove Transport Solutions — Full Relational Schema Guide

**Project:** SmartMove Transport Solutions  
**Databases:** Oracle 21c XE (Relational) + MongoDB 7.x (NoSQL)  
**Backend:** Spring Boot 3.x Microservices  
**API Gateway:** Spring Cloud Gateway (Port 8080)

---

## 1. Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│                    React Frontend (:3000)                      │
│         Axios → http://localhost:8080/api/*                    │
└───────────────────────┬───────────────────────────────────────┘
                        │ REST / JSON
                        ▼
┌───────────────────────────────────────────────────────────────┐
│              API Gateway (:8080)                               │
│    Routes /api/* → Microservices via Eureka Service Registry  │
└───────────────────────┬───────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Oracle DB     │ │Oracle DB     │ │MongoDB       │
│(11 services) │ │(report svc)  │ │(content svc) │
│Structured    │ │PL/SQL Reports│ │Dynamic/NoSQL │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 2. Service Registry

| Service Name       | Port  | Database | Gateway Route Path                                              |
|-------------------|-------|----------|-----------------------------------------------------------------|
| service-registry  | 8761  | —        | Eureka Discovery Server                                        |
| api-gateway       | 8080  | —        | Routes all `/api/**` to microservices                           |
| auth-service      | 8081  | Oracle   | `/api/auth/**`                                                  |
| vehicle-service   | 8082  | Oracle   | `/api/vehicles/**`                                              |
| driver-service    | 8083  | Oracle   | `/api/drivers/**`                                               |
| route-service     | 8084  | Oracle   | `/api/routes/**`                                                |
| passenger-service | 8085  | Oracle   | `/api/passengers/**`                                            |
| trip-service      | 8086  | Oracle   | `/api/trips/**`                                                 |
| booking-service   | 8087  | Oracle   | `/api/bookings/**`                                              |
| payment-service   | 8088  | Oracle   | `/api/payments/**`                                              |
| maintenance-service| 8089 | Oracle   | `/api/maintenance/**`                                           |
| feedback-service  | 8090  | Oracle   | `/api/feedback/**`                                              |
| content-service   | 8091  | MongoDB  | `/api/reviews/**`, `/api/announcements/**`, `/api/documents/**`, `/api/media/**` |
| report-service    | 8092  | Oracle   | `/api/reports/**`                                               |

---

## 3. Oracle Database Connection

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/XEPDB1
spring.datasource.username=smartmove
spring.datasource.password=smartmove123
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.OracleDialect
```

---

## 4. MongoDB Database Connection

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/smartmove
spring.data.mongodb.database=smartmove
```

---

## 5. Oracle Relational Tables (ER Schema)

### 5.1 PASSENGER 🛢️ (OracleDB)

| Column          | Data Type      | Constraint     | Description                     |
|----------------|----------------|----------------|---------------------------------|
| PASSENGER_ID   | NUMBER(10)     | **PK**, SEQ    | Auto-generated primary key      |
| FIRST_NAME     | VARCHAR2(100)  | NOT NULL       | Passenger first name            |
| LAST_NAME      | VARCHAR2(100)  | NOT NULL       | Passenger last name             |
| EMAIL          | VARCHAR2(150)  | NOT NULL, UQ   | Unique email address            |
| PHONE          | VARCHAR2(20)   | NOT NULL       | Contact phone number            |
| PASSWORD_HASH  | VARCHAR2(255)  | NOT NULL       | BCrypt hashed password          |
| STATUS         | VARCHAR2(20)   | NOT NULL, CHK  | ACTIVE, INACTIVE, SUSPENDED     |
| ROLE           | VARCHAR2(20)   | DEFAULT 'PASSENGER' | User role                 |
| REGISTERED_AT  | TIMESTAMP      | DEFAULT SYSDATE| Registration timestamp          |
| UPDATED_AT     | TIMESTAMP      | —              | Last update timestamp           |

**Sequence:** `SEQ_PASSENGER` (START 1, INCREMENT 1)  
**Index:** `IDX_PASSENGER_EMAIL` on EMAIL


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

---

### 5.2 DRIVER 🛢️ (OracleDB)

| Column             | Data Type      | Constraint     | Description                     |
|-------------------|----------------|----------------|---------------------------------|
| DRIVER_ID         | NUMBER(10)     | **PK**, SEQ    | Auto-generated primary key      |
| FIRST_NAME        | VARCHAR2(100)  | NOT NULL       | Driver first name               |
| LAST_NAME         | VARCHAR2(100)  | NOT NULL       | Driver last name                |
| EMAIL             | VARCHAR2(150)  | NOT NULL, UQ   | Unique email address            |
| PHONE             | VARCHAR2(20)   | NOT NULL       | Contact phone number            |
| LICENSE_NUMBER    | VARCHAR2(50)   | NOT NULL, UQ   | Unique license number           |
| PASSWORD_HASH     | VARCHAR2(255)  | NOT NULL       | BCrypt hashed password          |
| STATUS            | VARCHAR2(20)   | NOT NULL, CHK  | ACTIVE, INACTIVE, ON_TRIP, ON_LEAVE |
| RATING            | NUMBER(3,2)    | CHK 1-5        | Average rating (calculated)     |
| TOTAL_TRIPS       | NUMBER(10)     | DEFAULT 0      | Total completed trips           |
| ROLE              | VARCHAR2(20)   | DEFAULT 'DRIVER' | User role                     |
| CREATED_AT        | TIMESTAMP      | DEFAULT SYSDATE| Registration timestamp          |
| UPDATED_AT        | TIMESTAMP      | —              | Last update timestamp           |

**Sequence:** `SEQ_DRIVER` (START 1, INCREMENT 1)  
**Indexes:** `IDX_DRIVER_EMAIL`, `IDX_DRIVER_LICENSE`

---

### 5.3 VEHICLE 🛢️ (OracleDB)

| Column               | Data Type      | Constraint     | Description                     |
|---------------------|----------------|----------------|---------------------------------|
| VEHICLE_ID          | NUMBER(10)     | **PK**, SEQ    | Auto-generated primary key      |
| REGISTRATION_NUMBER | VARCHAR2(20)   | NOT NULL, UQ   | Unique vehicle registration     |
| TYPE                | VARCHAR2(50)   | NOT NULL       | Bus, Mini Bus, Van, etc.        |
| MODEL               | VARCHAR2(100)  | —              | Vehicle model name              |
| YEAR                | NUMBER(4)      | —              | Manufacturing year              |
| CAPACITY            | NUMBER(5)      | NOT NULL, CHK>0| Passenger capacity              |
| STATUS              | VARCHAR2(20)   | NOT NULL, CHK  | ACTIVE, INACTIVE, MAINTENANCE, RETIRED |
| DESCRIPTION         | VARCHAR2(500)  | —              | Additional description          |
| DRIVER_ID           | NUMBER(10)     | **FK** → DRIVER| Currently assigned driver       |
| CREATED_AT          | TIMESTAMP      | DEFAULT SYSDATE| Record creation timestamp       |
| UPDATED_AT          | TIMESTAMP      | —              | Last update timestamp           |

**Sequence:** `SEQ_VEHICLE` (START 1, INCREMENT 1)  
**FK:** `FK_VEHICLE_DRIVER` → DRIVER(DRIVER_ID) ON DELETE SET NULL  
**Index:** `IDX_VEHICLE_REG`, `IDX_VEHICLE_DRIVER`

---

### 5.4 ROUTE 🛢️ (OracleDB)

| Column        | Data Type      | Constraint     | Description                     |
|--------------|----------------|----------------|---------------------------------|
| ROUTE_ID     | NUMBER(10)     | **PK**, SEQ    | Auto-generated primary key      |
| ORIGIN       | VARCHAR2(100)  | NOT NULL       | Starting location (e.g., Colombo) |
| DESTINATION  | VARCHAR2(100)  | NOT NULL       | Ending location (e.g., Kandy)   |
| DISTANCE     | NUMBER(10,2)   | —              | Distance in kilometers          |
| DURATION     | VARCHAR2(50)   | —              | Estimated travel duration       |
| DESCRIPTION  | VARCHAR2(500)  | —              | Route description               |
| STATUS       | VARCHAR2(20)   | NOT NULL, CHK  | ACTIVE, INACTIVE                |
| CREATED_AT   | TIMESTAMP      | DEFAULT SYSDATE| Record creation timestamp       |
| UPDATED_AT   | TIMESTAMP      | —              | Last update timestamp           |

**Sequence:** `SEQ_ROUTE` (START 1, INCREMENT 1)  
**Constraint:** `UQ_ROUTE_ORIGIN_DEST` UNIQUE(ORIGIN, DESTINATION)

---

### 5.5 TRIP 🛢️ (OracleDB)

| Column           | Data Type      | Constraint     | Description                     |
|-----------------|----------------|----------------|---------------------------------|
| TRIP_ID         | NUMBER(10)     | **PK**, SEQ    | Auto-generated primary key      |
| ROUTE_ID        | NUMBER(10)     | **FK** → ROUTE | Referenced route                |
| VEHICLE_ID      | NUMBER(10)     | **FK** → VEHICLE| Assigned vehicle               |
| DRIVER_ID       | NUMBER(10)     | **FK** → DRIVER| Assigned driver                 |
| DEPARTURE_DATE  | DATE           | NOT NULL       | Trip departure date             |
| DEPARTURE_TIME  | VARCHAR2(10)   | NOT NULL       | Departure time (HH:MM)         |
| ARRIVAL_TIME    | VARCHAR2(10)   | —              | Estimated arrival time          |
| CAPACITY        | NUMBER(5)      | NOT NULL       | Total seats (from vehicle)      |
| BOOKED_SEATS    | NUMBER(5)      | DEFAULT 0      | Number of booked seats          |
| AVAILABLE_SEATS | NUMBER(5)      | COMPUTED       | capacity - booked_seats         |
| FARE            | NUMBER(10,2)   | NOT NULL, CHK>=0| Ticket price per seat          |
| STATUS          | VARCHAR2(20)   | NOT NULL, CHK  | SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED |
| CREATED_AT      | TIMESTAMP      | DEFAULT SYSDATE| Record creation timestamp       |
| UPDATED_AT      | TIMESTAMP      | —              | Last update timestamp           |

**Sequence:** `SEQ_TRIP` (START 1, INCREMENT 1)  
**FKs:**
- `FK_TRIP_ROUTE` → ROUTE(ROUTE_ID)
- `FK_TRIP_VEHICLE` → VEHICLE(VEHICLE_ID)
- `FK_TRIP_DRIVER` → DRIVER(DRIVER_ID)

**Indexes:** `IDX_TRIP_ROUTE`, `IDX_TRIP_DATE`, `IDX_TRIP_DRIVER`, `IDX_TRIP_VEHICLE`

---

### 5.6 BOOKING 🛢️ (OracleDB)

| Column           | Data Type      | Constraint     | Description                     |
|-----------------|----------------|----------------|---------------------------------|
| BOOKING_ID      | NUMBER(10)     | **PK**, SEQ    | Auto-generated primary key      |
| PASSENGER_ID    | NUMBER(10)     | **FK** → PASSENGER| Booking passenger             |
| TRIP_ID         | NUMBER(10)     | **FK** → TRIP  | Booked trip                     |
| TICKET_QUANTITY | NUMBER(5)      | NOT NULL, CHK>0| Number of tickets               |
| TOTAL_AMOUNT    | NUMBER(10,2)   | NOT NULL, CHK>=0| Total booking amount           |
| BOOKING_STATUS  | VARCHAR2(20)   | NOT NULL, CHK  | PENDING, CONFIRMED, CANCELLED, COMPLETED |
| PAYMENT_STATUS  | VARCHAR2(20)   | NOT NULL, CHK  | UNPAID, PAID, REFUNDED          |
| CREATED_AT      | TIMESTAMP      | DEFAULT SYSDATE| Booking creation timestamp      |
| UPDATED_AT      | TIMESTAMP      | —              | Last update timestamp           |

**Sequence:** `SEQ_BOOKING` (START 1, INCREMENT 1)  
**FKs:**
- `FK_BOOKING_PASSENGER` → PASSENGER(PASSENGER_ID)
- `FK_BOOKING_TRIP` → TRIP(TRIP_ID)

**Indexes:** `IDX_BOOKING_PASSENGER`, `IDX_BOOKING_TRIP`

---

### 5.7 PAYMENT 🛢️ (OracleDB)

| Column           | Data Type      | Constraint     | Description                     |
|-----------------|----------------|----------------|---------------------------------|
| PAYMENT_ID      | NUMBER(10)     | **PK**, SEQ    | Auto-generated primary key      |
| BOOKING_ID      | NUMBER(10)     | **FK** → BOOKING| Associated booking             |
| AMOUNT          | NUMBER(10,2)   | NOT NULL, CHK>0| Payment amount                  |
| PAYMENT_METHOD  | VARCHAR2(20)   | NOT NULL, CHK  | CARD, CASH, BANK_TRANSFER, MOBILE |
| PAYMENT_DATE    | TIMESTAMP      | NOT NULL       | Payment timestamp               |
| STATUS          | VARCHAR2(20)   | NOT NULL, CHK  | SUCCESS, FAILED, PENDING, REFUNDED |
| TRANSACTION_REF | VARCHAR2(100)  | —              | External transaction reference  |
| CREATED_AT      | TIMESTAMP      | DEFAULT SYSDATE| Record creation timestamp       |

**Sequence:** `SEQ_PAYMENT` (START 1, INCREMENT 1)  
**FK:** `FK_PAYMENT_BOOKING` → BOOKING(BOOKING_ID)  
**Index:** `IDX_PAYMENT_BOOKING`, `IDX_PAYMENT_DATE`

---

### 5.8 MAINTENANCE 🛢️ (OracleDB)

| Column                 | Data Type      | Constraint     | Description                     |
|-----------------------|----------------|----------------|---------------------------------|
| MAINTENANCE_ID        | NUMBER(10)     | **PK**, SEQ    | Auto-generated primary key      |
| VEHICLE_ID            | NUMBER(10)     | **FK** → VEHICLE| Maintained vehicle             |
| MAINTENANCE_DATE      | DATE           | NOT NULL       | Date of maintenance             |
| NEXT_MAINTENANCE_DATE | DATE           | —              | Next scheduled maintenance      |
| TYPE                  | VARCHAR2(20)   | NOT NULL, CHK  | ROUTINE, REPAIR, INSPECTION, EMERGENCY |
| DESCRIPTION           | VARCHAR2(500)  | NOT NULL       | Maintenance description         |
| STATUS                | VARCHAR2(20)   | NOT NULL, CHK  | SCHEDULED, IN_PROGRESS, COMPLETED, OVERDUE |
| COST                  | NUMBER(10,2)   | CHK>=0         | Maintenance cost                |
| TECHNICIAN            | VARCHAR2(100)  | —              | Technician name                 |
| CREATED_AT            | TIMESTAMP      | DEFAULT SYSDATE| Record creation timestamp       |
| UPDATED_AT            | TIMESTAMP      | —              | Last update timestamp           |

**Sequence:** `SEQ_MAINTENANCE` (START 1, INCREMENT 1)  
**FK:** `FK_MAINTENANCE_VEHICLE` → VEHICLE(VEHICLE_ID)  
**Index:** `IDX_MAINTENANCE_VEHICLE`, `IDX_MAINTENANCE_NEXT_DATE`

---

### 5.9 FEEDBACK 🛢️ (OracleDB)

| Column        | Data Type      | Constraint     | Description                     |
|--------------|----------------|----------------|---------------------------------|
| FEEDBACK_ID  | NUMBER(10)     | **PK**, SEQ    | Auto-generated primary key      |
| PASSENGER_ID | NUMBER(10)     | **FK** → PASSENGER| Feedback author               |
| ROUTE_ID     | NUMBER(10)     | **FK** → ROUTE | Route being reviewed (optional) |
| VEHICLE_ID   | NUMBER(10)     | **FK** → VEHICLE| Vehicle being reviewed (optional)|
| DRIVER_ID    | NUMBER(10)     | **FK** → DRIVER| Driver being reviewed (optional)|
| RATING       | NUMBER(1)      | NOT NULL, CHK 1-5| Rating score                  |
| COMMENT      | VARCHAR2(1000) | NOT NULL       | Feedback text                   |
| TYPE         | VARCHAR2(20)   | NOT NULL, CHK  | REVIEW, COMPLAINT, SUGGESTION   |
| CREATED_AT   | TIMESTAMP      | DEFAULT SYSDATE| Submission timestamp            |

**Sequence:** `SEQ_FEEDBACK` (START 1, INCREMENT 1)  
**FKs:**
- `FK_FEEDBACK_PASSENGER` → PASSENGER(PASSENGER_ID)
- `FK_FEEDBACK_ROUTE` → ROUTE(ROUTE_ID) ON DELETE SET NULL
- `FK_FEEDBACK_VEHICLE` → VEHICLE(VEHICLE_ID) ON DELETE SET NULL
- `FK_FEEDBACK_DRIVER` → DRIVER(DRIVER_ID) ON DELETE SET NULL

---

## 6. Entity Relationship Diagram (Textual)

```
PASSENGER ─────┐
  │ PK: passenger_id  │
  │                    │
  ├──< BOOKING >──┤──> TRIP ──┤──> ROUTE
  │    FK: passenger_id│    FK: trip_id  │    FK: route_id
  │    FK: trip_id     │                 │
  │                    │    FK: vehicle_id├──> VEHICLE ──┤──> DRIVER
  ├──< FEEDBACK        │    FK: driver_id │    FK: driver_id│
  │    FK: passenger_id│                 │                 │
  │    FK: route_id    │                 │                 │
  │    FK: vehicle_id  │                 ├──< MAINTENANCE  │
  │    FK: driver_id   │                 │    FK: vehicle_id│
  │                    │                 │                 │
  └────────────────────┘                 └─────────────────┘
                       │
                       ├──> PAYMENT
                       │    FK: booking_id
                       │
```

### Relationship Summary

| Parent Table | Child Table  | Relationship | FK Column      | On Delete     |
|-------------|-------------|-------------|----------------|---------------|
| PASSENGER   | BOOKING     | 1:N         | passenger_id   | CASCADE       |
| PASSENGER   | FEEDBACK    | 1:N         | passenger_id   | CASCADE       |
| TRIP        | BOOKING     | 1:N         | trip_id        | RESTRICT      |
| BOOKING     | PAYMENT     | 1:1         | booking_id     | CASCADE       |
| ROUTE       | TRIP        | 1:N         | route_id       | RESTRICT      |
| ROUTE       | FEEDBACK    | 1:N         | route_id       | SET NULL      |
| VEHICLE     | TRIP        | 1:N         | vehicle_id     | RESTRICT      |
| VEHICLE     | MAINTENANCE | 1:N         | vehicle_id     | CASCADE       |
| VEHICLE     | FEEDBACK    | 1:N         | vehicle_id     | SET NULL      |
| DRIVER      | VEHICLE     | 1:1         | driver_id      | SET NULL      |
| DRIVER      | TRIP        | 1:N         | driver_id      | RESTRICT      |
| DRIVER      | FEEDBACK    | 1:N         | driver_id      | SET NULL      |

---

## 7. MongoDB Collections (NoSQL)

### 7.1 reviews 🍃 (MongoDB)

```json
{
  "_id": ObjectId,
  "routeId": 5,
  "vehicleId": 25,
  "driverId": 4,
  "passengerId": 10,
  "passengerName": "John Silva",
  "rating": 5,
  "comment": "Comfortable and clean journey",
  "type": "REVIEW",
  "tags": ["clean", "comfortable", "on-time"],
  "createdAt": ISODate("2024-01-15T08:30:00Z")
}
```

**Indexes:** `{ routeId: 1 }`, `{ rating: -1 }`, `{ comment: "text" }`  
**Links to Oracle:** `routeId` → ROUTE.ROUTE_ID, `vehicleId` → VEHICLE.VEHICLE_ID, `driverId` → DRIVER.DRIVER_ID, `passengerId` → PASSENGER.PASSENGER_ID

### 7.2 announcements 🍃 (MongoDB)

```json
{
  "_id": ObjectId,
  "title": "Route Schedule Update",
  "message": "New express service from Colombo to Kandy starting Monday.",
  "publishedAt": ISODate("2024-02-01T10:00:00Z"),
  "targetAudience": "PASSENGERS",
  "priority": "HIGH",
  "status": "ACTIVE",
  "createdAt": ISODate("2024-02-01T10:00:00Z"),
  "updatedAt": ISODate("2024-02-01T10:00:00Z")
}
```

**Indexes:** `{ status: 1 }`, `{ targetAudience: 1 }`


**Implementing Query (MongoDB Collection Creation & Indexing):**
```javascript
db.createCollection("announcements");
db.announcements.createIndex({ status: 1 });
db.announcements.createIndex({ targetAudience: 1 });
```

### 7.3 vehicle_documents 🍃 (MongoDB)

```json
{
  "_id": ObjectId,
  "vehicleId": 25,
  "documents": [
    {
      "type": "Insurance",
      "fileName": "insurance_v25.pdf",
      "url": "/uploads/vehicles/25/insurance_v25.pdf",
      "status": "VALID"
    },
    {
      "type": "Registration",
      "fileName": "reg_v25.pdf",
      "url": "/uploads/vehicles/25/reg_v25.pdf",
      "status": "VALID"
    }
  ],
  "images": [
    {
      "url": "/uploads/vehicles/25/front.jpg",
      "caption": "Front view"
    },
    {
      "url": "/uploads/vehicles/25/interior.jpg",
      "caption": "Interior"
    }
  ],
  "uploadedAt": ISODate("2024-01-10T09:00:00Z")
}
```

**Index:** `{ vehicleId: 1 }`  
**Links to Oracle:** `vehicleId` → VEHICLE.VEHICLE_ID

### 7.4 trip_media 🍃 (MongoDB)

```json
{
  "_id": ObjectId,
  "tripId": 1005,
  "routeId": 5,
  "media": [
    {
      "type": "IMAGE",
      "url": "/uploads/trips/1005/departure.jpg",
      "caption": "Departure from Colombo"
    },
    {
      "type": "VIDEO",
      "url": "/uploads/trips/1005/scenic.mp4",
      "caption": "Scenic route view"
    }
  ],
  "uploadedAt": ISODate("2024-03-15T07:30:00Z")
}
```

**Indexes:** `{ tripId: 1 }`, `{ routeId: 1 }`  
**Links to Oracle:** `tripId` → TRIP.TRIP_ID, `routeId` → ROUTE.ROUTE_ID

---

## 8. Oracle ↔ MongoDB Integration Points

| Oracle Table | MongoDB Collection   | Link Field   | Integration Purpose                                    |
|-------------|---------------------|-------------|-------------------------------------------------------|
| VEHICLE     | vehicle_documents   | vehicleId   | Hybrid vehicle detail page (Oracle data + MongoDB docs/images) |
| ROUTE       | reviews             | routeId     | Route reviews from MongoDB displayed alongside Oracle route info |
| DRIVER      | reviews             | driverId    | Driver ratings aggregated from MongoDB reviews          |
| VEHICLE     | reviews             | vehicleId   | Vehicle ratings aggregated from MongoDB reviews         |
| PASSENGER   | reviews             | passengerId | Passenger's review history from MongoDB                 |
| TRIP        | trip_media          | tripId      | Trip multimedia content from MongoDB                    |
| ROUTE       | trip_media          | routeId     | Route-related media gallery                             |

---

## 9. How to Build & Run the Backend

### Prerequisites
- Java 17+
- Maven 3.8+
- Oracle 21c XE (running on localhost:1521/XEPDB1)
- MongoDB 7.x (running on localhost:27017)

### Build Order

```bash
# 1. Build the parent POM
cd SmartMove
mvn clean install -DskipTests

# 2. Start Service Registry FIRST
cd services/service-registry
mvn spring-boot:run

# 3. Start API Gateway
cd services/api-gateway
mvn spring-boot:run

# 4. Start microservices (any order after registry)
cd services/auth-service && mvn spring-boot:run
cd services/vehicle-service && mvn spring-boot:run
cd services/driver-service && mvn spring-boot:run
cd services/route-service && mvn spring-boot:run
cd services/passenger-service && mvn spring-boot:run
cd services/trip-service && mvn spring-boot:run
cd services/booking-service && mvn spring-boot:run
cd services/payment-service && mvn spring-boot:run
cd services/maintenance-service && mvn spring-boot:run
cd services/feedback-service && mvn spring-boot:run
cd services/content-service && mvn spring-boot:run
cd services/report-service && mvn spring-boot:run
```

### Frontend

```bash
cd frontend/smartmove-web
npm install
npm run dev      # Development (port 3000)
npm run build    # Production build
```

---

## 10. PL/SQL Procedures & Functions (Member 3 to implement)

| Name                    | Type      | Purpose                                           |
|------------------------|-----------|---------------------------------------------------|
| SP_REGISTER_VEHICLE    | Procedure | Insert new vehicle with validation                 |
| SP_REGISTER_PASSENGER  | Procedure | Insert new passenger with validation               |
| SP_SCHEDULE_TRIP       | Procedure | Create trip linked to route/vehicle/driver          |
| SP_ASSIGN_DRIVER       | Procedure | Assign available driver to a trip                   |
| SP_CREATE_BOOKING      | Procedure | Create booking with seat availability check         |
| SP_PROCESS_PAYMENT     | Procedure | Process payment and update booking status           |
| SP_RECORD_MAINTENANCE  | Procedure | Record maintenance and update vehicle status        |
| SP_CANCEL_BOOKING      | Procedure | Cancel booking and release seats                    |
| FN_CALCULATE_REVENUE   | Function  | Calculate revenue for a given date range            |
| FN_AVAILABLE_SEATS     | Function  | Return available seats for a trip                   |
| FN_OCCUPANCY_RATE      | Function  | Calculate trip occupancy percentage                 |
| FN_DRIVER_RATING       | Function  | Calculate driver average rating                     |
| TRG_BOOKING_SEAT_UPDATE| Trigger   | Auto-update booked_seats after booking insert/delete|
| TRG_PAYMENT_STATUS     | Trigger   | Auto-update booking payment_status after payment    |
| TRG_MAINTENANCE_STATUS | Trigger   | Auto-update vehicle status on maintenance record    |

---

## 11. Required MongoDB Query Scenarios

| # | Requirement                                       | MongoDB Query                                                        | API Endpoint                        |
|---|--------------------------------------------------|----------------------------------------------------------------------|-------------------------------------|
| 1 | Retrieve all reviews for a specific route         | `db.reviews.find({ routeId: N })`                                   | `GET /api/reviews/route/{routeId}`  |
| 2 | Identify highest-rated vehicles/drivers           | `db.reviews.aggregate([{$group: {_id: "$vehicleId", avg: {$avg: "$rating"}}}, {$sort: {avg: -1}}])` | `GET /api/reviews/top-rated` |
| 3 | Search complaints by keyword                      | `db.reviews.find({ comment: { $regex: "keyword", $options: "i" } })` | `GET /api/reviews/search?keyword=X` |
| 4 | Retrieve vehicle documents and multimedia         | `db.vehicle_documents.find({ vehicleId: N })`                       | `GET /api/documents/vehicle/{id}`   |

---

## 12. Five Business Reports

| # | Report Name                    | Data Source    | PL/SQL               | API Endpoint                                |
|---|-------------------------------|---------------|----------------------|---------------------------------------------|
| 1 | Most Frequently Used Routes   | BOOKING + ROUTE| Cursor + GROUP BY    | `GET /api/reports/routes`                   |
| 2 | Revenue Within Given Period   | PAYMENT        | FN_CALCULATE_REVENUE | `GET /api/reports/revenue?startDate=&endDate=`|
| 3 | Passenger Travel History      | BOOKING + TRIP | Cursor               | `GET /api/reports/passenger-history/{id}`    |
| 4 | Vehicles Due for Maintenance  | MAINTENANCE    | Query + JOIN         | `GET /api/reports/maintenance`              |
| 5 | Trip Occupancy & Performance  | TRIP + BOOKING | FN_OCCUPANCY_RATE    | `GET /api/reports/trip-performance`          |
