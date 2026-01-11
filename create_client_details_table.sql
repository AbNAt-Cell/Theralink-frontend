-- Create client_details table
CREATE TABLE IF NOT EXISTS public.client_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    prefix TEXT,
    middle_name TEXT,
    suffix TEXT,
    nickname TEXT,
    gender TEXT,
    date_of_birth DATE,
    ssn TEXT,
    race TEXT,
    start_date DATE,
    phone TEXT,
    
    -- Address Fields
    address_street TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip_code TEXT,
    
    -- Insurance Fields (simplified for 1 primary insurance for now)
    insurance_type TEXT,
    insurance_policy_number TEXT,
    insurance_start_date DATE,
    insurance_end_date DATE,
    
    comments TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    UNIQUE(profile_id)
);

-- Enable RLS
ALTER TABLE public.client_details ENABLE ROW LEVEL SECURITY;

-- Policies

-- Admins can view all client details in their clinic
CREATE POLICY "Admins can view client details" ON public.client_details
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = client_details.profile_id
            AND p.clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
        )
    );

-- Admins can insert client details (for their clinic's clients)
CREATE POLICY "Admins can insert client details" ON public.client_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = client_details.profile_id
            AND p.clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
        )
    );

-- Admins can update client details
CREATE POLICY "Admins can update client details" ON public.client_details
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = client_details.profile_id
            AND p.clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
        )
    );

-- Admins can delete client details
CREATE POLICY "Admins can delete client details" ON public.client_details
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = client_details.profile_id
            AND p.clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
        )
    );

-- Clients can view their own details
CREATE POLICY "Clients can view their own details" ON public.client_details
    FOR SELECT USING (auth.uid() = profile_id);
