import { createClient as getSupabaseClient } from '@/utils/supabase/client';

const supabase = getSupabaseClient();

// Types
export interface TreatmentObjective {
    id: string;
    goalId: string;
    objectiveNumber: number;
    objectiveText: string;
    frequency?: string;
    responsibleParty?: string;
    status: string;
}

export interface TreatmentGoal {
    id: string;
    treatmentPlanId: string;
    goalNumber: number;
    goalText: string;
    startDate?: string;
    targetDate?: string;
    status: string;
    objectives: TreatmentObjective[];
}

export interface TreatmentPlan {
    id: string;
    clientId: string;
    title: string;
    status: string;
    planDate: string;
    planEndDate?: string;
    dischargeDate?: string;
    startTime?: string;
    endTime?: string;
    service?: string;
    placeOfService?: string;
    isClientParticipant: boolean;
    transitionDischargePlan?: string;
    maintenanceRecommendation?: string;
    clientStrengths?: string;
    clientNeeds?: string;
    clientAbilities?: string;
    clientPreferences?: string;
    crisisPlanning?: string;
    stepDownServices?: string;
    dischargePlanning?: string;
    otherProviders?: string;
    isAiGenerated: boolean;
    goals: TreatmentGoal[];
    createdAt: string;
}

// Get all treatment plans for a client
export const getTreatmentPlans = async (clientId: string, includeCompleted = false): Promise<TreatmentPlan[]> => {
    let query = supabase
        .from('treatment_plans')
        .select(`
      *,
      goals:treatment_goals(
        *,
        objectives:treatment_objectives(*)
      )
    `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (!includeCompleted) {
        query = query.not('status', 'in', '("completed","closed")');
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(mapTreatmentPlan);
};

// Get a single treatment plan by ID
export const getTreatmentPlanById = async (planId: string): Promise<TreatmentPlan> => {
    const { data, error } = await supabase
        .from('treatment_plans')
        .select(`
      *,
      goals:treatment_goals(
        *,
        objectives:treatment_objectives(*)
      )
    `)
        .eq('id', planId)
        .single();

    if (error) throw error;
    return mapTreatmentPlan(data);
};

// Create a new treatment plan with goals and objectives
export const createTreatmentPlan = async (plan: Omit<Partial<TreatmentPlan>, 'id' | 'createdAt' | 'goals'> & {
    clientId: string;
    goals?: Array<{
        goalText: string;
        startDate?: string;
        targetDate?: string;
        objectives?: Array<{ objectiveText: string; frequency?: string; responsibleParty?: string }>;
    }>;
}): Promise<TreatmentPlan> => {
    // 1. Create the treatment plan
    const { data: planData, error: planError } = await supabase
        .from('treatment_plans')
        .insert({
            client_id: plan.clientId,
            title: plan.title,
            status: plan.status || 'draft',
            plan_date: plan.planDate || new Date().toISOString().split('T')[0],
            plan_end_date: plan.planEndDate || null,
            discharge_date: plan.dischargeDate || null,
            start_time: plan.startTime || null,
            end_time: plan.endTime || null,
            service: plan.service || null,
            place_of_service: plan.placeOfService || null,
            is_client_participant: plan.isClientParticipant || false,
            transition_discharge_plan: plan.transitionDischargePlan || null,
            maintenance_recommendation: plan.maintenanceRecommendation || null,
            client_strengths: plan.clientStrengths || null,
            client_needs: plan.clientNeeds || null,
            client_abilities: plan.clientAbilities || null,
            client_preferences: plan.clientPreferences || null,
            crisis_planning: plan.crisisPlanning || null,
            step_down_services: plan.stepDownServices || null,
            discharge_planning: plan.dischargePlanning || null,
            other_providers: plan.otherProviders || null,
            is_ai_generated: plan.isAiGenerated || false
        })
        .select()
        .single();

    if (planError) throw planError;

    // 2. Create goals and objectives
    if (plan.goals && plan.goals.length > 0) {
        for (let i = 0; i < plan.goals.length; i++) {
            const goal = plan.goals[i];
            const { data: goalData, error: goalError } = await supabase
                .from('treatment_goals')
                .insert({
                    treatment_plan_id: planData.id,
                    goal_number: i + 1,
                    goal_text: goal.goalText,
                    start_date: goal.startDate || null,
                    target_date: goal.targetDate || null
                })
                .select()
                .single();

            if (goalError) throw goalError;

            // Create objectives for this goal
            if (goal.objectives && goal.objectives.length > 0) {
                const objectives = goal.objectives.map((obj, j) => ({
                    goal_id: goalData.id,
                    objective_number: j + 1,
                    objective_text: obj.objectiveText,
                    frequency: obj.frequency || null,
                    responsible_party: obj.responsibleParty || null
                }));

                const { error: objError } = await supabase
                    .from('treatment_objectives')
                    .insert(objectives);

                if (objError) throw objError;
            }
        }
    }

    return getTreatmentPlanById(planData.id);
};

// Update treatment plan status
export const updateTreatmentPlanStatus = async (planId: string, status: string): Promise<void> => {
    const { error } = await supabase
        .from('treatment_plans')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', planId);

    if (error) throw error;
};

// Update treatment plan details
export const updateTreatmentPlan = async (planId: string, data: {
    title?: string;
    planDate?: string;
    planEndDate?: string;
    dischargeDate?: string;
    startTime?: string;
    endTime?: string;
    service?: string;
    placeOfService?: string;
    isClientParticipant?: boolean;
    transitionDischargePlan?: string;
    maintenanceRecommendation?: string;
    clientStrengths?: string;
    clientNeeds?: string;
    clientAbilities?: string;
    clientPreferences?: string;
    crisisPlanning?: string;
    stepDownServices?: string;
    dischargePlanning?: string;
    otherProviders?: string;
}): Promise<TreatmentPlan> => {
    const { error } = await supabase
        .from('treatment_plans')
        .update({
            title: data.title,
            plan_date: data.planDate || null,
            plan_end_date: data.planEndDate || null,
            discharge_date: data.dischargeDate || null,
            start_time: data.startTime || null,
            end_time: data.endTime || null,
            service: data.service || null,
            place_of_service: data.placeOfService || null,
            is_client_participant: data.isClientParticipant || false,
            transition_discharge_plan: data.transitionDischargePlan || null,
            maintenance_recommendation: data.maintenanceRecommendation || null,
            client_strengths: data.clientStrengths || null,
            client_needs: data.clientNeeds || null,
            client_abilities: data.clientAbilities || null,
            client_preferences: data.clientPreferences || null,
            crisis_planning: data.crisisPlanning || null,
            step_down_services: data.stepDownServices || null,
            discharge_planning: data.dischargePlanning || null,
            other_providers: data.otherProviders || null,
            updated_at: new Date().toISOString()
        })
        .eq('id', planId);

    if (error) throw error;
    return getTreatmentPlanById(planId);
};

// Delete a treatment plan
export const deleteTreatmentPlan = async (planId: string): Promise<void> => {
    const { error } = await supabase
        .from('treatment_plans')
        .delete()
        .eq('id', planId);

    if (error) throw error;
};

// Helper function to map database response to TypeScript interface
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapTreatmentPlan = (data: any): TreatmentPlan => ({
    id: data.id,
    clientId: data.client_id,
    title: data.title,
    status: data.status,
    planDate: data.plan_date,
    planEndDate: data.plan_end_date,
    dischargeDate: data.discharge_date,
    startTime: data.start_time,
    endTime: data.end_time,
    service: data.service,
    placeOfService: data.place_of_service,
    isClientParticipant: data.is_client_participant,
    transitionDischargePlan: data.transition_discharge_plan,
    maintenanceRecommendation: data.maintenance_recommendation,
    clientStrengths: data.client_strengths,
    clientNeeds: data.client_needs,
    clientAbilities: data.client_abilities,
    clientPreferences: data.client_preferences,
    crisisPlanning: data.crisis_planning,
    stepDownServices: data.step_down_services,
    dischargePlanning: data.discharge_planning,
    otherProviders: data.other_providers,
    isAiGenerated: data.is_ai_generated,
    goals: (data.goals || []).map((g: any) => ({
        id: g.id,
        treatmentPlanId: g.treatment_plan_id,
        goalNumber: g.goal_number,
        goalText: g.goal_text,
        startDate: g.start_date,
        targetDate: g.target_date,
        status: g.status,
        objectives: (g.objectives || []).map((o: any) => ({
            id: o.id,
            goalId: o.goal_id,
            objectiveNumber: o.objective_number,
            objectiveText: o.objective_text,
            frequency: o.frequency,
            responsibleParty: o.responsible_party,
            status: o.status
        }))
    })),
    createdAt: data.created_at
});
