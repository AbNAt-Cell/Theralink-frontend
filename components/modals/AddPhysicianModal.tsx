'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from 'lucide-react';

interface AddPhysicianModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PhysicianFormData) => Promise<void>;
}

export interface PhysicianFormData {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    comment: string;
}

export default function AddPhysicianModal({
    isOpen,
    onClose,
    onSave
}: AddPhysicianModalProps) {
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [comment, setComment] = useState('');

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setPhone('');
        setAddress('');
        setComment('');
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
                phone: phone.trim(),
                address: address.trim(),
                comment: comment.trim()
            });
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error saving physician:', error);
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
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-blue-800">Physician</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Row 1: First Name, Last Name, Phone */}
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
                            <Label>Phone #</Label>
                            <Input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Phone #"
                                type="tel"
                            />
                        </div>
                    </div>

                    {/* Row 2: Address, Comment */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Address</Label>
                            <Input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Address"
                            />
                        </div>
                        <div>
                            <Label>Comment</Label>
                            <Input
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Comment"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-blue-900 hover:bg-blue-800"
                        >
                            {loading && <Loader className="w-4 h-4 animate-spin mr-2" />}
                            Add Physician
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
