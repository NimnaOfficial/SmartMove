# SmartMove — MongoDB Database Documentation & Execution Guide

This directory contains MongoDB setup scripts, JSON schema validators, indexes, test datasets, and practical viva aggregation queries for the **SmartMove Enterprise Transit System**.

---

## Files in this Directory

| File | Purpose | Key Contents |
|---|---|---|
| [`Mongo_Setup.js`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/mongodb/Mongo_Setup.js) | Collection Creation & Indexing | Creates 4 collections with strict schema validation rules, compound indexes, and text index. |
| [`Mongo_TestData.js`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/mongodb/Mongo_TestData.js) | Test Data Insertion Script | Populates 14 structured JSON documents across all 4 collections with cross-references to Oracle IDs. |
| [`Mongo_Queries.js`](file:///C:/Users/SANDANIMNE/Desktop/code%20ss/SmartMove/SmartMove/docs/mongodb/Mongo_Queries.js) | Coursework Viva Practical Queries | Queries 1–4: Route reviews, top-rated vehicle aggregations, full-text complaint search, and compliance document inspection. |

---

## Collections Overview

1. `db.reviews` — Passenger journey reviews, star ratings (1–5), multi-attribute tags (`On Time`, `Comfortable`, `Clean`), and freeform comments. Indexed with full-text search index on `comment`.
2. `db.announcements` — System broadcasts, route advisories, and weather alerts filtered by target audience (`ALL`, `PASSENGERS`, `DRIVERS`) with priority weighting (`HIGH`, `MEDIUM`).
3. `db.vehicle_documents` — Fleet compliance records storing digital certificates (Revenue Licenses, Insurance Policies, Emission Certificates) with expiration dates and coach photo galleries.
4. `db.trip_media` — Digital multimedia gallery storing highway dashcam footage and scenic journey photography mapped to Oracle `TRIP_ID`.

---

## How to Execute

### Option A: Local MongoDB (Default Port 27017)
```bash
mongosh "mongodb://localhost:27017/smartmove" Mongo_Setup.js
mongosh "mongodb://localhost:27017/smartmove" Mongo_TestData.js
mongosh "mongodb://localhost:27017/smartmove" Mongo_Queries.js
```

### Option B: MongoDB Atlas Cloud Cluster
```bash
mongosh "mongodb+srv://lochsand231_db_user:FtRHjKk6uFlfmdkd@dm02.v72yvox.mongodb.net/SMARTMOVE" Mongo_Setup.js
mongosh "mongodb+srv://lochsand231_db_user:FtRHjKk6uFlfmdkd@dm02.v72yvox.mongodb.net/SMARTMOVE" Mongo_TestData.js
mongosh "mongodb+srv://lochsand231_db_user:FtRHjKk6uFlfmdkd@dm02.v72yvox.mongodb.net/SMARTMOVE" Mongo_Queries.js
```
