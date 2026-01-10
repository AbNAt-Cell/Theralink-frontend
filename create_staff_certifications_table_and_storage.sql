-- Create staff_certifications table
CREATE TABLE public.staff_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    issue_date DATE,
    expiration_date DATE,
    never_expires BOOLEAN DEFAULT FALSE,
    completed BOOLEAN DEFAULT FALSE, -- Assuming "Completed" checkbox means completion status
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.staff_certifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view all certifications" ON public.staff_certifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can insert certifications" ON public.staff_certifications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can update certifications" ON public.staff_certifications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can delete certifications" ON public.staff_certifications
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Staff can view their own certifications" ON public.staff_certifications
    FOR SELECT USING (auth.uid() = staff_id);


-- Create Storage Bucket for Certifications
INSERT INTO storage.buckets (id, name, public) VALUES ('certifications', 'certifications', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Allow public read, authenticated upload/delete for now, refined by RLS later if needed)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'certifications' );
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'certifications' AND auth.role() = 'authenticated' );
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'certifications' AND auth.role() = 'authenticated' );
