-- SQL schema for Authorizations
-- Run this in your Supabase SQL Editor

-- Authorization Status enum values: PENDING, APPROVED, DENIED, EXPIRED

-- 1. Create authorizations table
CREATE TABLE IF NOT EXISTS authorizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    submitted_by UUID NOT NULL REFERENCES profiles(id),
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'DENIED', 'EXPIRED')),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create authorization_clients junction table (one auth can have multiple clients)
CREATE TABLE IF NOT EXISTS authorization_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    authorization_id UUID NOT NULL REFERENCES authorizations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES profiles(id),
    effective_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auth_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(authorization_id, client_id)
);

-- 3. Create authorization_services junction table (services for an authorization)
CREATE TABLE IF NOT EXISTS authorization_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    authorization_id UUID NOT NULL REFERENCES authorizations(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id),
    service_code VARCHAR(50),
    total_units INTEGER NOT NULL DEFAULT 0,
    is_restrictive BOOLEAN DEFAULT FALSE,
    units_limit INTEGER,
    units_period VARCHAR(20) CHECK (units_period IN ('Day', 'Week', 'Month')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create authorization_templates table
CREATE TABLE IF NOT EXISTS authorization_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    services JSONB, -- Array of service configurations
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_authorizations_clinic_id ON authorizations(clinic_id);
CREATE INDEX IF NOT EXISTS idx_authorizations_status ON authorizations(status);
CREATE INDEX IF NOT EXISTS idx_authorizations_submitted_by ON authorizations(submitted_by);
CREATE INDEX IF NOT EXISTS idx_authorization_clients_auth_id ON authorization_clients(authorization_id);
CREATE INDEX IF NOT EXISTS idx_authorization_clients_client_id ON authorization_clients(client_id);
CREATE INDEX IF NOT EXISTS idx_authorization_services_auth_id ON authorization_services(authorization_id);

-- 6. Enable RLS
ALTER TABLE authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorization_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorization_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorization_templates ENABLE ROW LEVEL SECURITY;

-- 7. Drop existing policies if they exist (for re-running this script)
DROP POLICY IF EXISTS "authorizations_select" ON authorizations;
DROP POLICY IF EXISTS "authorizations_insert" ON authorizations;
DROP POLICY IF EXISTS "authorizations_update" ON authorizations;
DROP POLICY IF EXISTS "authorizations_delete" ON authorizations;
DROP POLICY IF EXISTS "auth_clients_select" ON authorization_clients;
DROP POLICY IF EXISTS "auth_clients_insert" ON authorization_clients;
DROP POLICY IF EXISTS "auth_clients_update" ON authorization_clients;
DROP POLICY IF EXISTS "auth_clients_delete" ON authorization_clients;
DROP POLICY IF EXISTS "auth_services_select" ON authorization_services;
DROP POLICY IF EXISTS "auth_services_insert" ON authorization_services;
DROP POLICY IF EXISTS "auth_services_update" ON authorization_services;
DROP POLICY IF EXISTS "auth_services_delete" ON authorization_services;
DROP POLICY IF EXISTS "auth_templates_select" ON authorization_templates;
DROP POLICY IF EXISTS "auth_templates_insert" ON authorization_templates;
DROP POLICY IF EXISTS "auth_templates_update" ON authorization_templates;
DROP POLICY IF EXISTS "auth_templates_delete" ON authorization_templates;

-- 8. RLS Policies for authorizations
CREATE POLICY "authorizations_select" ON authorizations
    FOR SELECT USING (
        clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "authorizations_insert" ON authorizations
    FOR INSERT WITH CHECK (
        clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "authorizations_update" ON authorizations
    FOR UPDATE USING (
        clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "authorizations_delete" ON authorizations
    FOR DELETE USING (
        clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
    );

-- 9. RLS Policies for authorization_clients
CREATE POLICY "auth_clients_select" ON authorization_clients
    FOR SELECT USING (
        authorization_id IN (
            SELECT id FROM authorizations 
            WHERE clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "auth_clients_insert" ON authorization_clients
    FOR INSERT WITH CHECK (
        authorization_id IN (
            SELECT id FROM authorizations 
            WHERE clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "auth_clients_update" ON authorization_clients
    FOR UPDATE USING (
        authorization_id IN (
            SELECT id FROM authorizations 
            WHERE clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "auth_clients_delete" ON authorization_clients
    FOR DELETE USING (
        authorization_id IN (
            SELECT id FROM authorizations 
            WHERE clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
        )
    );

-- 10. RLS Policies for authorization_services
CREATE POLICY "auth_services_select" ON authorization_services
    FOR SELECT USING (
        authorization_id IN (
            SELECT id FROM authorizations 
            WHERE clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "auth_services_insert" ON authorization_services
    FOR INSERT WITH CHECK (
        authorization_id IN (
            SELECT id FROM authorizations 
            WHERE clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "auth_services_update" ON authorization_services
    FOR UPDATE USING (
        authorization_id IN (
            SELECT id FROM authorizations 
            WHERE clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "auth_services_delete" ON authorization_services
    FOR DELETE USING (
        authorization_id IN (
            SELECT id FROM authorizations 
            WHERE clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
        )
    );

-- 11. RLS Policies for authorization_templates
CREATE POLICY "auth_templates_select" ON authorization_templates
    FOR SELECT USING (
        clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "auth_templates_insert" ON authorization_templates
    FOR INSERT WITH CHECK (
        clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "auth_templates_update" ON authorization_templates
    FOR UPDATE USING (
        clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "auth_templates_delete" ON authorization_templates
    FOR DELETE USING (
        clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid())
    );
