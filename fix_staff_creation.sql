-- 1. Relax the profiles FK constraint
-- This allows creating profiles for staff who don't have auth accounts yet.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Ensure Profiles has proper management policies
-- We use the helper functions from supabase_rls_fix.sql if they exist
-- but for safety, we'll re-define them or use direct checks.

DROP POLICY IF EXISTS "Admins can manage profiles in their clinic" ON public.profiles;
CREATE POLICY "Admins can manage profiles in their clinic" ON public.profiles
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN' 
        AND (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()) = clinic_id
    )
    WITH CHECK (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN' 
        AND (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()) = clinic_id
    );

DROP POLICY IF EXISTS "Super Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Super Admins can manage all profiles" ON public.profiles
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SUPER_ADMIN'
    );

-- 3. Ensure Staff Details has proper management policies
DROP POLICY IF EXISTS "Admins can manage staff details" ON public.staff_details;
CREATE POLICY "Admins can manage staff details" ON public.staff_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = staff_details.profile_id 
            AND clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
        )
    );
