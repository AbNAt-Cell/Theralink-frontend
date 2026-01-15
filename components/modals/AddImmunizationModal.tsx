'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader } from 'lucide-react';

interface AddImmunizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ImmunizationFormData) => Promise<void>;
}

export interface ImmunizationFormData {
    immunization: string;
    dateAdministered: string;
    administrationedBy: string;
    dateExpiration: string;
    amountAdministered: string;
    manufacturer: string;
    lotNumber: string;
    administrationSite: string;
    administrationRoute: string;
    isRejected: boolean;
    rejectedReason: string;
    comments: string;
}

const immunizationOptions = [
    'COVID-19 Vaccine',
    'Influenza (Flu)',
    'Hepatitis A',
    'Hepatitis B',
    'MMR (Measles, Mumps, Rubella)',
    'Tdap (Tetanus, Diphtheria, Pertussis)',
    'Varicella (Chickenpox)',
    'HPV',
    'Pneumococcal',
    'Meningococcal',
    'Shingles (Zoster)',
    'Polio',
    'Other'
];

const administrationSiteOptions = [
    'Left Arm (Deltoid)',
    'Right Arm (Deltoid)',
    'Left Thigh',
    'Right Thigh',
    'Left Gluteal',
    'Right Gluteal',
    'Subcutaneous',
    'Other'
];

const administrationRouteOptions = [
    'Intramuscular (IM)',
    'Subcutaneous (SC)',
    'Intradermal (ID)',
    'Oral',
    'Nasal',
    'Other'
];

const manufacturerOptions = [
    'Pfizer',
    'Moderna',
    'Johnson & Johnson',
    'AstraZeneca',
    'Sanofi',
    'Merck',
    'GlaxoSmithKline',
    'Novavax',
    'Other'
];

export default function AddImmunizationModal({
    isOpen,
    onClose,
    onSave
}: AddImmunizationModalProps) {
    const [loading, setLoading] = useState(false);
    const [immunization, setImmunization] = useState('');
    const [dateAdministered, setDateAdministered] = useState('');
    const [administrationedBy, setAdministrationedBy] = useState('');
    const [dateExpiration, setDateExpiration] = useState('');
    const [amountAdministered, setAmountAdministered] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [lotNumber, setLotNumber] = useState('');
    const [administrationSite, setAdministrationSite] = useState('');
    const [administrationRoute, setAdministrationRoute] = useState('');
    const [isRejected, setIsRejected] = useState(false);
    const [rejectedReason, setRejectedReason] = useState('');
    const [comments, setComments] = useState('');

    const resetForm = () => {
        setImmunization('');
        setDateAdministered('');
        setAdministrationedBy('');
        setDateExpiration('');
        setAmountAdministered('');
        setManufacturer('');
        setLotNumber('');
        setAdministrationSite('');
        setAdministrationRoute('');
        setIsRejected(false);
        setRejectedReason('');
        setComments('');
    };

    const handleSubmit = async () => {
        if (!immunization) {
            alert('Please select an immunization');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                immunization,
                dateAdministered,
                administrationedBy,
                dateExpiration,
                amountAdministered,
                manufacturer,
                lotNumber,
                administrationSite,
                administrationRoute,
                isRejected,
                rejectedReason,
                comments
            });
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error saving immunization:', error);
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-blue-800">Add Immunization</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Row 1: Immunization, Date Administered, Administrationed By */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Immunization</Label>
                            <Select value={immunization} onValueChange={setImmunization}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Immunization" />
                                </SelectTrigger>
                                <SelectContent>
                                    {immunizationOptions.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Date Administered</Label>
                            <Input
                                type="date"
                                value={dateAdministered}
                                onChange={(e) => setDateAdministered(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Administrationed By</Label>
                            <Select value={administrationedBy} onValueChange={setAdministrationedBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Administrationed By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="physician">Physician</SelectItem>
                                    <SelectItem value="nurse">Nurse</SelectItem>
                                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 2: Date Expiration, Amount Administered, Manufacturer */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Date Expiration</Label>
                            <Input
                                type="date"
                                value={dateExpiration}
                                onChange={(e) => setDateExpiration(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Amount Administered (mL)</Label>
                            <Input
                                value={amountAdministered}
                                onChange={(e) => setAmountAdministered(e.target.value)}
                                placeholder="Amount Administered (mL)"
                            />
                        </div>
                        <div>
                            <Label>Manufacturer</Label>
                            <Select value={manufacturer} onValueChange={setManufacturer}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Manufacturer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {manufacturerOptions.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 3: Lot Number, Administration Site, Administration Route */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Lot Number</Label>
                            <Input
                                value={lotNumber}
                                onChange={(e) => setLotNumber(e.target.value)}
                                placeholder="Lot Number"
                            />
                        </div>
                        <div>
                            <Label>Administration Site</Label>
                            <Select value={administrationSite} onValueChange={setAdministrationSite}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Administration Site" />
                                </SelectTrigger>
                                <SelectContent>
                                    {administrationSiteOptions.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Administration Route</Label>
                            <Select value={administrationRoute} onValueChange={setAdministrationRoute}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Administration Route" />
                                </SelectTrigger>
                                <SelectContent>
                                    {administrationRouteOptions.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Is Rejected Checkbox */}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="isRejected"
                            checked={isRejected}
                            onCheckedChange={(checked) => setIsRejected(checked === true)}
                        />
                        <Label htmlFor="isRejected" className="cursor-pointer">Is Rejected</Label>
                    </div>

                    {/* Rejected Reason (only shown if rejected) */}
                    {isRejected && (
                        <div className="max-w-md">
                            <Label>Rejected Reason</Label>
                            <Input
                                value={rejectedReason}
                                onChange={(e) => setRejectedReason(e.target.value)}
                                placeholder="Rejected Reason"
                            />
                        </div>
                    )}

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
                            Add
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
