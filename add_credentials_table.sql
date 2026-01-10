-- Create staff_credentials table
CREATE TABLE public.staff_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    effective_date DATE,
    expiration_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.staff_credentials ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view all credentials" ON public.staff_credentials
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can insert credentials" ON public.staff_credentials
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can update credentials" ON public.staff_credentials
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can delete credentials" ON public.staff_credentials
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Users can view their own credentials" ON public.staff_credentials
    FOR SELECT USING (auth.uid() = staff_id);
