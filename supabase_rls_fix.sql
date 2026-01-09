-- Helper functions to bypass RLS recursion
-- These run with SECURITY DEFINER to avoid the circular policy checks

CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_auth_user_clinic_id()
RETURNS uuid AS $$
  SELECT clinic_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- Update Profiles Policies
DROP POLICY IF EXISTS "Admins can view profiles in their clinic" ON public.profiles;
CREATE POLICY "Admins can view profiles in their clinic" ON public.profiles
    FOR SELECT USING (
        get_auth_user_role() = 'ADMIN' AND get_auth_user_clinic_id() = clinic_id
    );

DROP POLICY IF EXISTS "Super Admins can view all profiles" ON public.profiles;
CREATE POLICY "Super Admins can view all profiles" ON public.profiles
    FOR SELECT USING (get_auth_user_role() = 'SUPER_ADMIN');

-- Update Clinics Policies
DROP POLICY IF EXISTS "Users can view their own clinic" ON public.clinics;
CREATE POLICY "Users can view their own clinic" ON public.clinics
    FOR SELECT USING (get_auth_user_clinic_id() = id);

DROP POLICY IF EXISTS "Super Admins can view all clinics" ON public.clinics;
CREATE POLICY "Super Admins can view all clinics" ON public.clinics
    FOR SELECT USING (get_auth_user_role() = 'SUPER_ADMIN');

-- Update Dashboard Tables Policies
-- Appointments
DROP POLICY IF EXISTS "Clinic access for appointments" ON public.appointments;
CREATE POLICY "Clinic access for appointments" ON public.appointments
    FOR ALL USING (clinic_id = get_auth_user_clinic_id());

-- Staff Details
DROP POLICY IF EXISTS "Clinic access for staff details" ON public.staff_details;
CREATE POLICY "Clinic access for staff details" ON public.staff_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = staff_details.profile_id AND clinic_id = get_auth_user_clinic_id()
        )
    );

-- Documents
DROP POLICY IF EXISTS "Clinic access for documents" ON public.documents;
CREATE POLICY "Clinic access for documents" ON public.documents
    FOR ALL USING (clinic_id = get_auth_user_clinic_id());

-- Billing
DROP POLICY IF EXISTS "Clinic access for billing" ON public.billing_records;
CREATE POLICY "Clinic access for billing" ON public.billing_records
    FOR ALL USING (clinic_id = get_auth_user_clinic_id());

-- Compliance
DROP POLICY IF EXISTS "Clinic access for compliance" ON public.compliance_records;
CREATE POLICY "Clinic access for compliance" ON public.compliance_records
    FOR ALL USING (clinic_id = get_auth_user_clinic_id());

-- Training
DROP POLICY IF EXISTS "Clinic access for training" ON public.training_records;
CREATE POLICY "Clinic access for training" ON public.training_records
    FOR ALL USING (clinic_id = get_auth_user_clinic_id());
