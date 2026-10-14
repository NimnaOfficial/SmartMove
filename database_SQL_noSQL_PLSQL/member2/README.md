# SmartMove Transit System — Member 2 Implementation & Theory Guide
## Data Management 2 (CW No. 1)

* **Student Name:** Arshath MLM  
* **Student ID:** COHNDSE261F-036  
* **Role:** Member 2 — PL/SQL Business Logic, Materialized Views, Reports 1–3 & MongoDB Queries 1–2  
* **Assigned Database:** Oracle Database 21c Express Edition (XE) & MongoDB NoSQL  
* **Key Files:** `oracle.sql` / `orcale.sql`, `mongo.js`

---

## 1. Overview of Member 2 Responsibilities

Member 2 is responsible for implementing the core business calculation logic and analytical reporting layer across both relational and non-relational database engines:
1. **PL/SQL Stored Function (`CALCULATE_FARE`):** Encapsulating fare pricing calculation logic inside the database engine to guarantee transaction consistency across all booking channels.
2. **Materialized View (`MV_MONTHLY_REVENUE`):** Physical disk-based pre-aggregation of financial performance data for low-latency reporting.
3. **Stored Procedure (`REPORT_REVENUE`):** Parameterized procedure utilizing `OUT` parameters to return monthly financial metrics.
4. **Executive Business Reports (Reports 1, 2, 3):**
   - **Report 1:** Route Usage & Passenger Density using Oracle window ranking (`RANK() OVER`).
   - **Report 2:** Financial Revenue Performance & Reconciliation using conditional aggregation.
   - **Report 3:** Passenger Travel History & Loyalty Profile using grouping and aggregate metrics.
5. **MongoDB NoSQL Analytics (Queries 1 & 2):**
   - **Query 1:** Fast operational retrieval of passenger feedback by route.
   - **Query 2:** Multi-stage aggregation pipeline calculating average fleet ratings and review volumes.

---

## 2. Part-by-Part Code Breakdown & Lecture Note Mapping (`ALL.pdf`)

---

### Part 1: Stored Function `CALCULATE_FARE`

#### Code Snippet:
```sql
CREATE OR REPLACE FUNCTION CALCULATE_FARE (
    p_route_id IN NUMBER,
    p_seats    IN NUMBER
) RETURN NUMBER IS
    v_base_fare ROUTE.BASE_FARE%TYPE;
    v_total     NUMBER(10,2);
BEGIN
    IF p_seats <= 0 THEN
        RAISE_APPLICATION_ERROR(-20005, 'Seat count must be greater than zero.');
    END IF;

    SELECT BASE_FARE INTO v_base_fare
    FROM ROUTE
    WHERE ROUTE_ID = p_route_id;

    v_total := v_base_fare * p_seats;
    RETURN v_total;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20001, 'Route ID ' || p_route_id || ' does not exist.');
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20099, 'Error calculating fare: ' || SQLERRM);
END CALCULATE_FARE;
/

-- Test function with DUAL table:
SELECT CALCULATE_FARE(1, 2) AS TOTAL_FARE FROM DUAL;
```

#### What is it?
A compiled PL/SQL Stored Function that accepts input arguments (`IN NUMBER`), processes business calculations, and returns a single scalar value (`RETURN NUMBER`).

#### What does it do?
- Validates the incoming parameter (`p_seats > 0`).
- Dynamically queries the base ticket price of the specified route from the `ROUTE` table using `SELECT ... INTO`.
- Uses `v_base_fare ROUTE.BASE_FARE%TYPE` to inherit the exact data type and precision from the relational table column.
- Returns the total fare to the caller.
- Includes an `EXCEPTION` section that intercepts missing route records (`NO_DATA_FOUND`) and raises standardized Oracle user application errors (`RAISE_APPLICATION_ERROR`).

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 65–70 (`PL/SQL Function`), Slide 26 (`Variable attribute : %TYPE`), Slides 87–92 (`Exception Handling`).
- *Slide 65–68:* Defines a function as a named PL/SQL block that must return a value. Unlike procedures, functions can be invoked directly inside SQL queries (e.g. `SELECT CALCULATE_FARE(1, 2) FROM DUAL`).
- *Slide 26:* Explains the **`%TYPE` attribute**: Declares a variable according to another previously declared variable or database column. This guarantees data type synchronization if column definitions are altered.
- *Slide 88–92:* Explains **System-defined Exceptions** (`NO_DATA_FOUND`) and user-defined errors using `RAISE_APPLICATION_ERROR(-20000 to -20999, 'message')`.

---

### Part 2: Materialized View `MV_MONTHLY_REVENUE`

#### Code Snippet:
```sql
CREATE MATERIALIZED VIEW MV_MONTHLY_REVENUE
BUILD IMMEDIATE
REFRESH COMPLETE ON DEMAND
AS
SELECT 
    TO_CHAR(p.PAYMENT_DATE, 'YYYY-MM') AS REVENUE_MONTH,
    COUNT(b.BOOKING_ID)                AS TOTAL_BOOKINGS,
    SUM(p.AMOUNT)                      AS TOTAL_REVENUE
FROM PAYMENT p
JOIN BOOKING b ON p.BOOKING_ID = b.BOOKING_ID
WHERE p.STATUS = 'PAID'
GROUP BY TO_CHAR(p.PAYMENT_DATE, 'YYYY-MM');

SELECT * FROM MV_MONTHLY_REVENUE;
```

#### What is it?
A Materialized View is an Oracle database object that stores the pre-computed query results physically on disk, unlike a standard view which only stores the query text.

#### What does it do?
- `BUILD IMMEDIATE`: Populates the view with data immediately upon creation.
- `REFRESH COMPLETE ON DEMAND`: Refreshes the entire dataset when requested by the administrator (`DBMS_MVIEW.REFRESH`).
- Pre-aggregates historical transaction payments grouped by calendar month (`YYYY-MM`), allowing executive dashboards to retrieve financial summaries instantly without joining millions of rows in `PAYMENT` and `BOOKING`.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 76–86 (`View`, `Materialized View`, `Difference Between Materialized View And View`).
- *Slide 77–78:* Explains that standard views are virtual tables whose SQL query executes every time the view is queried.
- *Slide 79–81:* Defines **Materialized Views**: Physically persists query output on disk. Ideal for summary tables, data warehouses, and compute-heavy aggregations.
- *Slide 82–86:* Explains the **Populated method** (`BUILD IMMEDIATE` vs `BUILD DEFERRED`), **Refresh method** (`COMPLETE` vs `FAST`), and **Refresh interval** (`ON DEMAND` vs `ON COMMIT`).

---

### Part 3: Stored Procedure `REPORT_REVENUE`

#### Code Snippet:
```sql
CREATE OR REPLACE PROCEDURE REPORT_REVENUE (
    p_month         IN NUMBER,
    p_year          IN NUMBER,
    p_total_revenue OUT NUMBER
) AS
BEGIN
    SELECT NVL(SUM(AMOUNT), 0)
    INTO p_total_revenue
    FROM PAYMENT
    WHERE STATUS = 'PAID'
      AND EXTRACT(MONTH FROM PAYMENT_DATE) = p_month
      AND EXTRACT(YEAR FROM PAYMENT_DATE) = p_year;
END REPORT_REVENUE;
/
```

#### What is it?
A PL/SQL Stored Procedure with both `IN` parameters and an `OUT` parameter.

#### What does it do?
- Receives month and year filters via `IN` parameters.
- Uses `EXTRACT(MONTH ...)` and `EXTRACT(YEAR ...)` to filter payment records.
- Uses `NVL(SUM(AMOUNT), 0)` to handle null values gracefully if no payments exist.
- Assigns the aggregated revenue to parameter `p_total_revenue` via `OUT NUMBER`.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 55–64 (`PL/SQL Procedure`).
- *Slide 58:* Explains **`IN` Parameter**: Passes values from the calling environment into the procedure (read-only inside the procedure).
- *Slide 59–60:* Explains **`OUT` Parameter**: Returns values from the procedure back to the caller.
- *Slide 70:* Compares Procedures vs Functions: Procedures are designed to perform actions and return multiple values via `OUT` parameters, whereas Functions compute and return a single value.

---

### Part 4: Executive Business Reports 1, 2, and 3

#### Code Snippet (Report 1 — Route Popularity Ranking):
```sql
SELECT 
    r.ROUTE_ID,
    r.ORIGIN,
    r.DESTINATION,
    r.DISTANCE_KM,
    r.BASE_FARE,
    COUNT(b.BOOKING_ID) AS TOTAL_BOOKINGS,
    RANK() OVER (ORDER BY COUNT(b.BOOKING_ID) DESC) AS ROUTE_RANK
FROM ROUTE r
LEFT JOIN TRIP t ON r.ROUTE_ID = t.ROUTE_ID
LEFT JOIN BOOKING b ON t.TRIP_ID = b.TRIP_ID AND b.STATUS != 'CANCELLED'
GROUP BY r.ROUTE_ID, r.ORIGIN, r.DESTINATION, r.DISTANCE_KM, r.BASE_FARE
ORDER BY ROUTE_RANK;
```

#### What is it?
Analytical SQL query leveraging analytic window functions (`RANK() OVER`) and multi-table outer joins (`LEFT JOIN`).

#### What does it do?
- Aggregates ticket bookings per transit route across trips.
- `RANK() OVER (ORDER BY COUNT(b.BOOKING_ID) DESC)` calculates a dense ordinal ranking based on booking popularity without requiring procedural loops or correlated subqueries.
- Identifies high-demand corridors to guide fleet scheduling.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Advanced SQL & Analytical Query Techniques.
- Window functions compute values across sets of rows without collapsing the underlying row identities, offering superior execution performance over recursive PL/SQL cursors.

---

### Part 5: MongoDB NoSQL Queries 1 & 2 (`mongo.js`)

#### Code Snippet (Query 2 — Top-Rated Fleet Aggregation Pipeline):
```javascript
db.reviews.aggregate([
    {
        $match: {
            vehicleId: { $ne: null }
        }
    },
    {
        $group: {
            _id: "$vehicleId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 }
        }
    },
    {
        $project: {
            _id: 0,
            vehicleId: "$_id",
            averageRating: { $round: ["$averageRating", 2] },
            totalReviews: 1
        }
    },
    {
        $sort: {
            averageRating: -1,
            totalReviews: -1
        }
    },
    {
        $limit: 5
    }
]);
```

#### What is it?
MongoDB Aggregation Pipeline processing unstructured passenger feedback documents.

#### What does it do?
- **Stage 1 (`$match`):** Filters out general reviews that do not reference a specific vehicle ID.
- **Stage 2 (`$group`):** Groups documents by `vehicleId`, computing the mathematical mean (`$avg: "$rating"`) and total review volume (`$sum: 1`).
- **Stage 3 (`$project`):** Formats fields and rounds the score to two decimal places (`$round`).
- **Stage 4 (`$sort`):** Orders vehicles descending by rating score.
- **Stage 5 (`$limit`):** Returns the top 5 highest-rated buses.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 148–155 (`MongoDB Features`) & Slides 180–205 (`Query and Aggregation`).
- Explains MongoDB document databases, BSON document modeling, and pipeline aggregation stages (`$match`, `$group`, `$project`, `$sort`, `$limit`) as the NoSQL equivalent of SQL `GROUP BY`, `HAVING`, and window ranking.
