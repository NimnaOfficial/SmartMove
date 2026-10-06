# SmartMove Transport Solutions — Member 3
## Full Responsibilities, Jobs, Work Plan, Deliverables & Handover Guide

**Course:** Data Management 2  
**Assessment:** CW No 1  
**Project:** SmartMove Transport Solutions  
**Role:** Backend + Oracle + PL/SQL + System Integration Developer  
**Team structure:** 2 theory/design members + 2 technical/coding members

---

# 1. Your role in one sentence

You are the **core backend and Oracle implementation owner**.

Your main job is to turn the designs prepared by Members 1 and 2 into a **working Oracle database, working PL/SQL business-logic layer, working Spring Boot backend/API, and a stable connection between the frontend and Oracle/MongoDB**.

You are not responsible for designing every theory document from zero, and you are not the main UI developer. However, you **must understand the whole project** because the assessment includes a presentation and viva and the highest rubric band expects deep understanding.

---

# 2. What the CW requires that directly affects your work

The assessment requires:

- A web or enterprise application for SmartMove Transport Solutions.
- An Oracle relational database.
- Support for:
  - Vehicle Management
  - Driver Management
  - Route Management
  - Passenger Management
  - Trip Scheduling Management
  - Ticket Booking Management
  - Payment Processing
  - Maintenance Management
  - Feedback and Review Management
- Sufficient realistic sample data.
- PL/SQL programs using procedures, functions, cursors and/or triggers with exception handling.
- At least five business reports.
- MongoDB as a complementary NoSQL database for dynamic/unstructured transportation information.
- Application-layer integration with MongoDB.
- Demonstration of four required MongoDB query scenarios.
- Strong Oracle + MongoDB integration is rewarded in the rubric.

The marking rubric gives:
- Front-end Development + ER Diagram — 20%
- Oracle Database Implementation — 15%
- MongoDB Incorporation — 15%
- Reports & Business Logic (PL/SQL) — 15%
- Completeness — 5%
- Presentation & Viva — 20%
- Integration & Innovation — 10%

Your work directly affects the Oracle, PL/SQL, reports and integration areas, and indirectly affects almost every other area.

---

# 3. Your ownership map

## Primary ownership

You are primarily responsible for:

1. Oracle database implementation
2. Oracle schema creation
3. Constraints, sequences and indexes
4. Realistic Oracle sample data
5. PL/SQL implementation
6. Procedures
7. Functions
8. Cursors
9. Triggers
10. Exception handling
11. Five report implementations
12. Spring Boot backend
13. REST API
14. Oracle-to-backend integration
15. Calling PL/SQL from the application
16. Backend validation
17. Authentication/authorization implementation
18. Application security at backend level
19. MongoDB-to-backend integration support
20. Full technical integration
21. Backend testing
22. Technical debugging
23. Deployment/run instructions
24. Technical evidence for presentation/viva

## Shared responsibility

You work jointly with:

- **Member 1:** ERD/schema consistency, normalization, database design corrections, Oracle security/backup design.
- **Member 2:** PL/SQL specifications, report specifications, testing documentation, presentation and viva preparation.
- **Member 4:** React API integration, MongoDB integration, frontend-to-backend flow, final end-to-end testing.

---

# 4. Understand the project architecture before coding

Recommended architecture:

```text
React + TypeScript Frontend
            |
            | REST/JSON
            v
Spring Boot Backend
(Java 17 + Maven)
       /            \
      /              \
     v                v
Oracle Database   MongoDB
Structured data   Dynamic content
```

## Oracle is the transactional/system-of-record side

Recommended structured data:

```text
PASSENGER
DRIVER
VEHICLE
ROUTE
TRIP
BOOKING
PAYMENT
MAINTENANCE
FEEDBACK
```

Oracle should handle the relational business operations and the PL/SQL logic.

## MongoDB is complementary

Recommended collections:

```text
vehicle_documents
reviews
announcements
trip_media
```

MongoDB is used for the dynamic/unstructured information requested by the CW.

## Your central position

You are in the middle:

```text
React
   |
 REST API
   |
Spring Boot
   |
   +------ Oracle
   |
   +------ MongoDB
```

That makes your work critical to the final integration.

---

# 5. Important rule before you start coding

Do NOT invent a separate database design without consulting Member 1.

The correct flow is:

```text
Member 1
  |
  | ERD + normalized schema + data dictionary
  v
Member 3
  |
  | Oracle implementation
  v
Member 2
  |
  | PL/SQL/report specification
  v
Member 3
  |
  | implementation
  v
Member 4
  |
  | UI integration
```

If Member 1 changes the ERD after you have already built half the backend, stop and reconcile the design properly instead of silently creating duplicate structures.

---

# 6. Phase 0 — Get the handoff package from Members 1 and 2

Before serious implementation, collect:

## From Member 1

- Final ER/EER diagram
- Entity list
- Attribute list
- Primary keys
- Foreign keys
- Relationship/cardinality definitions
- Normalization notes
- Data dictionary
- Oracle schema specification
- Constraint requirements
- Any index recommendations
- Business relationships
- Security/backup design requirements

## From Member 2

- PL/SQL specification
- Procedures list
- Functions list
- Cursor requirements
- Trigger requirements
- Exception scenarios
- Five report specifications
- MongoDB design specification
- MongoDB query scenarios
- Test-case list
- Expected report outputs
- Expected business rules
- Presentation/demo requirements

## Your first job

Create an implementation checklist from both handoffs.

Example:

```text
[ ] PASSENGER table
[ ] DRIVER table
[ ] VEHICLE table
[ ] ROUTE table
[ ] TRIP table
[ ] BOOKING table
[ ] PAYMENT table
[ ] MAINTENANCE table
[ ] FEEDBACK table

[ ] Register vehicle procedure
[ ] Register passenger procedure
[ ] Schedule trip procedure
[ ] Create booking procedure
[ ] Process payment procedure
[ ] Record maintenance procedure
[ ] Assign driver procedure
[ ] Cancel booking procedure

[ ] Revenue function
[ ] Available seats function
[ ] Occupancy function
[ ] Driver rating function

[ ] Booking/seat trigger
[ ] Payment/status trigger
[ ] Maintenance/status trigger

[ ] Report 1
[ ] Report 2
[ ] Report 3
[ ] Report 4
[ ] Report 5

[ ] Spring Boot application
[ ] Oracle connection
[ ] REST endpoints
[ ] Authentication
[ ] Authorization
[ ] MongoDB connection
[ ] Report endpoints
[ ] Error handling
[ ] End-to-end tests
```

Do not begin by opening the IDE and randomly writing controllers.

---

# 7. Phase 1 — Set up the GitHub technical structure

Recommended repository:

```text
SmartMove-Transport-Solutions/
|
├── frontend/
│
├── backend/
│   └── smartmove-springboot/
│
├── database/
│   ├── oracle/
│   │   ├── tables/
│   │   ├── sequences/
│   │   ├── constraints/
│   │   ├── indexes/
│   │   ├── views/
│   │   ├── procedures/
│   │   ├── functions/
│   │   ├── triggers/
│   │   ├── cursors/
│   │   ├── reports/
│   │   ├── security/
│   │   ├── backup/
│   │   └── sample-data/
│   │
│   └── mongodb/
│
├── docs/
│
├── testing/
│
└── README.md
```

## Git rules

Use branches so that four people do not destroy each other's work.

Suggested branches:

```text
main
dev
member1
member2
member3
member4
```

Your branch can be:

```text
member3/backend
```

or simply:

```text
member3
```

Commit by logical feature, not by huge random batches.

Good:

```text
feat: add vehicle repository and service
feat: add trip scheduling procedure
feat: add booking API
fix: prevent booking unavailable seat
```

Bad:

```text
final
final2
final-real
final-new
working
```

---

# 8. Phase 2 — Oracle database implementation

This is one of your largest responsibilities.

## 8.1 Create the tables

Implement the final schema from Member 1.

Core areas:

```text
Vehicle
Driver
Route
Passenger
Trip
Booking
Payment
Maintenance
Feedback
```

Do not create inconsistent names.

Choose one naming standard and keep it everywhere.

For example:

```text
PASSENGER
PASSENGER_ID

DRIVER
DRIVER_ID

VEHICLE
VEHICLE_ID

ROUTE
ROUTE_ID

TRIP
TRIP_ID

BOOKING
BOOKING_ID

PAYMENT
PAYMENT_ID

MAINTENANCE
MAINTENANCE_ID

FEEDBACK
FEEDBACK_ID
```

---

# 9. Primary keys

Every main entity must have an appropriate primary key.

Example concept:

```text
PASSENGER
-----------
passenger_id PK
```

```text
VEHICLE
--------
vehicle_id PK
```

Do not allow duplicate primary keys.

---

# 10. Foreign keys and relationships

Implement the relationships defined in the ERD.

Examples:

```text
TRIP.route_id
    -> ROUTE.route_id
```

```text
TRIP.vehicle_id
    -> VEHICLE.vehicle_id
```

```text
BOOKING.passenger_id
    -> PASSENGER.passenger_id
```

```text
BOOKING.trip_id
    -> TRIP.trip_id
```

```text
PAYMENT.booking_id
    -> BOOKING.booking_id
```

The actual relationships must follow the final team ERD.

---

# 11. Constraints

Use database constraints to protect data integrity.

Typical categories:

```text
PRIMARY KEY
FOREIGN KEY
UNIQUE
NOT NULL
CHECK
```

Potential checks:

```text
rating between 1 and 5
ticket price >= 0
capacity > 0
payment amount > 0
```

Use only rules that fit the actual project design.

---

# 12. Sequences / identity strategy

Use a consistent Oracle-supported strategy for generating identifiers.

If using sequences:

```text
SEQ_PASSENGER
SEQ_DRIVER
SEQ_VEHICLE
SEQ_ROUTE
SEQ_TRIP
SEQ_BOOKING
SEQ_PAYMENT
SEQ_MAINTENANCE
SEQ_FEEDBACK
```

The exact implementation depends on the Oracle version and schema design chosen by your team.

Do not mix several ID strategies without a reason.

---

# 13. Indexes

Indexes are not just decoration.

Consider indexing frequently searched foreign keys and reporting/filter fields where appropriate.

Potential examples:

```text
TRIP(route_id)
TRIP(trip_date)
BOOKING(passenger_id)
BOOKING(trip_id)
PAYMENT(payment_date)
MAINTENANCE(next_maintenance_date)
```

Coordinate with Member 1 before finalizing.

---

# 14. Views

Views are optional unless your team decides they improve reporting or presentation.

Useful views can simplify repeated reporting queries, such as:

```text
V_TRIP_DETAILS
V_BOOKING_DETAILS
V_PASSENGER_TRAVEL_HISTORY
V_VEHICLE_MAINTENANCE
```

Do not add views simply to inflate the project.

---

# 15. Realistic Oracle sample data

The CW requires sufficient realistic sample data.

Build enough data so that:

- routes repeat
- passengers make multiple trips
- vehicles have different states
- drivers are assigned to trips
- bookings exist in realistic quantities
- payments exist
- some vehicles are due for maintenance
- feedback exists
- reports produce meaningful results

For example, you want report output where route frequency is actually different:

```text
Colombo -> Kandy     18 bookings
Colombo -> Galle     12 bookings
Colombo -> Negombo    9 bookings
```

not:

```text
Every route = 1 booking
```

because that makes the report unconvincing.

---

# 16. Oracle sample-data dependency order

Insert parent records before dependent records.

Typical order:

```text
1. ROUTE
2. VEHICLE
3. DRIVER
4. PASSENGER
5. TRIP
6. BOOKING
7. PAYMENT
8. MAINTENANCE
9. FEEDBACK
```

The final order depends on foreign keys.

---

# 17. Create a repeatable database setup

A lecturer or team member should be able to follow a clean sequence.

For example:

```text
01_tables.sql
02_sequences.sql
03_constraints.sql
04_indexes.sql
05_views.sql
06_sample_data.sql
07_procedures.sql
08_functions.sql
09_cursors.sql
10_triggers.sql
11_reports.sql
12_security.sql
```

This is much safer than one 5,000-line mystery SQL file.

---

# 18. PL/SQL implementation — your major technical responsibility

Member 2 creates the specification.

You implement it.

The CW specifically requests procedures, functions, cursors and/or triggers with exception handling to perform database operations and business logic.

Your objective is not to write PL/SQL that merely compiles.

Your PL/SQL should demonstrate actual business rules.

---

# 19. Procedures to implement

A recommended set is:

## A. Register vehicle

Purpose:

```text
Insert a valid new vehicle.
```

Validate things such as:

```text
Registration uniqueness
Required fields
Valid capacity
Valid status
```

Handle errors with meaningful exceptions.

---

## B. Register passenger

Purpose:

```text
Create passenger record.
```

Validate:

```text
Required details
Unique contact/email where the design requires it
```

---

## C. Schedule trip

Purpose:

```text
Create a trip linked to route, vehicle and driver.
```

Check:

```text
Route exists
Vehicle exists
Driver exists
Vehicle is available
Driver is available
Date/time is valid
```

The exact checks should follow your agreed business rules.

---

## D. Assign driver

Purpose:

```text
Assign a suitable driver to a trip.
```

Check:

```text
Driver exists
Trip exists
Driver can be assigned
```

---

## E. Create booking

This is one of the most important procedures.

Suggested flow:

```text
Input:
passenger
trip
seat/details
```

Then:

```text
1. Verify passenger
2. Verify trip
3. Verify trip status
4. Check seat availability
5. Validate booking rules
6. Create booking
7. Return booking identifier
```

If anything fails:

```text
ROLLBACK
raise meaningful error
```

Do not leave partial data.

---

## F. Process payment

Suggested flow:

```text
Verify booking
Verify payable amount
Create payment
Update booking/payment status
Return success
```

Payment logic can be a simulated academic payment process unless the lecturer specifically demands a real gateway.

---

## G. Cancel booking

Potential logic:

```text
Verify booking
Check cancellation rules
Change status
Release seat
Update related state
```

---

## H. Record maintenance

Potential logic:

```text
Verify vehicle
Create maintenance record
Update maintenance state
Store maintenance date/details
```

---

# 20. Functions to implement

Functions should return a value.

Recommended examples:

## get_available_seats()

Input:

```text
trip_id
```

Returns:

```text
number of available seats
```

---

## calculate_trip_revenue()

Input:

```text
trip_id
```

Returns:

```text
total revenue
```

---

## calculate_route_occupancy()

Input:

```text
route/trip
```

Returns:

```text
occupancy percentage
```

---

## calculate_driver_rating()

Input:

```text
driver_id
```

Returns:

```text
average rating
```

Only use data actually represented in the database.

---

# 21. Cursors

Cursors should have a meaningful purpose.

Don't create a cursor just to satisfy a checklist.

Good uses include:

```text
Iterating through passengers/trips for a report
Processing records meeting a business condition
Producing a formatted business report
```

Use an explicit or cursor-for-loop style appropriate to the requirement.

Make sure you understand:

```text
OPEN
FETCH
EXIT
CLOSE
```

for explicit cursors, if you use them.

---

# 22. Triggers

Triggers should demonstrate automatic business rules.

Potential examples:

## Trigger A — Booking/payment status

```text
Payment confirmed
     ↓
Booking becomes confirmed
```

## Trigger B — Maintenance

```text
Maintenance created
     ↓
Vehicle status/state updated as designed
```

## Trigger C — Booking/seat consistency

```text
Booking inserted/cancelled
     ↓
Relevant trip availability state maintained
```

Do not create dangerous recursive triggers.

Avoid storing duplicate derived values unless necessary.

---

# 23. Exception handling

This is extremely important.

The rubric's top band asks for robust PL/SQL logic and advanced exception handling.

You should demonstrate:

## Expected business exceptions

Examples:

```text
Passenger does not exist
Trip does not exist
Vehicle unavailable
Driver unavailable
No seats available
Booking does not exist
Duplicate record
Invalid amount
Invalid date/time
```

## SQL/system exceptions

Handle suitable database exceptions where relevant.

Do not hide errors with:

```sql
WHEN OTHERS THEN NULL;
```

That destroys useful diagnostics.

Prefer:

```text
meaningful error
safe rollback
appropriate logging/message
```

where your design supports it.

---

# 24. Transactions and rollback

Business operations should not leave half-completed records.

Example:

```text
CREATE BOOKING
     |
     +--> booking insert
     |
     +--> update related status/seat
     |
     +--> payment/confirmation where appropriate
```

If a critical step fails:

```text
ROLLBACK
```

so the database stays consistent.

Do not commit after every random SQL statement.

Define transaction boundaries intentionally.

---

# 25. Implement the five business reports

The CW says the PL/SQL implementation must include at least five business reports.

Use the team-approved five.

## REPORT 1 — Most Frequently Used Routes

Suggested output:

```text
Rank
Route
Booking Count
```

Logic:

```text
Count bookings
Group by route
Order descending
```

---

## REPORT 2 — Revenue Within a Given Period

Input:

```text
start_date
end_date
```

Output:

```text
Tickets Sold
Total Revenue
Average Ticket Value
```

---

## REPORT 3 — Passenger Travel History

Input:

```text
passenger_id
```

Output:

```text
Passenger
Trip
Route
Travel Date
Vehicle
Booking
Payment Status
```

---

## REPORT 4 — Vehicles Due for Maintenance

Output:

```text
Vehicle
Last Maintenance
Next Maintenance
Status
```

Use date logic appropriate to your final maintenance design.

---

## REPORT 5 — Trip Occupancy & Performance

Suggested output:

```text
Trip
Route
Vehicle
Capacity
Booked Seats
Available Seats
Occupancy %
Revenue
```

This report is particularly useful for demonstrating meaningful business analytics.

---

# 26. Make reports callable from the backend

The report flow should be:

```text
React Reports Page
        |
        v
GET /api/reports/...
        |
        v
Spring Boot
        |
        v
Oracle PL/SQL / report query
        |
        v
Report result
        |
        v
JSON response
        |
        v
React table/chart
```

A report that exists only in SQL Developer is weaker than a report demonstrated inside the actual application.

---

# 27. Spring Boot project setup

Recommended stack:

```text
Java 17
Spring Boot
Maven
Spring Web
Spring Data JPA
Spring Security
Bean Validation
Spring Data MongoDB
Oracle JDBC driver
OpenAPI/Swagger
```

Use versions compatible with your team's actual environment and NIBM setup.

---

# 28. Backend package structure

A clean structure could be:

```text
com.smartmove
|
├── auth
├── config
├── security
|
├── passenger
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   └── dto
|
├── driver
├── vehicle
├── route
├── trip
├── booking
├── payment
├── maintenance
├── feedback
|
├── reports
|
├── mongodb
│   ├── reviews
│   ├── documents
│   ├── announcements
│   └── media
|
└── common
```

The exact package structure can differ, but maintain one consistent architecture.

---

# 29. Backend layer responsibilities

Use a clear separation:

```text
Controller
   ↓
Service
   ↓
Repository / PL/SQL access
   ↓
Oracle
```

For MongoDB:

```text
Controller
   ↓
Service
   ↓
MongoRepository
   ↓
MongoDB
```

Avoid putting all business logic directly inside controllers.

---

# 30. DTOs

Use request/response DTOs for API boundaries where appropriate.

Example concept:

```text
CreateBookingRequest
BookingResponse
PaymentRequest
TripResponse
ReportResponse
```

This reduces coupling between database entities and API contracts.

---

# 31. Validation

Validate requests at the backend.

Examples:

```text
Required fields
Positive amounts
Valid rating range
Valid IDs
Valid dates
Valid status transitions
```

The database remains the ultimate integrity layer, but the API should reject obviously invalid input early.

---

# 32. REST API design

Suggested endpoints:

```text
/api/auth

/api/vehicles
/api/drivers
/api/routes
/api/passengers
/api/trips
/api/bookings
/api/payments
/api/maintenance
/api/feedback

/api/reports
```

Add Mongo-backed endpoints such as:

```text
/api/reviews
/api/announcements
/api/documents
/api/media
```

Use appropriate HTTP methods:

```text
GET
POST
PUT/PATCH
DELETE
```

only where each operation makes business sense.

---

# 33. Oracle access from Spring Boot

You can use JPA for standard relational CRUD.

For PL/SQL-backed business operations, use a suitable Oracle/JPA/JDBC stored-procedure mechanism.

The key architecture is:

```text
Frontend
  ↓
REST API
  ↓
Spring Service
  ↓
Stored Procedure / Function where appropriate
  ↓
Oracle
```

Important business rules should be implemented where the team designed them, not duplicated inconsistently in three layers.

---

# 34. Calling reports from Spring Boot

Report endpoints can look conceptually like:

```text
GET /api/reports/routes
GET /api/reports/revenue?from=...&to=...
GET /api/reports/passenger/{id}/travel-history
GET /api/reports/maintenance-due
GET /api/reports/trip-performance
```

The exact route names are your team's API design choice.

---

# 35. Authentication and authorization

Recommended roles:

```text
ADMIN
DRIVER
PASSENGER
```

Potential permissions:

### ADMIN

```text
Vehicle management
Driver management
Route management
Trip management
Maintenance
Reports
```

### DRIVER

```text
Assigned trip information
Relevant trip updates
```

### PASSENGER

```text
Trip search
Booking
Payment
Travel history
Feedback
```

Do not expose admin endpoints to normal users.

---

# 36. Error handling in the backend

Create consistent API error responses.

Conceptual format:

```json
{
  "timestamp": "...",
  "status": 400,
  "message": "No seats available",
  "path": "/api/bookings"
}
```

The actual format can be simpler or more advanced.

Important:

```text
PL/SQL error
   ↓
Spring catches/maps it
   ↓
Meaningful API response
   ↓
Frontend shows useful message
```

Do not show raw Oracle stack traces to end users.

---

# 37. MongoDB integration — your support responsibility

Member 4 owns the MongoDB implementation, but you are responsible for helping connect it to the application.

The required MongoDB content includes:

```text
Vehicle images and documents
Passenger reviews and feedback comments
Travel announcements and notifications
Trip-related multimedia content
```

The CW also requires MongoDB query demonstrations and application-layer integration.

---

# 38. MongoDB backend architecture

Recommended:

```text
React
  ↓
Spring Boot
  ↓
Spring Data MongoDB
  ↓
MongoDB
```

Collections:

```text
vehicle_documents
reviews
announcements
trip_media
```

Do not force this dynamic content into Oracle merely because Oracle is already connected.

---

# 39. Cross-database linking

Use stable identifiers so Oracle and MongoDB records can refer to each other.

Example:

```text
Oracle:
vehicle_id = 25
```

MongoDB:

```json
{
  "vehicleId": 25,
  "documents": [...]
}
```

Similarly:

```text
routeId
tripId
driverId
passengerId
```

where appropriate.

Do not duplicate complete Oracle relational records inside MongoDB.

Store references and dynamic content.

---

# 40. Required MongoDB query support

The CW requires demonstrations for:

## Query 1

Retrieve all passenger reviews for a specific route.

Backend support should allow something like:

```text
GET /api/reviews/route/{routeId}
```

---

## Query 2

Identify highest-rated vehicles or drivers based on customer feedback.

Possible backend endpoint:

```text
GET /api/reviews/top-rated
```

---

## Query 3

Search customer complaints/feedback using keywords.

Possible endpoint:

```text
GET /api/reviews/search?keyword=delay
```

---

## Query 4

Retrieve vehicle documents and multimedia information.

Possible endpoint:

```text
GET /api/vehicles/{vehicleId}/documents
GET /api/trips/{tripId}/media
```

The exact API design can differ, but all required scenarios should actually work.

---

# 41. End-to-end example you must understand

The most important workflow is probably booking.

```text
Passenger opens application
        ↓
React requests available trips
        ↓
Spring Boot queries Oracle
        ↓
Trips displayed
        ↓
Passenger selects trip
        ↓
React sends booking request
        ↓
Spring Boot validates request
        ↓
Oracle booking procedure executes
        ↓
Procedure checks passenger
        ↓
Procedure checks trip
        ↓
Procedure checks seat availability
        ↓
Booking created
        ↓
Relevant status/seat information updated
        ↓
Payment operation
        ↓
Booking becomes confirmed
        ↓
Response returned to React
        ↓
Passenger sees confirmation
```

You must be able to explain this flow in the viva.

---

# 42. Another end-to-end example — vehicle details

```text
User opens Vehicle 25
          |
          +------ Oracle
          |       Vehicle details
          |       Driver
          |       Status
          |       Maintenance
          |
          +------ MongoDB
                  Images
                  Documents
                  Reviews
                  Dynamic media
```

Spring Boot combines the data into a usable frontend response.

This is a strong demonstration of Oracle + MongoDB integration.

---

# 43. Testing — your responsibility

You should personally test:

## Oracle

```text
[ ] Tables create successfully
[ ] Constraints work
[ ] Foreign keys work
[ ] Sample data inserts correctly
[ ] Procedures execute
[ ] Functions return correct values
[ ] Cursors execute
[ ] Triggers fire correctly
[ ] Exceptions are raised correctly
[ ] Rollback works where required
```

## Backend

```text
[ ] Application starts
[ ] Oracle connection works
[ ] Mongo connection works
[ ] Authentication works
[ ] Authorization works
[ ] CRUD APIs work
[ ] Validation works
[ ] Error handling works
[ ] Report APIs work
```

## Integration

```text
[ ] React can call API
[ ] API can call Oracle
[ ] API can call PL/SQL
[ ] API can call MongoDB
[ ] Oracle data reaches UI
[ ] MongoDB data reaches UI
[ ] Reports appear correctly
```

---

# 44. Database test scenarios

Create intentional failure tests.

Examples:

## Booking with nonexistent passenger

Expected:

```text
Business exception
No invalid booking inserted
```

## Booking when no seats remain

Expected:

```text
Booking rejected
Meaningful message
```

## Payment for nonexistent booking

Expected:

```text
Payment rejected
```

## Duplicate vehicle registration

Expected:

```text
Constraint/business error
```

## Invalid rating

Expected:

```text
Rejected by validation/constraint
```

These demonstrate robust implementation.

---

# 45. Do not forget concurrency/business consistency

Even for an academic application, think about cases such as:

```text
Two people trying to book the same final seat.
```

Your booking logic should be designed to reduce the risk of inconsistent seat availability.

Use appropriate transactional database logic.

You do not need to create a massive enterprise distributed transaction system. You do need to show that you understand why booking is a business-critical transaction.

---

# 46. Technical evidence you must give the team

Capture evidence while developing, not one hour before presentation.

Useful evidence:

```text
Oracle schema screenshot
ERD-to-table consistency
PL/SQL procedure execution
Function execution
Trigger result
Exception handling result
Report 1 result
Report 2 result
Report 3 result
Report 4 result
Report 5 result
MongoDB query results
Spring Boot running
REST API result
Frontend consuming API
Oracle + MongoDB hybrid page
Authentication/role demo
```

Give clean screenshots to Member 2.

---

# 47. README technical section

You should provide the technical setup information for the final README.

Include:

```text
Prerequisites
Java version
Maven
Oracle requirements
MongoDB requirements
Environment variables
Database setup
Backend setup
Frontend setup
Run commands
Test credentials where appropriate
```

Do not commit passwords, private keys or secrets.

---

# 48. Environment variables

Never hard-code sensitive credentials.

Conceptually:

```text
DB_URL=...
DB_USERNAME=...
DB_PASSWORD=...

MONGO_URI=...

JWT_SECRET=...
```

Use an example file:

```text
.env.example
```

without real credentials.

---

# 49. Technical setup documentation

Make the project reproducible.

Recommended sequence:

```text
1. Create Oracle schema/user if required
2. Run Oracle setup scripts
3. Insert sample data
4. Configure MongoDB
5. Insert MongoDB sample data
6. Set environment variables
7. Start Spring Boot
8. Start React
9. Login
10. Run sample workflow
```

This is important for the final demo.

---

# 50. Branch and merge discipline

Before merging your work:

```text
git pull
git checkout your-branch
work
test
commit
push
open/prepare merge
```

When integrating:

```text
member3 backend
        ↓
dev
        ↓
test
        ↓
main
```

Do not merge broken code simply because the deadline is close.

---

# 51. What Member 1 should receive from you

After Oracle implementation:

```text
Final implemented Oracle schema
Table names
Column names
Constraints
Relationship implementation
Any schema changes from original ERD
```

If your implementation reveals a design issue, tell Member 1.

Do not silently change the ERD.

---

# 52. What Member 2 should receive from you

Give Member 2:

```text
Procedure names
Function names
Trigger names
Cursor implementation
Exception handling scenarios
Report output screenshots
Oracle execution screenshots
Backend/API screenshots
Testing evidence
Technical architecture information
```

Especially provide:

```text
"How this report works"
"Which tables it uses"
"Which PL/SQL program generates it"
"How the application calls it"
```

This lets Member 2 write technically accurate presentation/viva material.

---

# 53. What Member 4 should receive from you

Member 4 needs:

```text
API base URL
Endpoint list
Request formats
Response formats
Authentication requirements
Role permissions
Error response format
Report API contracts
MongoDB-backed endpoint contracts
```

Do not change API responses casually after Member 4 has connected the UI.

---

# 54. API contract document

Create a simple technical document like:

```text
GET /api/vehicles
Response:
[
  {
    "id": 1,
    "registrationNumber": "...",
    "capacity": 40,
    "status": "AVAILABLE"
  }
]
```

For booking:

```text
POST /api/bookings
Request:
{
  "passengerId": 1,
  "tripId": 20
}
```

The exact JSON fields should match your final implementation.

---

# 55. Daily technical checklist

At the end of every work session:

```text
[ ] Code committed
[ ] Code pushed
[ ] No secrets committed
[ ] Database scripts updated
[ ] API still starts
[ ] Existing functions still work
[ ] New feature tested
[ ] Team informed of breaking changes
```

---

# 56. Weekly team sync

Tell the team:

```text
What is completed?
What changed?
What is blocked?
What API changed?
What database changed?
What evidence was captured?
What does the other member need?
```

Keep the synchronization short and practical.

---

# 57. Technical quality rules

## Rule 1 — Do not hard-code business results

Bad:

```text
return 250000;
```

when the requirement is to calculate actual revenue.

Good:

```text
Calculate from Oracle data.
```

---

## Rule 2 — Do not use fake reports

The reports should use real database data.

---

## Rule 3 — Do not make MongoDB decorative

If the MongoDB database exists but the application never uses it, the integration is weak.

---

## Rule 4 — Do not put all business logic in React

React should not independently calculate important business rules that should come from backend/database logic.

---

## Rule 5 — Do not hide database errors

Log and handle them appropriately.

---

## Rule 6 — Do not bypass the agreed ERD

Database and diagram must match.

---

# 58. Suggested implementation order for you

Follow this exact order unless the team finds a real dependency requiring a change.

```text
1. Receive final ERD
2. Receive data dictionary
3. Create Oracle tables
4. Create sequences/IDs
5. Create constraints
6. Create indexes
7. Insert realistic sample data
8. Test basic SQL
9. Implement PL/SQL procedures
10. Implement PL/SQL functions
11. Implement cursors
12. Implement triggers
13. Implement exception handling
14. Implement five reports
15. Test PL/SQL
16. Create Spring Boot project
17. Connect Oracle
18. Implement entities/repositories
19. Implement services
20. Implement controllers
21. Implement validation
22. Implement authentication
23. Implement authorization
24. Integrate PL/SQL into backend
25. Integrate reports into backend
26. Connect MongoDB through backend
27. Expose MongoDB features through APIs
28. Give API contracts to Member 4
29. Connect React to backend
30. Run end-to-end tests
31. Fix integration bugs
32. Capture evidence
33. Prepare technical demo
34. Prepare viva explanations
35. Freeze release version
```

---

# 59. Final integration checklist

Before declaring your technical work complete:

## Oracle

```text
[ ] Complete schema
[ ] Correct relationships
[ ] Constraints
[ ] Sequences/IDs
[ ] Indexes where appropriate
[ ] Realistic sample data
[ ] Security implementation/design integrated
[ ] Backup implementation/documentation integrated
```

## PL/SQL

```text
[ ] Procedures
[ ] Functions
[ ] Cursors
[ ] Triggers
[ ] Exception handling
[ ] Transactions
[ ] Meaningful business logic
```

## Reports

```text
[ ] Frequent routes
[ ] Revenue by period
[ ] Passenger travel history
[ ] Maintenance due
[ ] Trip occupancy/performance
```

## Spring Boot

```text
[ ] Oracle connection
[ ] MongoDB connection
[ ] REST APIs
[ ] Validation
[ ] Authentication
[ ] Authorization
[ ] Error handling
[ ] PL/SQL calls
[ ] Report calls
```

## Integration

```text
[ ] React -> Spring Boot
[ ] Spring Boot -> Oracle
[ ] Spring Boot -> MongoDB
[ ] Oracle reports -> API
[ ] MongoDB queries -> API
[ ] API -> React
```

## Testing

```text
[ ] Positive tests
[ ] Negative tests
[ ] Exception tests
[ ] Role tests
[ ] Booking tests
[ ] Payment tests
[ ] Maintenance tests
[ ] Report tests
[ ] MongoDB tests
[ ] Full end-to-end scenario
```

---

# 60. Full end-to-end acceptance scenario

Your team should be able to demonstrate all of the following without changing code during the demo:

```text
1. Login as passenger
2. View available trips
3. Select a route/trip
4. Book a ticket
5. Process simulated payment
6. See booking confirmation
7. View passenger travel history
8. Submit feedback/review
9. View dynamic MongoDB review/content
10. Login as admin
11. Add/manage vehicle
12. Add/manage driver
13. Manage route
14. Schedule trip
15. Record maintenance
16. Open reports
17. Run all five reports
18. Display MongoDB content
19. Demonstrate four required MongoDB query scenarios
20. Show Oracle + MongoDB working together
```

The actual UI sequence may differ, but your system should cover equivalent functionality.

---

# 61. What you must be able to explain in the viva

You need to know the entire project, not only the backend.

## Oracle questions

Be ready for:

```text
Why Oracle?
Why relational database?
What is a primary key?
What is a foreign key?
Why these relationships?
Why these constraints?
Why indexes?
Why normalization?
```

## PL/SQL questions

```text
What is PL/SQL?
Procedure vs function?
What is a cursor?
Why use a trigger?
What is exception handling?
How does rollback work?
Why put this business rule in PL/SQL?
```

## Backend questions

```text
Why Spring Boot?
What is REST?
What is a controller?
What is a service?
What is a repository?
Why DTOs?
How does authentication work?
How is authorization enforced?
```

## Integration questions

```text
How does React communicate with backend?
How does backend communicate with Oracle?
How does backend call PL/SQL?
How does backend access MongoDB?
Why use both Oracle and MongoDB?
```

## Business-flow questions

```text
How does booking work?
How do you stop invalid bookings?
How is payment linked to booking?
How are maintenance records linked to vehicles?
How is revenue calculated?
```

---

# 62. Biggest mistakes to avoid

## Mistake 1 — Building only CRUD

CRUD alone will not demonstrate the full PL/SQL/report/integration requirement.

---

## Mistake 2 — PL/SQL scripts not connected to the application

You should be able to demonstrate that important business logic is actually usable.

---

## Mistake 3 — MongoDB sitting separately

The CW specifically asks for application-layer integration.

---

## Mistake 4 — Database design and code disagree

If the ERD says one relationship and the database implements another, the project looks inconsistent.

---

## Mistake 5 — No realistic sample data

Reports become meaningless.

---

## Mistake 6 — Weak exception handling

Avoid:

```sql
WHEN OTHERS THEN NULL;
```

---

## Mistake 7 — One giant controller/service

Keep the code maintainable.

---

## Mistake 8 — Hard-coded dashboard numbers

Use real backend/database data.

---

## Mistake 9 — Only happy-path testing

The lecturer may intentionally try invalid input.

---

## Mistake 10 — You know only your own code

You still have to participate in the whole project and viva.

---

# 63. What "finished" means for Member 3

You are finished only when all of this is true:

```text
Oracle works
+
PL/SQL works
+
Reports work
+
Spring Boot works
+
API works
+
Authentication works
+
MongoDB integration works
+
React can consume the APIs
+
End-to-end scenario works
+
Evidence is captured
+
Team understands your implementation
```

Not merely:

```text
"Backend compiles."
```

---

# 64. Your final handover package

Give the team:

```text
database/oracle/
    all SQL scripts

backend/
    complete Spring Boot project

docs/
    API specification
    technical setup notes

testing/
    backend/database evidence

screenshots/
    Oracle
    PL/SQL
    reports
    APIs
    integration
```

Also make a short technical handover file:

```text
MEMBER3_HANDOVER.md
```

containing:

```text
How to start backend
How to connect Oracle
How to connect MongoDB
Environment variables
API base URL
Test user roles
Database setup order
Known limitations
Important business rules
```

---

# 65. Final responsibility summary

Your job is essentially:

```text
          MEMBER 1
       ERD + Database
          DESIGN
             |
             v
        ┌─────────┐
        │ MEMBER 3│
        │         │
        │ ORACLE  │
        │ PL/SQL  │
        │ BACKEND │
        │  APIs   │
        │ SECURITY│
        │INTEGRATE│
        └────┬────┘
             |
      ┌──────┴──────┐
      v             v
   Oracle        MongoDB
      ^             ^
      |             |
      └────Spring───┘
             |
             v
          MEMBER 4
        React Frontend
```

Your role is the **technical bridge** between the database design, business logic, frontend and MongoDB.

---

# 66. One final rule

The assessment sheet explicitly states that **AI-generated contents will obtain 0 marks**.

Therefore, use this guide as your project planning/learning document, but make sure your team follows your lecturer's academic-integrity requirements and that you personally understand, implement, test and can explain the submitted work.

Do not submit material simply because an AI produced it.

---

# MEMBER 3 MASTER CHECKLIST

```text
DESIGN HANDOFF
[ ] Received final ERD
[ ] Received data dictionary
[ ] Received PL/SQL specification
[ ] Received 5 report specification
[ ] Received MongoDB specification

ORACLE
[ ] Tables
[ ] PK
[ ] FK
[ ] NOT NULL
[ ] UNIQUE
[ ] CHECK
[ ] Sequences/IDs
[ ] Indexes
[ ] Views where needed
[ ] Sample data
[ ] Security
[ ] Backup support

PL/SQL
[ ] Procedures
[ ] Functions
[ ] Cursors
[ ] Triggers
[ ] Exceptions
[ ] Transactions
[ ] Rollback
[ ] Meaningful errors

REPORTS
[ ] Frequently used routes
[ ] Revenue by period
[ ] Passenger travel history
[ ] Vehicles due maintenance
[ ] Trip occupancy/performance

BACKEND
[ ] Spring Boot
[ ] Java 17
[ ] Maven
[ ] Oracle JDBC/JPA
[ ] MongoDB
[ ] REST
[ ] DTOs
[ ] Validation
[ ] Error handling
[ ] Authentication
[ ] Authorization

INTEGRATION
[ ] React -> API
[ ] API -> Oracle
[ ] API -> PL/SQL
[ ] API -> MongoDB
[ ] Reports -> frontend
[ ] Mongo queries -> frontend
[ ] Hybrid Oracle + MongoDB page

TESTING
[ ] Positive tests
[ ] Negative tests
[ ] Business exceptions
[ ] Booking tests
[ ] Payment tests
[ ] Maintenance tests
[ ] Report tests
[ ] MongoDB tests
[ ] End-to-end test

HANDOVER
[ ] SQL scripts
[ ] Backend source
[ ] API documentation
[ ] Setup guide
[ ] Screenshots/evidence
[ ] Team handover
[ ] Viva preparation
```

## The goal for Member 3

> **Build the technical engine that makes the entire SmartMove system actually work — Oracle + PL/SQL + Spring Boot + REST APIs + MongoDB integration — and leave the other members with a stable system they can demonstrate confidently.**
