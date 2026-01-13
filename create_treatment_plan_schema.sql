-- Treatment Plans Schema
-- Stores treatment plans for clients with goals and objectives

CREATE TABLE IF NOT EXISTS public.treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'draft', -- draft, active, completed, closed
    plan_date DATE NOT NULL,
    plan_end_date DATE,
    discharge_date DATE,
    start_time TIME,
    end_time TIME,
    service TEXT,
    place_of_service TEXT,
    is_client_participant BOOLEAN DEFAULT false,
    transition_discharge_plan TEXT,
    maintenance_recommendation TEXT,
    client_strengths TEXT,
    client_needs TEXT,
    client_abilities TEXT,
    client_preferences TEXT,
    crisis_planning TEXT,
    step_down_services TEXT,
    discharge_planning TEXT,
    other_providers TEXT,
    is_ai_generated BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Treatment Goals
CREATE TABLE IF NOT EXISTS public.treatment_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treatment_plan_id UUID NOT NULL REFERENCES public.treatment_plans(id) ON DELETE CASCADE,
    goal_number INTEGER DEFAULT 1,
    goal_text TEXT NOT NULL,
    start_date DATE,
    target_date DATE,
    status TEXT DEFAULT 'active', -- active, achieved, discontinued
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Treatment Objectives (interventions for each goal)
CREATE TABLE IF NOT EXISTS public.treatment_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.treatment_goals(id) ON DELETE CASCADE,
    objective_number INTEGER DEFAULT 1,
    objective_text TEXT NOT NULL,
    frequency TEXT,
    responsible_party TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_treatment_plans_client_id ON public.treatment_plans(client_id);
CREATE INDEX IF NOT EXISTS idx_treatment_plans_status ON public.treatment_plans(status);
CREATE INDEX IF NOT EXISTS idx_treatment_goals_plan_id ON public.treatment_goals(treatment_plan_id);
CREATE INDEX IF NOT EXISTS idx_treatment_objectives_goal_id ON public.treatment_objectives(goal_id);

-- Enable RLS
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_objectives ENABLE ROW LEVEL SECURITY;

-- RLS Policies for treatment_plans
CREATE POLICY "Users can view treatment plans in their clinic"
    ON public.treatment_plans FOR SELECT
    USING (
        client_id IN (
            SELECT id FROM public.profiles 
            WHERE clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "Authenticated users can manage treatment plans"
    ON public.treatment_plans FOR ALL
    USING (auth.role() = 'authenticated');

-- RLS Policies for treatment_goals
CREATE POLICY "Users can view treatment goals"
    ON public.treatment_goals FOR SELECT
    USING (
        treatment_plan_id IN (SELECT id FROM public.treatment_plans)
    );

CREATE POLICY "Authenticated users can manage treatment goals"
    ON public.treatment_goals FOR ALL
    USING (auth.role() = 'authenticated');

-- RLS Policies for treatment_objectives
CREATE POLICY "Users can view treatment objectives"
    ON public.treatment_objectives FOR SELECT
    USING (
        goal_id IN (SELECT id FROM public.treatment_goals)
    );

CREATE POLICY "Authenticated users can manage treatment objectives"
    ON public.treatment_objectives FOR ALL
    USING (auth.role() = 'authenticated');
