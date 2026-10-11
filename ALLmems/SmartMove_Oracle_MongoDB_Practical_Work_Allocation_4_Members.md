# SmartMove Transport Solutions
## Oracle + MongoDB Practical Implementation Work Allocation
### Member-by-member database jobs — implementation only

**Module:** Data Management 2  
**Project:** SmartMove Transport Solutions  
**Team:** Four members  
**Scope:** Practical Oracle SQL, PL/SQL, MongoDB, sample data, queries, validation, and database integration tests.

> This guide allocates implementation work only. It does not allocate physical equipment/setup tasks, UI design, presentation writing, theory-document writing, or general project-management tasks. The group should still understand the whole database implementation for the viva.

---

# 1. What the database work must deliver

## Oracle

- Relational tables and relationships for the nine core operations.
- Primary keys, foreign keys, unique/not-null/check constraints.
- Sequences or another consistent ID-generation method.
- Appropriate indexes without redundant indexes.
- Realistic sample data.
- PL/SQL procedures/functions and the agreed use of cursors/triggers, with exception handling.
- Consistent transactional behaviour for bookings, payments, cancellations and maintenance.
- At least five working business reports.
- Runnable SQL scripts and repeatable validation tests.

## MongoDB

Required content areas:

- Vehicle images and documents.
- Passenger reviews and feedback comments.
- Travel announcements and notifications.
- Trip-related multimedia.

Required query demonstrations:

1. Retrieve reviews for a specified route.
2. Identify highest-rated vehicles or drivers from customer feedback.
3. Search complaints/feedback by keyword.
4. Retrieve vehicle documents and multimedia.

Also required in the practical implementation:

- Realistic sample documents.
- Appropriate query indexes.
- Stable references to Oracle records.
- Repeatable query scripts and result tests.

---

# 2. Final ownership model

Use one shared Oracle integration database and one shared MongoDB integration database/cluster. Members can develop scripts on separate Git branches, but changes to the shared database must be reviewed and coordinated.

| Member | Primary practical ownership | Secondary practical ownership |
|---|---|---|
| **Member 1** | Oracle schema foundation: `PASSENGER`, `DRIVER`, `VEHICLE`, `ROUTE` | MongoDB ID/reference convention and cross-database reference validation |
| **Member 2** | PL/SQL programming and Reports 1–3 | MongoDB queries 1–2 and query-result validation |
| **Member 3** | Oracle transactional tables, transaction/business operations, Reports 4–5 | Oracle–MongoDB cross-reference tests and backend database contract tests |
| **Member 4** | MongoDB collections, sample documents, indexes, queries 3–4 | Oracle ID reference validation and joint end-to-end database tests |

**Ownership means accountability, not isolation.** Every member must review and test the others' database work where it affects shared functionality.

---

# 3. Recommended script structure in GitHub

```text
database/
├── oracle/
│   ├── 00_setup/
│   ├── 01_sequences/
│   ├── 02_tables_master/
│   ├── 03_tables_transactional/
│   ├── 04_constraints/
│   ├── 05_indexes/
│   ├── 06_sample_data/
│   ├── 07_procedures/
│   ├── 08_functions/
│   ├── 09_cursors/
│   ├── 10_triggers/
│   ├── 11_reports/
│   ├── 12_security_grants/
│   ├── 13_validation_tests/
│   └── README.md
└── mongodb/
    ├── 00_setup/
    ├── 01_collections/
    ├── 02_indexes/
    ├── 03_sample_data/
    ├── 04_queries/
    ├── 05_validation_tests/
    └── README.md
```

Suggested Oracle files:

```text
01_sequences/01_sequences.sql
02_tables_master/01_passenger_driver_vehicle_route.sql
03_tables_transactional/01_trip_booking_payment.sql
04_constraints/01_foreign_keys_checks.sql
05_indexes/01_indexes.sql
06_sample_data/01_master_data.sql
06_sample_data/02_trip_booking_data.sql
07_procedures/01_booking_operations.sql
08_functions/01_business_functions.sql
09_cursors/01_report_cursors.sql
10_triggers/01_business_triggers.sql
11_reports/01_frequent_routes.sql
11_reports/02_revenue_by_period.sql
11_reports/03_passenger_history.sql
11_reports/04_maintenance_due.sql
11_reports/05_trip_performance.sql
13_validation_tests/01_integrity_tests.sql
13_validation_tests/02_transaction_tests.sql
```

Suggested MongoDB files:

```text
01_collections/01_create_collections.js
02_indexes/01_indexes.js
03_sample_data/01_vehicle_documents.js
03_sample_data/02_reviews.js
03_sample_data/03_announcements.js
03_sample_data/04_trip_media.js
04_queries/01_reviews_by_route.js
04_queries/02_highest_rated.js
04_queries/03_keyword_search.js
04_queries/04_vehicle_documents_media.js
05_validation_tests/01_oracle_reference_ids.js
```

Do not maintain multiple competing versions of the same script. If your team already has a working script structure, adapt this guide to it.

---

# 4. MEMBER 1 — Oracle schema foundation and cross-database references

## Main objective

Build and validate the relational foundation so other members can safely write PL/SQL and business operations against a stable schema.

## A. Oracle tables owned by Member 1

Implement these master/core tables using the approved team schema:

```text
PASSENGER
DRIVER
VEHICLE
ROUTE
```

### `PASSENGER`

Practical checks:

- Primary key for passenger ID.
- First and last name.
- Unique email.
- Contact number.
- Password hash only—never store a plaintext password.
- Valid account status.
- Role if required by the final design.
- Registration/update timestamp fields.

### `DRIVER`

Practical checks:

- Primary key for driver ID.
- Name and contact information.
- Unique email.
- Unique licence number.
- Password hash if drivers authenticate.
- Valid driver status.
- Rating and trip-count fields only if retained in the agreed schema.
- Timestamp fields.

### `VEHICLE`

Practical checks:

- Primary key for vehicle ID.
- Unique registration number.
- Type and capacity.
- Model/year if used by the agreed design.
- Valid status.
- Timestamp fields.

### `ROUTE`

Practical checks:

- Primary key for route ID.
- Origin and destination.
- Distance and estimated duration where used.
- Base fare.
- Valid status.
- Timestamp fields.

## B. IDs, constraints and indexes

Create and test:

- Primary keys.
- Unique constraints for passenger/driver email, driver licence number, and vehicle registration as applicable.
- `NOT NULL` constraints for required fields.
- `CHECK` constraints for allowed status values, positive capacity, rating range and valid monetary values.
- Sequences or one consistent identity strategy.
- Indexes only where they add value and are not redundant with unique/primary-key indexes.

**Avoid the team's previously encountered `ORA-01408` problem:** if `EMAIL` or `REGISTRATION_NUMBER` is declared `UNIQUE`, Oracle normally creates an index to enforce that constraint. Do not add a redundant single-column index on the same column list without a specific reason.

## C. Master sample data

Populate enough data to support meaningful reports and foreign-key tests. Practical initial targets—not exact lecturer-mandated numbers—are:

- 10+ passengers.
- 5+ drivers.
- 5+ vehicles.
- 5+ routes.

Data must be varied, not all identical. Ensure emails/licence numbers/registrations are unique and keep IDs stable so the other members can refer to them from Oracle and MongoDB.

## D. MongoDB contribution

Member 1 does not own all MongoDB implementation. The practical MongoDB tasks are:

1. Agree the ID convention with Member 4.
2. Verify that `vehicleId`, `routeId`, `driverId`, `passengerId`, and `tripId` values in MongoDB refer to real Oracle rows when intended.
3. Run reference-validation checks against the agreed Oracle test dataset.
4. Report inconsistent or nonexistent references to Member 4 before the final query demos.

Example cross-database reference:

```json
{
  "vehicleId": 1,
  "routeId": 2,
  "driverId": 3,
  "tripId": 4
}
```

Use Oracle numeric IDs consistently as numeric values unless the team intentionally adopts another explicit conversion convention. Do not copy complete relational rows into MongoDB just to make references work.

## E. Member 1 deliverables

```text
[ ] DDL for PASSENGER
[ ] DDL for DRIVER
[ ] DDL for VEHICLE
[ ] DDL for ROUTE
[ ] Sequence/ID scripts
[ ] Constraints and index scripts
[ ] Master sample data
[ ] Integrity-validation SQL
[ ] ID/reference convention confirmed with Member 4
[ ] Cross-reference test results
```

## F. Member 1 acceptance tests

- Duplicate passenger email is rejected.
- Duplicate driver email/licence number is rejected.
- Duplicate vehicle registration is rejected.
- Invalid statuses are rejected.
- Invalid capacity/rating values are rejected.
- Parent rows exist before child records are inserted.
- Master queries show the expected sample data.

---

# 5. MEMBER 2 — Oracle PL/SQL, Reports 1–3 and MongoDB queries 1–2

## Main objective

Implement meaningful database-side business logic and make the first three business reports work against actual Oracle data.

## A. PL/SQL implementation

Coordinate procedure ownership with Member 3. Implement assigned procedures/functions/cursors/triggers rather than duplicating the same business logic in conflicting programs.

Possible practical operations include:

- Registration operations where the team wants them enforced through PL/SQL.
- Calculation of fare/revenue or available seats.
- Booking/report retrieval logic shared with Member 3.
- Report cursor/output logic.

The final code must demonstrate the PL/SQL structures selected by the team and must include meaningful exception handling.

## B. Exception handling

Build and test useful outcomes for cases such as:

- Passenger not found.
- Trip not found.
- No seats available.
- Invalid booking state.
- Invalid date range.
- Duplicate business identifier.
- Invalid payment or booking reference.

Do not hide errors using `WHEN OTHERS THEN NULL`. A failed operation should give a meaningful failure and should not leave partial/inconsistent records.

## C. Report 1 — Most frequently used routes

Suggested output:

- Route ID.
- Origin and destination.
- Booking count.
- Rank.
- Passenger count only if the definition is clear and meaningful.

Tests:

- A route with many bookings ranks above one with fewer bookings.
- The report handles routes with no bookings consistently.
- Cancelled bookings are treated according to the agreed counting rule.

## D. Report 2 — Revenue within a period

Input parameters:

- Start date.
- End date.

Suggested output:

- Number of qualifying ticket sales/bookings.
- Total revenue.
- Average ticket value.
- Optional breakdown by date/route.

Define which payment statuses count as revenue. For example, successful payments should count; failed payments should not. Ensure the date boundary and status logic are testable and documented in code comments.

## E. Report 3 — Passenger travel history

Input:

- Passenger ID.

Output:

- Passenger.
- Trip.
- Route.
- Departure date/time.
- Vehicle.
- Booking status.
- Payment status.

Test both a passenger with multiple bookings and a passenger with no bookings.

## F. MongoDB Query 1 — Reviews by route

With Member 4's approved collection structure:

- Accept a `routeId`.
- Return all reviews for that route.
- Test a route with matching reviews and one with no reviews.
- Confirm route IDs reference actual Oracle routes where expected.

## G. MongoDB Query 2 — Highest-rated vehicles/drivers

- Aggregate reviews by `vehicleId` and/or `driverId`.
- Calculate average numeric rating.
- Include review count if possible, so one review does not look equivalent to a large sample.
- Sort from highest to lowest.
- Test ties, missing rating values and no-result scenarios.

Use the actual collection/field names agreed with Member 4. Do not assume the sample query matches a different document structure.

## H. Member 2 deliverables

```text
[ ] Assigned PL/SQL scripts
[ ] Exception/negative tests
[ ] Report 1 script and verified output
[ ] Report 2 script and verified output
[ ] Report 3 script and verified output
[ ] MongoDB Query 1 script and verified output
[ ] MongoDB Query 2 script and verified output
[ ] Result-check notes
```

---

# 6. MEMBER 3 — Oracle transactional tables, transaction correctness and Reports 4–5

## Main objective

Implement the transactional relational part and make booking, payment, cancellation and maintenance operations keep data consistent when they succeed or fail.

## A. Oracle transactional tables owned by Member 3

Implement these tables according to the final ERD:

```text
TRIP
BOOKING
PAYMENT
MAINTENANCE
FEEDBACK
```

### `TRIP`

Validate:
- Trip ID primary key.
- Route foreign key.
- Vehicle foreign key.
- Driver foreign key.
- Departure/arrival fields.
- Available-seat or agreed capacity model.
- Valid trip status.
- Sensible date/time constraints.

### `BOOKING`

Validate:
- Booking ID.
- Passenger FK.
- Trip FK.
- Seats booked.
- Total fare.
- Booking status.
- Payment status.
- Booking timestamp.
- Valid quantities and monetary values.

### `PAYMENT`

Validate:
- Payment ID.
- Booking FK.
- Amount.
- Payment method.
- Payment date.
- Status.
- Unique transaction reference if used.

### `MAINTENANCE`

Validate:
- Maintenance ID.
- Vehicle FK.
- Description.
- Cost.
- Maintenance date.
- Status.
- Next-maintenance date if needed for the due-report rule.

### `FEEDBACK`

Validate:
- Feedback ID.
- Passenger FK.
- Optional trip FK.
- Type.
- Description.
- Status.
- Timestamp.

If rating needs to exist in Oracle as well as MongoDB, agree the model with Member 1/2/4 before adding a second incompatible feedback/review structure.

## B. Insert in foreign-key dependency order

A typical dependency order is:

```text
PASSENGER / DRIVER / VEHICLE / ROUTE
                    |
                    v
                   TRIP
                    |
                    v
                  BOOKING
                    |
                    v
                  PAYMENT

VEHICLE -> MAINTENANCE
PASSENGER/TRIP -> FEEDBACK
```

## C. Transaction-safe operations

Coordinate the final PL/SQL program ownership with Member 2.

### Booking

- Verify passenger and trip exist.
- Verify that the trip is open for booking.
- Verify enough seats are available.
- Validate the requested quantity.
- Calculate/verify fare according to the agreed rule.
- Insert the booking and update availability using one consistent strategy.
- Roll back related changes if a critical step fails.

### Payment

- Verify booking exists.
- Validate amount.
- Record outcome.
- Update booking/payment status consistently.
- Prevent accidental duplicate confirmation.

### Cancellation

- Verify booking exists and can be cancelled.
- Update status.
- Release seats when appropriate.
- Apply the agreed refund/payment-state rule.

### Maintenance

- Verify vehicle exists.
- Insert maintenance record.
- Update vehicle status only according to the agreed business rule.
- Ensure the maintenance report reflects the operation.

Avoid maintaining `AVAILABLE_SEATS` in one place while calculating it differently elsewhere. Agree whether seats are stored or calculated and apply that choice consistently.

## D. Report 4 — Vehicles due for maintenance

Suggested output:

- Vehicle ID and registration.
- Last maintenance date.
- Next maintenance/due date if supported.
- Vehicle status.
- Maintenance status.

**Schema issue to resolve:** the current provided `MAINTENANCE` sample table has `MAINTENANCE_DATE` but no `NEXT_MAINTENANCE_DATE`. To accurately report vehicles due for maintenance, agree on a due-date rule with Member 1 and add the necessary field or use an explicitly defined valid alternative before creating the report.

## E. Report 5 — Trip occupancy and performance

Suggested output:

- Trip ID.
- Route.
- Vehicle.
- Capacity.
- Booked seats.
- Available seats.
- Occupancy percentage.
- Revenue under the agreed revenue definition.

Validate the calculations against sample data. Ensure cancelled bookings and unpaid/failed payments are treated consistently.

## F. Database contract for the backend

Give the backend developer the exact:

- Table/view/procedure names.
- Parameters and return values.
- Valid statuses.
- Exception conditions.
- Transaction behaviour.
- Report query/program signatures.

## G. Member 3 deliverables

```text
[ ] DDL for TRIP
[ ] DDL for BOOKING
[ ] DDL for PAYMENT
[ ] DDL for MAINTENANCE
[ ] DDL for FEEDBACK
[ ] Required constraints/foreign keys
[ ] Transactional sample data
[ ] Booking/payment/cancellation consistency tests
[ ] Report 4 script and verified output
[ ] Report 5 script and verified output
[ ] Failure/rollback test results
[ ] Backend database contract
```

---

# 7. MEMBER 4 — MongoDB collections, indexes, sample documents and queries 3–4

## Main objective

Implement the NoSQL content required by the CW and prove that the queries return correct results against actual sample documents.

## A. Required collection: `vehicle_documents`

Store vehicle image/document metadata and references.

Example document shape:

```json
{
  "vehicleId": 1,
  "images": [
    {
      "type": "IMAGE",
      "url": "https://example.invalid/vehicle-1-front.jpg",
      "caption": "Front view"
    }
  ],
  "documents": [
    {
      "type": "INSURANCE",
      "fileName": "insurance-sample.pdf",
      "url": "https://example.invalid/insurance-sample.pdf",
      "uploadedAt": "2026-10-01T10:00:00Z"
    }
  ]
}
```

Replace placeholder URLs with working demo references or a safe storage pattern selected by the team. Do not use private real documents.

## B. Required collection: `reviews`

Recommended common fields:

- `routeId`
- `vehicleId` where applicable
- `driverId` where applicable
- `passengerId` where applicable
- Numeric `rating`
- `comment`
- `createdAt`
- Optional `tags` or content category

Example:

```json
{
  "routeId": 1,
  "vehicleId": 1,
  "driverId": 1,
  "passengerId": 1,
  "rating": 5,
  "comment": "Comfortable journey and professional driver.",
  "type": "REVIEW",
  "tags": ["comfortable", "punctual"],
  "createdAt": "2026-10-01T10:30:00Z"
}
```

## C. Required collection: `announcements`

Recommended fields:
- Title.
- Message.
- Published timestamp.
- Priority.
- Target audience.
- Status.
- Optional expiry/read-state field.

## D. Required collection: `trip_media`

Recommended fields:
- `tripId`.
- Optional `routeId` and `vehicleId`.
- Media type.
- URL/path/reference.
- Caption.
- Created/published timestamp.
- Optional metadata.

Store references/metadata for large files unless the team implements a suitable alternative.

## E. Indexes

Create indexes suited to actual query patterns, for example:

- `reviews.routeId`
- `reviews.vehicleId`
- `reviews.driverId`
- `reviews.rating`
- `reviews.createdAt`
- `vehicle_documents.vehicleId`
- `trip_media.tripId`
- `announcements.status`
- `announcements.publishedAt`

Use compound indexes only when justified by the query. Do not create every imaginable index without a purpose.

## F. Required Query 3 — keyword search

Implement keyword search against complaint/review text.

Test keywords that appear in the data, such as `delay`, `late`, `rude`, `clean`, or `crowded`.

Test:
- A keyword with results.
- A keyword with no results.
- Case handling if needed.
- Missing/blank search terms.

Choose a defined strategy, such as text-index search or a controlled regex. Be aware that text search and substring search are not identical.

## G. Required Query 4 — vehicle documents and multimedia

Implement scripts that retrieve:
- Image/document data for a `vehicleId`.
- Multimedia data for a `tripId` and/or agreed route/vehicle reference.

Test an ID that has content and an ID that has no content.

## H. Sample document targets

Suggested working targets, not lecturer-mandated quantities:

- 15–30 varied reviews.
- 5–10 vehicle document/image records.
- 5–10 announcements.
- 5–10 trip media records.

Ensure ratings vary and sample comments contain search keywords. Use Oracle IDs that really exist.

## I. Member 4 deliverables

```text
[ ] Four MongoDB content collections
[ ] Collection initialization scripts
[ ] Index script
[ ] Sample documents
[ ] Query 3 script and verified results
[ ] Query 4 script and verified results
[ ] Cross-reference checks for Oracle IDs
[ ] MongoDB setup/run instructions
[ ] Evidence of the four required queries
```

---

# 8. Shared Oracle–MongoDB rules

## Rule A — Use one identifier convention

If `VEHICLE.VEHICLE_ID = 1` in Oracle, a MongoDB document referring to that vehicle should use `vehicleId: 1` consistently. Do not switch randomly between numeric `1` and string `"1"`.

## Rule B — MongoDB complements Oracle

Keep transactional records in Oracle:
- Booking.
- Payment.
- Trip.
- Operational vehicle status.
- Maintenance transactions.

Keep the flexible content required by the CW in MongoDB:
- Reviews/comments.
- Announcements/notifications.
- Vehicle documents/images metadata.
- Trip multimedia metadata.

## Rule C — Avoid duplicate sources of truth

If Oracle owns vehicle status, do not maintain a separately editable competing status in MongoDB. Store a reference to the Oracle vehicle and Mongo-specific content.

## Rule D — Validate references

Check that route/vehicle/driver/passenger/trip IDs in MongoDB match real Oracle sample records whenever those references are required.

## Rule E — Keep credentials private

Do not commit Oracle wallet files, database passwords, MongoDB URIs containing credentials, or administrative credentials to GitHub. Use environment variables or ignored local config files.

---

# 9. Oracle report acceptance tests

| Report | Owner | Acceptance test |
|---|---|---|
| 1. Most frequently used routes | Member 2 | Routes rank correctly by the agreed booking-count rule |
| 2. Revenue in a period | Member 2 | Date boundaries and qualifying payment statuses are correct |
| 3. Passenger travel history | Member 2 | Multiple trips and zero-trip passengers are handled correctly |
| 4. Vehicles due for maintenance | Member 3 | Due-date rule is defined and results match maintenance data |
| 5. Trip occupancy/performance | Member 3 | Capacity, booked seats, availability, occupancy and revenue agree |

A report is not complete just because it runs. Compare the output against known sample rows and manually validate the calculation.

---

# 10. Oracle execution order

Use one documented sequence. Adjust it for real dependencies and any existing scripts:

1. Verify project schema and access.
2. Create sequences or ID-generation mechanism.
3. Create master tables (`PASSENGER`, `DRIVER`, `VEHICLE`, `ROUTE`).
4. Create transactional tables (`TRIP`, `BOOKING`, `PAYMENT`, `MAINTENANCE`, `FEEDBACK`).
5. Add foreign keys and remaining constraints.
6. Create appropriate indexes.
7. Insert master data.
8. Insert dependent trip/booking/payment/maintenance/feedback data.
9. Create procedures.
10. Create functions.
11. Create cursors/report mechanisms.
12. Create triggers.
13. Run exception and transaction tests.
14. Run all five reports.
15. Apply minimum runtime-account grants.
16. Run final validation scripts.

**Caution:** the team's scripts may already have created tables and inserted records with explicit IDs. Do not blindly rerun non-idempotent `CREATE TABLE`, `INSERT`, or sequence scripts against a populated shared database. Verify the current database state before executing a script. Sequence-reset syntax differs by Oracle version; use syntax supported by your actual database.

---

# 11. MongoDB execution order

1. Agree the database name.
2. Create/verify the four collection names.
3. Insert sample documents.
4. Create appropriate indexes.
5. Run Query 1: reviews by route.
6. Run Query 2: highest-rated vehicles/drivers.
7. Run Query 3: keyword search.
8. Run Query 4: vehicle documents/media.
9. Validate Oracle ID references.
10. Test missing IDs and no-result scenarios.
11. Commit scripts and evidence.

Do not repeatedly insert duplicate sample data. Keep destructive reset scripts separate and clearly labelled; never run them against shared data without the team's agreement.

---

# 12. Practical test allocation

## Member 1
- Duplicate email/licence/registration is rejected.
- Invalid status/capacity/rating values are rejected.
- Master table constraints work.
- Sample master data is correct.
- MongoDB reference IDs match Oracle.

## Member 2
- PL/SQL programs produce correct outputs.
- Exceptions are meaningful.
- Failed operations do not leave partial records.
- Reports 1–3 match sample data.
- MongoDB queries 1–2 return expected results.

## Member 3
- Foreign-key dependency checks work.
- Booking/payment/cancellation are consistent.
- Failed operations are rolled back appropriately.
- Maintenance logic and Reports 4–5 work.
- Backend calls use correct schema objects and parameters.

## Member 4
- All four MongoDB content types have meaningful sample data.
- Keyword search works with hits and zero hits.
- Document/media retrieval returns correct references.
- All referenced Oracle IDs exist.
- MongoDB setup/query scripts run reproducibly.

## All four
- Verify a passenger/trip/booking/payment path.
- Verify a vehicle-maintenance path.
- Verify each of the five reports.
- Verify all four MongoDB query scenarios.
- Verify that a vehicle/route view can combine Oracle operational data with MongoDB dynamic content through the application layer.

---

# 13. Shared-database collaboration rules

Since all four members use one live database:

1. Develop scripts on your own branch.
2. Use descriptive filenames and small, reviewable commits.
3. Review scripts before applying changes to the shared database.
4. Nominate a database maintainer to coordinate structural/destructive changes.
5. Record which scripts have been applied.
6. Do not rerun inserts against existing data unless the script is designed to be repeatable.
7. Keep the source scripts in GitHub so the schema can be reconstructed.
8. Never run `DROP TABLE`, `DROP USER`, broad `deleteMany()`, or another destructive command on shared data without group agreement and a recovery/rebuild plan.

---

# 14. Final completion checklist

## Oracle

```text
[ ] Master tables implemented
[ ] Transactional tables implemented
[ ] PK/FK/UNIQUE/CHECK/NOT NULL constraints verified
[ ] ID generation works after sample inserts
[ ] Appropriate indexes created without redundant indexes
[ ] Realistic sample data loaded
[ ] PL/SQL programs implemented and executed
[ ] Exception/transaction tests completed
[ ] Five reports implemented and validated
[ ] Runtime privileges reviewed
[ ] Setup scripts committed and documented
```

## MongoDB

```text
[ ] vehicle_documents
[ ] reviews
[ ] announcements
[ ] trip_media
[ ] Sample documents
[ ] Appropriate indexes
[ ] Query 1: reviews by route
[ ] Query 2: highest-rated vehicles/drivers
[ ] Query 3: keyword complaints/feedback search
[ ] Query 4: vehicle documents/multimedia
[ ] Oracle reference IDs validated
[ ] Scripts and test results committed
```

## Cross-database practical validation

```text
[ ] Shared IDs agreed
[ ] Oracle and MongoDB sample references match
[ ] Duplicate sources of truth avoided
[ ] Report outputs checked against sample data
[ ] Database/API contracts tested by the relevant member
[ ] End-to-end data flows produce expected results
```

---

# 15. Final member summary

**Member 1:** Build the Oracle master-data foundation and validate cross-database IDs.

**Member 2:** Implement assigned PL/SQL, Reports 1–3, and MongoDB queries 1–2.

**Member 3:** Build transactional Oracle tables and consistent business transactions, plus Reports 4–5 and backend database contracts.

**Member 4:** Build MongoDB collections, sample documents, indexes, queries 3–4, and cross-database reference tests.

**All members:** Review one another's work, test the complete database implementation, and understand the actual SQL, PL/SQL, MongoDB queries, constraints, results, and error handling.

The target is not simply to have SQL and MongoDB files in GitHub. The target is a reproducible, tested database implementation in which every required feature actually works.
