-- ============================================
--  LUMINAE EVENTS — DATABASE SETUP
--  db_setup.sql
--  Run this file in phpMyAdmin or MySQL CLI
-- ============================================

-- STEP 1: Create the database
CREATE DATABASE IF NOT EXISTS luminae_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- STEP 2: Use the database
USE luminae_db;

-- STEP 3: Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    full_name    VARCHAR(100)  NOT NULL,
    email        VARCHAR(150)  NOT NULL,
    phone        VARCHAR(20)   NOT NULL,
    company      VARCHAR(150)  DEFAULT NULL,
    event_type   VARCHAR(50)   NOT NULL,
    event_date   DATE          NOT NULL,
    attendees    VARCHAR(20)   NOT NULL,
    city         VARCHAR(100)  NOT NULL,
    message      TEXT          NOT NULL,
    status       ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at   DATETIME      DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email      (email),
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at),
    INDEX idx_status     (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- STEP 4: Verify the table was created
DESCRIBE registrations;

-- ============================================
-- OPTIONAL: Insert sample data for testing
-- ============================================
INSERT INTO registrations
    (full_name, email, phone, company, event_type, event_date, attendees, city, message)
VALUES
    ('Rahul Sharma',   'rahul@techcorp.in',   '+91 98765 43210', 'Tech Corp Ltd',       'corporate',  '2024-04-15', '50-200',   'Pune',    'Looking for a tech leadership summit with AV setup and catering.'),
    ('Priya Mehta',    'priya@brandco.in',    '+91 87654 32109', 'Brand Co.',           'activation', '2024-05-18', '1000+',    'Mumbai',  'BTL brand activation across 5 malls in Mumbai. Need full team.'),
    ('Arun Kumar',     'arun@expoindia.com',  '+91 76543 21098', 'Expo India Events',   'exhibition', '2024-04-22', '1000+',    'Mumbai',  'Exhibition stall design and setup for India Manufacturing Expo.'),
    ('Sneha Patil',    'sneha@fingroup.in',   '+91 65432 10987', 'Finance Group India', 'conference', '2024-05-03', '200-500',  'Bangalore','Finance conference for CFOs. Need stage, lighting and branding.');

-- ============================================
-- VIEW all registrations (to verify)
-- ============================================
SELECT
    id,
    full_name,
    email,
    event_type,
    event_date,
    attendees,
    city,
    status,
    created_at
FROM registrations
ORDER BY created_at DESC;
