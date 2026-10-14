import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 810, "SmartMove Transit Solutions — Master Live Viva & Practical Examination Manual")
            self.drawRightString(559, 810, "Data Management 2 (CW No. 1) | NIBM")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(36, 804, 559, 804)
        
        # Footer
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, 32, 559, 32)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(559, 22, page_text)
        self.setFont("Helvetica", 7.5)
        self.drawString(36, 22, "CONFIDENTIAL — NIBM School of Computing | Live Demonstration & Evaluation Drill")
        self.restoreState()

def build_pdf(filename="docs/viva/SmartMove_Live_Viva_Demonstration_Training_Guide.pdf"):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=44,
        bottomMargin=42
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=17,
        leading=21,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=3
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )

    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#1D4ED8"),
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.8,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=2.5
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=body_style,
        leftIndent=10,
        bulletIndent=3,
        spaceAfter=2
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=6.8,
        leading=9.2,
        textColor=colors.HexColor("#0F172A")
    )

    speaking_style = ParagraphStyle(
        'SpeakingText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7.5,
        leading=10.2,
        textColor=colors.HexColor("#1E3A8A")
    )

    story = []

    # Title & Metadata Banner
    banner_data = [
        [
            Paragraph("<b>National Institute of Business Management (NIBM)</b><br/>School of Computing and Engineering — HDSE / HNDIS", subtitle_style),
            Paragraph("<b>Assessment:</b> CW No. 1<br/><b>Module:</b> Data Management 2", subtitle_style)
        ]
    ]
    t_banner = Table(banner_data, colWidths=[330, 193])
    t_banner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_banner)
    story.append(Spacer(1, 5))

    story.append(Paragraph("SmartMove Live Viva Practical Demonstration & Training Manual", title_style))
    story.append(Paragraph("Step-by-Step Viva Execution Guide, Database Demonstrations, Speaking Scripts & Rubric Defense", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#2563EB"), spaceAfter=6))

    # Team Roster Table
    roster_data = [
        ["Member & ID", "Student Name", "Assigned Viva Scope & Software Tools", "Key Responsibilities"],
        ["Member 1 (037)", "J.H.N. Fernando", "Oracle 21c XE / SQL Developer / cmd", "Master Relational Schema, 3NF DDL, Constraints, Sequences, Roles, Data Pump (expdp/impdp)"],
        ["Member 2 (036)", "Arshath MLM", "Oracle XE / PL/SQL / mongosh", "CALCULATE_FARE Function, Materialized Views, Reports 1-3, MongoDB Queries 1 & 2"],
        ["Member 3 (028)", "D.D. Kandeepan", "Oracle XE / PL/SQL Engine", "TRG_MANAGE_SEATS Trigger, Concurrency Locking (SELECT FOR UPDATE), Reports 4 & 5"],
        ["Member 4 (004)", "K.G.L. Sandanimne", "MongoDB Compass / mongosh / React UI", "MongoDB Collections, JSON Validators, Query 3 (Text Search), Query 4 (Media), Full Web App Integration"]
    ]
    t_roster = Table(roster_data, colWidths=[75, 95, 155, 198])
    t_roster.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 3.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_roster)
    story.append(Spacer(1, 6))

    # Section 1: Rubric Overview
    story.append(Paragraph("1. Assessment Structure & Rubric Breakdown (from DM2 CW -1 (1).pdf)", h1_style))
    story.append(Paragraph(
        "According to the official coursework document, the evaluation consists of <b>Software Application Implementation (80%)</b> "
        "and <b>Presentation & Live Viva (20%)</b>. Examiners evaluate working software and live database query execution:",
        body_style
    ))

    rubric_data = [
        ["Rubric Criteria", "Weight", "70%+ Top Distinction Band Expectation (What You Must Demonstrate)"],
        ["Front-end Development + ER Diagram", "20%", "Fully functional user-friendly frontend covering all 9 operations; complete normalized 3NF ER diagram."],
        ["Database Implementation (Oracle)", "15%", "All operations implemented with PL/SQL, correct schema, strong RBAC security and backup mechanism."],
        ["MongoDB Incorporation", "15%", "Correct MongoDB incorporation, schema-flexible structure, and the 4 standard query scenarios fully captured."],
        ["Reports & Business Logic (PL/SQL)", "15%", "Comprehensive reports (at least 5), robust PL/SQL logic, and advanced exception handling."],
        ["Completeness of the Project", "5%", "Fully complete, all requirements achieved, no missing operational modules."],
        ["Integration & Innovation", "10%", "Strong integration between Oracle and MongoDB for hybrid analytics and real-time content delivery."],
        ["Presentation & Viva", "20%", "Excellent individual understanding, confident technical communication, demonstrates deep knowledge."]
    ]
    t_rubric = Table(rubric_data, colWidths=[140, 45, 338])
    t_rubric.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 2.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_rubric)
    story.append(Spacer(1, 6))

    def make_code_box(code_text):
        p = Paragraph(code_text.replace('\n', '<br/>').replace(' ', '&nbsp;'), code_style)
        t = Table([[p]], colWidths=[523])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#94A3B8")),
            ('PADDING', (0,0), (-1,-1), 3.5),
        ]))
        return t

    def make_speaking_box(text):
        p = Paragraph(f"<b>Speaking Script:</b> {text}", speaking_style)
        t = Table([[p]], colWidths=[523])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
            ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#3B82F6")),
            ('PADDING', (0,0), (-1,-1), 3.5),
        ]))
        return t

    # Section 2: Pre-Flight
    story.append(Paragraph("2. Pre-Flight Setup Checklist (10 Minutes Prior to Viva)", h1_style))
    story.append(Paragraph("Open terminal in project root and execute the silent start script: <code>./start_full_system.ps1</code>. Ensure 4 windows are open:", body_style))
    story.append(Paragraph("• <b>Window 1 (Oracle SQL Developer / SQL*Plus):</b> Connected to service <code>XEPDB1</code> as user <code>SMARTMOVE</code>.", bullet_style))
    story.append(Paragraph("• <b>Window 2 (MongoDB Shell / Compass):</b> Connected to <code>mongodb://localhost:27017/smartmove</code>.", bullet_style))
    story.append(Paragraph("• <b>Window 3 (Web Browser):</b> Tab 1 on <code>http://localhost:3000</code>; Tab 2 on <code>http://localhost:8761</code> (Eureka Registry).", bullet_style))
    story.append(Paragraph("• <b>Window 4 (VS Code):</b> Open to <code>database_SQL_noSQL_PLSQL/</code> showing clean student scripts.", bullet_style))
    story.append(Spacer(1, 6))

    # Section 3: The 4 Mandated MongoDB Queries
    story.append(Paragraph("3. Deep-Dive: The 4 Mandatory MongoDB Queries (Page 3 of CW Brief)", h1_style))
    story.append(Paragraph("These 4 exact queries are explicitly mandated in the assessment specification. Practice running them in <code>mongosh</code>:", body_style))
    story.append(Spacer(1, 3))

    # Query 1
    story.append(Paragraph("Query 1: Retrieve All Passenger Reviews for a Specific Route", h2_style))
    story.append(Paragraph("<b>Scenario:</b> Operational managers inspect star ratings, comments, and feedback tags for Route 1 (Colombo to Kandy).", body_style))
    q1_code = """db.reviews.find(
    { routeId: 1 },
    { _id: 0, passengerId: 1, rating: 1, type: 1, tags: 1, comment: 1, createdAt: 1 }
).sort({ createdAt: -1 });"""
    story.append(make_code_box(q1_code))
    story.append(Spacer(1, 2))
    story.append(make_speaking_box(
        "\"Query 1 retrieves customer feedback for Route 1 sorted by date. In relational databases, storing tags and optional fields requires multi-table junction schemas. In MongoDB, documents naturally store dynamic arrays like ['On Time', 'Clean']. We created an index on routeId to guarantee O(log N) lookup time.\""
    ))
    story.append(Spacer(1, 5))

    # Query 2
    story.append(Paragraph("Query 2: Identify Highest-Rated Vehicles or Drivers Based on Customer Feedback", h2_style))
    story.append(Paragraph("<b>Scenario:</b> Fleet management computes mean rating and review volume to reward top drivers and buses.", body_style))
    q2_code = """db.reviews.aggregate([
    { $match: { vehicleId: { $ne: null } } },
    { $group: { _id: "$vehicleId", averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
    { $project: { _id: 0, vehicleId: "$_id", averageRating: { $round: ["$averageRating", 2] }, totalReviews: 1 } },
    { $sort: { averageRating: -1, totalReviews: -1 } },
    { $limit: 5 }
]);"""
    story.append(make_code_box(q2_code))
    story.append(Spacer(1, 2))
    story.append(make_speaking_box(
        "\"Query 2 demonstrates a 5-stage aggregation pipeline ($match -> $group -> $project -> $sort -> $limit). It calculates arithmetic mean ($avg) and review volume ($sum), rounds ratings using $round, and limits output to the top 5 vehicles. To rank drivers instead, we simply group by $driverId.\""
    ))
    story.append(Spacer(1, 5))

    # Query 3
    story.append(Paragraph("Query 3: Search Customer Complaints or Feedback Using Specific Keywords", h2_style))
    story.append(Paragraph("<b>Scenario:</b> Customer service managers search thousands of reviews for critical keywords ('delay', 'breakdown') using text indexes.", body_style))
    q3_code = """// Prerequisite: Text index on comment field: db.reviews.createIndex({ comment: "text" });
db.reviews.find(
    { $text: { $search: "delay breakdown" } },
    { score: { $meta: "textScore" }, _id: 0, passengerId: 1, routeId: 1, rating: 1, type: 1, comment: 1 }
).sort({ score: { $meta: "textScore" } });"""
    story.append(make_code_box(q3_code))
    story.append(Spacer(1, 2))
    story.append(make_speaking_box(
        "\"Query 3 utilizes MongoDB's Full-Text Search. Instead of slow regex scans (LIKE %delay%), it uses an inverted text index on comment. It computes a relevance score using {$meta: 'textScore'} and sorts descending by score, allowing support staff to triage urgent breakdowns instantly.\""
    ))
    story.append(Spacer(1, 5))

    # Query 4
    story.append(Paragraph("Query 4: Retrieve Vehicle Documents and Multimedia Information", h2_style))
    story.append(Paragraph("<b>Scenario:</b> Fleet inspectors check vehicle compliance certificates; dispatch officers inspect trip departure photos and dashcam video.", body_style))
    q4_code = """// 4A: Retrieve legal certificates and photos for Vehicle 1 (Embedded Document Pattern)
db.vehicle_documents.find({ vehicleId: 1 }, { _id: 0, vehicleId: 1, registration: 1, documents: 1, images: 1 });

// 4B: Retrieve operational multimedia for Trip 1
db.trip_media.find({ tripId: 1 }, { _id: 0, tripId: 1, routeId: 1, mediaType: 1, caption: 1, url: 1 });"""
    story.append(make_code_box(q4_code))
    story.append(Spacer(1, 2))
    story.append(make_speaking_box(
        "\"Query 4 demonstrates the Embedded Document Pattern. In Oracle, vehicle certificates require 3 tables and complex SQL JOINs. In MongoDB, insurance, revenue licenses, and images are embedded in a single parent envelope, fetched in an atomic single-read operation. Media files are stored in cloud storage (S3/CDN) with metadata in MongoDB.\""
    ))
    story.append(Spacer(1, 6))

    # Section 4: Individual Member Drills
    story.append(Paragraph("4. Individual Member Live Viva Practice Drills", h1_style))
    story.append(Paragraph("Each team member must deliver a confident 20-second opening statement and execute their live tasks:", body_style))
    story.append(Spacer(1, 3))

    # Member 1 Drill
    m1_flow = []
    m1_flow.append(Paragraph("Member 1 (037 — J.H.N. Fernando): Master Schema, Constraints, Security & Backup", h2_style))
    m1_flow.append(Paragraph("<b>Opening Pitch:</b> <i>\"I designed the 4 master foundation tables in 3NF, implemented sequence-based surrogate keys to eliminate lock contention, enforced database-level check constraints, configured smartmove_app_role for least-privilege security, and formulated our Data Pump backup plan.\"</i>", body_style))
    m1_code = """-- Show Master Constraints:
SELECT TABLE_NAME, CONSTRAINT_NAME, CONSTRAINT_TYPE FROM USER_CONSTRAINTS WHERE TABLE_NAME IN ('PASSENGER','DRIVER','ROUTE','VEHICLE');
-- Show Sequences:
SELECT SEQUENCE_NAME, INCREMENT_BY, LAST_NUMBER FROM USER_SEQUENCES;
-- Show Security Role Privileges:
SELECT * FROM ROLE_TAB_PRIVS WHERE ROLE = 'SMARTMOVE_APP_ROLE';
-- Data Pump Export command:
expdp system/oracle@localhost:1521/XEPDB1 schemas=SMARTMOVE directory=DATA_PUMP_DIR dumpfile=smartmove_full.dmp logfile=smartmove_exp.log"""
    m1_flow.append(make_code_box(m1_code))
    story.append(KeepTogether(m1_flow))
    story.append(Spacer(1, 5))

    # Member 2 Drill
    m2_flow = []
    m2_flow.append(Paragraph("Member 2 (036 — Arshath MLM): PL/SQL Function, Materialized Views & Reports 1–3", h2_style))
    m2_flow.append(Paragraph("<b>Opening Pitch:</b> <i>\"I created the CALCULATE_FARE function with exception handling, built MV_MONTHLY_REVENUE Materialized View for instant monthly revenue aggregation, developed procedure REPORT_REVENUE, and built Reports 1 to 3 using window ranking functions.\"</i>", body_style))
    m2_code = """-- 1. Execute CALCULATE_FARE:
SELECT CALCULATE_FARE(1, 2) AS TOTAL_FARE FROM DUAL; -- LKR 3000.00
-- 2. Show Exception Handling:
SELECT CALCULATE_FARE(999, 1) FROM DUAL; -- Raises ORA-20001: Route ID 999 does not exist.
-- 3. Query Materialized View:
SELECT * FROM MV_MONTHLY_REVENUE;
-- 4. Report 1 (Window Ranking):
SELECT r.ROUTE_ID, r.ORIGIN, r.DESTINATION, COUNT(b.BOOKING_ID) AS BOOKINGS,
       RANK() OVER (ORDER BY COUNT(b.BOOKING_ID) DESC) AS ROUTE_RANK
FROM ROUTE r LEFT JOIN TRIP t ON r.ROUTE_ID = t.ROUTE_ID
LEFT JOIN BOOKING b ON t.TRIP_ID = b.TRIP_ID AND b.STATUS != 'CANCELLED'
GROUP BY r.ROUTE_ID, r.ORIGIN, r.DESTINATION ORDER BY ROUTE_RANK;"""
    m2_flow.append(make_code_box(m2_code))
    story.append(KeepTogether(m2_flow))
    story.append(Spacer(1, 5))

    # Member 3 Drill
    m3_flow = []
    m3_flow.append(Paragraph("Member 3 (028 — D.D. Kandeepan): Transactional Engine, Trigger & Concurrency", h2_style))
    m3_flow.append(Paragraph("<b>Opening Pitch:</b> <i>\"I developed the transactional tables—Trip, Booking, Payment, Maintenance, Feedback. I implemented TRG_MANAGE_SEATS trigger to maintain seats automatically, implemented MAKE_BOOKING with SELECT ... FOR UPDATE pessimistic locking, and built Reports 4 and 5.\"</i>", body_style))
    m3_code = """-- THE GOLD TRIGGER DEMO (Run live in SQL Developer):
-- Step 1: Check seats on Trip 1 (Shows 43)
SELECT TRIP_ID, AVAILABLE_SEATS FROM TRIP WHERE TRIP_ID = 1;
-- Step 2: Book 2 seats
INSERT INTO BOOKING (BOOKING_ID, PASSENGER_ID, TRIP_ID, SEATS_BOOKED, TOTAL_FARE, STATUS, PAYMENT_STATUS)
VALUES (SEQ_BOOKING.NEXTVAL, 1, 1, 2, 3000.00, 'CONFIRMED', 'UNPAID'); COMMIT;
-- Step 3: Check seats again (Automatically decreased to 41!)
SELECT TRIP_ID, AVAILABLE_SEATS FROM TRIP WHERE TRIP_ID = 1;
-- Step 4: Cancel booking
UPDATE BOOKING SET STATUS = 'CANCELLED' WHERE BOOKING_ID = (SELECT MAX(BOOKING_ID) FROM BOOKING); COMMIT;
-- Step 5: Check seats again (Automatically restored to 43!)
SELECT TRIP_ID, AVAILABLE_SEATS FROM TRIP WHERE TRIP_ID = 1;"""
    m3_flow.append(make_code_box(m3_code))
    story.append(KeepTogether(m3_flow))
    story.append(Spacer(1, 5))

    # Member 4 Drill
    m4_flow = []
    m4_flow.append(Paragraph("Member 4 (004 — K.G.L. Sandanimne): MongoDB Architecture, Full-Text & Web App", h2_style))
    m4_flow.append(Paragraph("<b>Opening Pitch:</b> <i>\"I architected the MongoDB document database layer with JSON Schema validators, implemented full-text indexing for Query 3 and nested media retrieval for Query 4, and connected the React frontend to our 12 Spring Boot microservices for real-time operations.\"</i>", body_style))
    m4_code = """-- Live Web Application Flow (http://localhost:3000):
1. Login as Passenger (nimal@example.com / password123) -> Search trips -> Book 2 seats.
2. Open Incognito window, login as Driver (saman.k@smartmove.lk) -> Trip appears in real-time -> Click 'Start Journey'.
3. In Passenger tab -> Click 'Pay with Card' -> Status becomes COMPLETED.
4. Login as Admin (admin@smartmove.lk) -> Open /admin/reports -> Click 'Export PDF' to show live business reports!"""
    m4_flow.append(make_code_box(m4_code))
    story.append(KeepTogether(m4_flow))
    story.append(Spacer(1, 6))

    # Section 5: Presentation Slide Allocation
    story.append(Paragraph("5. Slide-by-Slide Presentation Allocation (15 Minutes)", h1_style))
    pres_data = [
        ["Slide Range", "Speaker", "Slide Topics & Content", "Viva Focus"],
        ["Slides 1–4", "Member 1 (037)", "Introduction, Problem Statement, Objectives, Core System Operations", "Business Context"],
        ["Slides 5–7", "Member 1 (037)", "Conceptual EER Diagram, Relational Schema (3NF Normalization), Constraints", "Data Modeling & Integrity"],
        ["Slides 8–10", "Member 2 (036)", "PL/SQL Fare Calculation Engine, Materialized Views, Executive Reports 1–3", "Database Computing"],
        ["Slides 11–13", "Member 3 (028)", "Transactional Architecture, TRG_MANAGE_SEATS Trigger, Concurrency Locking", "ACID & State Machine"],
        ["Slides 14–16", "Member 4 (004)", "MongoDB Polyglot Persistence, Collections, Full-Text Search, Media Retrieval", "NoSQL Document Modeling"],
        ["Slides 17–19", "Member 4 (004) / All", "Full-Stack System Architecture, Live Web Demonstration, Conclusion & Q&A", "System Integration"]
    ]
    t_pres = Table(pres_data, colWidths=[65, 80, 245, 133])
    t_pres.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 2.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_pres)
    story.append(Spacer(1, 6))

    # Section 6: Top 10 Viva Questions
    story.append(Paragraph("6. Top 10 Viva Curveball Questions & Model Answers", h1_style))
    
    qa_data = [
        ["#", "Examiner Question", "High-Scoring Model Answer"],
        ["1", "Why use both Oracle and MongoDB?", "Polyglot Persistence: Oracle guarantees ACID consistency for financial transactions and seat availability. MongoDB provides schema flexibility for nested documents (compliance certificates, photos) and high-speed full-text indexing for reviews."],
        ["2", "Why calculate fares in PL/SQL rather than frontend?", "Calculating fares inside the database ensures business rule integrity. Client-side code can be inspected or bypassed by API scripts, risking pricing tampering."],
        ["3", "How do you prevent overbooking when two users book simultaneously?", "In MAKE_BOOKING, we issue SELECT ... FOR UPDATE on the TRIP row. This acquires an exclusive row-level lock. The second transaction waits until the first commits, sees 0 seats left, and raises error -20002."],
        ["4", "What is the difference between View and Materialized View?", "A regular view is a saved virtual query executed every time it is queried. A Materialized View computes the aggregate beforehand and stores results physically on disk (BUILD IMMEDIATE), offering instant performance."],
        ["5", "What is the difference between Statement and Row triggers?", "Statement triggers fire once per SQL statement. Row-level triggers (FOR EACH ROW) fire once for every affected row, providing access to :NEW and :OLD column values."],
        ["6", "What is the purpose of NOCACHE on sequences?", "By default, Oracle caches 20 sequence numbers in SGA memory. If the server restarts unexpectedly, cached numbers are lost, leaving gaps. NOCACHE guarantees consecutive surrogate keys."],
        ["7", "Can you rollback a CREATE TABLE or TRUNCATE?", "No. In Oracle, DDL statements issue an implicit COMMIT before and after execution. Only DML statements (INSERT, UPDATE, DELETE) can be rolled back."],
        ["8", "How does MongoDB validate data without foreign keys?", "We enforce collection contracts via $jsonSchema validators (data types, mandatory fields, enum constraints). Cross-database foreign keys (vehicleId) are validated in our Spring Boot service layer."],
        ["9", "What is the difference between %TYPE and %ROWTYPE?", "%TYPE anchors a variable to a single column's data type. %ROWTYPE declares a composite record variable holding an entire table row."],
        ["10", "What is the difference between WHERE and HAVING in Report 4?", "WHERE filters rows before aggregation. HAVING filters the aggregate results after GROUP BY. In Report 4, we must calculate MAX(m.MAINTENANCE_DATE) first, then filter by ADD_MONTHS(...) <= SYSDATE."]
    ]
    t_qa = Table(qa_data, colWidths=[18, 155, 350])
    t_qa.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 2.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_qa)
    story.append(Spacer(1, 6))

    # Section 7: Emergency Playbook
    story.append(Paragraph("7. Emergency Troubleshooting Playbook", h1_style))
    story.append(Paragraph("• <b>If Oracle service is stopped:</b> Open Admin PowerShell and run: <code>Start-Service OracleServiceXE; Start-Service OracleOraDB21Home1TNSListener</code>", bullet_style))
    story.append(Paragraph("• <b>If MongoDB service is stopped:</b> Open Admin PowerShell and run: <code>Start-Service MongoDB</code>", bullet_style))
    story.append(Paragraph("• <b>If ports (8080/3000) are blocked:</b> Run: <code>./stop_all.ps1</code> to cleanly kill stale processes and release all ports.", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully built: {filename}")

if __name__ == "__main__":
    build_pdf()
