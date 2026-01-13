-- Client Pages Database Schema
-- All tables needed for remaining client inner pages

-- ============================================
-- CLIENT PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    progress_date DATE NOT NULL,
    progress_note TEXT,
    session_type TEXT, -- individual, group, family
    duration_minutes INTEGER,
    goals_addressed TEXT[],
    interventions TEXT[],
    client_response TEXT,
    plan_for_next_session TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_progress_client_id ON public.client_progress(client_id);
CREATE INDEX IF NOT EXISTS idx_client_progress_date ON public.client_progress(progress_date);

-- ============================================
-- MEDICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT, -- daily, twice daily, as needed, etc.
    route TEXT, -- oral, injection, topical, etc.
    prescriber TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active', -- active, discontinued, historic
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_medications_client_id ON public.client_medications(client_id);
CREATE INDEX IF NOT EXISTS idx_client_medications_status ON public.client_medications(status);

-- ============================================
-- AUTHORIZATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_authorizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    authorization_number TEXT,
    service_type TEXT,
    payer_name TEXT,
    start_date DATE,
    end_date DATE,
    units_authorized INTEGER,
    units_used INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active', -- active, expired, pending
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_authorizations_client_id ON public.client_authorizations(client_id);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT, -- intake, consent, assessment, discharge, etc.
    file_url TEXT,
    file_size INTEGER,
    uploaded_by UUID REFERENCES public.profiles(id),
    document_date DATE,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON public.client_documents(client_id);

-- ============================================
-- ELIGIBILITY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_eligibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    payer_name TEXT,
    policy_number TEXT,
    group_number TEXT,
    eligibility_status TEXT, -- eligible, ineligible, pending
    verification_date DATE,
    coverage_start DATE,
    coverage_end DATE,
    copay DECIMAL(10,2),
    deductible DECIMAL(10,2),
    deductible_met DECIMAL(10,2),
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_eligibility_client_id ON public.client_eligibility(client_id);

-- ============================================
-- ASSIGNED STAFF TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_assigned_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT, -- primary therapist, case manager, supervisor
    start_date DATE,
    end_date DATE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(client_id, staff_id, role)
);

CREATE INDEX IF NOT EXISTS idx_client_assigned_staff_client_id ON public.client_assigned_staff(client_id);

-- ============================================
-- PHYSICIAN TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_physicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    physician_name TEXT NOT NULL,
    specialty TEXT,
    phone TEXT,
    fax TEXT,
    email TEXT,
    address TEXT,
    is_primary BOOLEAN DEFAULT false,
    npi TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_physicians_client_id ON public.client_physicians(client_id);

-- ============================================
-- BACKGROUND TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_background (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL, -- medical, social, family, education, employment, legal, substance
    content TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(client_id, section_type)
);

CREATE INDEX IF NOT EXISTS idx_client_background_client_id ON public.client_background(client_id);

-- ============================================
-- CONTACTS & RELATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    relationship TEXT, -- parent, spouse, guardian, sibling, etc.
    phone TEXT,
    email TEXT,
    address TEXT,
    is_emergency_contact BOOLEAN DEFAULT false,
    is_authorized_contact BOOLEAN DEFAULT false,
    can_pickup BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_contacts_client_id ON public.client_contacts(client_id);

-- ============================================
-- CONTACT NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_contact_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_date TIMESTAMPTZ NOT NULL,
    contact_type TEXT, -- phone, email, in-person, other
    contact_with TEXT, -- client, parent, other
    subject TEXT,
    notes TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_contact_notes_client_id ON public.client_contact_notes(client_id);

-- ============================================
-- QUESTIONNAIRE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    questionnaire_name TEXT NOT NULL,
    questionnaire_type TEXT, -- intake, screening, outcome, etc.
    completed_date DATE,
    score DECIMAL(10,2),
    responses JSONB,
    status TEXT DEFAULT 'pending', -- pending, completed, expired
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_questionnaires_client_id ON public.client_questionnaires(client_id);

-- ============================================
-- IMMUNIZATION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_immunizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vaccine_name TEXT NOT NULL,
    administration_date DATE,
    lot_number TEXT,
    site TEXT, -- left arm, right arm, etc.
    administered_by TEXT,
    next_due_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_immunizations_client_id ON public.client_immunizations(client_id);

-- ============================================
-- FILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    category TEXT, -- general, medical, legal, etc.
    uploaded_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_files_client_id ON public.client_files(client_id);

-- ============================================
-- DISCHARGE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.client_discharge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    discharge_date DATE,
    discharge_type TEXT, -- planned, unplanned, against advice, transferred
    discharge_reason TEXT,
    discharge_summary TEXT,
    referrals TEXT,
    follow_up_plan TEXT,
    status TEXT DEFAULT 'active', -- active, discharged
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_discharge_client_id ON public.client_discharge(client_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.client_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_assigned_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_physicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_background ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contact_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_immunizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_discharge ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow authenticated users)
CREATE POLICY "Authenticated users can manage client_progress" ON public.client_progress FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_medications" ON public.client_medications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_authorizations" ON public.client_authorizations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_documents" ON public.client_documents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_eligibility" ON public.client_eligibility FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_assigned_staff" ON public.client_assigned_staff FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_physicians" ON public.client_physicians FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_background" ON public.client_background FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_contacts" ON public.client_contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_contact_notes" ON public.client_contact_notes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_questionnaires" ON public.client_questionnaires FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_immunizations" ON public.client_immunizations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_files" ON public.client_files FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_discharge" ON public.client_discharge FOR ALL USING (auth.role() = 'authenticated');
