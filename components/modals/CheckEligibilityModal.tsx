'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getPayers, Payer } from '@/hooks/admin/insurance';
import { ClientProfile } from '@/hooks/admin/client';

export interface CheckEligibilityData {
    fromDate: string;
    toDate: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    relationship: string;
    policyNumber: string;
    payerId: string;
}

interface CheckEligibilityModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCheck: (data: CheckEligibilityData) => void;
    initialData?: Partial<ClientProfile> | null;
}

export function CheckEligibilityModal({
    open,
    onOpenChange,
    onCheck,
    initialData,
}: CheckEligibilityModalProps) {
    const [payers, setPayers] = useState<Payer[]>([]);
    const [formData, setFormData] = useState({
        fromDate: '',
        toDate: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        relationship: 'Self',
        policyNumber: '',
        payerId: '',
    });

    useEffect(() => {
        const loadPayers = async () => {
            const data = await getPayers();
            setPayers(data);
        };
        if (open) {
            loadPayers();
            // Prepopulate form
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

            setFormData(prev => ({
                ...prev,
                fromDate: firstDay,
                toDate: lastDay,
                firstName: initialData?.firstName || '',
                lastName: initialData?.lastName || '',
                birthDate: initialData?.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
                gender: initialData?.gender?.toLowerCase() === 'male' ? 'Male' : initialData?.gender?.toLowerCase() === 'female' ? 'Female' : '',
                policyNumber: initialData?.insurance?.policyNumber || '',
                payerId: '', // Ideally try to match payer name if possible
            }));
        }
    }, [open, initialData]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCheck(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Check Eligibility</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-3 gap-4">
                        {/* Row 1: From, To, Last Name */}
                        <div className="space-y-2">
                            <Label>From Date</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={formData.fromDate}
                                    onChange={e => handleChange('fromDate', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>To Date</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={formData.toDate}
                                    onChange={e => handleChange('toDate', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input
                                value={formData.lastName}
                                onChange={e => handleChange('lastName', e.target.value)}
                            />
                        </div>

                        {/* Row 2: First Name, DOB, Gender */}
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input
                                value={formData.firstName}
                                onChange={e => handleChange('firstName', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Birth Date</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={e => handleChange('birthDate', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={val => handleChange('gender', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Row 3: Relationship, Policy, Payer */}
                        <div className="space-y-2">
                            <Label>Relationship</Label>
                            <Select
                                value={formData.relationship}
                                onValueChange={val => handleChange('relationship', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Self">Self</SelectItem>
                                    <SelectItem value="Spouse">Spouse</SelectItem>
                                    <SelectItem value="Child">Child</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Policy#</Label>
                            <Input
                                value={formData.policyNumber}
                                onChange={e => handleChange('policyNumber', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Payer</Label>
                            <Select
                                value={formData.payerId}
                                onValueChange={val => handleChange('payerId', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Payer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {payers.map((payer) => (
                                        <SelectItem key={payer.id} value={payer.id}>{payer.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-start gap-4 pt-4">
                        <Button type="submit" className="bg-blue-900 hover:bg-blue-800 w-24">
                            Check
                        </Button>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-24">
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
