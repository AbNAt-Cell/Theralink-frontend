import { createClient as getSupabaseClient } from '@/utils/supabase/client';

const supabase = getSupabaseClient();

// ICD-10 Code interface
export interface ICD10Code {
    code: string;
    name: string;
}

// Client Diagnosis interface
export interface ClientDiagnosis {
    id: string;
    clientId: string;
    icd10Code: string;
    diagnosisName: string;
    diagnosisDate: string;
    isRuleOut: boolean;
    isHistorical: boolean;
    isImpression: boolean;
    isExternal: boolean;
    notes?: string;
    createdAt: string;
}

// Search ICD-10 codes using NLM Clinical Tables API
export const searchICD10Codes = async (query: string): Promise<ICD10Code[]> => {
    if (!query || query.length < 3) return [];

    try {
        const response = await fetch(
            `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${encodeURIComponent(query)}&maxList=25`
        );

        if (!response.ok) throw new Error('Failed to fetch ICD-10 codes');

        const data = await response.json();
        // NLM API returns: [total, codes, null, [code, name] pairs]
        const results: ICD10Code[] = [];

        if (data[3]) {
            for (const item of data[3]) {
                results.push({
                    code: item[0],
                    name: item[1]
                });
            }
        }

        return results;
    } catch (error) {
        console.error('Error searching ICD-10 codes:', error);
        return [];
    }
};

// Get diagnoses for a client
export const getClientDiagnoses = async (clientId: string): Promise<ClientDiagnosis[]> => {
    const { data, error } = await supabase
        .from('client_diagnoses')
        .select('*')
        .eq('client_id', clientId)
        .order('diagnosis_date', { ascending: false });

    if (error) throw error;

    return (data || []).map(d => ({
        id: d.id,
        clientId: d.client_id,
        icd10Code: d.icd10_code,
        diagnosisName: d.diagnosis_name,
        diagnosisDate: d.diagnosis_date,
        isRuleOut: d.is_rule_out,
        isHistorical: d.is_historical,
        isImpression: d.is_impression,
        isExternal: d.is_external,
        notes: d.notes,
        createdAt: d.created_at
    }));
};

// Add a diagnosis to a client
export const addClientDiagnosis = async (data: {
    clientId: string;
    icd10Code: string;
    diagnosisName: string;
    diagnosisDate: string;
    isRuleOut?: boolean;
    isHistorical?: boolean;
    isImpression?: boolean;
    isExternal?: boolean;
    notes?: string;
    createdBy?: string;
}): Promise<ClientDiagnosis> => {
    const { data: result, error } = await supabase
        .from('client_diagnoses')
        .insert({
            client_id: data.clientId,
            icd10_code: data.icd10Code,
            diagnosis_name: data.diagnosisName,
            diagnosis_date: data.diagnosisDate,
            is_rule_out: data.isRuleOut || false,
            is_historical: data.isHistorical || false,
            is_impression: data.isImpression || false,
            is_external: data.isExternal || false,
            notes: data.notes,
            created_by: data.createdBy
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: result.id,
        clientId: result.client_id,
        icd10Code: result.icd10_code,
        diagnosisName: result.diagnosis_name,
        diagnosisDate: result.diagnosis_date,
        isRuleOut: result.is_rule_out,
        isHistorical: result.is_historical,
        isImpression: result.is_impression,
        isExternal: result.is_external,
        notes: result.notes,
        createdAt: result.created_at
    };
};

// Delete a diagnosis
export const deleteClientDiagnosis = async (diagnosisId: string): Promise<void> => {
    const { error } = await supabase
        .from('client_diagnoses')
        .delete()
        .eq('id', diagnosisId);

    if (error) throw error;
};
