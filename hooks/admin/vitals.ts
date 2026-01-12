import { createClient as getSupabaseClient } from '@/utils/supabase/client';

const supabase = getSupabaseClient();

// Client Vital interface
export interface ClientVital {
    id: string;
    clientId: string;
    recordDate: string;
    bpSystolic?: number;
    bpDiastolic?: number;
    heartRate?: number;
    pulseRate?: number;
    respiration?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    notes?: string;
    createdAt: string;
}

// Calculate BMI from weight (lbs) and height (cms)
export const calculateBMI = (weightLbs?: number, heightCms?: number): number | undefined => {
    if (!weightLbs || !heightCms || heightCms === 0) return undefined;

    // Convert lbs to kg (1 lb = 0.453592 kg)
    const weightKg = weightLbs * 0.453592;
    // Convert cms to meters
    const heightM = heightCms / 100;
    // BMI = kg / m²
    const bmi = weightKg / (heightM * heightM);
    return Math.round(bmi * 100) / 100;
};

// Get vitals for a client
export const getClientVitals = async (clientId: string): Promise<ClientVital[]> => {
    const { data, error } = await supabase
        .from('client_vitals')
        .select('*')
        .eq('client_id', clientId)
        .order('record_date', { ascending: false });

    if (error) throw error;

    return (data || []).map(v => ({
        id: v.id,
        clientId: v.client_id,
        recordDate: v.record_date,
        bpSystolic: v.bp_systolic,
        bpDiastolic: v.bp_diastolic,
        heartRate: v.heart_rate,
        pulseRate: v.pulse_rate,
        respiration: v.respiration,
        temperature: v.temperature,
        weight: v.weight,
        height: v.height,
        bmi: v.bmi,
        notes: v.notes,
        createdAt: v.created_at
    }));
};

// Add a vital record
export const addClientVital = async (data: {
    clientId: string;
    recordDate: string;
    bpSystolic?: number;
    bpDiastolic?: number;
    heartRate?: number;
    pulseRate?: number;
    respiration?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    notes?: string;
    createdBy?: string;
}): Promise<ClientVital> => {
    // Calculate BMI
    const bmi = calculateBMI(data.weight, data.height);

    const { data: result, error } = await supabase
        .from('client_vitals')
        .insert({
            client_id: data.clientId,
            record_date: data.recordDate,
            bp_systolic: data.bpSystolic || null,
            bp_diastolic: data.bpDiastolic || null,
            heart_rate: data.heartRate || null,
            pulse_rate: data.pulseRate || null,
            respiration: data.respiration || null,
            temperature: data.temperature || null,
            weight: data.weight || null,
            height: data.height || null,
            bmi: bmi || null,
            notes: data.notes || null,
            created_by: data.createdBy || null
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: result.id,
        clientId: result.client_id,
        recordDate: result.record_date,
        bpSystolic: result.bp_systolic,
        bpDiastolic: result.bp_diastolic,
        heartRate: result.heart_rate,
        pulseRate: result.pulse_rate,
        respiration: result.respiration,
        temperature: result.temperature,
        weight: result.weight,
        height: result.height,
        bmi: result.bmi,
        notes: result.notes,
        createdAt: result.created_at
    };
};

// Delete a vital record
export const deleteClientVital = async (vitalId: string): Promise<void> => {
    const { error } = await supabase
        .from('client_vitals')
        .delete()
        .eq('id', vitalId);

    if (error) throw error;
};
