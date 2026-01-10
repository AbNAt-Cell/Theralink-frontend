-- Create staff_files table
CREATE TABLE public.staff_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.staff_files ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view all files" ON public.staff_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can insert files" ON public.staff_files
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can update files" ON public.staff_files
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can delete files" ON public.staff_files
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Staff can view their own files" ON public.staff_files
    FOR SELECT USING (auth.uid() = staff_id);


-- Create Storage Bucket for Files
INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access Files" ON storage.objects FOR SELECT USING ( bucket_id = 'files' );
CREATE POLICY "Authenticated Upload Files" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'files' AND auth.role() = 'authenticated' );
CREATE POLICY "Authenticated Delete Files" ON storage.objects FOR DELETE USING ( bucket_id = 'files' AND auth.role() = 'authenticated' );
