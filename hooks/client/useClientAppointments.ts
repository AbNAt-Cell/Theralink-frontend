'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';
import { Event } from '@/types/calendar';

export function useClientAppointments() {
    const { user } = useUser();
    const supabase = createClient();
    
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchAppointments = async () => {
        if (!user || user.role !== 'CLIENT') {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch All Appointments for this Client
            const { data: appointments, error: fetchError } = await supabase
                .from('appointments')
                .select(`
                    id,
                    appointment_date,
                    appointment_time,
                    appointment_type,
                    status,
                    location,
                    clinic:clinics!clinic_id(name),
                    staff:profiles!staff_id(first_name, last_name)
                `)
                .eq('client_id', user.id)
                .order('appointment_date', { ascending: true });

            if (fetchError) throw fetchError;

            // Transform appointments to Event format expected by the calendar
            const calendarEvents: Event[] = (appointments || []).map((appt: any) => {
                // Unwrap relations if returned as arrays
                const staffObj = Array.isArray(appt.staff) ? appt.staff[0] || {} : appt.staff || {};
                const providerName = staffObj.first_name ? `${staffObj.first_name} ${staffObj.last_name}` : 'Provider';

                // Map appointment type to fullcalendar event type
                let eventType: Event['type'] = 'client-meeting';
                if (appt.appointment_type?.toLowerCase().includes('consultation')) {
                    eventType = 'general-meeting';
                }

                // Parse out location (if physical, use the string, if virtual, default to online)
                const locationStr = appt.location || 'Online Session';

                return {
                    id: appt.id,
                    title: `${appt.appointment_type || 'Session'} with ${providerName}`,
                    date: appt.appointment_date,
                    time: appt.appointment_time || '09:00 AM',
                    location: locationStr,
                    type: eventType,
                };
            });

            setEvents(calendarEvents);
        } catch (err: any) {
            console.error('Error fetching client calendar data:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchAppointments();
        }
    }, [user?.id]);

    return { events, loading, error, refresh: fetchAppointments };
}
