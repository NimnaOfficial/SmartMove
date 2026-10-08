# SmartMove Transport Solutions
## Complete UI & Web Application Specification

**Course:** Data Management 2  
**Assessment:** CW No. 1  
**Application:** SmartMove Transport Solutions  
**Architecture:** Microservices  
**Frontend:** React + TypeScript + Vite  
**UI stack:** Tailwind CSS + shadcn/ui  
**Charts:** Recharts  
**Backend:** Spring Boot Microservices  
**Database:** Oracle + MongoDB

> This is an implementation planning guide. The final submitted implementation must be the team's own work and must follow the lecturer's academic-integrity policy.

## 1. Purpose

This document is the complete UI/web specification for the SmartMove Transport Solutions Data Management 2 CW. It is the frontend team's implementation blueprint: pages, windows, sections, fields, buttons, actions, roles, API/data behaviour, states, navigation, MongoDB-backed screens, five reports, integration, testing, and demo flows.

## 2. CW requirements that the UI must visibly support

The assessment requires a simple Web or Enterprise Application plus Oracle relational implementation, PL/SQL business logic, at least five business reports, MongoDB as a complementary NoSQL database, four specified MongoDB query demonstrations, and application-layer MongoDB integration.

The nine core operations are:
1. Vehicle Management
2. Driver Management
3. Route Management
4. Passenger Management
5. Trip Scheduling Management
6. Ticket Booking Management
7. Payment Processing
8. Maintenance Management
9. Feedback and Review Management

MongoDB must cover:
- Vehicle images and documents
- Passenger reviews and feedback comments
- Travel announcements and notifications
- Trip-related multimedia

Required MongoDB demonstrations:
1. Reviews for a specific route
2. Highest-rated vehicles or drivers
3. Keyword search in complaints/feedback
4. Vehicle documents and multimedia

The UI should therefore make these requirements observable inside the application, not only in database tools.

## 3. Roles

### ADMIN
Can manage operational data, scheduling, bookings, payments, maintenance, feedback, reports, and content.

### DRIVER
Can see assigned trips, relevant trip/route/vehicle information, notifications, and allowed status updates.

### PASSENGER
Can register/login, search trips, view trips, book, pay, view bookings/travel history, submit feedback, read announcements, and view relevant media.

## 4. Overall application architecture

Recommended flow:

```text
React + TypeScript
        |
        v
API Gateway
        |
        +-----------------------+
        |                       |
        v                       v
Business Microservices     Content Service
        |                       |
        v                       v
      Oracle                 MongoDB
        |
   PL/SQL + Reports
```

The browser must not connect directly to Oracle or MongoDB. All database access goes through backend services.

## 5. Global application shell

Every protected screen should share one shell:

```text
+-------------------------------------------------------------+
| SmartMove | Search | Notifications | User/Profile          |
+---------------+---------------------------------------------+
| Sidebar       | Main Content                                |
| Dashboard     |                                             |
| Operations    |                                             |
| Reports       |                                             |
| Content       |                                             |
| Settings      |                                             |
| Logout        |                                             |
+---------------+---------------------------------------------+
```

Header:
- SmartMove branding
- Optional global search
- Notification icon
- User name
- Role badge
- Profile menu

Sidebar:
- Role-aware navigation
- No admin controls for passengers/drivers
- Collapsible on smaller screens

## 6. Global reusable UI components

Build these before feature pages:

- App shell and layouts
- Header and sidebar
- Page header/breadcrumb
- Buttons
- Inputs/selects/textareas
- Date/time pickers
- Tables
- Cards
- Tabs
- Badges/status pills
- Search/filter controls
- Pagination
- Modals
- Confirmation dialogs
- Toast notifications
- Loading skeletons/spinners
- Empty states
- Error states
- Charts
- Image/media gallery
- File/document list

Every API-driven page must handle Loading, Success, Empty, and Error states.

## 7. Global UI rules

Use one visual system for typography, spacing, buttons, tables, forms, cards, statuses, and dialogs.

Destructive actions require confirmation.

Example:
```text
Delete Vehicle?
This action cannot be undone.
[Cancel] [Delete]
```

Never display raw Java/Oracle/MongoDB stack traces to users.

Use friendly messages such as:
- Unable to create booking.
- No seats are currently available.
- Requested record was not found.

Disable Save/Submit while a request is processing to reduce duplicate submissions.

## 8. Public Page — Landing / Welcome

Route: `/`

Purpose: introduce SmartMove and send users toward login, registration, and trip discovery.

Sections:
1. Header: Home, Trips, About, Login, Register
2. Hero: SmartMove Transport Solutions + short value statement
3. Primary actions: Search Trips, Login, Register
4. Service cards: Booking, Trip Management, Payments, Updates, Feedback
5. Selected announcements from MongoDB
6. Optional featured trips/routes
7. Footer with project/organization information

Keep it useful and professional; it is not the main marking target.

## 9. Public Page — Login

Route: `/login`

Fields:
- Email/username
- Password

Actions:
- Login
- Create account
- Forgot password only if implemented

On success:
- ADMIN -> Admin dashboard
- DRIVER -> Driver dashboard
- PASSENGER -> Passenger dashboard

Show a clear invalid-login error without exposing sensitive authentication details.

## 10. Public Page — Register

Route: `/register`

Fields:
- Full name
- Email
- Phone
- Password
- Confirm password

Add only final-schema fields if needed.

Validation:
- Required values
- Email format
- Phone format
- Password rules
- Matching passwords
- Duplicate-account error

Action: Create Account.

## 11. Passenger Dashboard

Route: `/passenger/dashboard`

Show:
- Upcoming trips
- Active bookings
- Completed trips
- Total trips
- Next booking summary
- Search Trips panel
- Latest MongoDB announcements
- Recent feedback/review summary where appropriate

Search panel:
- From
- To
- Date
- Passenger count if implemented
- Search Trips button

## 12. Passenger — Search Trips

Route: `/passenger/trips`

Search/filter:
- Origin
- Destination
- Date
- Optional vehicle type/time/price filters

Each result:
- Trip ID
- Route
- Departure
- Arrival/estimated arrival
- Vehicle
- Available seats
- Fare
- Status

Actions:
- View Details
- Book Now

## 13. Passenger — Trip Details

Route: `/passenger/trips/:tripId`

Sections:
### Trip
Route, origin, destination, date, departure time, estimated arrival, status.

### Vehicle
Registration, type, capacity, availability.

### Driver
Appropriate driver information.

### Dynamic content
MongoDB-backed images, documents/review information, and trip media where applicable.

### Price
Fare and booking action.

Buttons:
- Book Now
- Back

## 14. Passenger — Booking

Route: `/passenger/book/:tripId`

Use a step indicator:
1. Trip
2. Booking
3. Payment
4. Confirmation

Show trip summary, authenticated passenger details, ticket quantity, fare and total.

If the agreed schema supports seat selection, show an appropriate seat selector.

Buttons:
- Continue to Payment
- Cancel

The frontend collects input; booking business rules remain in backend/Oracle/PLSQL.

## 15. Passenger — Payment

Route: `/passenger/payment/:bookingId`

This is an academic/simulated payment screen unless the lecturer requires a real provider.

Show:
- Booking ID
- Route
- Date/time
- Ticket quantity
- Total

Possible payment method:
- Demo/Card/Cash according to the implemented model

States:
- Processing
- Success
- Failure

Never use or store real card credentials for coursework testing.

## 16. Passenger — Booking Confirmation

Route: `/passenger/bookings/:bookingId/confirmation`

Show:
- Booking confirmed message
- Booking ID
- Passenger
- Route
- Date/time
- Vehicle
- Amount
- Payment status
- Booking status

Buttons:
- My Bookings
- Travel History
- Dashboard

## 17. Passenger — My Bookings

Route: `/passenger/bookings`

Tabs:
- Upcoming
- Completed
- Cancelled

Fields:
- Booking ID
- Route
- Trip
- Date
- Amount
- Booking status
- Payment status

Actions:
- View
- Cancel, when permitted

## 18. Passenger — Travel History

Route: `/passenger/travel-history`

Show:
- Trip
- Route
- Date
- Vehicle
- Booking
- Payment status

Filters:
- Date range
- Route

This page can consume the same backend/report logic used by the passenger travel-history report.

## 19. Passenger — Feedback / Review

Route: `/passenger/feedback`

Submit form:
- Trip
- Route
- Vehicle
- Driver
- Rating 1–5
- Comment

Actions:
- Submit Feedback
- Reset/Cancel

Below:
- Previous feedback
- Rating
- Comment
- Route
- Date

The final relational/MongoDB division must follow the team database design.

## 20. Passenger — Announcements

Route: `/passenger/announcements`

MongoDB-backed feed.

Each card:
- Title
- Message
- Published date
- Priority
- Audience/status if relevant

Use search/filter only when useful.

## 21. Passenger — Media

Route: `/passenger/media`

MongoDB-backed content.

Display:
- Trip
- Route
- Image/video thumbnail or reference
- Caption
- Published date
- Media type

Filters:
- Trip
- Route
- Media type

## 22. Passenger — Profile

Route: `/passenger/profile`

Sections:
- Personal information
- Contact information
- Account security

Actions:
- Edit profile
- Change password
- Logout

## 23. Admin Dashboard

Route: `/admin/dashboard`

This should be the strongest management screen.

KPI cards:
- Total Vehicles
- Total Drivers
- Total Passengers
- Today's Trips
- Today's Bookings
- Today's Revenue
- Maintenance Due

Charts:
- Bookings by Route
- Revenue Trend
- Trip Occupancy

Quick actions:
- Add Vehicle
- Add Driver
- Create Route
- Schedule Trip
- Record Maintenance

Alerts:
- Vehicles due for maintenance
- Upcoming trips
- Recent complaints/feedback
- Operational notices

All important figures must come from real backend data.

## 24. Admin — Vehicles list

Route: `/admin/vehicles`

Header:
- Vehicles
- Add Vehicle

Filters:
- Registration
- Vehicle type
- Status

Table:
- ID
- Registration
- Type
- Capacity
- Status
- Driver
- Actions

Actions:
- View
- Edit
- Deactivate/delete where the backend permits

## 25. Admin — Add/Edit Vehicle

Use a modal or dedicated form.

Fields:
- Registration number
- Vehicle type
- Capacity
- Status
- Optional model/year/description only if present in the final schema

Validation:
- Required fields
- Valid capacity
- Valid status
- Duplicate registration handling

Buttons:
- Save
- Cancel

## 26. Admin — Vehicle Details

Route: `/admin/vehicles/:vehicleId`

Use tabs:
- Overview
- Maintenance
- Documents
- Images
- Reviews

Oracle-backed:
- Vehicle identity
- Registration
- Type
- Capacity
- Status
- Driver/operational data
- Maintenance state

MongoDB-backed:
- Vehicle images
- Documents
- Customer reviews
- Related dynamic media

This is one of the best pages for demonstrating Oracle + MongoDB integration.

## 27. Admin — Drivers list

Route: `/admin/drivers`

Table:
- Driver ID
- Name
- Contact
- Status
- Assigned trips
- Rating when supported
- Actions

Actions:
- View
- Edit

## 28. Admin — Driver Details

Route: `/admin/drivers/:driverId`

Sections/tabs:
- Profile
- Status
- Assigned Trips
- Performance/Rating
- Customer Reviews

Keep personal information limited to what the project actually needs.

## 29. Admin — Routes list

Route: `/admin/routes`

Table:
- Route ID
- Origin
- Destination
- Status
- Trips
- Actions

Actions:
- Add
- View
- Edit
- Deactivate/delete where appropriate

## 30. Admin — Add/Edit Route

Fields:
- Origin
- Destination
- Description
- Status
- Optional distance/duration if included in final schema

Buttons:
- Save
- Cancel

Validation must match backend/database rules.

## 31. Admin — Route Details

Route: `/admin/routes/:routeId`

Show:
- Route information
- Trips using the route
- Booking activity where available
- Passenger reviews

Required MongoDB demo:
Use this page to show all passenger reviews for a selected route.

## 32. Admin — Passengers list

Route: `/admin/passengers`

Table:
- Passenger ID
- Name
- Email
- Phone
- Registration date
- Status
- Actions

Actions:
- View
- Edit
- Deactivate where implemented

## 33. Admin — Passenger Details

Route: `/admin/passengers/:passengerId`

Tabs:
- Profile
- Bookings
- Travel History
- Feedback

Admin should see appropriate data while avoiding unnecessary sensitive information.

## 34. Admin — Trips list

Route: `/admin/trips`

Header:
- Trips
- Schedule Trip

Filters:
- Date
- Route
- Driver
- Vehicle
- Status

Table:
- Trip ID
- Route
- Vehicle
- Driver
- Date
- Time
- Capacity
- Booked
- Status
- Actions

## 35. Admin — Schedule Trip

Fields:
- Route
- Vehicle
- Driver
- Date
- Departure time
- Arrival time if used
- Fare
- Status

Before submission the backend/database should validate:
- Route exists
- Vehicle is available
- Driver is assignable
- Date/time rules are valid

Buttons:
- Schedule
- Cancel

## 36. Admin — Trip Details

Route: `/admin/trips/:tripId`

Show:
- Trip information
- Route
- Vehicle
- Driver
- Capacity
- Booked seats
- Available seats
- Revenue where available
- Bookings
- Related media

Tabs:
- Overview
- Bookings
- Media

## 37. Admin — Bookings list

Route: `/admin/bookings`

Filters:
- Booking ID
- Passenger
- Trip
- Route
- Date
- Booking status
- Payment status

Table:
- Booking ID
- Passenger
- Trip
- Route
- Date
- Amount
- Booking status
- Payment status
- Actions

## 38. Admin — Booking Details

Route: `/admin/bookings/:bookingId`

Show:
- Booking information
- Passenger
- Trip
- Route
- Vehicle
- Payment
- Status

Allowed actions:
- Cancel when business rules permit
- View payment

## 39. Admin — Payments list

Route: `/admin/payments`

Table:
- Payment ID
- Booking ID
- Passenger
- Amount
- Method
- Date
- Status

Filters:
- Date range
- Status
- Method

## 40. Admin — Payment Details

Route: `/admin/payments/:paymentId`

Show:
- Payment ID
- Booking ID
- Amount
- Date
- Payment method
- Status

Never display full sensitive card credentials.

## 41. Admin — Maintenance list

Route: `/admin/maintenance`

Tabs:
- All
- Due
- Upcoming
- Completed

Table:
- Maintenance ID
- Vehicle
- Maintenance date
- Next maintenance
- Type
- Status
- Actions

Primary action:
- Record Maintenance

## 42. Admin — Record Maintenance

Fields:
- Vehicle
- Maintenance date
- Next maintenance date
- Maintenance type
- Description
- Status
- Optional cost/technician only if included in the final design

Buttons:
- Save
- Cancel

## 43. Admin — Maintenance Details

Route: `/admin/maintenance/:maintenanceId`

Show:
- Vehicle
- Maintenance dates
- Type
- Description
- Status
- History

Action:
- Edit when permitted

## 44. Admin — Feedback list

Route: `/admin/feedback`

Show:
- Rating
- Passenger reference
- Route
- Vehicle
- Driver
- Comment
- Date

Filters:
- Rating
- Route
- Vehicle
- Driver
- Keyword
- Date

## 45. Admin — Feedback Details

Route: `/admin/feedback/:feedbackId`

Show:
- Rating
- Comment
- Route
- Vehicle
- Driver
- Passenger reference
- Date

Only add moderation/flagging if the team actually implements it.

## 46. Reports — Main page

Route: `/admin/reports`

Show five report cards:
1. Most Frequently Used Routes
2. Revenue Within a Given Period
3. Passenger Travel History
4. Vehicles Due for Maintenance
5. Trip Occupancy & Performance

Each card:
- Report name
- Purpose
- Open Report button

## 47. Report UI — Most Frequently Used Routes

Route: `/admin/reports/routes`

Optional filters:
- Start date
- End date

Table:
- Rank
- Route
- Booking count
- Passenger count where available

Chart:
- Route vs booking count

Buttons:
- Generate/Refresh
- Export only if implemented

## 48. Report UI — Revenue within a period

Route: `/admin/reports/revenue`

Filters:
- Start date
- End date

Summary:
- Tickets Sold
- Total Revenue
- Average Ticket Value

Show a clear table and optional revenue chart.

The calculation comes from Oracle/report logic, not hardcoded frontend numbers.

## 49. Report UI — Passenger Travel History

Route: `/admin/reports/passenger-history`

Filters:
- Passenger
- Start date
- End date

Table:
- Passenger
- Trip
- Route
- Date
- Vehicle
- Booking
- Payment status

## 50. Report UI — Vehicles Due for Maintenance

Route: `/admin/reports/maintenance`

Table:
- Vehicle
- Registration
- Last maintenance
- Next maintenance
- Status

Clearly distinguish due/overdue records where the backend supplies that status.

## 51. Report UI — Trip Occupancy & Performance

Route: `/admin/reports/trip-performance`

Table:
- Trip
- Route
- Vehicle
- Capacity
- Booked seats
- Available seats
- Occupancy %
- Revenue

Optional chart:
- Trip/route vs occupancy %

## 52. Report page states

Every report page must handle:
- Initial state
- Loading
- Data found
- No data
- Error
- Refresh

Example:
`No report data found for the selected period.`

## 53. MongoDB Content Hub

Route: `/admin/content`

Provide navigation to:
- Reviews
- Top Rated
- Keyword Search
- Announcements
- Vehicle Documents
- Vehicle Images
- Trip Media

This is the main visible home for MongoDB-backed dynamic content.

## 54. MongoDB — Reviews page

Route: `/admin/content/reviews`

Show:
- Rating
- Passenger reference
- Route
- Vehicle
- Driver
- Comment
- Date

Filters:
- Route
- Vehicle
- Driver
- Rating
- Keyword

## 55. MongoDB Query 1 — Reviews by route

Required scenario: retrieve all passenger reviews for a specific route.

UI:
- Select Route
- Search Reviews

Results:
- Rating
- Comment
- Vehicle
- Driver
- Date

The result must come from the content service/MongoDB, not static data.

## 56. MongoDB Query 2 — Highest-rated vehicles/drivers

Route: `/admin/content/top-rated`

Tabs:
- Vehicles
- Drivers

Show:
- Rank
- Vehicle/driver
- Average rating
- Number of reviews

This should demonstrate an actual MongoDB aggregation/query.

## 57. MongoDB Query 3 — Keyword complaint search

Route: `/admin/content/search`

Search:
`Keyword [________] [Search]`

Example keywords should exist in the sample data:
- delay
- late
- clean
- rude
- crowded

Results:
- Rating
- Comment
- Route
- Vehicle
- Date

## 58. MongoDB Query 4 — Vehicle documents and multimedia

On vehicle detail or a dedicated content page, select a vehicle and show:
- Vehicle documents
- Vehicle images
- Relevant multimedia

This must be retrieved through the application layer.

## 59. MongoDB — Announcements admin

Route: `/admin/content/announcements`

List:
- Title
- Priority
- Audience
- Published date
- Status

Actions:
- Create
- Edit
- Publish
- Archive
- Delete only where appropriate

## 60. MongoDB — Announcement form

Fields:
- Title
- Message
- Priority
- Target audience
- Publish date
- Status

Actions:
- Save Draft
- Publish
- Cancel

## 61. MongoDB — Vehicle Documents

Route: `/admin/content/vehicle-documents`

Filters:
- Vehicle
- Document type

Display:
- Vehicle
- Document type
- File/reference
- Uploaded date
- Status

Actions where implemented:
- View
- Download
- Replace/update

## 62. MongoDB — Vehicle Images

Route: `/admin/content/vehicle-images`

Use a gallery:
- Image
- Vehicle
- Caption
- Uploaded date

Actions:
- View
- Delete where permitted

## 63. MongoDB — Trip Media

Route: `/admin/content/trip-media`

Display:
- Trip
- Route
- Media type
- Preview
- Caption
- Date

Actions:
- Add
- View
- Delete where permitted

## 64. Driver Dashboard

Route: `/driver/dashboard`

Cards:
- Today's Trips
- Upcoming Trips
- Completed Trips

Sections:
- Next Trip
- Announcements
- Relevant feedback/performance information

## 65. Driver — My Trips

Route: `/driver/trips`

Tabs:
- Today
- Upcoming
- Completed

Each trip:
- Route
- Date
- Time
- Vehicle
- Status
- View Details

## 66. Driver — Trip Details

Route: `/driver/trips/:tripId`

Show:
- Trip
- Route
- Vehicle
- Schedule
- Status

If status updates are implemented:
- Show only valid actions permitted by the backend.

## 67. Driver — Profile

Route: `/driver/profile`

Show:
- Name
- Contact
- Status
- Assigned/operational information

Optional:
- Rating
- Recent review summary

## 68. Driver — Notifications

Route: `/driver/notifications`

Show:
- Trip updates
- Schedule changes
- Operational announcements

These can be sourced from MongoDB-backed announcements/notifications.

## 69. Global notification center

Header bell opens a notification panel/page.

Groups:
- Unread
- All

Examples:
- Trip schedule changed.
- Vehicle is due for maintenance.
- New feedback received.
- Service announcement published.

## 70. Admin Profile / Settings

Route: `/admin/profile`

Sections:
- Profile
- Security
- Preferences if implemented

Do not add large unrelated settings areas just for appearance.

## 71. Error and system windows

Implement:
### 404 Not Found
`The requested page was not found.`

### 403 Forbidden
`You do not have permission to access this page.`

### Session expired
`Your session has expired. Please log in again.`

### General error
`Something went wrong. Please try again.`

Each should offer a sensible return/retry action.

## 72. Standard modal patterns

### Add/Edit modal
Title -> fields -> validation -> Cancel -> Save

### Delete confirmation
Warning -> Cancel -> Confirm

### Booking confirmation
Summary -> Confirm/Back

### Payment result
Processing -> success/failure

### Document/media preview
Preview -> metadata -> close

## 73. Table behaviour

For lists with enough data provide:
- Search
- Filters
- Sorting
- Pagination

On small screens use horizontal scrolling or cards. Important actions must remain reachable.

## 74. Responsive windows

Desktop:
- Permanent sidebar
- Multi-column dashboard
- Full tables

Tablet:
- Collapsible sidebar
- Two-column layouts where possible

Small screens:
- Drawer navigation
- Stacked cards/forms
- Horizontal table scrolling or card conversion

## 75. API/data boundary

Frontend responsibility:
- Collect input
- Obvious client validation
- Call APIs
- Present data
- Manage UI state
- Show loading/errors/success

Backend responsibility:
- Authentication
- Authorization
- Business rules
- Database access
- PL/SQL calls
- MongoDB queries

Database responsibility:
- Integrity constraints
- Transactional consistency
- PL/SQL business logic assigned to Oracle

## 76. Oracle-backed page flow

Example:

```text
React Vehicle Page
    -> API Gateway
    -> Vehicle Service
    -> Oracle
    -> JSON
    -> React
```

Do not make the frontend calculate authoritative business values itself.

## 77. MongoDB-backed page flow

Example:

```text
React Reviews Page
    -> API Gateway
    -> Content Service
    -> MongoDB
    -> JSON
    -> React
```

## 78. Hybrid Oracle + MongoDB page

Example Vehicle Details:

```text
Vehicle Details
---------------- Oracle ----------------
Registration
Type
Capacity
Status
Driver
Maintenance
---------------- MongoDB --------------
Images
Documents
Reviews
Dynamic media
-----------------------------------------
```

Spring Boot services provide the application-level integration.

## 79. Frontend route tree

```text
/
├── login
├── register
├── passenger/...
├── driver/...
└── admin/...
```

Use the detailed route list in this document as the master frontend navigation plan. Keep URLs stable once Member 3 begins integration.

## 80. Page-to-service mapping

```text
Login/Register         -> auth-service
Passengers             -> passenger-service
Vehicles               -> vehicle-service
Drivers                -> driver-service
Routes                 -> route-service
Trips                  -> trip-service
Bookings               -> booking-service
Payments               -> payment-service
Maintenance            -> maintenance-service
Feedback               -> feedback-service
Reports                -> report-service
Reviews/Announcements  -> content-service
Documents/Media        -> content-service
```

The browser normally calls the API Gateway, not individual internal services.

## 81. Recommended frontend folder structure

```text
frontend/smartmove-web/
├── public/
└── src/
    ├── assets/
    ├── components/
    │   ├── common/
    │   ├── forms/
    │   ├── tables/
    │   └── charts/
    ├── layouts/
    │   ├── PublicLayout
    │   ├── AdminLayout
    │   ├── DriverLayout
    │   └── PassengerLayout
    ├── pages/
    │   ├── auth/
    │   ├── dashboard/
    │   ├── vehicles/
    │   ├── drivers/
    │   ├── routes/
    │   ├── passengers/
    │   ├── trips/
    │   ├── bookings/
    │   ├── payments/
    │   ├── maintenance/
    │   ├── feedback/
    │   ├── reports/
    │   ├── reviews/
    │   ├── announcements/
    │   ├── documents/
    │   └── media/
    ├── services/
    │   └── api/
    ├── hooks/
    ├── context/
    ├── types/
    ├── routes/
    ├── utils/
    └── constants/
```

## 82. API service layer on frontend

Do not scatter raw fetch/axios calls throughout components.

Use service modules such as:

```text
authService
vehicleService
driverService
routeService
passengerService
tripService
bookingService
paymentService
maintenanceService
feedbackService
reportService
reviewService
announcementService
mediaService
documentService
```

This gives Member 4 a stable integration layer.

## 83. Recommended frontend implementation order

1. Project shell
2. Routing
3. Authentication
4. Role protection
5. Reusable components
6. Admin dashboard
7. Passenger dashboard
8. Vehicle module
9. Driver module
10. Route module
11. Trip module
12. Booking
13. Payment
14. Maintenance
15. Feedback
16. Reports
17. MongoDB reviews
18. Announcements
19. Documents/images
20. Trip media
21. Hybrid detail pages
22. Loading/error/empty states
23. Responsive polish
24. End-to-end testing

## 84. End-to-end passenger workflow

```text
Landing
  -> Login
  -> Passenger Dashboard
  -> Search Trips
  -> Trip Details
  -> Booking
  -> Payment
  -> Confirmation
  -> My Bookings
  -> Travel History
  -> Feedback
```

Every link in this chain must work with real services before final submission.

## 85. End-to-end admin workflow

```text
Admin Login
  -> Dashboard
  -> Vehicles
  -> Drivers
  -> Routes
  -> Schedule Trip
  -> Bookings
  -> Payments
  -> Maintenance
  -> Feedback
  -> Reports
  -> MongoDB Content
```

## 86. End-to-end MongoDB demonstration

Demonstrate:
1. Select route -> retrieve reviews
2. Open top-rated -> retrieve/aggregate ratings
3. Enter keyword -> retrieve matching complaints/feedback
4. Open vehicle -> retrieve documents/images/media

Where possible show the same data in the actual application, then optionally show the raw MongoDB query for proof.

## 87. UI testing checklist

Authentication:
- Login success/failure
- Logout
- Protected routes
- Role navigation

Core operations:
- Vehicle
- Driver
- Route
- Passenger
- Trip
- Booking
- Payment
- Maintenance
- Feedback

MongoDB:
- Reviews by route
- Highest-rated
- Keyword search
- Documents/media
- Announcements

Reports:
- All five reports load
- Filters work
- Empty state works
- Errors work

UX:
- Loading
- Success
- Empty
- Error
- Responsive layout
- No broken routes

## 88. Evidence to capture

Capture clean evidence while building:

- Login
- Admin dashboard
- Passenger dashboard
- Core operation pages
- Booking/payment flow
- Maintenance
- All five reports
- MongoDB reviews
- Required MongoDB query results
- Announcements
- Vehicle documents/images
- Trip media
- Oracle + MongoDB hybrid page
- Authentication/role behaviour
- End-to-end successful booking

Provide the evidence to the presentation/documentation member.

## 89. Presentation/demo priority

Polish these pages most:

1. Login
2. Admin Dashboard
3. Passenger Dashboard
4. Search Trips
5. Trip Details
6. Booking
7. Payment
8. Vehicle Details
9. Reports
10. MongoDB Reviews/Content
11. Hybrid Oracle + MongoDB Vehicle Details

A strong demo should show functionality rather than spend most of the time on animations.

## 90. Full final UI acceptance checklist

```text
PUBLIC
[ ] Landing
[ ] Login
[ ] Register

PASSENGER
[ ] Dashboard
[ ] Search Trips
[ ] Trip Details
[ ] Booking
[ ] Payment
[ ] Confirmation
[ ] My Bookings
[ ] Travel History
[ ] Feedback
[ ] Announcements
[ ] Media
[ ] Profile

DRIVER
[ ] Dashboard
[ ] My Trips
[ ] Trip Details
[ ] Notifications
[ ] Profile

ADMIN
[ ] Dashboard
[ ] Vehicles
[ ] Vehicle Form
[ ] Vehicle Details
[ ] Drivers
[ ] Driver Details
[ ] Routes
[ ] Route Form
[ ] Route Details
[ ] Passengers
[ ] Passenger Details
[ ] Trips
[ ] Schedule Trip
[ ] Trip Details
[ ] Bookings
[ ] Booking Details
[ ] Payments
[ ] Payment Details
[ ] Maintenance
[ ] Maintenance Form
[ ] Maintenance Details
[ ] Feedback
[ ] Feedback Details

REPORTS
[ ] Main report page
[ ] Frequent routes
[ ] Revenue
[ ] Passenger history
[ ] Maintenance due
[ ] Trip performance

MONGODB
[ ] Reviews
[ ] Route review search
[ ] Top-rated
[ ] Keyword search
[ ] Announcements
[ ] Vehicle documents
[ ] Vehicle images
[ ] Trip media

SYSTEM
[ ] Loading states
[ ] Empty states
[ ] Error states
[ ] Success notifications
[ ] Confirmation dialogs
[ ] 404
[ ] 403
[ ] Session expiration
[ ] Responsive layout
[ ] Role-aware navigation
[ ] Real API data
[ ] Oracle + MongoDB integration
```

## 91. Final design principle

Build the product in this order:

```text
FUNCTIONALITY
    ->
CORRECT DATA
    ->
CLEAR USER WORKFLOW
    ->
GOOD UX
    ->
VISUAL POLISH
```

The application should feel like one transportation-management product, not a collection of unrelated CRUD pages.

## 92. Final SmartMove UI vision

The final user journey should feel like:

```text
LOGIN
  ->
DASHBOARD
  ->
OPERATE / SEARCH
  ->
BOOK
  ->
PAY
  ->
TRAVEL
  ->
FEEDBACK
  ->
ANALYZE
  ->
REPORT
```

Oracle should provide structured operational data, transactions, PL/SQL and reports. MongoDB should provide dynamic/unstructured reviews, announcements, vehicle documents/images and trip media. Spring Boot microservices connect those systems to the React application.

## 93. Key implementation rule

Keep every page connected to the agreed backend contract. Do not build a page around invented field names, fake results, or a backend endpoint that does not exist. When the ERD, PL/SQL/report specification, API contract, or MongoDB design changes, update the frontend contract before continuing integration.

The goal is a complete, demonstrable SmartMove system in which every required CW feature can be reached, used, tested, and explained during the presentation/viva.
