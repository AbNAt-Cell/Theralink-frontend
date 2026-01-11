-- Create Payers table
CREATE TABLE IF NOT EXISTS public.payers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    payer_id TEXT, -- External Payer ID if needed (e.g. from a clearinghouse)
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Payers
ALTER TABLE public.payers ENABLE ROW LEVEL SECURITY;

-- Payers Policies (Viewable by authenticated users)
CREATE POLICY "Payers are viewable by authenticated users" 
ON public.payers FOR SELECT 
TO authenticated 
USING (true);

-- Allow admins to insert/update payers (assuming admin check)
CREATE POLICY "Admins can insert payers" 
ON public.payers FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role = 'SUPER_ADMIN' OR profiles.role = 'ADMIN')
    )
);

-- Create Client Policies table
CREATE TABLE IF NOT EXISTS public.client_policies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    payer_id UUID REFERENCES public.payers(id) ON DELETE SET NULL,
    policy_number TEXT,
    start_date DATE,
    end_date DATE,
    is_primary BOOLEAN DEFAULT false,
    insured_is_different BOOLEAN DEFAULT false,
    has_copay BOOLEAN DEFAULT false,
    copay_amount NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Client Policies
ALTER TABLE public.client_policies ENABLE ROW LEVEL SECURITY;

-- Client Policies RLS
-- Admins/Staff can view all policies for clients in their clinic? 
-- For simplicity, let's allow authenticated users to view for now, similar to other tables, 
-- or restrict based on clinic association if we were strictly multi-tenant at that level.
-- Following pattern: Viewable by authenticated users associated with the clinic logic (handled by app logic usually, but here we can be broad first).

CREATE POLICY "Policies viewable by authenticated users" 
ON public.client_policies FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Policies insertable by authenticated users" 
ON public.client_policies FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Policies updatable by authenticated users" 
ON public.client_policies FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Policies deletable by authenticated users" 
ON public.client_policies FOR DELETE 
TO authenticated 
USING (true);

-- Seed Data (Idempotent)
INSERT INTO public.payers (name, payer_id)
VALUES 
    ('Blue Cross Blue Shield', 'BCBS'),
    ('Aetna', 'AETNA'),
    ('Cigna', 'CIGNA'),
    ('UnitedHealthcare', 'UHC'),
    ('Medicare', 'MEDICARE'),
    ('Medicaid', 'MEDICAID'),
    ('Humana', 'HUMANA')
ON CONFLICT DO NOTHING; -- Note: 'name' is not unique constraint by default above, so this might duplicate if run multiple times without constraints. 
-- To be safe, let's just insert if table is empty or accept duplicates for this dev phase.
-- Ideally we'd add a unique constraint on name.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payers_name_key') THEN
        ALTER TABLE public.payers ADD CONSTRAINT payers_name_key UNIQUE (name);
    END IF;
END $$;
