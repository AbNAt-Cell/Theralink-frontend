'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';

export function useDashboardData() {
    const { user } = useUser();
    const supabase = createClient();
    const [data, setData] = useState({
        appointments: [] as any[],
        loggedInStaff: [] as any[],
        billingInfo: null as any,
        clientsByStatus: [] as any[],
        pendingDocuments: [] as any[],
        loading: true,
        error: null as any,
    });

    const fetchData = async () => {
        if (!user?.clinicId) return;

        setData(prev => ({ ...prev, loading: true }));

        try {
            const today = new Date().toISOString().split('T')[0];

            // Fetch Today's Appointments with Profile Join
            const { data: appointments, error: apptError } = await supabase
                .from('appointments')
                .select(`
          *,
          client:profiles!client_id(first_name, last_name),
          staff:profiles!staff_id(first_name, last_name)
        `)
                .eq('clinic_id', user.clinicId)
                .eq('appointment_date', today);

            if (apptError) throw apptError;

            // Fetch Logged in Staff (Simplified: all staff in clinic for now)
            const { data: staff, error: staffError } = await supabase
                .from('profiles')
                .select('*')
                .eq('clinic_id', user.clinicId)
                .in('role', ['ADMIN', 'STAFF']);

            if (staffError) throw staffError;

            // Fetch Billing Info
            const { data: billing, error: billingError } = await supabase
                .from('billing_records')
                .select('*')
                .eq('clinic_id', user.clinicId)
                .single();

            // Fetch Clients by Status Grouping
            const { data: clients, error: clientError } = await supabase
                .from('profiles')
                .select('role, last_name')
                .eq('clinic_id', user.clinicId)
                .eq('role', 'CLIENT');

            if (clientError) throw clientError;

            // Fetch Pending Documents
            const { data: documents, error: docError } = await supabase
                .from('documents')
                .select(`
          *,
          client:profiles!client_id(first_name, last_name),
          staff:profiles!staff_id(first_name, last_name)
        `)
                .eq('clinic_id', user.clinicId)
                .eq('status', 'PENDING');

            if (docError) throw docError;

            setData({
                appointments: appointments || [],
                loggedInStaff: staff || [],
                billingInfo: billing || {
                    total_amount_collected: 0,
                    submissions_count: 0,
                    claims_count: 0,
                    documents_billed_count: 0,
                },
                clientsByStatus: clients || [],
                pendingDocuments: documents || [],
                loading: false,
                error: null,
            });
        } catch (err: any) {
            console.error('Error fetching dashboard data:', err);
            setData(prev => ({ ...prev, loading: false, error: err }));
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.clinicId]);

    return { ...data, refresh: fetchData };
}
