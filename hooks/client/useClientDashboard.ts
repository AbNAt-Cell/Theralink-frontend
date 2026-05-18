'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';

export interface DashboardAppointment {
    id: string;
    appointment_date: string;
    appointment_time: string;
    appointment_type: string;
    status: string;
    staff: { first_name: string; last_name: string };
}

export interface DashboardDocument {
    id: string;
    date_of_service: string;
    doc_type: string;
    status: string;
    staff: { first_name: string; last_name: string };
    file_url?: string;
    file_name?: string;
}

export function useClientDashboard() {
    const { user } = useUser();
    const supabase = createClient();
    
    const [data, setData] = useState({
        upcomingAppointments: [] as DashboardAppointment[],
        pendingDocuments: [] as DashboardDocument[],
        completedDocuments: [] as DashboardDocument[],
        loading: true,
        error: null as any,
    });

    const fetchData = async () => {
        if (!user || user.role !== 'CLIENT') {
            setData(prev => ({ ...prev, loading: false }));
            return;
        }

        setData(prev => ({ ...prev, loading: true, error: null }));

        try {
            const today = new Date().toISOString().split('T')[0];

            // 1. Fetch Upcoming Appointments
            const { data: appointments, error: apptError } = await supabase
                .from('appointments')
                .select(`
                    id,
                    appointment_date,
                    appointment_time,
                    appointment_type,
                    status,
                    staff:profiles!staff_id(first_name, last_name)
                `)
                .eq('client_id', user.id)
                .gte('appointment_date', today)
                .order('appointment_date', { ascending: true })
                .limit(5);

            if (apptError) throw apptError;

            // 2. Fetch Documents
            const { data: documents, error: docError } = await supabase
                .from('documents')
                .select(`
                    id,
                    date_of_service,
                    status,
                    doc_type,
                    file_url,
                    file_name,
                    staff:profiles!staff_id(first_name, last_name)
                `)
                .eq('client_id', user.id)
                .order('date_of_service', { ascending: false });

            // Map results to unwrap staff objects if they come back as arrays
            const mappedAppointments: DashboardAppointment[] = (appointments || []).map((appt: any) => ({
                ...appt,
                staff: Array.isArray(appt.staff) ? appt.staff[0] || { first_name: '', last_name: '' } : appt.staff || { first_name: '', last_name: '' }
            }));

            const mappedDocuments: DashboardDocument[] = (documents || []).map((doc: any) => ({
                ...doc,
                staff: Array.isArray(doc.staff) ? doc.staff[0] || { first_name: '', last_name: '' } : doc.staff || { first_name: '', last_name: '' }
            }));

            // Split documents into pending and completed
            const pendingDocs = mappedDocuments.filter(doc => doc.status === 'PENDING' || doc.status === 'NEEDS_SIGNATURE');
            const completedDocs = mappedDocuments.filter(doc => doc.status === 'COMPLETED' || doc.status === 'SIGNED');

            setData({
                upcomingAppointments: mappedAppointments,
                pendingDocuments: pendingDocs,
                completedDocuments: completedDocs,
                loading: false,
                error: null,
            });

        } catch (err: any) {
            console.error('Error fetching client dashboard data:', err);
            setData(prev => ({ ...prev, loading: false, error: err }));
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchData();
        }
    }, [user?.id]);

    return { ...data, refresh: fetchData };
}
