
-- Member 2 — Oracle PL/SQL, Reports 1–3 and MongoDB Queries 1–2

-- 1. PL/SQL Function with Exception Handling

CREATE OR REPLACE FUNCTION CALCULATE_FARE(p_route_id IN NUMBER, p_seats IN NUMBER) RETURN NUMBER IS
    v_base_fare NUMBER;
BEGIN
    SELECT BASE_FARE INTO v_base_fare FROM ROUTE WHERE ROUTE_ID = p_route_id;
    RETURN v_base_fare * p_seats;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20001, 'Invalid Route ID provided for fare calculation.');
END CALCULATE_FARE;
/

-- 2. Report 1: Most Frequently Used Routes

SELECT r.ROUTE_ID, r.ORIGIN, r.DESTINATION, COUNT(b.BOOKING_ID) as TOTAL_BOOKINGS,
       RANK() OVER (ORDER BY COUNT(b.BOOKING_ID) DESC) as RANKING
FROM ROUTE r
         LEFT JOIN TRIP t ON r.ROUTE_ID = t.ROUTE_ID
         LEFT JOIN BOOKING b ON t.TRIP_ID = b.TRIP_ID AND b.STATUS != 'CANCELLED'
GROUP BY r.ROUTE_ID, r.ORIGIN, r.DESTINATION
ORDER BY RANKING;

-- 3. Report 2: Revenue within a Period

CREATE MATERIALIZED VIEW MV_MONTHLY_REVENUE
            BUILD IMMEDIATE
    REFRESH COMPLETE ON DEMAND
AS
SELECT TO_CHAR(PAYMENT_DATE, 'YYYY-MM') AS REVENUE_MONTH,
       SUM(AMOUNT) AS TOTAL_REVENUE,
       COUNT(PAYMENT_ID) AS TICKETS_SOLD
FROM PAYMENT
WHERE STATUS = 'SUCCESS'
GROUP BY TO_CHAR(PAYMENT_DATE, 'YYYY-MM');

-- To manually refresh the materialized view before the dashboard loads:
-- EXEC DBMS_MVIEW.REFRESH('MV_MONTHLY_REVENUE');

-- Alternatively, as a PL/SQL procedure using a Cursor:

CREATE OR REPLACE PROCEDURE REPORT_REVENUE(p_start_date IN DATE, p_end_date IN DATE) IS
    CURSOR rev_cursor IS
        SELECT SUM(AMOUNT) as TOTAL_REVENUE, COUNT(PAYMENT_ID) as TICKETS_SOLD, AVG(AMOUNT) as AVG_TICKET
        FROM PAYMENT
        WHERE STATUS = 'SUCCESS'
          AND PAYMENT_DATE BETWEEN p_start_date AND p_end_date;
    v_rev rev_cursor%ROWTYPE;
BEGIN
    OPEN rev_cursor;
    FETCH rev_cursor INTO v_rev;
    DBMS_OUTPUT.PUT_LINE('Total Revenue (LKR): ' || NVL(v_rev.TOTAL_REVENUE, 0));
    DBMS_OUTPUT.PUT_LINE('Tickets Sold: ' || NVL(v_rev.TICKETS_SOLD, 0));
    DBMS_OUTPUT.PUT_LINE('Avg Ticket Value: ' || NVL(v_rev.AVG_TICKET, 0));
    CLOSE rev_cursor;
END REPORT_REVENUE;
/

-- 4. Report 3: Passenger Travel History

SELECT p.FIRST_NAME || ' ' || p.LAST_NAME AS PASSENGER_NAME,
       r.ORIGIN || ' to ' || r.DESTINATION AS ROUTE_DETAILS,
       t.DEPARTURE_TIME,
       v.REGISTRATION_NUMBER,
       b.STATUS as BOOKING_STATUS,
       pay.STATUS as PAYMENT_STATUS
FROM PASSENGER p
         JOIN BOOKING b ON p.PASSENGER_ID = b.PASSENGER_ID
         JOIN TRIP t ON b.TRIP_ID = t.TRIP_ID
         JOIN ROUTE r ON t.ROUTE_ID = r.ROUTE_ID
         JOIN VEHICLE v ON t.VEHICLE_ID = v.VEHICLE_ID
         LEFT JOIN PAYMENT pay ON b.BOOKING_ID = pay.BOOKING_ID
WHERE p.PASSENGER_ID = 1 -- Replace with target passenger ID
ORDER BY t.DEPARTURE_TIME DESC;



