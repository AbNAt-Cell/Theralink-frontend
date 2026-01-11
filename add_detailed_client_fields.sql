-- Add detailed fields to client_details table
-- Fields based on user requirements and design

ALTER TABLE public.client_details
ADD COLUMN IF NOT EXISTS record_number TEXT,
ADD COLUMN IF NOT EXISTS sexual_orientation TEXT,
ADD COLUMN IF NOT EXISTS marital_status TEXT,
ADD COLUMN IF NOT EXISTS gender_identity TEXT,
ADD COLUMN IF NOT EXISTS pregnancy_status TEXT,
ADD COLUMN IF NOT EXISTS gender_pronouns TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS work_phone TEXT,
ADD COLUMN IF NOT EXISTS physical_address_street TEXT,
ADD COLUMN IF NOT EXISTS physical_address_line_2 TEXT,
ADD COLUMN IF NOT EXISTS physical_address_city TEXT,
ADD COLUMN IF NOT EXISTS physical_address_state TEXT,
ADD COLUMN IF NOT EXISTS physical_address_zip_code TEXT,
ADD COLUMN IF NOT EXISTS is_private_pay BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS assigned_site TEXT;

-- Update RLS policies if needed (existing policies cover all columns, so strictly speaking no change needed unless we want column-level security)
-- However, we should ensure the new columns are accessible. Since selecting * includes new columns, existing policies are sufficient.
