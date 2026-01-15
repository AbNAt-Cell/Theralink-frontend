'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';
import { Event } from '@/types/calendar';

interface Appointment {
    id: string;
    appointment_date: string;
    appointment_time: string;
    appointment_type: string;
    status: string;
    location?: string;
    notes?: string;
    client: {
        id: string;
        first_name: string;
        last_name: string;
    };
    staff: {
        id: string;
        first_name: string;
        last_name: string;
    };
}

export function useCalendarData() {
    const { user } = useUser();
    const supabase = createClient();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user?.clinicId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Fetch appointments for current month and next 3 months
                const today = new Date();
                const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                const endDate = new Date(today.getFullYear(), today.getMonth() + 4, 0);

                const { data: appointments, error: fetchError } = await supabase
                    .from('appointments')
                    .select(`
            id,
            appointment_date,
            appointment_time,
            appointment_type,
            status,
            location,
            notes,
            client:profiles!client_id(id, first_name, last_name),
            staff:profiles!staff_id(id, first_name, last_name)
          `)
                    .eq('clinic_id', user.clinicId)
                    .gte('appointment_date', startDate.toISOString().split('T')[0])
                    .lte('appointment_date', endDate.toISOString().split('T')[0])
                    .order('appointment_date', { ascending: true });

                if (fetchError) throw fetchError;

                // Transform appointments to Event format
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const calendarEvents: Event[] = (appointments || []).map((appt: any) => {
                    const clientName = appt.client
                        ? `${appt.client.first_name} ${appt.client.last_name}`
                        : 'Unknown Client';
                    const staffName = appt.staff
                        ? `${appt.staff.first_name} ${appt.staff.last_name}`
                        : 'Unassigned';

                    // Map appointment type to event type
                    let eventType: Event['type'] = 'client-meeting';
                    const apptType = appt.appointment_type?.toLowerCase() || '';
                    if (apptType.includes('staff') || apptType.includes('team')) {
                        eventType = 'staff-meeting';
                    } else if (apptType.includes('general') || apptType.includes('admin')) {
                        eventType = 'general-meeting';
                    }

                    return {
                        id: appt.id,
                        title: `${clientName} - ${appt.appointment_type || 'Appointment'}`,
                        date: appt.appointment_date,
                        time: appt.appointment_time || '9:00 AM',
                        location: appt.location || `With ${staffName}`,
                        type: eventType,
                    };
                });

                setEvents(calendarEvents);
            } catch (err: unknown) {
                console.error('Error fetching calendar data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load calendar');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [user?.clinicId, supabase]);

    return { events, loading, error };
}
