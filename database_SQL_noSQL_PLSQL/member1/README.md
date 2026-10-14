# SmartMove Transit System — Member 1 Implementation & Theory Guide
## Data Management 2 (CW No. 1)

* **Student Name:** J.H.N. Fernando  
* **Student ID:** COHNDSE261F-037  
* **Role:** Member 1 — Master Schema Foundation, Constraints, Database Security & Backup  
* **Assigned Database:** Oracle Database 21c Express Edition (XE)  
* **Key Files:** `oracle.sql` / `orcale.sql`

---

## 1. Overview of Member 1 Responsibilities

Member 1 is responsible for establishing the core structural foundation of the SmartMove enterprise database. This encompasses:
1. **Master Entity DDL:** Creating master tables (`PASSENGER`, `DRIVER`, `ROUTE`, `VEHICLE`) conforming to 3rd Normal Form (3NF).
2. **Key Generation:** Creating Oracle sequences for surrogate primary key generation to eliminate concurrency bottlenecks.
3. **Domain & Referential Integrity:** Defining table-level and column-level constraints (`PRIMARY KEY`, `UNIQUE`, `CHECK`, `NOT NULL`, `DEFAULT`).
4. **Database Security Architecture:** Implementing Role-Based Access Control (RBAC) by creating `smartmove_app_role`, granting least-privilege object permissions, and configuring application user `smartmove_user`.
5. **Backup & Recovery Strategy:** Formulating logical backup routines utilizing Oracle Data Pump (`expdp` and `impdp`).

---

## 2. Part-by-Part Code Breakdown & Lecture Note Mapping (`ALL.pdf`)

---

### Part 1: Sequence Creation for Primary Keys

#### Code Snippet:
```sql
CREATE SEQUENCE SEQ_PASSENGER START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_DRIVER    START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_ROUTE     START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE SEQ_VEHICLE   START WITH 1 INCREMENT BY 1 NOCACHE;
```

#### What is it?
An Oracle `SEQUENCE` is a database object that generates an ordered sequence of unique numeric integers according to defined interval rules. 

#### What does it do?
- `START WITH 1`: The sequence begins issuing values starting from integer 1.
- `INCREMENT BY 1`: Each subsequent request increases by 1.
- `NOCACHE`: Prevents pre-allocating numbers in memory cache, ensuring zero gaps in sequence numbers if an unexpected system restart occurs.
- Automatically generates sequential surrogate primary keys (`SEQ_PASSENGER.NEXTVAL`), isolating database keys from natural business values (e.g., National ID or email).

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Relational Database Implementation & Primary Key Generation.
- In relational schema design, using integer surrogate keys generated via Oracle sequences guarantees fast B-Tree indexing, consistent join performance across foreign keys, and prevents lock contention during high-concurrency inserts.

---

### Part 2: Master Tables DDL & Constraints

#### Code Snippet (Example: `PASSENGER` and `VEHICLE`):
```sql
CREATE TABLE PASSENGER (
    PASSENGER_ID   NUMBER(10)     DEFAULT SEQ_PASSENGER.NEXTVAL,
    FIRST_NAME     VARCHAR2(100)  NOT NULL,
    LAST_NAME      VARCHAR2(100)  NOT NULL,
    EMAIL          VARCHAR2(150)  NOT NULL,
    PHONE          VARCHAR2(20)   NOT NULL,
    PASSWORD_HASH  VARCHAR2(255)  NOT NULL,
    STATUS         VARCHAR2(20)   DEFAULT 'ACTIVE' NOT NULL,
    ROLE           VARCHAR2(20)   DEFAULT 'PASSENGER' NOT NULL,
    REGISTERED_AT  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UPDATED_AT     TIMESTAMP,

    CONSTRAINT PK_PASSENGER PRIMARY KEY (PASSENGER_ID),
    CONSTRAINT UQ_PASSENGER_EMAIL UNIQUE (EMAIL),
    CONSTRAINT CK_PASS_EMAIL CHECK (EMAIL LIKE '%@%.%'),
    CONSTRAINT CK_PASS_STATUS CHECK (STATUS IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    CONSTRAINT CK_PASS_ROLE CHECK (ROLE IN ('PASSENGER', 'ADMIN'))
);

CREATE TABLE VEHICLE (
    VEHICLE_ID     NUMBER(10)     DEFAULT SEQ_VEHICLE.NEXTVAL,
    REGISTRATION   VARCHAR2(20)   NOT NULL,
    MODEL          VARCHAR2(100)  NOT NULL,
    CAPACITY       NUMBER(3)      NOT NULL,
    STATUS         VARCHAR2(20)   DEFAULT 'AVAILABLE' NOT NULL,
    TYPE           VARCHAR2(30)   DEFAULT 'STANDARD' NOT NULL,
    CREATED_AT     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UPDATED_AT     TIMESTAMP,

    CONSTRAINT PK_VEHICLE PRIMARY KEY (VEHICLE_ID),
    CONSTRAINT UQ_VEHICLE_REG UNIQUE (REGISTRATION),
    CONSTRAINT CK_VEHICLE_CAP CHECK (CAPACITY BETWEEN 10 AND 100),
    CONSTRAINT CK_VEHICLE_STATUS CHECK (STATUS IN ('AVAILABLE', 'ON_TRIP', 'MAINTENANCE', 'OUT_OF_SERVICE')),
    CONSTRAINT CK_VEHICLE_TYPE CHECK (TYPE IN ('LUXURY', 'SEMI_LUXURY', 'STANDARD'))
);
```

#### What is it?
Data Definition Language (DDL) specifications defining the relational entities, scalar data types (`NUMBER`, `VARCHAR2`, `TIMESTAMP`), default values, and integrity constraints.

#### What does it do?
- **Entity Integrity:** `PRIMARY KEY (PASSENGER_ID)` enforces uniqueness and non-null values.
- **Unique Identification:** `UNIQUE (EMAIL)` and `UNIQUE (REGISTRATION)` prevent duplicate accounts or duplicate license plates.
- **Domain Integrity (`CHECK` constraints):**
  - `CHECK (EMAIL LIKE '%@%.%')`: Validates proper electronic mail format at database engine level.
  - `CHECK (CAPACITY BETWEEN 10 AND 100)`: Prevents unrealistic bus seating values.
  - `CHECK (STATUS IN (...))`: Enforces state machine validity at the schema level.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 14–18 (`PL/SQL Data Types` & Scalar Types).
- In Oracle, scalar types like `VARCHAR2` dynamically size strings up to 4,000 bytes, while `NUMBER(p, s)` guarantees exact decimal arithmetic.
- Schema-level constraints ensure ACID transaction validity: no application bug can commit corrupted data into the master tables.

---

### Part 3: Database Security (User Privileges & Roles)

#### Code Snippet:
```sql
CREATE ROLE smartmove_app_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON PASSENGER TO smartmove_app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON DRIVER    TO smartmove_app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ROUTE     TO smartmove_app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON VEHICLE   TO smartmove_app_role;

GRANT SELECT ON SEQ_PASSENGER TO smartmove_app_role;
GRANT SELECT ON SEQ_DRIVER    TO smartmove_app_role;
GRANT SELECT ON SEQ_ROUTE     TO smartmove_app_role;
GRANT SELECT ON SEQ_VEHICLE   TO smartmove_app_role;
```

#### What is it?
Oracle Database Security implementation using **User Roles** and **Object Privileges**.

#### What does it do?
- Creates a dedicated security container role `smartmove_app_role`.
- Grants only the necessary Data Manipulation Language (DML) privileges (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) on master tables.
- Grants `SELECT` on sequences so microservices can generate primary keys.
- Isolates administrative tables from unprivileged access.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 113–127 (`User Privileges`, `Object Privileges`, and `User Roles`).
- *Slide 113–115:* Explains the difference between **System Privileges** (database-wide permissions like `CREATE SESSION`, `CREATE TABLE`) and **Object Privileges** (permissions on specific database objects like `SELECT`, `INSERT` on `PASSENGER`).
- *Slide 123–127:* Explains **User Roles**: A role is a named group of related privileges. Instead of granting permissions directly to individual users, privileges are granted to a role, and the role is granted to users (`smartmove_user`). This simplifies user administration and implements the security Principle of Least Privilege.

---

### Part 4: Logical Database Backup & Recovery (Oracle Data Pump)

#### Code Snippet:
```text
Export Command:
expdp system/oracle@localhost:1521/XEPDB1 schemas=SMARTMOVE directory=DATA_PUMP_DIR dumpfile=smartmove_full.dmp logfile=smartmove_exp.log

Import Command:
impdp system/oracle@localhost:1521/XEPDB1 schemas=SMARTMOVE directory=DATA_PUMP_DIR dumpfile=smartmove_full.dmp logfile=smartmove_imp.log
```

#### What is it?
Oracle Data Pump Export (`expdp`) and Import (`impdp`) utilities for high-speed, server-based logical backup and schema migration.

#### What does it do?
- `schemas=SMARTMOVE`: Dumps all metadata (tables, sequences, constraints, roles) and table rows belonging to the SmartMove schema.
- `directory=DATA_PUMP_DIR`: Specifies the secure server directory path where binary dump files are written.
- `dumpfile=smartmove_full.dmp`: Binary format output file containing compressed database objects.
- `logfile=smartmove_exp.log`: Generates detailed execution audit logs with timestamp verification.

#### Connection to DM02 Lecture Notes (`ALL.pdf`):
- **Lecture Reference:** Slides 128–140 (`Database Backup`, `Export Utility`, `Import Utility`).
- *Slide 128:* Defines logical backup versus physical backup. Logical backups export database structures and data into proprietary binary files without taking the database offline.
- *Slide 133–137:* Explains the **Export Utility** syntax, parameters (`schemas`, `directory`, `dumpfile`, `logfile`), and how it extracts metadata definitions.
- *Slide 138–140:* Explains the **Import Utility (`impdp`)**, which reads Data Pump dump files to recreate schemas, rebuild table indexes, and restore data after disaster recovery.
