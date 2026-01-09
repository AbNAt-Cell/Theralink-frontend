-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.profiles(id),
    staff_id UUID NOT NULL REFERENCES public.profiles(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Staff details table
CREATE TABLE IF NOT EXISTS public.staff_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    phone TEXT,
    gender TEXT,
    race TEXT,
    position TEXT,
    position_effective_date DATE,
    date_of_birth DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.profiles(id),
    staff_id UUID NOT NULL REFERENCES public.profiles(id),
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    date_of_service DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Billing records table (simplified for dashboard)
CREATE TABLE IF NOT EXISTS public.billing_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    total_amount_collected DECIMAL(12,2) DEFAULT 0.00,
    submissions_count INTEGER DEFAULT 0,
    claims_count INTEGER DEFAULT 0,
    documents_billed_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Compliance table
CREATE TABLE IF NOT EXISTS public.compliance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING'
);

-- Training table
CREATE TABLE IF NOT EXISTS public.training_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'SCHEDULED'
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_records ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for multi-tenancy)
-- We use DROP POLICY IF EXISTS before creating to avoid "already exists" errors.

DROP POLICY IF EXISTS "Clinic access for appointments" ON public.appointments;
CREATE POLICY "Clinic access for appointments" ON public.appointments
    FOR ALL USING (clinic_id IN (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Clinic access for staff details" ON public.staff_details;
CREATE POLICY "Clinic access for staff details" ON public.staff_details
    FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE clinic_id IN (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())));

DROP POLICY IF EXISTS "Clinic access for documents" ON public.documents;
CREATE POLICY "Clinic access for documents" ON public.documents
    FOR ALL USING (clinic_id IN (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Clinic access for billing" ON public.billing_records;
CREATE POLICY "Clinic access for billing" ON public.billing_records
    FOR ALL USING (clinic_id IN (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Clinic access for compliance" ON public.compliance_records;
CREATE POLICY "Clinic access for compliance" ON public.compliance_records
    FOR ALL USING (clinic_id IN (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Clinic access for training" ON public.training_records;
CREATE POLICY "Clinic access for training" ON public.training_records
    FOR ALL USING (clinic_id IN (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()));

