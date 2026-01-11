-- Client Diagnoses Schema
-- Stores diagnoses linked to clients with metadata

CREATE TABLE IF NOT EXISTS public.client_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    icd10_code TEXT NOT NULL,
    diagnosis_name TEXT NOT NULL,
    diagnosis_date DATE NOT NULL,
    is_rule_out BOOLEAN DEFAULT false,
    is_historical BOOLEAN DEFAULT false,
    is_impression BOOLEAN DEFAULT false,
    is_external BOOLEAN DEFAULT false,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_diagnoses_client_id ON public.client_diagnoses(client_id);
CREATE INDEX IF NOT EXISTS idx_client_diagnoses_icd10_code ON public.client_diagnoses(icd10_code);

-- Enable RLS
ALTER TABLE public.client_diagnoses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view diagnoses in their clinic"
    ON public.client_diagnoses FOR SELECT
    USING (
        client_id IN (
            SELECT id FROM public.profiles 
            WHERE clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "Authenticated users can insert diagnoses"
    ON public.client_diagnoses FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update diagnoses"
    ON public.client_diagnoses FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete diagnoses"
    ON public.client_diagnoses FOR DELETE
    USING (auth.role() = 'authenticated');
