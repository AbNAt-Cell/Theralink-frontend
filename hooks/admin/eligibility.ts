import { createClient as getSupabaseClient } from '@/utils/supabase/client';

export interface EligibilityCheck {
    id: string;
    client_id: string;
    payer_id?: string;
    payer_name: string;
    check_date: string;
    service_date_from?: string;
    service_date_to?: string;
    status: string;
    response_details?: any;
    created_at: string;
}

export const getEligibilityChecks = async (clientId: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('eligibility_checks')
        .select('*')
        .eq('client_id', clientId)
        .order('check_date', { ascending: false });

    if (error) {
        console.error('Error fetching eligibility checks:', error);
        return [];
    }
    return data as EligibilityCheck[];
};

export const addEligibilityCheck = async (check: Partial<EligibilityCheck>) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('eligibility_checks')
        .insert([check])
        .select()
        .single();

    if (error) {
        throw error;
    }
    return data;
};
