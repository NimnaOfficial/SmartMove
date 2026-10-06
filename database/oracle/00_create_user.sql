-- ============================================================
-- SmartMove Transport Solutions — Oracle Database Setup
-- Run these scripts IN ORDER in SQL Developer
-- Connect to: XEPDB1 as SYSDBA
-- ============================================================

-- ============================================================
-- STEP 1: Create the SMARTMOVE user/schema
-- ============================================================
-- Run as SYSDBA:

ALTER SESSION SET CONTAINER = XEPDB1;

-- Drop user if exists (for clean setup)
BEGIN
    EXECUTE IMMEDIATE 'DROP USER smartmove CASCADE';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -1918 THEN RAISE; END IF;
END;
/

-- Create user
CREATE USER smartmove IDENTIFIED BY smartmove123
    DEFAULT TABLESPACE USERS
    TEMPORARY TABLESPACE TEMP
    QUOTA UNLIMITED ON USERS;

-- Grant privileges
GRANT CONNECT, RESOURCE, CREATE SESSION TO smartmove;
GRANT CREATE TABLE TO smartmove;
GRANT CREATE SEQUENCE TO smartmove;
GRANT CREATE VIEW TO smartmove;
GRANT CREATE PROCEDURE TO smartmove;
GRANT CREATE TRIGGER TO smartmove;
GRANT CREATE TYPE TO smartmove;
GRANT CREATE SYNONYM TO smartmove;
GRANT EXECUTE ON DBMS_OUTPUT TO smartmove;

COMMIT;

-- ============================================================
-- Verify connection
-- ============================================================
-- Now connect as: smartmove/smartmove123@localhost:1521/XEPDB1
-- You should be able to run:
-- SELECT USER FROM DUAL;
-- Result: SMARTMOVE
