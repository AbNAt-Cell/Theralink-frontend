'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';

export interface Diagnosis {
    id: string;
    date: string;
    diagnosis: string;
    provider: string;
    dxCode: string;
    notes?: string;
}

export function useClientDiagnoses() {
    const { user } = useUser();
    const supabase = createClient();
    
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchDiagnoses = async () => {
        if (!user || user.role !== 'CLIENT') {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch All Diagnoses for this Client
            const { data, error: fetchError } = await supabase
                .from('client_diagnoses')
                .select(`
                    id,
                    diagnosis_date,
                    diagnosis_name,
                    icd10_code,
                    notes,
                    provider:profiles!created_by(first_name, last_name)
                `)
                .eq('client_id', user.id)
                .order('diagnosis_date', { ascending: false });

            if (fetchError) throw fetchError;

            // Transform data to Diagnosis format expected by the table
            const mappedDiagnoses: Diagnosis[] = (data || []).map((dx: any) => {
                // Unwrap relations if returned as arrays
                const providerObj = Array.isArray(dx.provider) ? dx.provider[0] || {} : dx.provider || {};
                const providerName = providerObj.first_name ? `${providerObj.first_name} ${providerObj.last_name}` : 'Unknown Provider';

                return {
                    id: dx.id,
                    date: dx.diagnosis_date,
                    diagnosis: dx.diagnosis_name,
                    dxCode: dx.icd10_code,
                    provider: providerName,
                    notes: dx.notes,
                };
            });

            setDiagnoses(mappedDiagnoses);
        } catch (err: any) {
            console.error('Error fetching client diagnoses data:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchDiagnoses();
        }
    }, [user?.id]);

    return { diagnoses, loading, error, refresh: fetchDiagnoses };
}
