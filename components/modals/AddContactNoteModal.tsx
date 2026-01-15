'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader } from 'lucide-react';
import { getAvailableStaff, AvailableStaff } from '@/hooks/admin/client-pages';

interface AddContactNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ContactNoteFormData) => Promise<void>;
}

export interface ContactNoteFormData {
    staffId: string;
    staffName: string;
    contacted: string;
    direction: 'outgoing' | 'incoming';
    dateOfContact: string;
    timeOfContact: string;
    methodOfContact: string;
    contactNote: string;
}

const contactedOptions = [
    'Client',
    'Father',
    'Mother',
    'Guardian',
    'Spouse',
    'Sibling',
    'Other Family Member',
    'Insurance Company',
    'Physician',
    'School',
    'Agency',
    'Other'
];

const methodOptions = [
    'In Person',
    'Phone Call',
    'Video Call',
    'Email',
    'Text Message',
    'Fax',
    'Mail',
    'Other'
];

export default function AddContactNoteModal({
    isOpen,
    onClose,
    onSave
}: AddContactNoteModalProps) {
    const [loading, setLoading] = useState(false);
    const [staffList, setStaffList] = useState<AvailableStaff[]>([]);
    const [showInactiveStaff, setShowInactiveStaff] = useState(false);

    const [staffId, setStaffId] = useState('');
    const [contacted, setContacted] = useState('');
    const [direction, setDirection] = useState<'outgoing' | 'incoming'>('outgoing');
    const [dateOfContact, setDateOfContact] = useState('');
    const [timeOfContact, setTimeOfContact] = useState('');
    const [methodOfContact, setMethodOfContact] = useState('');
    const [contactNote, setContactNote] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadStaff();
            // Set default date to today
            setDateOfContact(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen]);

    const loadStaff = async () => {
        try {
            const staff = await getAvailableStaff();
            setStaffList(staff);
        } catch (error) {
            console.error('Error loading staff:', error);
        }
    };

    const resetForm = () => {
        setStaffId('');
        setContacted('');
        setDirection('outgoing');
        setDateOfContact('');
        setTimeOfContact('');
        setMethodOfContact('');
        setContactNote('');
    };

    const handleSubmit = async () => {
        if (!staffId || !contacted || !dateOfContact) {
            alert('Please fill in all required fields');
            return;
        }

        const selectedStaff = staffList.find(s => s.id === staffId);
        const staffName = selectedStaff
            ? `${selectedStaff.firstName || ''} ${selectedStaff.lastName || ''}`.trim()
            : '';

        setLoading(true);
        try {
            await onSave({
                staffId,
                staffName,
                contacted,
                direction,
                dateOfContact,
                timeOfContact,
                methodOfContact,
                contactNote
            });
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error saving contact note:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Contact Note</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Row 1: Staff with toggle, Contacted */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <Label>Staff</Label>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={showInactiveStaff}
                                        onCheckedChange={setShowInactiveStaff}
                                    />
                                    <span className="text-xs text-gray-500">Show Inactive Staff</span>
                                </div>
                            </div>
                            <Select value={staffId} onValueChange={setStaffId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Staff" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staffList.map(staff => (
                                        <SelectItem key={staff.id} value={staff.id}>
                                            {staff.firstName} {staff.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Contacted</Label>
                            <Select value={contacted} onValueChange={setContacted}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Contacted" />
                                </SelectTrigger>
                                <SelectContent>
                                    {contactedOptions.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Direction: Outgoing / Incoming */}
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="direction"
                                checked={direction === 'outgoing'}
                                onChange={() => setDirection('outgoing')}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span>Outgoing</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="direction"
                                checked={direction === 'incoming'}
                                onChange={() => setDirection('incoming')}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span>Incoming</span>
                        </label>
                    </div>

                    {/* Row 2: Date, Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Date of Contact</Label>
                            <Input
                                type="date"
                                value={dateOfContact}
                                onChange={(e) => setDateOfContact(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Time of Contact</Label>
                            <Input
                                type="time"
                                value={timeOfContact}
                                onChange={(e) => setTimeOfContact(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Method of Contact */}
                    <div>
                        <Label>Method of Contact</Label>
                        <Select value={methodOfContact} onValueChange={setMethodOfContact}>
                            <SelectTrigger>
                                <SelectValue placeholder="Method of Contact" />
                            </SelectTrigger>
                            <SelectContent>
                                {methodOptions.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Contact Note */}
                    <div>
                        <Label>Contact note</Label>
                        <Textarea
                            value={contactNote}
                            onChange={(e) => setContactNote(e.target.value)}
                            placeholder="Enter contact note..."
                            rows={5}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-blue-900 hover:bg-blue-800"
                        >
                            {loading && <Loader className="w-4 h-4 animate-spin mr-2" />}
                            Add
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
