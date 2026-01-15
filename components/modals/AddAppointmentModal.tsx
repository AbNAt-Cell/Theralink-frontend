'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Calendar, Clock, User, Users } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/Partials/use-toast';
import { useAppointmentNotifications } from '@/hooks/useAppointmentNotifications';

interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

interface AddAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const APPOINTMENT_TYPES = [
    'Initial Evaluation',
    'Therapy Session',
    'Follow-up',
    'Assessment',
    'Progress Review',
    'Family Session',
    'Group Session',
    'Consultation',
    'Discharge Planning',
    'Other'
];

export default function AddAppointmentModal({ isOpen, onClose, onSuccess }: AddAppointmentModalProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const supabase = createClient();
    const { createAppointmentWithNotification } = useAppointmentNotifications();

    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Profile[]>([]);
    const [staff, setStaff] = useState<Profile[]>([]);
    const [loadingProfiles, setLoadingProfiles] = useState(true);

    const [formData, setFormData] = useState({
        clientId: '',
        staffId: '',
        appointmentDate: '',
        appointmentTime: '',
        appointmentType: '',
        location: '',
        notes: '',
    });

    useEffect(() => {
        if (isOpen && user?.clinicId) {
            fetchProfiles();
        }
    }, [isOpen, user?.clinicId]);

    const fetchProfiles = async () => {
        if (!user?.clinicId) return;
        setLoadingProfiles(true);

        try {
            // Fetch clients
            const { data: clientData } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, email, role')
                .eq('clinic_id', user.clinicId)
                .eq('role', 'CLIENT')
                .order('first_name');

            // Fetch staff
            const { data: staffData } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, email, role')
                .eq('clinic_id', user.clinicId)
                .in('role', ['ADMIN', 'STAFF'])
                .order('first_name');

            setClients(clientData || []);
            setStaff(staffData || []);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoadingProfiles(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.clientId || !formData.staffId || !formData.appointmentDate || !formData.appointmentTime || !formData.appointmentType) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please fill in all required fields.',
            });
            return;
        }

        setLoading(true);

        try {
            const result = await createAppointmentWithNotification({
                clientId: formData.clientId,
                staffId: formData.staffId,
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                appointmentType: formData.appointmentType,
                location: formData.location,
            });

            toast({
                title: 'Appointment Created!',
                description: `Notifications: Email ${result.notifications.email.success ? '✓' : '✗'}, Message ${result.notifications.message.success ? '✓' : '✗'}`,
            });

            // Reset form
            setFormData({
                clientId: '',
                staffId: '',
                appointmentDate: '',
                appointmentTime: '',
                appointmentType: '',
                location: '',
                notes: '',
            });

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error creating appointment:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create appointment. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Add New Appointment
                    </DialogTitle>
                    <DialogDescription>
                        Schedule a new appointment and notify the client via email and messenger.
                    </DialogDescription>
                </DialogHeader>

                {loadingProfiles ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Client Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="client" className="flex items-center gap-1">
                                <User className="w-4 h-4" /> Client *
                            </Label>
                            <Select
                                value={formData.clientId}
                                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.id}>
                                            {client.first_name} {client.last_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Staff Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="staff" className="flex items-center gap-1">
                                <Users className="w-4 h-4" /> Staff Member *
                            </Label>
                            <Select
                                value={formData.staffId}
                                onValueChange={(value) => setFormData({ ...formData, staffId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staff.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.first_name} {s.last_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date" className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> Date *
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.appointmentDate}
                                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time" className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> Time *
                                </Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.appointmentTime}
                                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Appointment Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type">Appointment Type *</Label>
                            <Select
                                value={formData.appointmentType}
                                onValueChange={(value) => setFormData({ ...formData, appointmentType: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {APPOINTMENT_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                placeholder="e.g., Office A, Telehealth, Room 101"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Optional notes about the appointment..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={2}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Appointment'
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
