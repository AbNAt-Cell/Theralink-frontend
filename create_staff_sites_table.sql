-- Create staff_sites junction table
CREATE TABLE public.staff_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(staff_id, clinic_id) -- Prevent duplicate assignments
);

-- Enable RLS
ALTER TABLE public.staff_sites ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view all staff sites" ON public.staff_sites
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can insert staff sites" ON public.staff_sites
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can delete staff sites" ON public.staff_sites
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Staff can view their own sites" ON public.staff_sites
    FOR SELECT USING (auth.uid() = staff_id);
