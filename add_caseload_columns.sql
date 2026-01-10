-- Add caseload management columns to staff_details
ALTER TABLE public.staff_details 
ADD COLUMN IF NOT EXISTS max_capacity INT DEFAULT NULL, -- NULL means unlimited
ADD COLUMN IF NOT EXISTS accepting_new_clients BOOLEAN DEFAULT TRUE;

-- Add assignment column to profiles (for clients assigned to staff)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS assigned_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Policy to allow admins to see/update assigned_staff_id
-- (Existing policies likely cover UPDATE if they are admin, but let's be sure)
