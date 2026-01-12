-- Client Vitals Schema
-- Stores vital signs for clients

CREATE TABLE IF NOT EXISTS public.client_vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    bp_systolic INTEGER,          -- Blood Pressure Systolic
    bp_diastolic INTEGER,         -- Blood Pressure Diastolic
    heart_rate INTEGER,           -- Heart Rate (bpm)
    pulse_rate INTEGER,           -- Pulse Rate
    respiration INTEGER,          -- Respiration rate
    temperature DECIMAL(5,2),     -- Temperature (°F)
    weight DECIMAL(6,2),          -- Weight in lbs
    height DECIMAL(6,2),          -- Height in cms
    bmi DECIMAL(5,2),             -- BMI (calculated)
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_vitals_client_id ON public.client_vitals(client_id);
CREATE INDEX IF NOT EXISTS idx_client_vitals_record_date ON public.client_vitals(record_date);

-- Enable RLS
ALTER TABLE public.client_vitals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view vitals in their clinic"
    ON public.client_vitals FOR SELECT
    USING (
        client_id IN (
            SELECT id FROM public.profiles 
            WHERE clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "Authenticated users can insert vitals"
    ON public.client_vitals FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update vitals"
    ON public.client_vitals FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete vitals"
    ON public.client_vitals FOR DELETE
    USING (auth.role() = 'authenticated');
