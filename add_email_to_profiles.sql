-- Add email column to profiles table if it doesn't exist
-- This allows storing email for staff members created manually
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update RLS to ensure we can see/manage the email column
-- The existing policies should already cover this since they use SELECT *
