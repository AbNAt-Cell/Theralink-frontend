-- 1. Ensure at least one clinic exists
INSERT INTO public.clinics (name)
SELECT 'Theralink Default Clinic'
WHERE NOT EXISTS (SELECT 1 FROM public.clinics);

-- 2. Assign the first clinic to your admin account 
-- This fixes the "Missing clinicId" error in the browser console
UPDATE public.profiles
SET clinic_id = (SELECT id FROM public.clinics LIMIT 1)
WHERE id = '45f1c52e-a3f6-4728-a391-79fc4966a15b';

-- 3. Verify the result
SELECT p.id, p.role, c.name as clinic_name
FROM public.profiles p
LEFT JOIN public.clinics c ON p.clinic_id = c.id
WHERE p.id = '45f1c52e-a3f6-4728-a391-79fc4966a15b';
