-- SQL schema for Clinic Files
-- Run this in your Supabase SQL Editor

-- 1. Create clinic_files table
CREATE TABLE IF NOT EXISTS clinic_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    file_name VARCHAR(255) NOT NULL,
    file_tags TEXT[], -- Array of tags
    file_url TEXT NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clinic_files_clinic_id ON clinic_files(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_files_uploaded_by ON clinic_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_clinic_files_file_name ON clinic_files(file_name);
CREATE INDEX IF NOT EXISTS idx_clinic_files_created_at ON clinic_files(created_at DESC);

-- 3. Enable RLS
ALTER TABLE clinic_files ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist (for re-running)
DROP POLICY IF EXISTS "clinic_files_select" ON clinic_files;
DROP POLICY IF EXISTS "clinic_files_insert" ON clinic_files;
DROP POLICY IF EXISTS "clinic_files_update" ON clinic_files;
DROP POLICY IF EXISTS "clinic_files_delete" ON clinic_files;

-- 5. RLS Policies for clinic_files
CREATE POLICY "clinic_files_select" ON clinic_files
    FOR SELECT USING (
        clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "clinic_files_insert" ON clinic_files
    FOR INSERT WITH CHECK (
        clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "clinic_files_update" ON clinic_files
    FOR UPDATE USING (
        clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "clinic_files_delete" ON clinic_files
    FOR DELETE USING (
        clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
    );
