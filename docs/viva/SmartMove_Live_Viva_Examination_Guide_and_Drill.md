# SmartMove Transit System — Master Live Viva Examination Guide & Practice Drill
## Data Management 2 (CW No. 1) — School of Computing & Engineering, NIBM

> **Course:** Higher National Diploma in Software Engineering (HDSE / HNDIS)  
> **Module:** Data Management 2  
> **Coursework:** CW No. 1 (SmartMove Transport Solutions)  
> **Assessment Type:** Software Application (80%) + Presentation & Live Viva (20%)  
> **Team Roster:**  
> - **Member 1 (037):** J.H.N. Fernando — Master Schema Foundation, Constraints, Database Security & Backup  
> - **Member 2 (036):** Arshath MLM — PL/SQL Business Logic, Materialized Views, Reports 1–3 & MongoDB Queries 1–2  
> - **Member 3 (028):** D.D. Kandeepan — Transactional Engine, Database Triggers, Concurrency Procedures & Reports 4–5  
> - **Member 4 (004):** K.G.L. Sandanimne — MongoDB Architecture, Full-Text Search, Media Retrieval & Full Web Integration  

---

## 1. What the Examiners Expect Live (Analysis of Coursework Specification)

According to **`ALLmems/DM2 CW -1 (1).pdf`**, the marking criteria allocate:
- **Front-end Development + ER Diagram (20%):** User-friendly interface covering all 9 core operations; normalized 3NF ER diagram.
- **Oracle Database Implementation (15%):** Correct relational schema, constraints, sequences, PL/SQL logic, user security, and backup.
- **MongoDB Incorporation (15%):** Schema-flexible collections, standard queries (1–4), nested documents, and text indexing.
- **Reports & Business Logic (15%):** At least 5 business reports in PL/SQL with exception handling.
- **Integration & Innovation (10%):** Robust hybrid link between Oracle (structured transactions) and MongoDB (unstructured content).
- **Presentation & Viva (20%):** Clear communication, individual mastery of assigned scope, and live demonstration of working software and databases.

> [!IMPORTANT]
> **The examiners will NOT just listen to slides.** They will ask you to:
> 1. Switch to your database client (Oracle SQL Developer / SQL*Plus / MongoDB Compass / `mongosh`).
> 2. Run queries and PL/SQL blocks **live in front of them**.
> 3. Trigger a business event (e.g. make a booking or cancel) and prove that the database state updated correctly.
> 4. Demonstrate the full web application on `http://localhost:3000` with real-time updates.

---

## 2. Pre-Flight Setup Checklist (Do This 10 Minutes Before Entering Viva)

Before the examiners call your group, have the following software open and running:

1. **Start the SmartMove Ecosystem:**
   Open PowerShell as Administrator in project root and run:
   ```powershell
   ./start_full_system.ps1
   ```
   *Verify:*
   - Eureka Registry: `http://localhost:8761` (All 12 microservices registered and GREEN).
   - API Gateway: `http://localhost:8080` (Responsive).
   - React Web UI: `http://localhost:3000` (Loaded to login page).

2. **Open Database Tools:**
   - **Oracle SQL Developer / SQL*Plus:** Connected to user `smartmove_user` or `SMARTMOVE` on service `XEPDB1`.
   - **MongoDB Compass / mongosh:** Connected to `mongodb://localhost:27017/smartmove`.

3. **Open VS Code:** Opened to `SmartMove/database_SQL_noSQL_PLSQL/` so you can show your clean code instantly.

---

## 3. Member 1 Live Demonstration & Practice Drill
### Student: J.H.N. Fernando (COHNDSE261F-037)
**Role:** Master Schema Foundation, Constraints, Security Roles & Logical Backup

### What to Say When Introduced (20-Second Pitch):
> *"Good morning/afternoon, Sir/Madam. I am J.H.N. Fernando (ID: COHNDSE261F-037). In SmartMove, I took ownership of the foundational relational schema in Oracle 21c. I designed the master entities—Passenger, Driver, Route, and Vehicle in Third Normal Form (3NF), established sequence-based primary key generators to eliminate lock contention, implemented database-level check and domain constraints, configured Role-Based Access Control via `smartmove_app_role`, and designed the Oracle Data Pump logical backup strategy."*

### Live Tasks the Examiner Will Ask Member 1 to Perform:

#### Task 1.1: "Show me your master tables and constraints in Oracle."
* **What to do:** In SQL Developer or SQL*Plus, run:
  ```sql
  SELECT TABLE_NAME, CONSTRAINT_NAME, CONSTRAINT_TYPE 
  FROM USER_CONSTRAINTS 
  WHERE TABLE_NAME IN ('PASSENGER', 'DRIVER', 'ROUTE', 'VEHICLE')
  ORDER BY TABLE_NAME;
  ```
* **What to explain:**
  - `P` = Primary Key (enforces entity uniqueness).
  - `U` = Unique Key (`UQ_PASSENGER_EMAIL`, `UQ_VEHICLE_REG`).
  - `C` = Check constraints: Show `CK_PASS_EMAIL` (`EMAIL LIKE '%@%.%'`), `CK_VEHICLE_CAP` (`CAPACITY BETWEEN 10 AND 100`), and `CK_ROUTE_DIST` (`DISTANCE_KM > 0`).
  - *Examiner Question:* "Why put check constraints in Oracle instead of just in the frontend?"
  - *Your Answer:* "Client-side validation can be bypassed by direct API calls or scripts. Database constraints guarantee ACID consistency at the lowest storage layer."

#### Task 1.2: "Show me your sequences. Why use sequences instead of auto-increment identity columns?"
* **What to do:** Run:
  ```sql
  SELECT SEQUENCE_NAME, MIN_VALUE, INCREMENT_BY, LAST_NUMBER 
  FROM USER_SEQUENCES;
  ```
* **What to explain (Connecting to `ALL.pdf`):**
  - "Oracle sequences (`SEQ_PASSENGER`, `SEQ_DRIVER`, `SEQ_ROUTE`, `SEQ_VEHICLE`) generate surrogate integer keys. We used `NOCACHE` so that sequence numbers remain strictly consecutive without memory gaps across system restarts."

#### Task 1.3: "Show me your security setup. How do you protect the database from application tampering?"
* **What to do:** Run:
  ```sql
  SELECT * FROM ROLE_TAB_PRIVS WHERE ROLE = 'SMARTMOVE_APP_ROLE';
  ```
* **What to explain (Connecting to `ALL.pdf` Slides 113–127):**
  - "Following the Principle of Least Privilege, our Spring Boot microservices do NOT connect as DBA or table owner. We created a dedicated role `smartmove_app_role` and granted only necessary DML permissions (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) on operational tables, plus `SELECT` on sequences. We then created `smartmove_user` and assigned this role."

#### Task 1.4: "How does your backup and recovery work?"
* **What to do:** Show the Data Pump commands in [`member1/oracle.sql`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/database_SQL_noSQL_PLSQL/member1/oracle.sql#L137-L148):
  ```text
  expdp system/oracle@localhost:1521/XEPDB1 schemas=SMARTMOVE directory=DATA_PUMP_DIR dumpfile=smartmove_full.dmp logfile=smartmove_exp.log
  ```
* **What to explain (Connecting to `ALL.pdf` Slides 128–140):**
  - "Oracle Data Pump (`expdp`) provides server-side parallel extraction of metadata and table data into a proprietary binary dump. If hardware fails, `impdp` restores tables, constraints, sequences, and roles in seconds."

---

## 4. Member 2 Live Demonstration & Practice Drill
### Student: Arshath MLM (COHNDSE261F-036)
**Role:** PL/SQL Pricing Engine, Materialized Views, Reports 1–3 & MongoDB Queries 1–2

### What to Say When Introduced (20-Second Pitch):
> *"Good morning/afternoon, Sir/Madam. I am Arshath MLM (ID: COHNDSE261F-036). My responsibility in SmartMove was building the core business calculation engine and executive financial reports. In Oracle PL/SQL, I created the `CALCULATE_FARE` stored function, created the `MV_MONTHLY_REVENUE` Materialized View with on-demand refresh, developed the `REPORT_REVENUE` procedure, and built Business Reports 1, 2, and 3 using analytic window functions. In MongoDB, I implemented Query 1 for route feedback and Query 2's multi-stage aggregation pipeline to identify top-rated fleet vehicles."*

### Live Tasks the Examiner Will Ask Member 2 to Perform:

#### Task 2.1: "Execute your `CALCULATE_FARE` function live right now."
* **What to do:** In SQL Developer / SQL*Plus, run:
  ```sql
  SELECT CALCULATE_FARE(1, 2) AS TOTAL_FARE FROM DUAL;
  ```
  *(Result: LKR 3000.00 for Route 1 Colombo➔Kandy with 2 seats).*
* **Now show Exception Handling (Examiner love this!):**
  ```sql
  -- Invalid seat count:
  SELECT CALCULATE_FARE(1, -5) FROM DUAL;
  -- Output: ORA-20005: Seat count must be greater than zero.

  -- Non-existent route:
  SELECT CALCULATE_FARE(999, 1) FROM DUAL;
  -- Output: ORA-20001: Route ID 999 does not exist.
  ```
* **What to explain (Connecting to `ALL.pdf` Slides 65–70 & 87–92):**
  - "The function uses `v_base_fare ROUTE.BASE_FARE%TYPE` (Slide 26) to inherit precision from the relational schema. It validates inputs and raises user-defined application errors (`RAISE_APPLICATION_ERROR`) with standardized error codes."

#### Task 2.2: "Show me your Materialized View. Why use a Materialized View instead of a normal View?"
* **What to do:** Run:
  ```sql
  SELECT * FROM MV_MONTHLY_REVENUE;
  ```
* **What to explain (Connecting to `ALL.pdf` Slides 76–86):**
  - "A regular view is a saved query that re-executes every time it is called. A **Materialized View** physically writes the pre-aggregated results to disk (`BUILD IMMEDIATE`). We used `REFRESH COMPLETE ON DEMAND`, allowing nightly batch jobs to recalculate monthly revenue in bulk, so executive queries execute in 0 milliseconds."

#### Task 2.3: "Execute Report 1 (Most Frequently Used Routes)."
* **What to do:** Run:
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
* **What to explain:**
  - "We use the analytic window function `RANK() OVER (ORDER BY COUNT(b.BOOKING_ID) DESC)`. It ranks routes dynamically without requiring expensive correlated subqueries or procedural cursors."

#### Task 2.4: "Open MongoDB and run Query 2 live (Top Rated Vehicles Pipeline)."
* **What to do:** In `mongosh` or MongoDB Compass, paste:
  ```javascript
  db.reviews.aggregate([
      { $match: { vehicleId: { $ne: null } } },
      { $group: { _id: "$vehicleId", averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
      { $project: { _id: 0, vehicleId: "$_id", averageRating: { $round: ["$averageRating", 2] }, totalReviews: 1 } },
      { $sort: { averageRating: -1, totalReviews: -1 } },
      { $limit: 5 }
  ]);
  ```
* **What to explain (Connecting to `ALL.pdf` Slides 180–205):**
  - Walk the examiner through the 5 pipeline stages: `$match` ➔ `$group` (`$avg`, `$sum`) ➔ `$project` (`$round`) ➔ `$sort` ➔ `$limit`.

---

## 5. Member 3 Live Demonstration & Practice Drill
### Student: D.D. Kandeepan (COHNDSE261F-028)
**Role:** Transactional Engine, Database Triggers, Concurrency Procedures & Reports 4–5

### What to Say When Introduced (20-Second Pitch):
> *"Good morning/afternoon, Sir/Madam. I am D.D. Kandeepan (ID: COHNDSE261F-028). In SmartMove, I developed the mission-critical operational and transactional core. I implemented the transactional tables—Trip, Booking, Payment, Maintenance, and Feedback—with strict foreign keys and check constraints. I developed the `TRG_MANAGE_SEATS` trigger that automatically maintains available seats in real-time, implemented `MAKE_BOOKING` with row-level pessimistic locking (`SELECT ... FOR UPDATE`) to prevent race conditions, and built Reports 4 and 5 for fleet maintenance compliance and seat occupancy."*

### Live Tasks the Examiner Will Ask Member 3 to Perform:

#### Task 3.1: "Show me how your trigger works LIVE right now!" (THE GOLD VIVA DEMO)
* **What to do:** This is the most impressive live test in the whole viva.
  1. Check initial seats for Trip 1:
     ```sql
     SELECT TRIP_ID, AVAILABLE_SEATS, STATUS FROM TRIP WHERE TRIP_ID = 1;
     ```
     *(Note down: e.g. 43 seats available).*
  2. Make a live booking of 2 seats:
     ```sql
     INSERT INTO BOOKING (BOOKING_ID, PASSENGER_ID, TRIP_ID, SEATS_BOOKED, TOTAL_FARE, STATUS, PAYMENT_STATUS)
     VALUES (SEQ_BOOKING.NEXTVAL, 1, 1, 2, 3000.00, 'CONFIRMED', 'UNPAID');
     COMMIT;
     ```
  3. Re-query Trip 1 immediately:
     ```sql
     SELECT TRIP_ID, AVAILABLE_SEATS, STATUS FROM TRIP WHERE TRIP_ID = 1;
     ```
     *(Show the examiner: `AVAILABLE_SEATS` automatically decreased from 43 to 41!)*
  4. Now cancel that booking:
     ```sql
     UPDATE BOOKING SET STATUS = 'CANCELLED' WHERE BOOKING_ID = (SELECT MAX(BOOKING_ID) FROM BOOKING);
     COMMIT;
     ```
  5. Re-query Trip 1 again:
     *(Show the examiner: `AVAILABLE_SEATS` automatically restored back to 43!)*
* **What to explain (Connecting to `ALL.pdf` Slides 71–75):**
  - "Trigger `TRG_MANAGE_SEATS` is a row-level trigger (`FOR EACH ROW`) firing `AFTER INSERT OR UPDATE OR DELETE`. It uses `:NEW.SEATS_BOOKED` on insert and `:OLD.SEATS_BOOKED` on cancellation to guarantee real-time seat synchronization without manual application queries."

#### Task 3.2: "How do you handle concurrency if two passengers book the last seat at the same second?"
* **What to explain (Connecting to `ALL.pdf` Slides 34–40):**
  - "In our `MAKE_BOOKING` stored procedure, we use **Pessimistic Concurrency Control** via `SELECT ... FOR UPDATE` on the `TRIP` row:
    ```sql
    SELECT AVAILABLE_SEATS, ROUTE_ID INTO v_avail_seats, v_route_id
    FROM TRIP WHERE TRIP_ID = p_trip_id FOR UPDATE;
    ```
    This places an exclusive row-level lock on the trip. The second passenger's transaction is queued until the first completes. When the second transaction acquires the lock, it sees `AVAILABLE_SEATS = 0` and our check raises error `-20002: Not enough seats available`, completely preventing overbooking."

#### Task 3.3: "Execute Report 4 (Fleet Maintenance Compliance)."
* **What to do:** Run:
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
* **What to explain:**
  - "We enforce the 6-month safety compliance rule using date function `ADD_MONTHS(MAX(m.MAINTENANCE_DATE), 6)`. The `HAVING` clause isolates buses overdue for service or never inspected."

---

## 6. Member 4 Live Demonstration & Practice Drill
### Student: K.G.L. Sandanimne (COHNDSE261F-004)
**Role:** MongoDB Architecture, Full-Text Search, Media Retrieval & Full Web Integration

### What to Say When Introduced (20-Second Pitch):
> *"Good morning/afternoon, Sir/Madam. I am K.G.L. Sandanimne (ID: COHNDSE261F-004). My responsibility in SmartMove was architecting the MongoDB document database layer and delivering the end-to-end user-facing application integration. In MongoDB, I designed four collections with `$jsonSchema` validators, built single, compound, and full-text indexes, populated rich nested documents for compliance and trip media, and implemented Queries 3 and 4. On the application layer, I connected our 12 Spring Boot microservices with the React frontend to deliver real-time trip booking, driver journey lifecycle, and PDF report exports."*

### Live Tasks the Examiner Will Ask Member 4 to Perform:

#### Task 4.1: "Show me your MongoDB collections and JSON Schema validators."
* **What to do:** In `mongosh` or MongoDB Compass:
  ```javascript
  use smartmove;
  show collections;
  // Output: announcements, reviews, trip_media, vehicle_documents
  ```
* **What to explain (Connecting to `ALL.pdf` Slides 178–185):**
  - "MongoDB is schema-flexible, but for enterprise reliability, we defined `$jsonSchema` validators on collections like `reviews` and `vehicle_documents`. It validates data types (`bsonType: 'number'`, `'string'`, `'array'`), required fields, and enum restrictions (e.g., `rating` minimum 1 and maximum 5, type `REVIEW` or `COMPLAINT`)."

#### Task 4.2: "Run Query 3 live (Full-Text Search on Complaints)."
* **What to do:** In `mongosh`:
  ```javascript
  db.reviews.find(
      { $text: { $search: "delay breakdown" } },
      { score: { $meta: "textScore" }, _id: 0, passengerId: 1, routeId: 1, rating: 1, type: 1, comment: 1 }
  ).sort({ score: { $meta: "textScore" } });
  ```
* **What to explain (Connecting to `ALL.pdf` Slides 180–195):**
  - "We built a full-text search index on `comment: 'text'`. Query 3 searches for terms 'delay' and 'breakdown' across thousands of customer comments. Using `{ score: { $meta: 'textScore' } }`, MongoDB ranks matches by relevance so customer support can instantly prioritize severe operational disruptions."

#### Task 4.3: "Run Query 4 live (Vehicle Documents and Trip Multimedia)."
* **What to do:** In `mongosh`:
  ```javascript
  // 4A: Get legal certificates for Vehicle 1
  db.vehicle_documents.find({ vehicleId: 1 }, { _id: 0, vehicleId: 1, registration: 1, documents: 1, images: 1 });

  // 4B: Get media assets for Trip 1
  db.trip_media.find({ tripId: 1 }, { _id: 0, tripId: 1, routeId: 1, mediaType: 1, caption: 1, url: 1 });
  ```
* **What to explain (Connecting to `ALL.pdf` Slides 188–192):**
  - "Notice how `vehicle_documents` embeds insurance, revenue licenses, and emission certificates as a nested document array. In Oracle, this requires 3 separate tables and SQL `JOIN`s. In MongoDB, it is retrieved in a single atomic read operation, which is ideal for vehicle dispatch checks."

#### Task 4.4: "Now show me the live Web Application!" (THE GRAND FINALE)
* **What to do:** Switch to browser at `http://localhost:3000`:
  1. **Passenger Flow:**
     - Log in as `nimal@example.com` (password: `password123`).
     - Go to `/passenger/trips`. Search Colombo ➔ Kandy.
     - Book 2 seats. System issues booking, decreases available seats.
  2. **Driver Flow (Real-Time Handover):**
     - Open an Incognito window, go to `http://localhost:3000/login`.
     - Log in as `saman.k@smartmove.lk` (Driver).
     - Go to `/driver/trips`. The scheduled trip appears in real-time.
     - Click **Start Journey** (`IN_PROGRESS`).
  3. **Payment & Completion:**
     - Back in passenger tab (`/passenger/bookings`), click **Pay with Card**.
     - Payment processes, trip status updates to `COMPLETED`.
  4. **Executive BI Reports:**
     - Log in as `admin@smartmove.lk` on `/admin/reports`.
     - Show all 5 reports.
     - Click **Export PDF** to show the live PDF export.

---

## 7. Top 10 Viva "Trap" Questions & Model Answers

| # | Examiner Question | High-Scoring Model Answer |
|---|---|---|
| **1** | *Why use both Oracle and MongoDB? Why not store everything in Oracle?* | **Answer:** "This is a Polyglot Persistence architecture. Oracle guarantees ACID consistency for financial transactions (bookings, payments, seat reservations) where money and overbooking are at risk. MongoDB handles unstructured, dynamic data (driver documents, photos, announcements, and full-text passenger reviews) which evolve rapidly without requiring rigid schema alterations." |
| **2** | *What is the difference between an explicit cursor and a Cursor FOR Loop in PL/SQL?* | **Answer:** "In an explicit cursor, the developer must manually execute `OPEN`, `FETCH`, and `CLOSE`, and handle loop exit conditions (`%NOTFOUND`). A Cursor FOR loop automates all three steps and automatically declares the record variable, reducing code complexity and preventing memory leaks from unclosed cursors (Slides 34–40)." |
| **3** | *What happens if the database crashes while `MAKE_BOOKING` is executing?* | **Answer:** "Because `MAKE_BOOKING` is encapsulated in an ACID transaction, any uncommitted changes are rolled back automatically by Oracle's Undo Tablespace upon instance recovery. Seat counts and bookings will remain in their last committed consistent state." |
| **4** | *Why did you create a Materialized View for monthly revenue? Why not just run the SELECT query directly?* | **Answer:** "Running aggregate sums and group-bys on millions of payment records during peak hours consumes high CPU and I/O. A Materialized View computes the aggregate beforehand and stores it on disk (`BUILD IMMEDIATE`), allowing instant dashboard rendering (Slides 76–86)." |
| **5** | *How does MongoDB ensure data integrity if there are no foreign key constraints?* | **Answer:** "We use `$jsonSchema` validators to enforce data types, required fields, and enum values at the collection level. Cross-database references (e.g. `vehicleId: 1`) are validated in our Spring Boot service layer before MongoDB documents are persisted." |
| **6** | *What is the difference between Statement-Level and Row-Level triggers?* | **Answer:** "A Statement-Level trigger fires once for the entire SQL statement, regardless of how many rows are modified. A Row-Level trigger (`FOR EACH ROW`) fires once for every individual row affected, allowing access to `:NEW` and `:OLD` column values (Slides 71–75)." |
| **7** | *Can you rollback a DDL statement in Oracle?* | **Answer:** "No. In Oracle, DDL statements (`CREATE`, `ALTER`, `DROP`) issue an implicit `COMMIT` before and after execution. Only DML statements (`INSERT`, `UPDATE`, `DELETE`) can be rolled back." |
| **8** | *How does your application communicate between the React frontend and microservices?* | **Answer:** "The React frontend connects to Spring Cloud API Gateway on Port 8080. The Gateway uses Eureka Service Registry (Port 8761) to route requests dynamically to the 12 microservices (`8081`–`8092`), centralizing CORS, routing, and JWT authentication." |
| **9** | *What is the purpose of `NOCACHE` in sequence generation?* | **Answer:** "By default, Oracle caches 20 sequence numbers in SGA memory for performance. If the database crashes, cached numbers are lost, leaving gaps in sequence numbers. `NOCACHE` ensures every generated primary key is strictly sequential without gaps." |
| **10** | *What is the difference between `WHERE` and `HAVING` in Report 4?* | **Answer:** "`WHERE` filters rows before any grouping or aggregation takes place. `HAVING` filters the aggregated results after `GROUP BY`. In Report 4, we must calculate `MAX(m.MAINTENANCE_DATE)` first, then use `HAVING` to check if `ADD_MONTHS(...) <= SYSDATE`." |

---

## 8. Emergency Troubleshooting Playbook

* **Scenario: "My Oracle service is stopped!"**
  - Run in Admin PowerShell:
    ```powershell
    Start-Service -Name "OracleServiceXE"
    Start-Service -Name "OracleOraDB21Home1TNSListener"
    ```
* **Scenario: "MongoDB is not responding!"**
  - Run in Admin PowerShell:
    ```powershell
    Start-Service -Name "MongoDB"
    ```
* **Scenario: "A port is occupied before the demo!"**
  - Run `./stop_all.ps1` to cleanly kill orphaned processes and free ports `8761`, `8080`–`8092`, and `3000`.
