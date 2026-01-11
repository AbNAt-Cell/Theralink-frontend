-- Ensure the FK points to public.profiles, NOT auth.users
ALTER TABLE public.staff_credentials
    DROP CONSTRAINT IF EXISTS staff_credentials_staff_id_fkey;

ALTER TABLE public.staff_credentials
    ADD CONSTRAINT staff_credentials_staff_id_fkey
    FOREIGN KEY (staff_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;

-- Also verify the table exists and columns are correct (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff_credentials' AND column_name = 'staff_id') THEN
        ALTER TABLE public.staff_credentials ADD COLUMN staff_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL;
    END IF;
END $$;
