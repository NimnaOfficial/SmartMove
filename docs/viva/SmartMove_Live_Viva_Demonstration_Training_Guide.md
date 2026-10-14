# SmartMove Live Viva Practical Demonstration & Training Practice Manual
## Based on NIBM Coursework Specification (`DM2 CW -1 (1).pdf`) & Lecture Notes (`ALL.pdf`)

> **Course:** HDSE / HNDIS — Data Management 2 (CW No. 1)  
> **Target Score:** 70%+ (Top Distinction Band across all 7 Rubric Criteria)  
> **Team Allocation:**  
> - **Member 1 (037):** **J.H.N. Fernando** — Master Relational Schema, Constraints, Security Roles & Data Pump Backup  
> - **Member 2 (036):** **Arshath MLM** — PL/SQL Pricing Function, Materialized Views, Reports 1–3 & MongoDB Queries 1 & 2  
> - **Member 3 (028):** **D.D. Kandeepan** — Transactional Operations, Trigger `TRG_MANAGE_SEATS`, Concurrency Procedures & Reports 4 & 5  
> - **Member 4 (004):** **K.G.L. Sandanimne** — MongoDB Collections, JSON Validators, Full-Text Search (Query 3), Media Retrieval (Query 4) & Web App Integration  

---

## 1. Complete Catalog of Everything Mandated for Live Demonstration

From an exhaustive analysis of **`ALLmems/DM2 CW -1 (1).pdf`** (Pages 2–4), here is the master list of everything the examiners are grading:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│               MANDATORY LIVE DEMONSTRATION CHECKLIST (CW SPECIFICATION)                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. ORACLE 9 CORE OPERATIONS:                                                          │
│    [x] Vehicle Management           [x] Trip Scheduling Management                     │
│    [x] Driver Management            [x] Ticket Booking Management                      │
│    [x] Route Management             [x] Payment Processing                             │
│    [x] Passenger Management         [x] Maintenance Management                         │
│    [x] Feedback and Review Management                                                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. PL/SQL PROGRAMS & 5 BUSINESS REPORTS:                                               │
│    [x] Stored Function: CALCULATE_FARE (with exception handling)                       │
│    [x] Stored Procedure: MAKE_BOOKING (with row-level concurrency locking)             │
│    [x] Database Trigger: TRG_MANAGE_SEATS (automatic seat synchronization)             │
│    [x] Materialized View: MV_MONTHLY_REVENUE (on-demand pre-aggregated disk storage)   │
│    [x] Report 1: Most frequently used routes based on bookings (Window RANK() OVER)    │
│    [x] Report 2: Total revenue generated within a given period (Monthly reconciliation)│
│    [x] Report 3: Passenger travel history reports (Cumulative loyalty spend)           │
│    [x] Report 4: Finding vehicles due for maintenance (6-month service interval)       │
│    [x] Report 5: Trip operational performance & seat occupancy percentage              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. MONGODB 4 REQUIRED QUERY DEMONSTRATIONS (CW Page 3):                                │
│    [x] Query 1: Retrieve all passenger reviews for a specific route                    │
│    [x] Query 2: Identify highest-rated vehicles or drivers based on customer feedback  │
│    [x] Query 3: Search customer complaints or feedback using specific keywords         │
│    [x] Query 4: Retrieve vehicle documents and multimedia information                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. DATABASE ADMINISTRATION & SECURITY:                                                 │
│    [x] Role-Based Access Control: smartmove_app_role & smartmove_user                  │
│    [x] Oracle Data Pump: Logical schema export (expdp) & disaster recovery (impdp)     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 5. APPLICATION LAYER INTEGRATION:                                                      │
│    [x] Full-stack demonstration on http://localhost:3000 (React UI ⟷ Gateway ⟷ DBs)  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Pre-Viva Environment Setup (10 Minutes Prior)

Open PowerShell as Administrator in `SmartMove/` and run:
```powershell
./start_full_system.ps1
```
Keep 4 windows open side-by-side:
1. **Oracle Client:** SQL Developer or SQL*Plus command line (connected to `XEPDB1`).
2. **MongoDB Client:** `mongosh` terminal or MongoDB Compass (connected to `mongodb://localhost:27017/smartmove`).
3. **Web Browser:** Tab 1 on `http://localhost:3000` (React Web UI), Tab 2 on `http://localhost:8761` (Eureka Registry).
4. **VS Code:** Opened to [`database_SQL_noSQL_PLSQL/`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/database_SQL_noSQL_PLSQL).

---

## 3. Member 1 Practice Drill: Master Schema, Security & Backup
### Student: J.H.N. Fernando (COHNDSE261F-037)

#### Live Action 1: Show Master 3NF Tables & Schema Constraints
* **What you do:** In Oracle SQL Developer / SQL*Plus, run:
  ```sql
  SELECT TABLE_NAME, CONSTRAINT_NAME, CONSTRAINT_TYPE 
  FROM USER_CONSTRAINTS 
  WHERE TABLE_NAME IN ('PASSENGER', 'DRIVER', 'ROUTE', 'VEHICLE')
  ORDER BY TABLE_NAME;
  ```
* **What you say:**
  > *"Sir/Madam, I implemented the 4 master foundation tables in Third Normal Form (3NF). Every non-key attribute depends solely on the primary key. To ensure data integrity at the database engine level, I enforced check constraints—such as `CK_PASS_EMAIL` validating email format, `CK_VEHICLE_CAP` enforcing bus capacity between 10 and 100 seats, and `CK_ROUTE_DIST` ensuring positive distances."*

#### Live Action 2: Demonstrate Primary Key Sequence Generation
* **What you do:** Run:
  ```sql
  SELECT SEQUENCE_NAME, INCREMENT_BY, LAST_NUMBER FROM USER_SEQUENCES;
  ```
* **What you say:**
  > *"We avoid manual identity counters which cause table locking. As taught in DM02, Oracle sequences (`SEQ_PASSENGER`, `SEQ_DRIVER`, `SEQ_ROUTE`, `SEQ_VEHICLE`) allocate unique integer surrogate keys directly in memory. We used `NOCACHE` so sequence values never skip numbers even after unexpected server reboots."*

#### Live Action 3: Demonstrate Database Security & Roles (RBAC)
* **What you do:** Run:
  ```sql
  SELECT * FROM ROLE_TAB_PRIVS WHERE ROLE = 'SMARTMOVE_APP_ROLE';
  ```
* **What you say (Citing `ALL.pdf` Slides 113–127):**
  > *"Following the Principle of Least Privilege, our microservices never connect as DBA. I created `smartmove_app_role` and granted only the required DML privileges (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) on operational tables and `SELECT` on sequences. We then created application user `smartmove_user` and assigned this role."*

#### Live Action 4: Demonstrate Data Pump Backup (`expdp`)
* **What you do:** Open Command Prompt and show the command:
  ```cmd
  expdp system/oracle@localhost:1521/XEPDB1 schemas=SMARTMOVE directory=DATA_PUMP_DIR dumpfile=smartmove_full.dmp logfile=smartmove_exp.log
  ```
* **What you say (Citing `ALL.pdf` Slides 128–140):**
  > *"For disaster recovery, Oracle Data Pump provides high-speed parallel extraction of schema definitions, constraints, sequences, and table rows into binary dump files. If a database corruption occurs, `impdp` recreates the entire schema in minutes."*

---

## 4. Member 2 Practice Drill: PL/SQL Functions, Materialized Views & Reports 1–3
### Student: Arshath MLM (COHNDSE261F-036)

#### Live Action 1: Execute `CALCULATE_FARE` Stored Function Live
* **What you do:** In Oracle SQL Developer, run:
  ```sql
  -- Standard test: Route 1 (Colombo to Kandy, Base 1500), 2 seats
  SELECT CALCULATE_FARE(1, 2) AS TOTAL_FARE FROM DUAL;
  -- Result: LKR 3000.00
  ```
* **Now trigger Exception Handling (Examiners will test you on this!):**
  ```sql
  -- Non-existent route:
  SELECT CALCULATE_FARE(999, 1) FROM DUAL;
  -- Output: ORA-20001: Route ID 999 does not exist.

  -- Invalid seat count:
  SELECT CALCULATE_FARE(1, 0) FROM DUAL;
  -- Output: ORA-20005: Seat count must be greater than zero.
  ```
* **What you say (Citing `ALL.pdf` Slides 65–70 & 87–92):**
  > *"I wrote `CALCULATE_FARE` as a compiled PL/SQL stored function returning a `NUMBER`. It uses `%TYPE` (`v_base_fare ROUTE.BASE_FARE%TYPE`) to inherit column data precision. It checks seat quantities, queries the base fare, and uses `RAISE_APPLICATION_ERROR` with custom codes (-20001, -20005) to abort invalid requests."*

#### Live Action 2: Demonstrate Materialized View `MV_MONTHLY_REVENUE`
* **What you do:** Run:
  ```sql
  SELECT * FROM MV_MONTHLY_REVENUE;
  ```
* **What you say (Citing `ALL.pdf` Slides 76–86):**
  > *"Unlike a standard view which re-runs its query each time, our Materialized View stores pre-computed monthly revenue totals physically on disk (`BUILD IMMEDIATE`). It uses `REFRESH COMPLETE ON DEMAND`, which enables nightly batch jobs to recalculate monthly financials in bulk without placing CPU load on real-time booking transactions."*

#### Live Action 3: Execute Report 1 (Most Frequently Used Routes)
* **What you do:** Run:
  ```sql
  SELECT 
      r.ROUTE_ID, r.ORIGIN, r.DESTINATION, r.DISTANCE_KM, r.BASE_FARE,
      COUNT(b.BOOKING_ID) AS TOTAL_BOOKINGS,
      RANK() OVER (ORDER BY COUNT(b.BOOKING_ID) DESC) AS ROUTE_RANK
  FROM ROUTE r
  LEFT JOIN TRIP t ON r.ROUTE_ID = t.ROUTE_ID
  LEFT JOIN BOOKING b ON t.TRIP_ID = b.TRIP_ID AND b.STATUS != 'CANCELLED'
  GROUP BY r.ROUTE_ID, r.ORIGIN, r.DESTINATION, r.DISTANCE_KM, r.BASE_FARE
  ORDER BY ROUTE_RANK;
  ```
* **What you say:**
  > *"This satisfies the first coursework report requirement. It uses the analytic window function `RANK() OVER (ORDER BY COUNT(b.BOOKING_ID) DESC)` to rank routes by popularity dynamically without requiring nested subqueries."*

#### Live Action 4: Demonstrate MongoDB Query 1 & Query 2 (Page 3 of CW Spec)
* **What you do:** In `mongosh`, run:
  ```javascript
  // QUERY 1: Retrieve all passenger reviews for Route 1
  db.reviews.find(
      { routeId: 1 },
      { _id: 0, passengerId: 1, rating: 1, type: 1, tags: 1, comment: 1, createdAt: 1 }
  ).sort({ createdAt: -1 });

  // QUERY 2: Identify highest-rated vehicles pipeline
  db.reviews.aggregate([
      { $match: { vehicleId: { $ne: null } } },
      { $group: { _id: "$vehicleId", averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
      { $project: { _id: 0, vehicleId: "$_id", averageRating: { $round: ["$averageRating", 2] }, totalReviews: 1 } },
      { $sort: { averageRating: -1, totalReviews: -1 } },
      { $limit: 5 }
  ]);
  ```
* **What you say (Citing `ALL.pdf` Slides 180–205):**
  > *"These fulfill MongoDB scenarios 1 and 2. Query 1 retrieves feedback for Route 1 sorted by date. Query 2 executes a 5-stage aggregation pipeline (`$match` ➔ `$group` ➔ `$project` ➔ `$sort` ➔ `$limit`), computing mathematical average ratings and volume per vehicle to reward top drivers."*

---

## 5. Member 3 Practice Drill: Transactional Operations, Trigger & Reports 4–5
### Student: D.D. Kandeepan (COHNDSE261F-028)

#### Live Action 1: The Golden Live Trigger Demonstration (`TRG_MANAGE_SEATS`)
* **What you do:** Run this sequence in Oracle live:
  ```sql
  -- Step A: Check current available seats on Trip 1
  SELECT TRIP_ID, AVAILABLE_SEATS, STATUS FROM TRIP WHERE TRIP_ID = 1;
  -- Example: Shows 43 seats available

  -- Step B: Insert a new confirmed booking for 2 seats
  INSERT INTO BOOKING (BOOKING_ID, PASSENGER_ID, TRIP_ID, SEATS_BOOKED, TOTAL_FARE, STATUS, PAYMENT_STATUS)
  VALUES (SEQ_BOOKING.NEXTVAL, 1, 1, 2, 3000.00, 'CONFIRMED', 'UNPAID');
  COMMIT;

  -- Step C: Re-query Trip 1 immediately
  SELECT TRIP_ID, AVAILABLE_SEATS, STATUS FROM TRIP WHERE TRIP_ID = 1;
  -- Show the examiner: AVAILABLE_SEATS automatically decreased to 41!

  -- Step D: Cancel that booking
  UPDATE BOOKING SET STATUS = 'CANCELLED' 
  WHERE BOOKING_ID = (SELECT MAX(BOOKING_ID) FROM BOOKING);
  COMMIT;

  -- Step E: Re-query Trip 1 again
  SELECT TRIP_ID, AVAILABLE_SEATS, STATUS FROM TRIP WHERE TRIP_ID = 1;
  -- Show the examiner: AVAILABLE_SEATS automatically restored back to 43!
  ```
* **What you say (Citing `ALL.pdf` Slides 71–75):**
  > *"Trigger `TRG_MANAGE_SEATS` is a row-level trigger (`AFTER INSERT OR UPDATE OR DELETE ON BOOKING FOR EACH ROW`). It intercepts `:NEW.STATUS = 'CONFIRMED'` to decrement available seats on the trip, and intercepts `:OLD.STATUS = 'CONFIRMED' AND :NEW.STATUS = 'CANCELLED'` to refund seats back to the fleet inventory in real-time."*

#### Live Action 2: Concurrency Locking in `MAKE_BOOKING`
* **What you do:** Open [`member3/oracle.sql`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/database_SQL_noSQL_PLSQL/member3/oracle.sql#L156-L165) and show lines with `FOR UPDATE`:
  ```sql
  SELECT AVAILABLE_SEATS, ROUTE_ID INTO v_avail_seats, v_route_id
  FROM TRIP WHERE TRIP_ID = p_trip_id FOR UPDATE;
  ```
* **What you say (Citing `ALL.pdf` Slides 34–40):**
  > *"To solve the classic booking race condition where two passengers click 'Book' simultaneously for the last seat, we implement pessimistic locking. `SELECT ... FOR UPDATE` acquires an exclusive lock on that trip row. The second transaction waits until the first commits, sees 0 seats left, and is safely rejected with error `-20002`."*

#### Live Action 3: Execute Report 4 (Fleet Maintenance Compliance)
* **What you do:** Run:
  ```sql
  SELECT 
      v.VEHICLE_ID, v.REGISTRATION, v.MODEL, v.TYPE,
      MAX(m.MAINTENANCE_DATE) AS LAST_SERVICING_DATE,
      ADD_MONTHS(MAX(m.MAINTENANCE_DATE), 6) AS DUE_DATE
  FROM VEHICLE v
  LEFT JOIN MAINTENANCE m ON v.VEHICLE_ID = m.VEHICLE_ID
  GROUP BY v.VEHICLE_ID, v.REGISTRATION, v.MODEL, v.TYPE
  HAVING MAX(m.MAINTENANCE_DATE) IS NULL 
      OR ADD_MONTHS(MAX(m.MAINTENANCE_DATE), 6) <= SYSDATE
  ORDER BY DUE_DATE ASC;
  ```
* **What you say:**
  > *"This satisfies coursework report requirement 4. Using `ADD_MONTHS(..., 6)` and `HAVING ... <= SYSDATE`, it flags buses due for maintenance or never serviced, protecting passenger safety."*

---

## 6. Member 4 Practice Drill: MongoDB Queries 3–4 & Full Web Demo
### Student: K.G.L. Sandanimne (COHNDSE261F-004)

#### Live Action 1: Demonstrate MongoDB `$jsonSchema` Validation
* **What you do:** In `mongosh`, run:
  ```javascript
  db.getCollectionInfos({ name: "reviews" })[0].options.validator;
  ```
* **What you say (Citing `ALL.pdf` Slides 178–185):**
  > *"Although MongoDB is schema-flexible, we enforce data quality using JSON Schema validators. We validate BSON data types, ensure required attributes (`routeId`, `rating`, `comment`), restrict star ratings between 1 and 5, and enforce enum values (`REVIEW`, `COMPLAINT`)."*

#### Live Action 2: Demonstrate Query 3 Live (Full-Text Search on Complaints)
* **What you do:** In `mongosh`, run:
  ```javascript
  db.reviews.find(
      { $text: { $search: "delay breakdown" } },
      { score: { $meta: "textScore" }, _id: 0, passengerId: 1, routeId: 1, rating: 1, type: 1, comment: 1 }
  ).sort({ score: { $meta: "textScore" } });
  ```
* **What you say (Citing `ALL.pdf` Slides 180–195):**
  > *"This fulfills MongoDB requirement 3. We built a full-text search index on `comment: 'text'`. Query 3 searches for keywords 'delay' and 'breakdown' across customer complaints and sorts by relevance score (`$meta: 'textScore'`), allowing rapid customer service response."*

#### Live Action 3: Demonstrate Query 4 Live (Vehicle Documents & Trip Media)
* **What you do:** In `mongosh`, run:
  ```javascript
  // 4A: Retrieve legal compliance certificates and photos for Vehicle 1
  db.vehicle_documents.find({ vehicleId: 1 }, { _id: 0, vehicleId: 1, registration: 1, documents: 1, images: 1 });

  // 4B: Retrieve operational multimedia for Trip 1
  db.trip_media.find({ tripId: 1 }, { _id: 0, tripId: 1, routeId: 1, mediaType: 1, caption: 1, url: 1 });
  ```
* **What you say (Citing `ALL.pdf` Slides 188–192):**
  > *"This fulfills MongoDB requirement 4. Using nested document arrays, insurance, revenue licenses, and emission tests are stored inside the parent vehicle document. It avoids multi-table relational `JOIN` overhead and is retrieved in a single read operation."*

#### Live Action 4: Demonstrate the Real Web Application (`http://localhost:3000`)
* **What you do:**
  1. Open `http://localhost:3000`. Log in as `nimal@example.com` (Passenger).
  2. Search Colombo ➔ Kandy trips. Book 2 seats. Show seat count decrement in real-time.
  3. Open Incognito window. Log in as `saman.k@smartmove.lk` (Driver). Show new trip scheduled. Click "Start Journey".
  4. Passenger tab: Pay with Card. Show trip updates to `COMPLETED`.
  5. Log in as `admin@smartmove.lk` on `/admin/reports`. Show all 5 reports and click **Export PDF**.
* **What you say:**
  > *"This proves full polyglot integration. The React frontend interacts with Spring Cloud API Gateway (Port 8080), communicating with Oracle for ACID transactions and MongoDB for documents and multimedia."*

---

## 7. Quick Viva FAQ (1-Sentence Answers for Curveball Questions)

1. **"Why use Oracle and MongoDB together?"**  
   *"Oracle handles structured ACID financial transactions (bookings, payments, seats); MongoDB handles unstructured, dynamic data (vehicle documents, photos, full-text reviews)."*
2. **"What is the difference between `%TYPE` and `%ROWTYPE`?"**  
   *"`%TYPE` declares a variable with the exact data type of a single column; `%ROWTYPE` declares a record variable representing an entire table row (Slide 26-28)."*
3. **"What is the difference between an implicit cursor and an explicit cursor?"**  
   *"Oracle manages implicit cursors automatically for single SQL statements (`SQL%ROWCOUNT`, `SQL%FOUND`); explicit cursors are declared by the programmer to fetch multiple rows row-by-row (Slide 34-40)."*
4. **"Can you rollback after a `TRUNCATE` or `CREATE TABLE`?"**  
   *"No, DDL statements issue an implicit COMMIT before and after execution (Slide 10-12)."*
5. **"How does the database prevent negative available seats?"**  
   *"At the schema level via `CONSTRAINT CK_TRIP_SEATS CHECK (AVAILABLE_SEATS >= 0)`, and procedurally in `MAKE_BOOKING` before the insert occurs."*
