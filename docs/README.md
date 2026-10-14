# SmartMove Enterprise Transit System — Coursework Documentation & Viva Hub

> **Course:** Data Management 2 (CW No. 1)  
> **Institution:** NIBM  
> **Team Members:**  
> - **Member 1 (037):** **JHN Fernando** (COHNDSE261F-037) — Master Schema Foundation, Constraints, Roles, Backup  
> - **Member 2 (036):** **Arshath MLM** (COHNDSE261F-036) — PL/SQL Business Logic, Reports 1–3, Mongo Aggregations  
> - **Member 3 (028):** **D.D Kandeepan** (COHNDSE261F-028) — Transactional Engine, Triggers, Concurrency, Reports 4–5  
> - **Member 4 (004):** **KGL Sandanimne** (COHNDSE261F-004) — MongoDB Architecture, Full-Text Search, Media & UI Integration  

---

## Directory Navigation & Deliverables

```
docs/
├── api/
│   ├── SmartMove_API_Reference.csv     # Complete 94-endpoint CSV reference
│   └── api-endpoints.md               # Full Markdown specification of all REST APIs & RBAC rules
├── diagrams/                          # (also aliased as digrams/)
│   ├── DM02_SCHEMA_3NF.pdf            # Vector PDF 3NF Relational Schema (Production)
│   ├── DM02_SCHEMA_3NF.png            # 300 DPI high-res 3NF diagram
│   ├── DM02_ER_3NF.pdf                # Vector PDF Production EER Diagram
│   ├── DM02_ER_3NF.png                # 300 DPI high-res EER diagram
│   ├── DM02_ER.pdf                    # Phase 1 Conceptual EER Diagram
│   ├── DM02_SCHEMA.pdf                # Phase 1 Logical Schema Diagram
│   └── Schema_and_EER_Documentation.md# Comprehensive 3NF normalization technical guide
├── mongodb/
│   ├── Mongo_Setup.js                 # Collection schemas, JSON validators & indexes
│   ├── Mongo_TestData.js              # 14 test JSON documents across all 4 collections
│   ├── Mongo_Queries.js               # Practical coursework queries 1-4 with aggregations
│   └── README.md                      # MongoDB local & cloud execution guide
├── oracle/                            # (also aliased as orcale/)
│   ├── SmartMove_Oracle_Full_Executable.sql # Master executable Oracle SQL script
│   ├── Oracle_Setup.sql               # Relational DDL, sequences, triggers, PL/SQL engines
│   ├── Oracle_TestData.sql            # 33 seed rows across 9 tables with sequence sync
│   └── README.md                      # Oracle 21c XE deployment guide
├── presentation/
│   └── DM02_PRESENTATION.pptx         # 19-slide comprehensive Viva PowerPoint presentation
├── reports/
│   ├── SmartMove_routes_Report_2026-10-12.pdf      # Executive Report 1 (Route Popularity)
│   ├── SmartMove_revenue_Report_2026-10-12.pdf     # Executive Report 2 (Financial Performance)
│   ├── SmartMove_customers_Report_2026-10-12.pdf   # Executive Report 3 (Passenger Analytics)
│   ├── SmartMove_maintenance_Report_2026-10-12.pdf # Executive Report 4 (Maintenance Due)
│   ├── SmartMove_occupancy_Report_2026-10-12.pdf   # Executive Report 5 (Trip Occupancy)
│   └── SmartMove_Reports_Specification.md          # Full SQL & BI specification guide
└── viva/
    ├── SmartMove_Live_Viva_Examination_Guide_and_Drill.md # Complete live demonstration drill & Q&A prep
    └── SmartMove_Live_Viva_Demonstration_Training_Guide.md # Step-by-step viva practice manual & commands
```

---

## System Quick Reference

### Architecture & Ports
* **Eureka Service Registry:** `http://localhost:8761`
* **Spring Cloud API Gateway:** `http://localhost:8080` (all frontend traffic routes here)
* **Frontend Single-Page App:** `http://localhost:3000`
* **12 Microservices:**
  * `auth-service` (:8081) — JWT Authentication & User Profiles
  * `vehicle-service` (:8082) — Fleet Bus Management
  * `driver-service` (:8083) — Commercial Driver Manifests
  * `route-service` (:8084) — Geographic Travel Corridors
  * `passenger-service` (:8085) — Passenger Accounts
  * `trip-service` (:8086) — Trip Scheduling & Driver Assignment
  * `booking-service` (:8087) — Concurrency-Locked Seat Reservations
  * `payment-service` (:8088) — Card Payment Processing
  * `maintenance-service` (:8089) — 6-Month Servicing Compliance
  * `feedback-service` (:8090) — Transactional Complaint Registry
  * `content-service` (:8091) — MongoDB Document & Multimedia Hub
  * `report-service` (:8092) — Oracle BI Reporting Engine

### Databases
* **Oracle Database 21c XE:** `localhost:1521/XE` | Relational 3NF master & transactional data (9 tables).
* **MongoDB Atlas Cloud:** `SMARTMOVE` on cluster `dm02.v72yvox.mongodb.net` | Reviews, broadcasts, vehicle compliance certificates, and trip photos (4 collections).

---

## Viva Demonstration Checklist

1. **System Startup:** Run `./start_full_system.ps1` from workspace root.
2. **Passenger Journey:** Search route Colombo ➔ Kandy, book 2 seats with card payment, inspect live seat deduction.
3. **Driver Manifest:** Driver logs in, views trip manifest, accepts open trip, starts journey.
4. **Payment Clearance:** Payment marks trip completed and updates passenger travel history.
5. **Business Intelligence:** Admin exports all 5 live PDF business reports from `/admin/reports`.
6. **System Shutdown:** Run `./stop_all.ps1` to release all ports cleanly.
