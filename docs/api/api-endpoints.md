# SmartMove Enterprise Transit System — Complete API Reference

> **Microservices Architecture:** 12 Microservices + API Gateway + Eureka Service Registry  
> **Base Gateway URL:** `http://localhost:8080`  
> **Authentication:** Bearer JWT Token (`Authorization: Bearer <token>`)  
> **Databases:** Oracle Database 21c XE (Relational/Transactional) + MongoDB (Multimedia & Reviews)

---

## Service Registry & Gateway

| Service | Port | Base Path | Description |
|---|---|---|---|
| **Service Registry** | `8761` | `http://localhost:8761` | Netflix Eureka Service Discovery & Health Registry |
| **API Gateway** | `8080` | `http://localhost:8080` | Spring Cloud Gateway - Central Reverse Proxy & Load Balancer |

---

## 1. Auth Service (`auth-service`)
* **Port:** `8081` | **Database:** Oracle (`PASSENGER`, `DRIVER` tables) | **Gateway Route:** `/api/auth/**`

| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates credentials (email + password). Returns JWT token, user role, and profile details. |
| `POST` | `/api/auth/register` | Public | Registers a new user (Passenger/Driver/Admin) with BCrypt-hashed password. |
| `PUT` | `/api/auth/change-password` | Authenticated | Updates account password after verifying existing credentials. |

---

## 2. Vehicle Service (`vehicle-service`)
* **Port:** `8082` | **Database:** Oracle (`VEHICLE` table) | **Gateway Route:** `/api/vehicles/**`

| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/vehicles` | Public / Admin | Retrieves all fleet vehicles with capacity, type, and operational status. |
| `POST` | `/api/vehicles` | Admin | Registers a new vehicle into the fleet with unique registration validation. |
| `GET` | `/api/vehicles/{id}` | All | Retrieves vehicle details by ID including assigned driver metadata. |
| `PUT` | `/api/vehicles/{id}` | Admin | Updates vehicle specifications, year, model, or status (`ACTIVE`, `MAINTENANCE`). |
| `DELETE` | `/api/vehicles/{id}` | Admin | Deactivates or removes a vehicle from active fleet scheduling. |
| `GET` | `/api/vehicles/search?q={query}` | All | Searches vehicles by registration plate, model name, or coach type. |

---

## 3. Driver Service (`driver-service`)
* **Port:** `8083` | **Database:** Oracle (`DRIVER` table) | **Gateway Route:** `/api/drivers/**`

| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/drivers` | Admin | Retrieves all registered drivers with star rating and completed trip counts. |
| `POST` | `/api/drivers` | Admin | Registers a new driver with verified commercial license number. |
| `GET` | `/api/drivers/{id}` | All | Retrieves specific driver details, contact info, and rating statistics. |
| `PUT` | `/api/drivers/{id}` | Admin | Updates driver status (`ACTIVE`, `ON_TRIP`, `ON_LEAVE`), phone, or rating. |
| `DELETE` | `/api/drivers/{id}` | Admin | Deactivates or removes a driver account from the system. |
| `GET` | `/api/drivers/profile` | Driver | Retrieves authenticated driver's personal profile from JWT token. |
| `PUT` | `/api/drivers/profile` | Driver | Updates authenticated driver's contact details and personal settings. |
| `GET` | `/api/drivers/my-trips` | Driver | Retrieves all scheduled, active, and completed trips assigned to the driver. |
| `GET` | `/api/drivers/search?q={query}` | Admin | Searches drivers by name, email, phone, or license number. |

---

## 4. Route Service (`route-service`)
* **Port:** `8084` | **Database:** Oracle (`ROUTE` table) | **Gateway Route:** `/api/routes/**`

| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/routes` | Public | Retrieves all transit routes with origin, destination, distance (km), and base fare. |
| `POST` | `/api/routes` | Admin | Creates a new transit route with calculated distance and duration. |
| `GET` | `/api/routes/{id}` | Public | Retrieves detailed route information and active trip schedules. |
| `PUT` | `/api/routes/{id}` | Admin | Updates route parameters, estimated duration, base fare, or active status. |
| `DELETE` | `/api/routes/{id}` | Admin | Deactivates a transit route if no active trips depend on it. |
| `GET` | `/api/routes/search?q={query}` | Public | Searches routes by origin city, destination city, or highway name. |

---

## 5. Passenger Service (`passenger-service`)
* **Port:** `8085` | **Database:** Oracle (`PASSENGER` table) | **Gateway Route:** `/api/passengers/**`

| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/passengers` | Admin | Retrieves all registered passengers for administrative auditing. |
| `GET` | `/api/passengers/{id}` | Admin | Retrieves a passenger profile and total booking count by ID. |
| `PUT` | `/api/passengers/{id}` | Admin | Updates passenger details or modifies account status (`ACTIVE`, `SUSPENDED`). |
| `DELETE` | `/api/passengers/{id}` | Admin | Deactivates a passenger account. |
| `GET` | `/api/passengers/profile` | Passenger | Retrieves authenticated passenger's profile and travel preferences. |
| `PUT` | `/api/passengers/profile` | Passenger | Updates authenticated passenger's personal profile information. |
| `GET` | `/api/passengers/search?q={query}` | Admin | Searches passengers by first/last name, email, or telephone. |

---

## 6. Trip Service (`trip-service`)
* **Port:** `8086` | **Database:** Oracle (`TRIP`, `ROUTE`, `VEHICLE`, `DRIVER` tables) | **Gateway Route:** `/api/trips/**`

| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/trips` | Public | Retrieves all trips enriched with route names, driver details, and live fares. |
| `POST` | `/api/trips` | Admin | Schedules a new journey, validates vehicle availability and driver assignment. |
| `GET` | `/api/trips/{id}` | Public | Retrieves single trip details, seat availability, departure/arrival timestamps. |
| `PUT` | `/api/trips/{id}` | Admin | Updates trip schedule, assigned driver/vehicle, or adjusts booking fare. |
| `DELETE` | `/api/trips/{id}` | Admin | Cancels and removes an unstarted trip. |
| `PATCH` | `/api/trips/{id}/status` | Driver / Admin | Transitions trip status (`SCHEDULED` -> `IN_PROGRESS` -> `COMPLETED` / `CANCELLED`). |
| `GET` | `/api/trips/search` | Public | Real-time passenger search filtering by origin, destination, travel date, max price. |
| `GET` | `/api/trips/upcoming` | Public | Returns upcoming scheduled departures for dashboard and guest views. |
| `GET` | `/api/trips/available` | Driver | Retrieves unassigned/pending passenger trip requests available for driver acceptance. |
| `POST` | `/api/trips/{id}/claim` | Driver | Driver claims and self-assigns an open scheduled trip request. |
| `GET` | `/api/trips/driver/{driverId}`| Driver / Admin | Retrieves manifest of trips assigned to a specific driver. |

---

## 7. Booking Service (`booking-service`)
* **Port:** `8087` | **Database:** Oracle (`BOOKING`, `TRIP`, `PAYMENT` tables) | **Gateway Route:** `/api/bookings/**`

| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/bookings` | Admin | Retrieves all passenger bookings across all trips with live payment status. |
| `POST` | `/api/bookings` | Passenger | Creates a booking (`STATUS='CONFIRMED'`, `PAYMENT_STATUS='UNPAID'`). Triggers seat deduction. |
| `GET` | `/api/bookings/{id}` | All | Retrieves detailed booking voucher with journey metadata and fare breakdown. |
| `PUT` | `/api/bookings/{id}/cancel` | Passenger / Admin | Cancels booking and triggers `TRG_MANAGE_SEATS` to restore available seats. |
| `DELETE` | `/api/bookings/{id}` | Admin | Removes a cancelled booking record. |
| `GET` | `/api/bookings/my-bookings` | Passenger | Retrieves booking history for the authenticated passenger. |
| `GET` | `/api/bookings/search?q={query}` | Admin | Searches bookings by booking reference, passenger name, or destination. |
| `PATCH` | `/api/bookings/{id}/status` | Admin / Driver | Updates booking operational state (`CONFIRMED`, `IN_PROGRESS`, `COMPLETED`). |
| `PATCH` | `/api/bookings/{id}/payment`| Payment Service / Admin | Updates payment status (`PAID`, `REFUNDED`) upon card transaction clearance. |
| `PUT` | `/api/bookings/{id}/accept` | Driver | Allows assigned driver to accept and confirm passenger booking request. |
| `GET` | `/api/bookings/trip/{tripId}` | Driver / Admin | Retrieves passenger manifest for a specific trip. |

---

## 8. Payment Service (`payment-service`)
* **Port:** `8088` | **Database:** Oracle (`PAYMENT`, `BOOKING` tables) | **Gateway Route:** `/api/payments/**`

| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/payments` | Admin | Retrieves master financial ledger of all completed card transactions. |
| `POST` | `/api/payments` | Passenger | Processes card payment for booking. Updates `BOOKING.PAYMENT_STATUS='PAID'`. |
| `GET` | `/api/payments/{id}` | Admin | Retrieves single transaction receipt by payment ID. |
| `GET` | `/api/payments/booking/{bookingId}` | Passenger / Admin | Retrieves payment transaction receipt associated with a booking. |

---

## 9. Maintenance Service (`maintenance-service`)
* **Port:** `8089` | **Database:** Oracle (`MAINTENANCE`, `VEHICLE` tables) | **Gateway Route:** `/api/maintenance/**`

| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/maintenance` | Admin | Retrieves all vehicle maintenance records with cost and completion logs. |
| `POST` | `/api/maintenance` | Admin | Logs new vehicle repair or preventative servicing job. |
| `GET` | `/api/maintenance/{id}` | Admin | Retrieves maintenance work order details by ID. |
| `PUT` | `/api/maintenance/{id}` | Admin | Updates maintenance task status (`PENDING`, `IN_PROGRESS`, `COMPLETED`) or cost. |
| `DELETE` | `/api/maintenance/{id}` | Admin | Deletes an obsolete maintenance record. |
| `GET` | `/api/maintenance/due` | Admin | Implements 6-month servicing rule (`ADD_MONTHS(last_date, 6) < SYSDATE`). |
| `GET` | `/api/maintenance/search?q={query}` | Admin | Searches maintenance logs by vehicle plate, description, or repair type. |

---

## 10. Feedback Service (`feedback-service`)
* **Port:** `8090` | **Database:** Oracle (`FEEDBACK` table) | **Gateway Route:** `/api/feedback/**`

| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/feedback` | Admin | Retrieves all passenger feedback entries with category and resolution status. |
| `POST` | `/api/feedback` | Passenger | Submits feedback (`COMPLAINT`, `SUGGESTION`, `APPRECIATION`) linked to a completed trip. |
| `GET` | `/api/feedback/{id}` | Admin | Retrieves feedback complaint or appreciation details by ID. |
| `DELETE` | `/api/feedback/{id}` | Admin | Resolves and archives feedback record. |
| `GET` | `/api/feedback/passenger/{passengerId}` | Passenger / Admin | Retrieves all feedback submitted by a specific passenger. |
| `GET` | `/api/feedback/search?q={query}` | Admin | Searches feedback by passenger name, category, or description keyword. |

---

## 11. Content Service (`content-service` — MongoDB)
* **Port:** `8091` | **Database:** MongoDB (`reviews`, `announcements`, `vehicle_documents`, `trip_media`) | **Gateway Route:** `/api/reviews/**`, `/api/announcements/**`, `/api/documents/**`, `/api/media/**`

### A. Reviews Collection (`db.reviews`)
| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/reviews` | Public | Retrieves all passenger reviews and ratings stored in MongoDB. |
| `POST` | `/api/reviews` | Passenger | Submits a passenger review with star rating (1-5), comment, and tags. |
| `GET` | `/api/reviews/route/{routeId}` | Public | **MongoDB Query 1:** Fetches all reviews for a specific route sorted by date. |
| `GET` | `/api/reviews/top-rated` | Public | **MongoDB Query 2:** Aggregates highest-rated vehicles/drivers using `$group` & `$avg`. |
| `GET` | `/api/reviews/search?keyword={kw}` | Public | **MongoDB Query 3:** Full-text regex search across passenger complaints and tags. |

### B. Announcements Collection (`db.announcements`)
| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/announcements` | Public | Retrieves active announcements filtered by target audience (`ALL`, `PASSENGERS`, `DRIVERS`). |
| `POST` | `/api/announcements` | Admin | Broadcasts a new system announcement with priority level (`HIGH`, `MEDIUM`). |
| `PUT` | `/api/announcements/{id}` | Admin | Updates announcement text, priority, or toggles status (`ACTIVE`, `ARCHIVED`). |
| `DELETE` | `/api/announcements/{id}` | Admin | Removes an announcement by its MongoDB ObjectId. |

### C. Vehicle Documents Collection (`db.vehicle_documents`)
| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/documents/vehicle/{vehicleId}` | Admin | **MongoDB Query 4a:** Retrieves vehicle certificates (Insurance, Revenue License, Emission Test). |
| `GET` | `/api/documents/vehicle/{vehicleId}/images` | Public | Retrieves exterior and interior coach photo galleries. |
| `POST` | `/api/documents/vehicle/{vehicleId}` | Admin | Uploads and links a digital document record to an Oracle vehicle ID. |
| `DELETE` | `/api/documents/{id}` | Admin | Deletes a vehicle document record by MongoDB ObjectId. |

### D. Trip Multimedia Collection (`db.trip_media`)
| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/media` | Public | Retrieves all trip gallery photos and promotional media. |
| `GET` | `/api/media/trip/{tripId}` | Public | **MongoDB Query 4b:** Retrieves scenic images and dashcam media for a specific journey. |
| `POST` | `/api/media` | Admin / Driver | Uploads trip media with caption and geotags. |
| `DELETE` | `/api/media/{id}` | Admin | Deletes trip multimedia record by MongoDB ObjectId. |

---

## 12. Report Service (`report-service`)
* **Port:** `8092` | **Database:** Oracle PL/SQL & Materialized Views | **Gateway Route:** `/api/reports/**`

| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| `GET` | `/api/reports/routes` | Admin | **Report 1:** Most frequently used routes ranked using `RANK() OVER` window function. |
| `GET` | `/api/reports/revenue?startDate={}&endDate={}` | Admin | **Report 2:** Revenue auditing over a date window querying `MV_MONTHLY_REVENUE`. |
| `GET` | `/api/reports/passenger-history/{passengerId}` | Admin / Passenger | **Report 3:** 5-table join tracking complete passenger travel history and spend. |
| `GET` | `/api/reports/passengers` | Admin | Customer Analytics Report tracking lifetime bookings, spending, and activity. |
| `GET` | `/api/reports/maintenance` | Admin | **Report 4:** Vehicles due for maintenance under the 6-month compliance rule. |
| `GET` | `/api/reports/trip-performance` | Admin | **Report 5:** Fleet occupancy rate (`BOOKED / CAPACITY * 100`) and revenue generated. |
| `GET` | `/api/reports/dashboard` | Admin | Aggregated KPI stats (vehicles, active drivers, today's trips, revenue, bookings). |

---

## Summary of Total Endpoints

* **Documented in Reference CSV:** 80 endpoints
* **Implemented in Real Backend Controllers:** 94 endpoints
* **Frontend Web Services Coverage:** 100% (all 94 endpoints integrated)
* **Backend Framework:** Spring Boot 3 + Java 17 + Spring Cloud Eureka + Spring Cloud Gateway
