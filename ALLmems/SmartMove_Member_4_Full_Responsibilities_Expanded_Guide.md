# SmartMove Transport Solutions — Member 4
## Full Responsibilities, Jobs, Work Plan, Deliverables & Handover Guide

**Course:** Data Management 2  
**Assessment:** CW No 1  
**Project:** SmartMove Transport Solutions  
**Role:** Frontend + MongoDB + UX + Integration UI Developer  
**Team structure:** 2 theory/design members + 2 technical/coding members

---

# 1. Your role in one sentence

You are the **frontend and MongoDB implementation owner**.

Your main job is to turn the backend services into a **complete, user-friendly SmartMove web application**, while implementing the required MongoDB collections and queries for dynamic transportation information and connecting those features to the Spring Boot backend.

You work especially closely with **Member 3**, because Member 3 owns the backend/API and you own the user-facing application that consumes those APIs.

---

# 2. What the CW requires that directly affects your work

The assessment requires a **simple Web or Enterprise Application** for SmartMove Transport Solutions.

The application must support:

- Vehicle Management
- Driver Management
- Route Management
- Passenger Management
- Trip Scheduling Management
- Ticket Booking Management
- Payment Processing
- Maintenance Management
- Feedback and Review Management

The CW also requires MongoDB as a complementary NoSQL database for:

- Vehicle images and documents
- Passenger reviews and feedback comments
- Travel announcements and notifications
- Trip-related multimedia content

MongoDB must use a schema-flexible structure, and the project must demonstrate these query scenarios:

1. Retrieve all passenger reviews for a specific route.
2. Identify highest-rated vehicles or drivers based on customer feedback.
3. Search customer complaints/feedback using specific keywords.
4. Retrieve vehicle documents and multimedia information.

The CW also requires MongoDB integration with the application layer for real-time content delivery and interactive use.

The rubric gives:

- Front-end Development + ER Diagram — 20%
- Oracle Database Implementation — 15%
- MongoDB Incorporation — 15%
- Reports & Business Logic (PL/SQL) — 15%
- Completeness — 5%
- Presentation & Viva — 20%
- Integration & Innovation — 10%

The top rubric band expects a fully functional, user-friendly frontend, correct MongoDB incorporation with all requirements captured, and strong Oracle + MongoDB integration.

---

# 3. Your ownership map

## Primary ownership

You are primarily responsible for:

1. React frontend
2. Application layout and navigation
3. User experience
4. Responsive interface
5. Dashboard
6. Authentication screens
7. Role-based frontend behavior
8. Vehicle management UI
9. Driver management UI
10. Route management UI
11. Passenger management UI
12. Trip management UI
13. Ticket booking UI
14. Payment UI
15. Maintenance UI
16. Feedback/review UI
17. Reports UI
18. MongoDB implementation
19. MongoDB collections
20. MongoDB sample documents
21. Required MongoDB queries
22. MongoDB-backed frontend features
23. Frontend/API integration
24. UI-level error handling
25. Frontend testing
26. Cross-browser/basic responsiveness testing
27. Technical screenshots/evidence for frontend and MongoDB
28. Final UI/demo preparation

## Shared responsibility

You work jointly with:

- **Member 1:** Make sure the frontend reflects the final ERD/entities and business workflow.
- **Member 2:** Supply screenshots, test results and demo material; use their report/test specifications.
- **Member 3:** API contracts, authentication, Oracle/MongoDB backend connection, integration debugging.

---

# 4. Your position in the architecture

Recommended architecture:

```text
React + TypeScript
        |
        | REST / JSON
        v
Spring Boot Backend
        |
        +----------------+
        |                |
        v                v
     Oracle           MongoDB
 Structured         Dynamic / NoSQL
```

Your main technical area is:

```text
               MEMBER 4
                  |
       +----------+-----------+
       |                      |
       v                      v
   React UI              MongoDB
       |                      |
       +----------+-----------+
                  |
                  v
            Spring Boot
```

You are the person who turns the technical capabilities built by Member 3 into something the user and lecturer can actually operate.

---

# 5. Very important: you are NOT just "the UI person"

The project does not only require a frontend.

You own two major areas:

```text
FRONTEND
+
MONGODB
```

and you also carry a large portion of the final **integration and demonstration**.

The MongoDB section itself is worth 15%, while Integration & Innovation is another 10%.

Therefore, do not spend all your time making the UI look beautiful while leaving MongoDB until the final day.

---

# 6. Phase 0 — Receive the team handoff

Before starting the main frontend, collect the following.

## From Member 1

Get:

```text
Final ER/EER diagram
Final entity list
Final relationships
Final attributes
Final naming conventions
Business process descriptions
```

You need these so that the UI matches the database design.

## From Member 2

Get:

```text
Five report specifications
MongoDB design specification
MongoDB query requirements
Test cases
Expected outputs
Presentation structure
Viva topics
```

## From Member 3

This is your most important technical handoff.

Get:

```text
API base URL
API endpoint list
HTTP methods
Request body formats
Response formats
Authentication method
Login flow
JWT/token handling
Role permissions
Error response structure
Pagination/filtering rules if used
Report API endpoints
MongoDB-backed endpoint list
```

Do not start wiring pages to imaginary endpoints.

---

# 7. Create a frontend implementation checklist

Create a checklist before coding.

```text
[ ] Login
[ ] Register
[ ] Dashboard
[ ] Vehicle management
[ ] Driver management
[ ] Route management
[ ] Passenger management
[ ] Trip management
[ ] Booking
[ ] Payment
[ ] Maintenance
[ ] Feedback
[ ] Travel history
[ ] Reports
[ ] Announcements
[ ] Reviews
[ ] Vehicle documents
[ ] Trip multimedia
```

MongoDB:

```text
[ ] vehicle_documents collection
[ ] reviews collection
[ ] announcements collection
[ ] trip_media collection
[ ] route review query
[ ] highest-rated query
[ ] keyword complaint search
[ ] document/media retrieval
```

Integration:

```text
[ ] Auth works
[ ] Oracle-backed data displays
[ ] MongoDB-backed data displays
[ ] Reports display
[ ] Errors display correctly
```

---

# 8. Recommended frontend stack

Recommended stack:

```text
React
TypeScript
Vite
Tailwind CSS
shadcn/ui
Recharts
```

Optional supporting tools:

```text
React Router
Axios or fetch
React Hook Form
Zod
```

Choose a coherent stack instead of adding libraries without a reason.

---

# 9. Frontend project structure

A good structure could be:

```text
frontend/
└── smartmove/
    |
    ├── src/
    │   ├── components/
    │   ├── layouts/
    │   ├── pages/
    │   │   ├── auth/
    │   │   ├── dashboard/
    │   │   ├── vehicles/
    │   │   ├── drivers/
    │   │   ├── routes/
    │   │   ├── passengers/
    │   │   ├── trips/
    │   │   ├── bookings/
    │   │   ├── payments/
    │   │   ├── maintenance/
    │   │   ├── feedback/
    │   │   ├── reports/
    │   │   ├── reviews/
    │   │   ├── announcements/
    │   │   └── media/
    │   │
    │   ├── services/
    │   ├── api/
    │   ├── hooks/
    │   ├── types/
    │   ├── utils/
    │   └── routes/
    │
    └── README.md
```

The exact structure can differ, but keep the code modular.

---

# 10. Build the application shell first

Before implementing every feature, create:

```text
Login
   ↓
Application shell
   ├── Sidebar
   ├── Top navigation
   ├── User profile
   └── Main content
```

This avoids building each page with a different layout.

---

# 11. Navigation design

Recommended high-level navigation:

```text
Dashboard

OPERATIONS
  Vehicles
  Drivers
  Routes
  Trips
  Bookings
  Payments
  Maintenance
  Feedback

REPORTS
  Route Usage
  Revenue
  Travel History
  Maintenance Due
  Trip Performance

CONTENT
  Reviews
  Announcements
  Vehicle Documents
  Trip Media
```

The actual navigation should respect user roles.

---

# 12. Authentication UI

Build:

```text
Login
Register
Logout
```

The login page should:

```text
Collect credentials
Send request to backend
Receive authentication response
Store auth state securely according to team design
Redirect to the correct application area
```

Do not hard-code:

```text
if username === "admin"
```

The real backend should decide whether authentication succeeds.

---

# 13. Frontend authorization

The frontend should hide/disable inappropriate features based on the authenticated role, but remember:

**Frontend restrictions are not the real security boundary.**

Member 3 must enforce authorization on the backend.

Example:

```text
ADMIN
  -> sees admin controls

DRIVER
  -> sees driver-specific functions

PASSENGER
  -> sees passenger-specific functions
```

---

# 14. Dashboard

Create a useful SmartMove dashboard.

Suggested cards:

```text
Total Vehicles
Active Drivers
Today's Trips
Today's Bookings
Today's Revenue
Maintenance Due
```

Suggested visualizations:

```text
Bookings by Route
Revenue Trend
Trip Occupancy
```

Use real API data.

Never fake important numbers for the finished demonstration.

---

# 15. Vehicle Management UI

Build:

```text
Vehicle list
Add vehicle
View vehicle
Edit vehicle
Vehicle status
Vehicle details
Maintenance information
```

Suggested displayed information:

```text
Vehicle ID
Registration Number
Type
Capacity
Status
Current/assigned driver where applicable
```

Add:

```text
Search
Filter
Sort
```

when practical.

---

# 16. Vehicle detail page — important integration page

Make this one of the strongest pages in the application.

Example layout:

```text
VEHICLE 25
--------------------------------

Oracle / relational section:
Registration
Vehicle Type
Capacity
Status
Driver
Maintenance status

MongoDB section:
Images
Documents
Customer Reviews
Rating
Related media
```

This single page can demonstrate the hybrid database idea extremely well.

---

# 17. Driver Management UI

Build:

```text
Driver list
Add driver
Driver details
Edit driver
Driver status
Assigned trips
Rating/performance where supported
```

Keep fields aligned with the actual Oracle schema.

---

# 18. Route Management UI

Build:

```text
Route list
Add route
Edit route
Route details
Origin
Destination
Distance/time where included
Route status/details
```

Do not invent attributes that are not part of the final data design unless the team intentionally extends the design.

---

# 19. Passenger Management UI

Build:

```text
Passenger list
Passenger details
Passenger registration
Edit profile where appropriate
Travel history
Feedback access
```

For an admin view, show appropriate passenger information without unnecessarily exposing sensitive data.

---

# 20. Trip Scheduling UI

Create:

```text
Trip list
Schedule trip
Trip details
Assigned route
Assigned vehicle
Assigned driver
Date/time
Status
```

Provide validation such as:

```text
Required fields
Valid date/time
Valid selections
```

Business validation ultimately comes from the backend/database layer.

---

# 21. Ticket Booking UI

This is one of the most important passenger workflows.

Recommended flow:

```text
Search trips
      ↓
Select route/trip
      ↓
View trip details
      ↓
Check availability
      ↓
Book
      ↓
Review booking details
      ↓
Payment
      ↓
Confirmation
```

Show:

```text
Route
Date/time
Vehicle
Available seats
Fare
Booking information
```

---

# 22. Booking error handling

Show useful messages.

Examples:

```text
No seats available
Trip unavailable
Invalid passenger
Booking failed
Session expired
Payment unsuccessful
```

Do not show raw Java/Oracle exception messages.

---

# 23. Payment UI

This is an academic project unless the lecturer specifies a real payment gateway.

Build a simulated payment flow:

```text
Booking
   ↓
Payment screen
   ↓
Payment details
   ↓
Confirm
   ↓
Success/failure
```

Do not store real card details.

The application should demonstrate the relationship between:

```text
Booking
Payment
Booking status
```

---

# 24. Maintenance UI

Build:

```text
Maintenance list
Vehicles due
Record maintenance
Maintenance details
Maintenance status
```

This page should consume the backend/report data rather than independently calculating everything in React.

---

# 25. Feedback UI

Build:

```text
Submit rating
Submit comment
View previous feedback
```

The application can store structured relational feedback in Oracle where the team's design requires it, while MongoDB can hold the dynamic review/comment content required by the CW.

The exact division must match the final team architecture.

---

# 26. Reports UI

Create a dedicated:

```text
Reports
```

section.

Recommended pages:

```text
1. Most Frequently Used Routes
2. Revenue Within a Given Period
3. Passenger Travel History
4. Vehicles Due for Maintenance
5. Trip Occupancy & Performance
```

These are the five reports agreed by the team.

---

# 27. Report 1 — Frequently Used Routes

UI should provide:

```text
Route
Booking count
Ranking
```

Display it as:

```text
Table
+
Optional bar chart
```

The values must come from Member 3's report API.

---

# 28. Report 2 — Revenue

Provide filters:

```text
From date
To date
```

Display:

```text
Tickets sold
Total revenue
Average ticket value
```

Optional:

```text
Revenue chart
```

---

# 29. Report 3 — Passenger Travel History

Provide:

```text
Passenger selection/search
```

Display:

```text
Trip
Route
Travel date
Vehicle
Booking
Payment status
```

---

# 30. Report 4 — Vehicles Due for Maintenance

Display:

```text
Vehicle
Last maintenance
Next maintenance
Status
```

Useful UI:

```text
Due
Upcoming
Completed
```

only when supported by actual data.

---

# 31. Report 5 — Trip Occupancy & Performance

Display:

```text
Trip
Route
Vehicle
Capacity
Booked seats
Available seats
Occupancy %
Revenue
```

This is an excellent dashboard-style report.

---

# 32. MongoDB implementation — your second major responsibility

Create the MongoDB model according to the CW.

Required areas:

```text
vehicle_documents
reviews
announcements
trip_media
```

MongoDB should complement Oracle rather than simply duplicating the same relational data.

---

# 33. Collection 1 — vehicle_documents

Purpose:

Store dynamic vehicle document information and references for vehicle images/documents.

Conceptual structure:

```json
{
  "vehicleId": 25,
  "documents": [
    {
      "type": "Insurance",
      "fileName": "insurance.pdf",
      "url": "..."
    }
  ],
  "images": [
    {
      "url": "...",
      "caption": "Front view"
    }
  ]
}
```

Your actual fields should follow the final team design.

---

# 34. Collection 2 — reviews

This must support passenger feedback/review comments.

Conceptual example:

```json
{
  "routeId": 5,
  "vehicleId": 25,
  "driverId": 4,
  "passengerId": 10,
  "rating": 5,
  "comment": "Comfortable and clean journey",
  "type": "REVIEW",
  "createdAt": "..."
}
```

Dynamic fields can be added where schema flexibility provides value.

---

# 35. Collection 3 — announcements

Purpose:

```text
Travel announcements
Notifications
Service updates
```

Conceptual:

```json
{
  "title": "Route Schedule Update",
  "message": "...",
  "publishedAt": "...",
  "targetAudience": "PASSENGERS",
  "priority": "HIGH"
}
```

This should be displayed in the application.

---

# 36. Collection 4 — trip_media

Purpose:

```text
Trip-related images
Video references
Other multimedia metadata
```

Conceptual:

```json
{
  "tripId": 1005,
  "media": [
    {
      "type": "IMAGE",
      "url": "...",
      "caption": "Departure"
    },
    {
      "type": "VIDEO",
      "url": "...",
      "caption": "Trip update"
    }
  ]
}
```

Use an appropriate media-storage strategy agreed by the technical team.

---

# 37. Schema flexibility

One of the reasons for MongoDB in this project is dynamic/unstructured information.

Do not try to make every review identical when there is a legitimate reason for optional/dynamic content.

However:

**schema-flexible does not mean schema-chaotic.**

Maintain sensible common fields such as:

```text
routeId
vehicleId
driverId
createdAt
rating
content/message
```

where they are relevant.

---

# 38. Required MongoDB Query 1

The CW requires:

> Retrieve all passenger reviews for a specific route.

You need:

```text
MongoDB query
Backend endpoint
Frontend page/result
```

Possible UI:

```text
Route selector
      ↓
Load reviews
      ↓
Review cards/table
```

Example endpoint concept:

```text
GET /api/reviews/route/{routeId}
```

The exact endpoint is your team's choice.

---

# 39. Required MongoDB Query 2

The CW requires:

> Identify highest-rated vehicles or drivers based on customer feedback.

Build:

```text
Top-rated vehicles
Top-rated drivers
```

Possible UI:

```text
Rank
Vehicle/Driver
Average rating
Number of reviews
```

This is a good candidate for a small leaderboard/card view.

---

# 40. Required MongoDB Query 3

The CW requires:

> Search customer complaints or feedback using specific keywords.

Build a search UI:

```text
Keyword:
[ delay             ] [Search]
```

Possible search keywords:

```text
delay
late
clean
rude
crowded
comfort
```

The actual keywords should be supported by your sample data.

Display:

```text
Passenger/review reference
Rating
Comment
Route
Date
```

where supported by the data.

---

# 41. Required MongoDB Query 4

The CW requires:

> Retrieve vehicle documents and multimedia information.

Build the vehicle detail page so a lecturer can select a vehicle and see:

```text
Images
Documents
Related media
```

This should come from the MongoDB-backed application flow.

---

# 42. MongoDB sample data

Create enough MongoDB data to make the queries meaningful.

For example:

```text
Multiple reviews
Different ratings
Different routes
Different vehicles
Different drivers
Several complaints
Several announcements
Multiple documents
Multiple media entries
```

Do not make every document identical.

---

# 43. MongoDB + Oracle linking

Use stable IDs.

Example:

```text
Oracle VEHICLE_ID = 25
```

MongoDB:

```json
{
  "vehicleId": 25
}
```

This allows:

```text
Oracle vehicle details
+
MongoDB vehicle content
```

to appear on one page.

Likewise use suitable identifiers for:

```text
routeId
driverId
passengerId
tripId
```

---

# 44. Work closely with Member 3 on API contracts

Your workflow should be:

```text
You define what the UI needs
       ↓
Member 3 provides/implements API
       ↓
You connect frontend
       ↓
Test together
```

Do not randomly change the expected response format.

For example, agree beforehand:

```text
GET /api/vehicles
GET /api/trips
GET /api/bookings
GET /api/reports/routes
GET /api/reviews/route/{routeId}
```

with exact response structures.

---

# 45. Create an API service layer

Do not put raw API calls throughout every component.

Use something like:

```text
services/
  authService
  vehicleService
  driverService
  routeService
  tripService
  bookingService
  paymentService
  maintenanceService
  feedbackService
  reportService
  reviewService
  announcementService
  mediaService
```

This makes the application much easier to maintain.

---

# 46. Reusable UI components

Create reusable components such as:

```text
Button
Input
Select
Modal
Table
Card
Badge
Pagination
SearchBar
DateRangePicker
LoadingSpinner
ErrorState
EmptyState
ConfirmDialog
```

This improves consistency and speeds up development.

---

# 47. Loading states

Every API-driven page should account for:

```text
Loading
Success
Empty
Error
```

Example:

```text
Loading trips...
```

instead of showing a blank screen.

---

# 48. Empty states

Examples:

```text
No bookings found.

No vehicles are currently due for maintenance.

No reviews found for this route.

No announcements available.
```

A professional application handles missing data gracefully.

---

# 49. Form validation

Validate on the frontend before sending obvious invalid requests.

Examples:

```text
Required fields
Valid email format
Positive amounts
Valid rating 1–5
Valid date
Selected trip required
Selected passenger required
```

Again, frontend validation is for user experience; backend/database validation still matters.

---

# 50. Responsive design

Test at least:

```text
Desktop
Laptop
Tablet
Smaller browser width
```

The CW asks for a web/enterprise application but does not specify a particular responsive framework. Responsive design is a recommended quality feature.

Do not let tables become unusable on smaller screens.

---

# 51. Accessibility basics

Use:

```text
Labels
Readable contrast
Keyboard-accessible controls
Clear error messages
Meaningful button labels
```

Do not make buttons such as:

```text
[Click]
```

everywhere when a more descriptive label is possible.

---

# 52. Frontend security

Never put:

```text
Database password
MongoDB password
JWT secret
Private API keys
```

in the React source.

Anything shipped to the browser should be considered visible to the user.

Sensitive secrets belong on the backend/environment.

---

# 53. Route protection

Unauthenticated users should not reach protected application areas.

Example:

```text
/login

/admin/*
/driver/*
/passenger/*
```

Implement route handling appropriate to your authentication design.

---

# 54. Frontend error mapping

Map backend errors to user-friendly messages.

Examples:

```text
HTTP 401
→ Please log in again.

HTTP 403
→ You do not have permission for this action.

HTTP 404
→ Requested record was not found.

HTTP 409
→ This operation conflicts with existing data.

HTTP 500
→ Something went wrong. Please try again.
```

Do not expose internal stack traces.

---

# 55. Booking UI integration with PL/SQL

Your React page should not implement the booking business logic itself.

The correct flow is:

```text
React booking form
      ↓
Spring Boot booking endpoint
      ↓
PL/SQL procedure
      ↓
Oracle
      ↓
Result
      ↓
Spring Boot
      ↓
React
```

This is important because the CW specifically requires PL/SQL business logic.

---

# 56. Report UI integration with PL/SQL

Similarly:

```text
React report page
      ↓
Spring Boot report endpoint
      ↓
Oracle report procedure/query
      ↓
Response
      ↓
React table/chart
```

Your frontend should present the results; Member 3 owns the database-side implementation.

---

# 57. Technical testing responsibility

Test the actual user experience.

## Authentication

```text
[ ] Login success
[ ] Login failure
[ ] Logout
[ ] Protected page access
[ ] Role-specific navigation
```

## Vehicle

```text
[ ] List
[ ] Add
[ ] Edit
[ ] View
[ ] Error handling
```

## Driver

```text
[ ] List
[ ] Add
[ ] Edit
[ ] View
```

## Route

```text
[ ] List
[ ] Add
[ ] Edit
[ ] View
```

## Trip

```text
[ ] Create
[ ] View
[ ] Edit/update
[ ] Validation
```

## Booking

```text
[ ] Search trip
[ ] Select trip
[ ] Book
[ ] No-seat failure
[ ] Confirmation
```

## Payment

```text
[ ] Payment screen
[ ] Success
[ ] Failure
[ ] Booking state updated
```

## Maintenance

```text
[ ] View
[ ] Record
[ ] Due report
```

## Feedback

```text
[ ] Submit
[ ] View
```

---

# 58. MongoDB testing

You must separately verify:

```text
[ ] Reviews load by route
[ ] Top-rated vehicles/drivers load
[ ] Keyword search works
[ ] Vehicle documents load
[ ] Vehicle images load
[ ] Trip media loads
[ ] Announcements load
```

Test both:

```text
Results exist
No results exist
```

---

# 59. Integration testing

Run this complete workflow:

```text
Login
  ↓
Search trip
  ↓
Book ticket
  ↓
Payment
  ↓
View booking
  ↓
Leave review
  ↓
Review appears in Mongo-backed feature
  ↓
Admin views reports
```

Also test:

```text
Admin
  ↓
Vehicle
  ↓
Vehicle detail
  ├── Oracle details
  └── MongoDB documents/reviews/media
```

That is one of your strongest integration demonstrations.

---

# 60. Browser testing

Test in the browser you will use for the presentation.

Also test at least one additional modern browser if practical.

Check:

```text
Layout
Navigation
Forms
Tables
Charts
Images
Dialogs
Authentication
API failures
```

---

# 61. Performance basics

Do not load huge amounts of data unnecessarily.

Use:

```text
Pagination
Filtering
Search
Lazy loading where appropriate
```

for large lists when your backend supports it.

You do not need enterprise-scale optimization for this academic project, but avoid obviously inefficient UI patterns.

---

# 62. Visual consistency

Choose a consistent design system:

```text
Typography
Spacing
Buttons
Cards
Tables
Badges
Forms
Colors
Icons
```

Do not make:

```text
Vehicle page = one design
Driver page = completely different design
Reports = another application
```

The project should feel like one product.

---

# 63. Project branding

Use a consistent identity such as:

```text
SMARTMOVE
Transport Solutions
```

Use the same:

```text
Logo/text
Page title style
Navigation
Status badges
```

throughout the application.

---

# 64. Important status displays

Use understandable status labels.

Examples may include:

```text
AVAILABLE
BUSY
OFF_DUTY
ON_LEAVE
```

for drivers, and maintenance/repair states should match whatever the final team design uses.

Do not invent status values that conflict with the database.

---

# 65. Notifications

Implement an announcement/notification area using MongoDB data.

Example:

```text
Announcements

Route 120 schedule updated
Maintenance closure tomorrow
Special service notice
```

This directly gives the MongoDB announcement collection visible application value.

---

# 66. Interactive content

The CW mentions real-time content delivery and interactive forums for students and instructors.

The exact wording appears specialized/generic in the sheet, so do not invent an unnecessary large social network.

A sensible academic interpretation is to provide interactive transportation content such as:

```text
Announcements
Reviews
Feedback/comments
Dynamic trip content
```

and demonstrate that these are delivered through the application layer from MongoDB.

If your lecturer gives a more specific interpretation, follow the lecturer.

---

# 67. Evidence for the presentation

Capture:

```text
Login screen
Dashboard
Vehicle page
Booking flow
Payment flow
Maintenance page
Reports
MongoDB review page
Announcements
Vehicle documents/media
MongoDB query results
Oracle + Mongo hybrid vehicle page
```

Give the screenshots to Member 2.

---

# 68. MongoDB evidence to capture

For each required query, capture:

```text
Query
Input/filter
Returned result
Application output if available
```

For example:

```text
Query 1
Route = 5
↓
Reviews returned
```

Repeat for all four required scenarios.

---

# 69. Don't rely only on MongoDB Compass screenshots

Compass screenshots are useful evidence, but the strongest demonstration is:

```text
MongoDB
   ↓
Spring Boot
   ↓
React
```

Show the actual feature inside the application.

That is much better evidence of incorporation and application integration.

---

# 70. Technical handoff from you to Member 2

At the end, give:

```text
Frontend screenshots
MongoDB screenshots
MongoDB query screenshots
Dashboard screenshot
Reports screenshot
Hybrid Oracle + MongoDB screenshot
Testing results
UI architecture explanation
MongoDB collection explanation
```

Member 2 can use these in the presentation/documentation.

---

# 71. Technical handoff from you to Member 3

Give Member 3:

```text
Final API requirements
Any endpoint changes
Frontend errors found
Expected request/response shapes
Authentication requirements
MongoDB content requirements
Integration bugs
```

Do not hide integration bugs until the final day.

---

# 72. What Member 3 should give you

You need:

```text
Working backend URL/port
API documentation
Authentication details
Request bodies
Response bodies
Error formats
Role rules
Mongo endpoints
Report endpoints
Oracle-driven endpoints
```

Keep these written down.

---

# 73. Create a frontend API contract file

Recommended:

```text
frontend/API_CONTRACT.md
```

Include:

```text
Endpoint
Method
Authentication
Request
Response
Errors
```

This becomes your technical reference.

---

# 74. Create a MongoDB query reference

Recommended:

```text
database/mongodb/queries/
```

Keep:

```text
01_reviews_by_route.js
02_highest_rated.js
03_keyword_search.js
04_vehicle_documents_media.js
```

Use your actual MongoDB syntax.

---

# 75. Create MongoDB sample-data scripts

Recommended:

```text
database/mongodb/sample-data/
```

For example:

```text
vehicle_documents.json
reviews.json
announcements.json
trip_media.json
```

or JavaScript insertion scripts.

This lets the team reproduce the database.

---

# 76. Keep media references manageable

The CW needs vehicle images/documents and trip-related multimedia.

Do not turn the GitHub repository into a giant media dump.

Prefer an organized approach using:

```text
metadata
file references
URLs/paths
```

according to your team's chosen storage method.

Keep the implementation easy to reproduce for the demonstration.

---

# 77. Git workflow

Use your own branch:

```text
member4
```

or:

```text
member4/frontend
```

Commit logically.

Good:

```text
feat: add vehicle management UI
feat: add booking flow
feat: add MongoDB review page
feat: add report dashboard
fix: handle unauthorized API response
```

Avoid:

```text
final-final2
new-final
last-final
```

---

# 78. Before merging code

Check:

```text
[ ] npm/build works
[ ] TypeScript has no major errors
[ ] API integration works
[ ] MongoDB feature works
[ ] Existing pages still work
[ ] No secrets committed
[ ] Environment files handled correctly
```

---

# 79. Frontend environment variables

Do not put private backend/database secrets in frontend environment files.

A frontend environment may contain a public API base URL, but anything delivered to the browser is not secret.

For example:

```text
VITE_API_BASE_URL=...
```

is reasonable where appropriate.

MongoDB credentials should never be placed in React.

---

# 80. Final frontend acceptance flow

You should personally be able to perform:

```text
1. Open website
2. Login
3. Reach dashboard
4. Browse vehicles
5. Open a vehicle
6. See Oracle vehicle information
7. See MongoDB images/documents/reviews
8. Browse routes
9. Browse trips
10. Book a ticket
11. Complete simulated payment
12. View booking
13. Submit feedback
14. Read announcements
15. Open reports
16. Filter revenue report
17. Search travel history
18. View maintenance-due report
19. View trip performance
20. Demonstrate MongoDB searches
```

The exact navigation can differ, but the required capabilities must be accessible.

---

# 81. Final MongoDB acceptance flow

You should be able to demonstrate:

```text
Route selected
   ↓
MongoDB reviews returned

Top-rated option
   ↓
MongoDB aggregation/query result

Keyword entered
   ↓
Complaint/review results returned

Vehicle selected
   ↓
Documents/images/media returned
```

And these should be usable through the application layer where required.

---

# 82. Viva questions you must understand

Even though you are frontend/MongoDB owner, learn the entire system.

## Frontend

```text
Why React?
Why TypeScript?
How does React communicate with the backend?
Why use components?
How is routing handled?
How do you handle loading/errors?
```

## MongoDB

```text
Why MongoDB?
Why not store everything in Oracle?
What is schema flexibility?
What collections did you create?
Why these collections?
How are Oracle IDs related to MongoDB?
How do your required queries work?
```

## Integration

```text
How does the browser reach Oracle data?
How does the browser reach MongoDB data?
Why should the browser not connect directly to MongoDB?
How do Oracle and MongoDB complement each other?
```

## Business

```text
How does a booking work?
How does feedback work?
How does a report reach the frontend?
```

---

# 83. Things you must NOT do

## Do not connect React directly to Oracle

Use the backend.

```text
React
  ↓
Spring Boot
  ↓
Oracle
```

## Do not connect React directly to MongoDB

Use the backend.

```text
React
  ↓
Spring Boot
  ↓
MongoDB
```

## Do not store database passwords in React.

## Do not hard-code report results.

## Do not create fake MongoDB screens.

## Do not keep MongoDB completely separate from the application.

---

# 84. Common mistakes that will hurt your work

## Mistake 1

Beautiful UI but missing core operations.

Fix:

```text
Requirements first
Design second
Styling third
```

## Mistake 2

MongoDB added one day before submission.

Fix:

Build MongoDB alongside the frontend.

## Mistake 3

MongoDB exists but is not visible in the application.

Fix:

Create actual review/document/announcement/media pages.

## Mistake 4

Different UI styles on every page.

Fix:

Use reusable components.

## Mistake 5

Frontend contains business logic that should belong to backend/database.

Fix:

Keep the frontend responsible for interaction/presentation.

## Mistake 6

Fake static JSON forever.

Fix:

Replace development mocks with real APIs before release.

---

# 85. Recommended implementation order

Follow this sequence:

```text
1. Receive final ERD
2. Receive API contract
3. Receive MongoDB specification
4. Set up React project
5. Build application shell
6. Build authentication screens
7. Build dashboard
8. Create reusable components
9. Build vehicle UI
10. Build driver UI
11. Build route UI
12. Build passenger UI
13. Build trip UI
14. Build booking flow
15. Build payment flow
16. Build maintenance UI
17. Build feedback UI
18. Build reports UI
19. Create MongoDB collections
20. Create MongoDB sample data
21. Implement required MongoDB queries
22. Implement MongoDB-backed UI
23. Connect APIs
24. Connect authentication
25. Connect reports
26. Connect Oracle/Mongo hybrid pages
27. Test all workflows
28. Fix integration bugs
29. Capture evidence
30. Prepare final demo
31. Freeze release
```

---

# 86. Final project UI checklist

## Core pages

```text
[ ] Login
[ ] Register
[ ] Dashboard
[ ] Vehicles
[ ] Drivers
[ ] Routes
[ ] Passengers
[ ] Trips
[ ] Bookings
[ ] Payments
[ ] Maintenance
[ ] Feedback
```

## Reports

```text
[ ] Frequently used routes
[ ] Revenue
[ ] Passenger travel history
[ ] Maintenance due
[ ] Trip occupancy/performance
```

## MongoDB features

```text
[ ] Reviews
[ ] Announcements
[ ] Vehicle documents
[ ] Vehicle images
[ ] Trip multimedia
```

## MongoDB queries

```text
[ ] Reviews by route
[ ] Highest-rated vehicles/drivers
[ ] Keyword complaint search
[ ] Vehicle documents/media
```

## UX

```text
[ ] Loading states
[ ] Error states
[ ] Empty states
[ ] Form validation
[ ] Responsive layout
[ ] Consistent design
[ ] Role-aware navigation
```

---

# 87. Final integration checklist

```text
[ ] Login -> backend works
[ ] Dashboard -> real data
[ ] Vehicle -> Oracle data
[ ] Vehicle -> MongoDB data
[ ] Driver -> Oracle data
[ ] Route -> Oracle data
[ ] Trip -> Oracle data
[ ] Booking -> backend/PLSQL
[ ] Payment -> backend/Oracle
[ ] Maintenance -> backend/Oracle
[ ] Feedback -> correct data layer(s)
[ ] Reports -> Oracle backend
[ ] Reviews -> MongoDB backend
[ ] Announcements -> MongoDB backend
[ ] Documents -> MongoDB backend
[ ] Media -> MongoDB backend
[ ] Errors displayed correctly
```

---

# 88. Presentation responsibilities

Member 4 should be ready to demonstrate:

```text
Frontend architecture
Application navigation
Dashboard
Booking UI
Report UI
MongoDB-powered features
Oracle + MongoDB hybrid page
```

The strongest live demonstration for your part is:

```text
Open Vehicle
   ↓
Show Oracle structured information
   ↓
Show MongoDB documents/images/reviews
   ↓
Explain why both databases are useful
```

This clearly supports the Integration & Innovation criterion.

---

# 89. Demo-day preparation

Before the presentation:

```text
[ ] Backend running
[ ] Oracle available
[ ] MongoDB available
[ ] Frontend available
[ ] Test account available
[ ] Sample data loaded
[ ] Browser open
[ ] Correct environment variables
[ ] Network/API connection checked
[ ] Required pages tested
[ ] MongoDB queries ready
```

Have a fallback plan for a temporary service failure, such as screenshots or query demonstrations, while making the live application the primary demo.

---

# 90. Final handover package

Give the whole team:

```text
frontend source code
MongoDB collections/scripts
MongoDB queries
sample MongoDB data
API integration notes
frontend screenshots
MongoDB evidence
testing evidence
UI demo steps
```

Recommended folders:

```text
database/
└── mongodb/
    ├── collections/
    ├── sample-data/
    └── queries/

docs/
├── frontend/
└── screenshots/
```

---

# 91. What "finished" means for Member 4

You are finished only when:

```text
The frontend is functional
+
All required system operations are reachable
+
MongoDB is genuinely implemented
+
All four required MongoDB scenarios work
+
MongoDB is used through the application layer
+
Reports are visible in the application
+
Oracle-backed and MongoDB-backed content can be combined
+
Authentication works
+
Errors are handled
+
The UI is user-friendly
+
The end-to-end demo works
+
Evidence is captured
```

Not simply:

```text
"The website looks nice."
```

---

# 92. Member 4 master checklist

```text
PROJECT SETUP
[ ] Received ERD
[ ] Received API contract
[ ] Received MongoDB specification
[ ] Received testing plan
[ ] Set up React
[ ] Set up routing
[ ] Set up component system

FRONTEND
[ ] Login
[ ] Register
[ ] Dashboard
[ ] Vehicles
[ ] Drivers
[ ] Routes
[ ] Passengers
[ ] Trips
[ ] Bookings
[ ] Payments
[ ] Maintenance
[ ] Feedback
[ ] Reports

REPORTS
[ ] Frequently used routes
[ ] Revenue by period
[ ] Passenger travel history
[ ] Vehicles due maintenance
[ ] Trip occupancy/performance

MONGODB
[ ] vehicle_documents
[ ] reviews
[ ] announcements
[ ] trip_media
[ ] realistic sample data
[ ] schema-flexible structures

MONGODB QUERIES
[ ] Reviews by route
[ ] Highest-rated vehicles/drivers
[ ] Keyword complaint search
[ ] Vehicle documents/media

API INTEGRATION
[ ] Auth
[ ] Vehicles
[ ] Drivers
[ ] Routes
[ ] Passengers
[ ] Trips
[ ] Bookings
[ ] Payments
[ ] Maintenance
[ ] Feedback
[ ] Reports
[ ] Reviews
[ ] Announcements
[ ] Documents
[ ] Media

UX
[ ] Loading states
[ ] Error states
[ ] Empty states
[ ] Form validation
[ ] Responsive layout
[ ] Consistent components
[ ] Role-aware navigation

TESTING
[ ] Login tests
[ ] CRUD tests
[ ] Booking flow
[ ] Payment flow
[ ] Maintenance
[ ] Feedback
[ ] Reports
[ ] MongoDB queries
[ ] Oracle + MongoDB hybrid flow
[ ] End-to-end test

EVIDENCE
[ ] Dashboard screenshot
[ ] Core operation screenshots
[ ] Reports screenshots
[ ] MongoDB screenshots
[ ] Required query screenshots
[ ] Hybrid integration screenshot
[ ] Test evidence

HANDOVER
[ ] Source code pushed
[ ] MongoDB scripts pushed
[ ] Query scripts pushed
[ ] API integration notes
[ ] Screenshots supplied
[ ] Demo steps supplied
[ ] Viva preparation complete
```

---

# 93. Final responsibility summary

Your overall responsibility is:

```text
                         MEMBER 4
                            |
             +--------------+--------------+
             |                             |
             v                             v
        FRONTEND                       MONGODB
             |                             |
      React application             Collections
             |                       Sample data
      User workflows               Required queries
             |                             |
             +--------------+--------------+
                            |
                            v
                     Spring Boot
                            |
              +-------------+-------------+
              |                           |
              v                           v
           Oracle                      MongoDB
```

You are the person who makes the project **visible, usable and interactive**, while also making MongoDB a real part of the application rather than a separate database sitting on a computer.

---

# 94. The core objective for Member 4

> **Build a complete, user-friendly SmartMove web application and a genuine MongoDB feature layer that consumes Member 3's backend, exposes every required system operation, demonstrates all four required MongoDB query scenarios, and visibly combines Oracle and MongoDB information in meaningful user workflows.**

---

# 95. Academic-integrity note

The assessment sheet explicitly states that **AI-generated contents will obtain 0 marks**.

Use this document as a planning and learning guide. The team should implement, test, understand and explain the final submitted work themselves and follow the lecturer's academic-integrity requirements.

