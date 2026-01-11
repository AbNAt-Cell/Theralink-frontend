import { createClient as getSupabaseClient } from '@/utils/supabase/client';

const supabase = getSupabaseClient();

export interface Payer {
    id: string;
    name: string;
    payer_id?: string;
}

export interface ClientPolicy {
    id: string;
    client_id: string;
    payer_id: string;
    payer?: Payer;
    policy_number: string;
    start_date: string;
    end_date?: string;
    is_primary: boolean;
    insured_is_different: boolean;
    has_copay: boolean;
    copay_amount?: number;
}

export const getPayers = async () => {
    const { data, error } = await supabase
        .from('payers')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching payers:', error);
        return [];
    }
    return data as Payer[];
};

export const getClientPolicies = async (clientId: string) => {
    const { data, error } = await supabase
        .from('client_policies')
        .select(`
            *,
            payer:payers(*)
        `)
        .eq('client_id', clientId);

    if (error) {
        console.error('Error fetching client policies:', error);
        return [];
    }
    return data as ClientPolicy[];
};

export const addClientPolicy = async (policy: Partial<ClientPolicy>) => {
    const { data, error } = await supabase
        .from('client_policies')
        .insert([policy])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteClientPolicy = async (policyId: string) => {
    const { error } = await supabase
        .from('client_policies')
        .delete()
        .eq('id', policyId);

    if (error) throw error;
};
