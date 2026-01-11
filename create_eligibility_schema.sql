-- Create eligibility_checks table
CREATE TABLE IF NOT EXISTS public.eligibility_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    payer_id UUID REFERENCES public.payers(id),
    payer_name TEXT, -- Fallback if payer_id is null or just for display snapshot
    check_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    service_date_from DATE,
    service_date_to DATE,
    status TEXT DEFAULT 'Pending', -- Active, Inactive, Error, Pending
    response_details JSONB, -- Store full JSON response or details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.eligibility_checks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view/add checks (similar to other admin tables)
CREATE POLICY "Enable read access for authenticated users" ON public.eligibility_checks
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.eligibility_checks
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Seed some mock data for demonstration
INSERT INTO public.eligibility_checks (client_id, payer_name, status, service_date_from, check_date, response_details)
SELECT 
    id as client_id,
    'Blue Cross Blue Shield' as payer_name,
    'Active' as status,
    CURRENT_DATE as service_date_from,
    NOW() - INTERVAL '2 days' as check_date,
    '{"copay": 20, "deductible_remaining": 500}'::jsonb
FROM public.profiles
LIMIT 1;
