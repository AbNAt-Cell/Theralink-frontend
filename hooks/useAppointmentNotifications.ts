'use client';

import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';
import { contactMessage, sendMessage } from '@/hooks/messages';

interface AppointmentData {
    id?: string;
    clientId: string;
    staffId: string;
    appointmentDate: string;
    appointmentTime: string;
    appointmentType: string;
    location?: string;
    status?: string;
}

interface NotificationResult {
    email: { success: boolean; error?: string };
    message: { success: boolean; error?: string };
}

export function useAppointmentNotifications() {
    const { user } = useUser();
    const supabase = createClient();

    // Get client and staff details from profile IDs
    const getProfileDetails = async (profileId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email')
            .eq('id', profileId)
            .single();

        if (error) throw error;
        return data;
    };

    // Notify client when appointment is booked
    const notifyAppointmentBooked = async (appointment: AppointmentData): Promise<NotificationResult> => {
        const result: NotificationResult = {
            email: { success: false },
            message: { success: false }
        };

        try {
            // Get client and staff details
            const [client, staff] = await Promise.all([
                getProfileDetails(appointment.clientId),
                getProfileDetails(appointment.staffId)
            ]);

            const clientName = `${client.first_name} ${client.last_name}`;
            const staffName = `${staff.first_name} ${staff.last_name}`;

            // 1. Send Email Notification
            try {
                const emailResponse = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'confirmation',
                        clientEmail: client.email,
                        clientName,
                        staffName,
                        appointmentDate: appointment.appointmentDate,
                        appointmentTime: appointment.appointmentTime,
                        appointmentType: appointment.appointmentType,
                        location: appointment.location || 'To be confirmed',
                    }),
                });

                if (emailResponse.ok) {
                    result.email = { success: true };
                } else {
                    const error = await emailResponse.json();
                    result.email = { success: false, error: error.message };
                }
            } catch (emailError) {
                result.email = { success: false, error: String(emailError) };
            }

            // 2. Send Platform Message
            try {
                // Get or create conversation with client
                const conversationId = await contactMessage(appointment.clientId);

                if (conversationId) {
                    const messageText = `📅 **Appointment Scheduled**\n\n` +
                        `Your appointment has been booked:\n` +
                        `• **Date:** ${appointment.appointmentDate}\n` +
                        `• **Time:** ${appointment.appointmentTime}\n` +
                        `• **Type:** ${appointment.appointmentType}\n` +
                        `• **With:** ${staffName}\n` +
                        `• **Location:** ${appointment.location || 'To be confirmed'}\n\n` +
                        `If you need to reschedule, please contact us.`;

                    await sendMessage(conversationId, messageText, 'text', '');
                    result.message = { success: true };
                }
            } catch (messageError) {
                result.message = { success: false, error: String(messageError) };
            }

            return result;
        } catch (error) {
            console.error('Error notifying appointment:', error);
            throw error;
        }
    };

    // Create appointment and send notifications
    const createAppointmentWithNotification = async (appointment: AppointmentData): Promise<{ appointmentId: string; notifications: NotificationResult }> => {
        if (!user?.clinicId) throw new Error('No clinic found');

        // Insert appointment into database
        const { data: newAppointment, error } = await supabase
            .from('appointments')
            .insert({
                clinic_id: user.clinicId,
                client_id: appointment.clientId,
                staff_id: appointment.staffId,
                appointment_date: appointment.appointmentDate,
                appointment_time: appointment.appointmentTime,
                appointment_type: appointment.appointmentType,
                location: appointment.location,
                status: appointment.status || 'SCHEDULED',
            })
            .select()
            .single();

        if (error) throw error;

        // Send notifications
        const notifications = await notifyAppointmentBooked({
            ...appointment,
            id: newAppointment.id,
        });

        return {
            appointmentId: newAppointment.id,
            notifications,
        };
    };

    // Notify when appointment is cancelled
    const notifyAppointmentCancelled = async (
        appointment: AppointmentData,
        reason?: string
    ): Promise<NotificationResult> => {
        const result: NotificationResult = {
            email: { success: false },
            message: { success: false }
        };

        try {
            const [client, staff] = await Promise.all([
                getProfileDetails(appointment.clientId),
                getProfileDetails(appointment.staffId)
            ]);

            const clientName = `${client.first_name} ${client.last_name}`;
            const staffName = `${staff.first_name} ${staff.last_name}`;

            // Send cancellation email
            try {
                const emailResponse = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'cancellation',
                        clientEmail: client.email,
                        clientName,
                        staffName,
                        appointmentDate: appointment.appointmentDate,
                        appointmentTime: appointment.appointmentTime,
                        appointmentType: appointment.appointmentType,
                        reason,
                    }),
                });

                if (emailResponse.ok) {
                    result.email = { success: true };
                }
            } catch (emailError) {
                result.email = { success: false, error: String(emailError) };
            }

            // Send platform message
            try {
                const conversationId = await contactMessage(appointment.clientId);

                if (conversationId) {
                    const messageText = `❌ **Appointment Cancelled**\n\n` +
                        `Your appointment has been cancelled:\n` +
                        `• **Date:** ${appointment.appointmentDate}\n` +
                        `• **Time:** ${appointment.appointmentTime}\n` +
                        `• **Type:** ${appointment.appointmentType}\n` +
                        (reason ? `• **Reason:** ${reason}\n\n` : '\n') +
                        `Please contact us to reschedule.`;

                    await sendMessage(conversationId, messageText, 'text', '');
                    result.message = { success: true };
                }
            } catch (messageError) {
                result.message = { success: false, error: String(messageError) };
            }

            return result;
        } catch (error) {
            console.error('Error notifying cancellation:', error);
            throw error;
        }
    };

    return {
        notifyAppointmentBooked,
        notifyAppointmentCancelled,
        createAppointmentWithNotification,
    };
}
