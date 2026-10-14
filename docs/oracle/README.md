# SmartMove — Oracle 21c Database Documentation & Execution Guide

This directory contains all relational database scripts for the **SmartMove Enterprise Transit System**, fully normalized to **Third Normal Form (3NF)** and optimized for Oracle Database 21c XE / Enterprise Edition.

---

## Files in this Directory

| File | Purpose | Key Contents |
|---|---|---|
| [`SmartMove_Oracle_Full_Executable.sql`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/oracle/SmartMove_Oracle_Full_Executable.sql) | **Master All-in-One Deployment Script** | DDL for 9 tables, 9 sequences, constraints, triggers, functions, procedures, materialized view, seed test data, 5 business reports, and security roles. |
| [`Oracle_Setup.sql`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/oracle/Oracle_Setup.sql) | Standalone DDL Schema Setup | Schema tables, indexes, PL/SQL engines, and materialized view creation. |
| [`Oracle_TestData.sql`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/oracle/Oracle_TestData.sql) | Standalone Test Data Seed Script | 33 rows across 9 tables with sequence resynchronization. |

---

## Relational Tables (9 Tables)

1. `PASSENGER` — Passenger accounts, authentication hash, contact numbers, and status (`ACTIVE`, `INACTIVE`, `SUSPENDED`).
2. `DRIVER` — Commercial drivers, commercial license numbers, safety star ratings (1.00–5.00), and completed trip counts.
3. `VEHICLE` — Fleet coach assets (Luxury Coach, Mini Bus, Standard Bus) with capacity, model, year, and status (`ACTIVE`, `INACTIVE`, `MAINTENANCE`).
4. `ROUTE` — Geographic travel corridors with origin, destination, distance in km, estimated duration, and `BASE_FARE`.
5. `TRIP` — Scheduled passenger journeys linking Route, Vehicle, and Driver with timestamps, available seat counter, and status (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
6. `BOOKING` — Passenger ticket reservations with `SEATS_BOOKED`, `TOTAL_FARE`, `STATUS` (`PENDING`, `CONFIRMED`, `CANCELLED`), and `PAYMENT_STATUS` (`UNPAID`, `PAID`, `REFUNDED`).
7. `PAYMENT` — Financial transaction ledger recording card payment method, transaction reference (`TXN-*`), payment timestamp, and status (`SUCCESS`, `FAILED`, `REFUNDED`).
8. `MAINTENANCE` — Fleet servicing and repair logs with vehicle reference, repair description, cost (LKR), servicing date, and status (`PENDING`, `IN_PROGRESS`, `COMPLETED`).
9. `FEEDBACK` — Passenger customer service feedback and complaints linked to specific trips (`COMPLAINT`, `SUGGESTION`, `APPRECIATION`).

---

## How to Execute

### Option A: Using Oracle SQL*Plus
```bash
sqlplus system/YOUR_PASSWORD@localhost:1521/XE
@SmartMove_Oracle_Full_Executable.sql
```

### Option B: Using Oracle SQL Developer
1. Open SQL Developer and connect as `system` (or `smartmove_user`).
2. Open `SmartMove_Oracle_Full_Executable.sql`.
3. Press **F5** (Run Script).
4. Verify all tables, triggers, functions, and materialized view `MV_MONTHLY_REVENUE` are created without errors.
