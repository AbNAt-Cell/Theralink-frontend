-- Add new fields for client dashboard
ALTER TABLE public.client_details
ADD COLUMN IF NOT EXISTS smoking_status TEXT,
ADD COLUMN IF NOT EXISTS ethnicity TEXT,
ADD COLUMN IF NOT EXISTS client_pin TEXT,
ADD COLUMN IF NOT EXISTS parent_pin TEXT;
