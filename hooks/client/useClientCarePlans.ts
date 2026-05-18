'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';
import { differenceInMonths } from 'date-fns';

export interface CarePlan {
    id: string;
    client: string;
    assignedStaff: string;
    planStartDate: string;
    planDuration: string;
    primaryGoal: string;
    medicationPlan: string;
    appointment: string;
    status: string;
}

export function useClientCarePlans() {
    const { user } = useUser();
    const supabase = createClient();
    
    const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchCarePlans = async () => {
        if (!user || user.role !== 'CLIENT') {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch Treatment Plans with nested Goals and Provider info
            const { data, error: fetchError } = await supabase
                .from('treatment_plans')
                .select(`
                    id,
                    plan_date,
                    plan_end_date,
                    discharge_date,
                    status,
                    service,
                    provider:profiles!created_by(first_name, last_name),
                    goals:treatment_goals(goal_text)
                `)
                .eq('client_id', user.id)
                .order('plan_date', { ascending: false });

            if (fetchError) throw fetchError;

            // Transform data to CarePlan format expected by the table
            const mappedPlans: CarePlan[] = (data || []).map((plan: any) => {
                const providerObj = Array.isArray(plan.provider) ? plan.provider[0] || {} : plan.provider || {};
                const providerName = providerObj.first_name ? `${providerObj.first_name} ${providerObj.last_name}` : 'Unknown Provider';

                const endDate = plan.plan_end_date || plan.discharge_date;
                let durationStr = 'Ongoing';
                if (plan.plan_date && endDate) {
                   const months = differenceInMonths(new Date(endDate), new Date(plan.plan_date));
                   durationStr = months > 0 ? `${months} months` : '< 1 month';
                }

                // Extract first goal directly mapping from the join array (if exists)
                const goalsArray = Array.isArray(plan.goals) ? plan.goals : [plan.goals];
                const firstGoalText = goalsArray.length > 0 && goalsArray[0]?.goal_text 
                    ? goalsArray[0].goal_text 
                    : 'To be established';

                return {
                    id: plan.id.substring(0, 8).toUpperCase(),
                    client: 'Self', // Client portal perspective
                    assignedStaff: providerName,
                    planStartDate: plan.plan_date,
                    planDuration: durationStr,
                    primaryGoal: firstGoalText.length > 50 ? firstGoalText.substring(0, 47) + '...' : firstGoalText,
                    medicationPlan: 'Not specified in plan',
                    appointment: plan.service || 'General Session',
                    status: plan.status ? plan.status.charAt(0).toUpperCase() + plan.status.slice(1) : 'Draft',
                };
            });

            setCarePlans(mappedPlans);
        } catch (err: any) {
            console.error('Error fetching client care plans data:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchCarePlans();
        }
    }, [user?.id]);

    return { carePlans, loading, error, refresh: fetchCarePlans };
}
