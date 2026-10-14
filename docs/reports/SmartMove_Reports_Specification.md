# SmartMove — Executive Business Intelligence Reports Specification

> **Course:** Data Management 2 (CW No. 1)  
> **Backend Service:** `report-service` (Port `8092`)  
> **Frontend Page:** `AdminReports.tsx` (`/admin/reports`)  
> **PDF Export Engine:** Client-side vector & canvas rendering (`html2canvas` + `jspdf`)

This directory contains the executive PDF business reports exported directly from the SmartMove Transit Management System, alongside their technical SQL queries, analytical algorithms, and operational business purposes.

---

## Catalog of Exported PDF Reports

| File Name | Report Title | Core Analytical Engine | Primary Stakeholders |
|---|---|---|---|
| [`SmartMove_routes_Report_2026-10-12.pdf`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/reports/SmartMove_routes_Report_2026-10-12.pdf) | **Report 1: Most Frequently Used Routes** | `RANK() OVER` analytic window function joining `ROUTE` -> `TRIP` -> `BOOKING` | Route Planners, Fleet Allocation Team |
| [`SmartMove_revenue_Report_2026-10-12.pdf`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/reports/SmartMove_revenue_Report_2026-10-12.pdf) | **Report 2: Revenue & Financial Performance** | Date-bounded aggregation over `PAYMENT` ledger & `MV_MONTHLY_REVENUE` | Chief Financial Officer, Auditors |
| [`SmartMove_customers_Report_2026-10-12.pdf`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/reports/SmartMove_customers_Report_2026-10-12.pdf) | **Report 3: Passenger Travel & Customer Analytics** | Multi-table join (`PASSENGER` -> `BOOKING` -> `TRIP` -> `ROUTE` -> `PAYMENT`) | Marketing, Customer Loyalty Management |
| [`SmartMove_maintenance_Report_2026-10-12.pdf`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/reports/SmartMove_maintenance_Report_2026-10-12.pdf) | **Report 4: Vehicles Due for Maintenance** | 6-Month servicing rule via `ADD_MONTHS(LAST_DATE, 6) < SYSDATE` | Fleet Maintenance Supervisors, Safety Officers |
| [`SmartMove_occupancy_Report_2026-10-12.pdf`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/reports/SmartMove_occupancy_Report_2026-10-12.pdf) | **Report 5: Trip Occupancy & Capacity Utilization** | Seat utilization ratio `(BOOKED / CAPACITY * 100)` & trip revenue | Fleet Dispatchers, Operations Director |

---

## Detailed Technical Specifications

### Report 1: Most Frequently Used Routes
* **Endpoint:** `GET http://localhost:8080/api/reports/routes`
* **Business Objective:** Identifies high-demand travel corridors to justify frequency increases, premium coach deployment, or highway permit applications.
* **Underlying SQL Query:**
  ```sql
  SELECT 
      r.ROUTE_ID,
      r.ORIGIN,
      r.DESTINATION,
      COUNT(b.BOOKING_ID) AS TOTAL_BOOKINGS,
      RANK() OVER (ORDER BY COUNT(b.BOOKING_ID) DESC) AS ROUTE_RANK
  FROM ROUTE r
  LEFT JOIN TRIP t ON r.ROUTE_ID = t.ROUTE_ID
  LEFT JOIN BOOKING b ON t.TRIP_ID = b.TRIP_ID AND b.STATUS NOT IN ('CANCELLED')
  GROUP BY r.ROUTE_ID, r.ORIGIN, r.DESTINATION
  ORDER BY ROUTE_RANK;
  ```

---

### Report 2: Revenue & Financial Performance
* **Endpoint:** `GET http://localhost:8080/api/reports/revenue?startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}`
* **Business Objective:** Audits gross ticket revenue, confirmed seat transactions, and average ticket yield across any user-defined date window.
* **Underlying SQL Query / Materialized View:**
  ```sql
  SELECT 
      NVL(SUM(AMOUNT), 0) AS TOTAL_REVENUE,
      COUNT(PAYMENT_ID)   AS TICKETS_SOLD,
      NVL(ROUND(AVG(AMOUNT), 2), 0) AS AVG_TICKET_VALUE
  FROM PAYMENT
  WHERE STATUS = 'SUCCESS'
    AND PAYMENT_DATE BETWEEN TO_DATE('2026-09-12', 'YYYY-MM-DD') 
                         AND TO_DATE('2026-10-12 23:59:59', 'YYYY-MM-DD HH24:MI:SS');
  ```
* **Materialized View Acceleration:**
  Fast grouping is accelerated via `MV_MONTHLY_REVENUE`:
  ```sql
  CREATE MATERIALIZED VIEW MV_MONTHLY_REVENUE
  BUILD IMMEDIATE REFRESH COMPLETE ON DEMAND AS
  SELECT 
      TO_CHAR(PAYMENT_DATE, 'YYYY-MM') AS REVENUE_MONTH,
      SUM(AMOUNT)                      AS TOTAL_REVENUE,
      COUNT(PAYMENT_ID)                AS TICKETS_SOLD
  FROM PAYMENT
  WHERE STATUS = 'SUCCESS'
  GROUP BY TO_CHAR(PAYMENT_DATE, 'YYYY-MM');
  ```

---

### Report 3: Passenger Travel & Customer Analytics
* **Endpoint:** `GET http://localhost:8080/api/reports/passenger-history/{id}` & `GET /api/reports/passengers`
* **Business Objective:** Analyzes individual and aggregated passenger booking frequencies, travel spend, and journey destinations to inform loyalty rewards.
* **Underlying Multi-Table Join:**
  ```sql
  SELECT 
      p.PASSENGER_ID,
      p.FIRST_NAME || ' ' || p.LAST_NAME AS PASSENGER_NAME,
      r.ORIGIN || ' -> ' || r.DESTINATION AS ROUTE_DETAILS,
      t.DEPARTURE_TIME,
      v.REGISTRATION_NUMBER,
      b.STATUS AS BOOKING_STATUS,
      NVL(pay.STATUS, 'UNPAID') AS PAYMENT_STATUS,
      b.TOTAL_FARE
  FROM PASSENGER p
  JOIN BOOKING b ON p.PASSENGER_ID = b.PASSENGER_ID
  JOIN TRIP t ON b.TRIP_ID = t.TRIP_ID
  JOIN ROUTE r ON t.ROUTE_ID = r.ROUTE_ID
  JOIN VEHICLE v ON t.VEHICLE_ID = v.VEHICLE_ID
  LEFT JOIN PAYMENT pay ON b.BOOKING_ID = pay.BOOKING_ID
  WHERE p.PASSENGER_ID = :p_passenger_id
  ORDER BY t.DEPARTURE_TIME DESC;
  ```

---

### Report 4: Vehicles Due for Maintenance
* **Endpoint:** `GET http://localhost:8080/api/reports/maintenance`
* **Business Objective:** Enforces safety regulations by flagging vehicles whose last service was over 6 months ago (`ADD_MONTHS < SYSDATE`) or have never received recorded servicing.
* **Underlying SQL Query:**
  ```sql
  SELECT 
      v.VEHICLE_ID,
      v.REGISTRATION_NUMBER,
      v.MODEL,
      MAX(m.MAINTENANCE_DATE) AS LAST_SERVICING,
      ADD_MONTHS(MAX(m.MAINTENANCE_DATE), 6) AS DUE_DATE,
      v.STATUS
  FROM VEHICLE v
  LEFT JOIN MAINTENANCE m ON v.VEHICLE_ID = m.VEHICLE_ID
  GROUP BY v.VEHICLE_ID, v.REGISTRATION_NUMBER, v.MODEL, v.STATUS
  HAVING MAX(m.MAINTENANCE_DATE) IS NULL 
      OR ADD_MONTHS(MAX(m.MAINTENANCE_DATE), 6) <= SYSDATE
  ORDER BY DUE_DATE ASC;
  ```

---

### Report 5: Trip Occupancy & Performance
* **Endpoint:** `GET http://localhost:8080/api/reports/trip-performance`
* **Business Objective:** Calculates passenger load factors per trip to determine if larger coaches (e.g. 54-seat Ashok Leyland) or smaller coaches (28-seat Toyota Coaster) should be assigned.
* **Underlying Query Calculation:**
  ```sql
  SELECT 
      t.TRIP_ID,
      r.ORIGIN || ' - ' || r.DESTINATION AS ROUTE_NAME,
      v.CAPACITY,
      (v.CAPACITY - t.AVAILABLE_SEATS) AS BOOKED_SEATS,
      ROUND(((v.CAPACITY - t.AVAILABLE_SEATS) / v.CAPACITY) * 100, 1) AS OCCUPANCY_PERCENT,
      NVL(SUM(b.TOTAL_FARE), 0) AS REVENUE_GENERATED
  FROM TRIP t
  JOIN ROUTE r ON t.ROUTE_ID = r.ROUTE_ID
  JOIN VEHICLE v ON t.VEHICLE_ID = v.VEHICLE_ID
  LEFT JOIN BOOKING b ON t.TRIP_ID = b.TRIP_ID AND b.STATUS NOT IN ('CANCELLED')
  GROUP BY t.TRIP_ID, r.ORIGIN, r.DESTINATION, v.CAPACITY, t.AVAILABLE_SEATS
  ORDER BY t.TRIP_ID;
  ```
