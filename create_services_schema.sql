-- Services Schema
-- Available services in the clinic that can be assigned to clients

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    code TEXT NOT NULL,                    -- Service code (e.g., H0034, H2011)
    name TEXT NOT NULL,                    -- Service name
    description TEXT,                      -- Full description
    category TEXT,                         -- Category (e.g., BH Rehab, Skills Training)
    is_telehealth BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Client assigned services (junction table)
CREATE TABLE IF NOT EXISTS public.client_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    assigned_by UUID REFERENCES public.profiles(id),
    UNIQUE(client_id, service_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_services_clinic_id ON public.services(clinic_id);
CREATE INDEX IF NOT EXISTS idx_services_code ON public.services(code);
CREATE INDEX IF NOT EXISTS idx_client_services_client_id ON public.client_services(client_id);
CREATE INDEX IF NOT EXISTS idx_client_services_service_id ON public.client_services(service_id);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services
CREATE POLICY "Users can view services in their clinic"
    ON public.services FOR SELECT
    USING (
        clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
        OR clinic_id IS NULL
    );

CREATE POLICY "Authenticated users can manage services"
    ON public.services FOR ALL
    USING (auth.role() = 'authenticated');

-- RLS Policies for client_services
CREATE POLICY "Users can view client services in their clinic"
    ON public.client_services FOR SELECT
    USING (
        client_id IN (
            SELECT id FROM public.profiles 
            WHERE clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "Authenticated users can manage client services"
    ON public.client_services FOR ALL
    USING (auth.role() = 'authenticated');

-- Seed some sample services
INSERT INTO public.services (code, name, description, category, is_telehealth) VALUES
    ('H0034', 'Med Management', 'Medication Management 95', 'Med Management', false),
    ('H2011', 'Crisis Response', 'BH Rehab - Crisis Interventions', 'BH Rehab', false),
    ('H2014', 'Skills Training Child & Adol', 'BH Rehab - Skills Training', 'BH Rehab', false),
    ('H2014', 'Skills Training Child & Adol Telehealth', 'BH Rehab - Skills Training Telehealth', 'BH Rehab', true),
    ('T1017', 'Case Management Telehealth Wraparound', 'Intensive Case Management Wraparound Telehealth', 'Case Management', true),
    ('T1017', 'Case Management Wraparound', 'Intensive Case Management Wraparound', 'Case Management', false),
    ('T1017', 'Family Training', 'Skills Training - Family Training', 'Skills Training', false),
    ('T1017', 'CANS', '95 CANS Assessment', 'Assessment', false),
    ('T1017', 'Case Management Routine', 'Case Management Routine', 'Case Management', false),
    ('T1017', 'Case Management Routine Telehealth', 'Case Management Routine Telehealth', 'Case Management', true)
ON CONFLICT DO NOTHING;
