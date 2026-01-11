-- Fix for upsert to work correctly
-- Add unique constraint on profile_id in client_details table
-- This is required for the onConflict: 'profile_id' option in Supabase upsert

-- First, check if constraint exists and add if not
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'client_details_profile_id_unique'
    ) THEN
        ALTER TABLE public.client_details
        ADD CONSTRAINT client_details_profile_id_unique UNIQUE (profile_id);
    END IF;
END $$;

-- Verify the constraint was added
-- SELECT conname FROM pg_constraint WHERE conrelid = 'public.client_details'::regclass;
