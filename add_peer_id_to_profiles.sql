-- Add peer_id column to profiles table to support calling features
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS peer_id TEXT;

-- Update RLS to ensure peer_id is readable by others in the same clinic (for calling)
-- The existing policies should already cover this.
