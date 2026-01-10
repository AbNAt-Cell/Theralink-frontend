-- Add signature_url column to profiles table
ALTER TABLE public.profiles ADD COLUMN signature_url TEXT;

-- Create storage bucket for signatures if it doesn't exist
-- Note: managing storage buckets is usually done via Supabase Dashboard or Client API, but we can set up policies here.

-- Allow public access to signatures (or restricted, depending on needs. Let's assume authenticated read)
-- Make sure a bucket named 'signatures' exists in your Supabase Storage.
