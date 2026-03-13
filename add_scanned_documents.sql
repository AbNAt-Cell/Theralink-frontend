-- SQL script to add scanned document support
-- Run this in your Supabase SQL Editor

-- 1. Add columns to documents table for scanned files
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS is_scanned BOOLEAN DEFAULT FALSE;

-- 2. Create storage bucket for documents (if it doesn't exist)
-- Note: This needs to be done via Supabase Dashboard or API
-- Go to Storage > Create bucket > Name: "documents"
-- Enable public access if you want files to be publicly accessible
-- Or keep it private and use signed URLs

-- 3. Storage policies for the documents bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads to clinic folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view clinic documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete clinic documents" ON storage.objects;

-- Insert policy: Allow authenticated users to upload to their clinic's folder
CREATE POLICY "Allow authenticated uploads to clinic folder" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] IN (SELECT clinic_id::text FROM public.profiles WHERE id = auth.uid())
);

-- Select policy: Allow authenticated users to view their clinic's documents
CREATE POLICY "Allow authenticated users to view clinic documents" ON storage.objects
FOR SELECT TO authenticated USING (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] IN (SELECT clinic_id::text FROM public.profiles WHERE id = auth.uid())
);

-- Delete policy: Allow authenticated users to delete their clinic's documents
CREATE POLICY "Allow authenticated users to delete clinic documents" ON storage.objects
FOR DELETE TO authenticated USING (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] IN (SELECT clinic_id::text FROM public.profiles WHERE id = auth.uid())
);

-- 4. Create index for faster queries on scanned documents
CREATE INDEX IF NOT EXISTS idx_documents_is_scanned ON documents(is_scanned);
CREATE INDEX IF NOT EXISTS idx_documents_file_url ON documents(file_url) WHERE file_url IS NOT NULL;
