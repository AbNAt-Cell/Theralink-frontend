'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader } from 'lucide-react';

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ContactFormData) => Promise<void>;
}

export interface ContactFormData {
    firstName: string;
    lastName: string;
    relationship: string;
    phoneNo: string;
    address: string;
    city: string;
    state: string;
    comments: string;
    isEmergencyContact: boolean;
    isAuthorizedContact: boolean;
    canPickup: boolean;
}

const relationshipOptions = [
    'Parent',
    'Guardian',
    'Spouse',
    'Sibling',
    'Child',
    'Grandparent',
    'Aunt/Uncle',
    'Cousin',
    'Friend',
    'Caregiver',
    'Case Manager',
    'Other'
];

const stateOptions = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
];

export default function AddContactModal({
    isOpen,
    onClose,
    onSave
}: AddContactModalProps) {
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [comments, setComments] = useState('');
    const [isEmergencyContact, setIsEmergencyContact] = useState(false);
    const [isAuthorizedContact, setIsAuthorizedContact] = useState(false);
    const [canPickup, setCanPickup] = useState(false);

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setRelationship('');
        setPhoneNo('');
        setAddress('');
        setCity('');
        setState('');
        setComments('');
        setIsEmergencyContact(false);
        setIsAuthorizedContact(false);
        setCanPickup(false);
    };

    const handleSubmit = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            alert('Please enter first and last name');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                relationship,
                phoneNo: phoneNo.trim(),
                address: address.trim(),
                city: city.trim(),
                state,
                comments: comments.trim(),
                isEmergencyContact,
                isAuthorizedContact,
                canPickup
            });
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error saving contact:', error);
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-blue-800">Parent/Guardian</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Row 1: First Name, Last Name, Relationship */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>First Name</Label>
                            <Input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                            />
                        </div>
                        <div>
                            <Label>Last Name</Label>
                            <Input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                            />
                        </div>
                        <div>
                            <Label>Relationship to Client</Label>
                            <Select value={relationship} onValueChange={setRelationship}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Relation" />
                                </SelectTrigger>
                                <SelectContent>
                                    {relationshipOptions.map(rel => (
                                        <SelectItem key={rel} value={rel.toLowerCase()}>
                                            {rel}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 2: Phone, Address, City */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Phone No.</Label>
                            <Input
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                placeholder="Phone No."
                                type="tel"
                            />
                        </div>
                        <div>
                            <Label>Address</Label>
                            <Input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Address"
                            />
                        </div>
                        <div>
                            <Label>City</Label>
                            <Input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                            />
                        </div>
                    </div>

                    {/* Row 3: State */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>State</Label>
                            <Select value={state} onValueChange={setState}>
                                <SelectTrigger>
                                    <SelectValue placeholder="State" />
                                </SelectTrigger>
                                <SelectContent>
                                    {stateOptions.map(st => (
                                        <SelectItem key={st} value={st}>
                                            {st}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-3 gap-4 pt-2">
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={isEmergencyContact}
                                onCheckedChange={setIsEmergencyContact}
                            />
                            <Label>Emergency Contact</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={isAuthorizedContact}
                                onCheckedChange={setIsAuthorizedContact}
                            />
                            <Label>Authorized Contact</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={canPickup}
                                onCheckedChange={setCanPickup}
                            />
                            <Label>Can Pick Up</Label>
                        </div>
                    </div>

                    {/* Comments */}
                    <div>
                        <Label>Comments</Label>
                        <Textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Comments..."
                            rows={4}
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
                            Add Guardian
                        </Button>
                        <Button variant="outline" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
