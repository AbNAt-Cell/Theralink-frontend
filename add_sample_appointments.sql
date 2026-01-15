-- ============================================
-- ADD SAMPLE APPOINTMENTS TO SUPABASE
-- Run this in Supabase SQL Editor
-- ============================================

-- First, get your clinic_id and some user IDs
-- You'll need to replace the placeholder values below with real IDs from your database

-- Step 1: Find your clinic_id
-- Run this query first: SELECT id, name FROM clinics LIMIT 5;

-- Step 2: Find some profile IDs (clients and staff)
-- Run this: SELECT id, first_name, last_name, role FROM profiles WHERE clinic_id = 'YOUR_CLINIC_ID' LIMIT 10;

-- Step 3: Once you have the IDs, insert appointments:
-- Replace 'CLINIC_ID', 'CLIENT_ID', and 'STAFF_ID' with actual UUIDs from your database

-- Example with placeholder IDs (UPDATE THESE!)
/*
INSERT INTO appointments (clinic_id, client_id, staff_id, appointment_date, appointment_time, appointment_type, status)
VALUES 
  -- Today's appointments
  ('YOUR_CLINIC_ID', 'CLIENT_ID_1', 'STAFF_ID_1', CURRENT_DATE, '09:00', 'Initial Evaluation', 'SCHEDULED'),
  ('YOUR_CLINIC_ID', 'CLIENT_ID_2', 'STAFF_ID_1', CURRENT_DATE, '10:30', 'Follow-up Session', 'SCHEDULED'),
  ('YOUR_CLINIC_ID', 'CLIENT_ID_1', 'STAFF_ID_2', CURRENT_DATE, '14:00', 'Therapy Session', 'SCHEDULED'),
  
  -- Tomorrow's appointments
  ('YOUR_CLINIC_ID', 'CLIENT_ID_2', 'STAFF_ID_1', CURRENT_DATE + 1, '09:00', 'Therapy Session', 'SCHEDULED'),
  ('YOUR_CLINIC_ID', 'CLIENT_ID_1', 'STAFF_ID_2', CURRENT_DATE + 1, '11:00', 'Assessment', 'SCHEDULED'),
  
  -- Next week appointments
  ('YOUR_CLINIC_ID', 'CLIENT_ID_1', 'STAFF_ID_1', CURRENT_DATE + 7, '10:00', 'Progress Review', 'SCHEDULED'),
  ('YOUR_CLINIC_ID', 'CLIENT_ID_2', 'STAFF_ID_2', CURRENT_DATE + 7, '14:00', 'Family Session', 'SCHEDULED');
*/

-- ============================================
-- QUICK HELPER: Auto-generate appointments using existing profiles
-- This script finds real IDs and creates appointments automatically
-- ============================================

DO $$
DECLARE
    v_clinic_id UUID;
    v_client_id UUID;
    v_staff_id UUID;
BEGIN
    -- Get first available clinic
    SELECT id INTO v_clinic_id FROM clinics LIMIT 1;
    
    IF v_clinic_id IS NULL THEN
        RAISE EXCEPTION 'No clinic found. Create a clinic first.';
    END IF;
    
    -- Get a client
    SELECT id INTO v_client_id 
    FROM profiles 
    WHERE clinic_id = v_clinic_id AND role = 'CLIENT' 
    LIMIT 1;
    
    -- Get a staff member
    SELECT id INTO v_staff_id 
    FROM profiles 
    WHERE clinic_id = v_clinic_id AND role IN ('ADMIN', 'STAFF') 
    LIMIT 1;
    
    IF v_client_id IS NULL OR v_staff_id IS NULL THEN
        RAISE EXCEPTION 'Need at least one CLIENT and one ADMIN/STAFF profile in your clinic';
    END IF;
    
    -- Insert sample appointments
    INSERT INTO appointments (clinic_id, client_id, staff_id, appointment_date, appointment_time, appointment_type, status, location)
    VALUES 
        (v_clinic_id, v_client_id, v_staff_id, CURRENT_DATE, '09:00', 'Initial Evaluation', 'SCHEDULED', 'Office A'),
        (v_clinic_id, v_client_id, v_staff_id, CURRENT_DATE, '14:00', 'Therapy Session', 'SCHEDULED', 'Office B'),
        (v_clinic_id, v_client_id, v_staff_id, CURRENT_DATE + 1, '10:30', 'Follow-up', 'SCHEDULED', 'Telehealth'),
        (v_clinic_id, v_client_id, v_staff_id, CURRENT_DATE + 3, '11:00', 'Assessment', 'SCHEDULED', 'Office A'),
        (v_clinic_id, v_client_id, v_staff_id, CURRENT_DATE + 7, '15:00', 'Progress Review', 'SCHEDULED', 'Conference Room');
    
    RAISE NOTICE 'Created 5 sample appointments for clinic: %', v_clinic_id;
END $$;

-- Verify the appointments were created
SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.appointment_type,
    a.status,
    c.first_name || ' ' || c.last_name as client_name,
    s.first_name || ' ' || s.last_name as staff_name
FROM appointments a
LEFT JOIN profiles c ON a.client_id = c.id
LEFT JOIN profiles s ON a.staff_id = s.id
ORDER BY a.appointment_date, a.appointment_time;
