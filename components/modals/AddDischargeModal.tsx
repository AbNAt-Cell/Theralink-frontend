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

interface AddDischargeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: DischargeFormData) => Promise<void>;
}

export interface DischargeFormData {
    dischargeDate: string;
    linkDocument: string;
    clientStatus: string;
    reasonOfDischarge: string;
    deactivateClient: boolean;
    dischargeSummary: string;
}

const clientStatusOptions = [
    'Active',
    'Inactive',
    'On Hold',
    'Pending Review',
    'Discharged'
];

const dischargeReasonOptions = [
    'Treatment Completed',
    'Goals Met',
    'Client Request',
    'Moved Out of Area',
    'Insurance/Financial Issues',
    'Non-Compliance',
    'Referred to Another Provider',
    'Lost to Follow-up',
    'Hospitalization',
    'Death',
    'Other'
];

export default function AddDischargeModal({
    isOpen,
    onClose,
    onSave
}: AddDischargeModalProps) {
    const [loading, setLoading] = useState(false);
    const [dischargeDate, setDischargeDate] = useState('');
    const [linkDocument, setLinkDocument] = useState('');
    const [clientStatus, setClientStatus] = useState('');
    const [reasonOfDischarge, setReasonOfDischarge] = useState('');
    const [deactivateClient, setDeactivateClient] = useState(true);
    const [dischargeSummary, setDischargeSummary] = useState('');

    const resetForm = () => {
        setDischargeDate('');
        setLinkDocument('');
        setClientStatus('');
        setReasonOfDischarge('');
        setDeactivateClient(true);
        setDischargeSummary('');
    };

    const handleSubmit = async () => {
        if (!dischargeDate) {
            alert('Please enter a discharge date');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                dischargeDate,
                linkDocument,
                clientStatus,
                reasonOfDischarge,
                deactivateClient,
                dischargeSummary
            });
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error saving discharge:', error);
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
                    <DialogTitle>Add Discharge</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Row 1: Discharge Date, Link Document */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Discharge Date</Label>
                            <Input
                                type="date"
                                value={dischargeDate}
                                onChange={(e) => setDischargeDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Link Document</Label>
                            <Input
                                value={linkDocument}
                                onChange={(e) => setLinkDocument(e.target.value)}
                                placeholder="Link Document"
                            />
                        </div>
                    </div>

                    {/* Row 2: Client Status, Reason of Discharge */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Client Status</Label>
                            <Select value={clientStatus} onValueChange={setClientStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clientStatusOptions.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Reason of Discharge</Label>
                            <Select value={reasonOfDischarge} onValueChange={setReasonOfDischarge}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Reason of Discharge" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dischargeReasonOptions.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Deactivate Client Checkbox */}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="deactivateClient"
                            checked={deactivateClient}
                            onCheckedChange={(checked) => setDeactivateClient(checked === true)}
                        />
                        <Label htmlFor="deactivateClient" className="cursor-pointer">Deactivate Client</Label>
                    </div>

                    {/* Discharge Summary */}
                    <div>
                        <Label>Discharge summary</Label>
                        <div className="border rounded-md mt-1">
                            {/* Simple toolbar mimicking rich text editor */}
                            <div className="flex items-center gap-1 p-2 border-b bg-gray-50 flex-wrap">
                                <button className="px-2 py-1 hover:bg-gray-200 rounded font-bold">B</button>
                                <button className="px-2 py-1 hover:bg-gray-200 rounded italic">I</button>
                                <button className="px-2 py-1 hover:bg-gray-200 rounded underline">U</button>
                                <span className="w-px h-4 bg-gray-300 mx-1"></span>
                                <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm">←</button>
                                <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm">→</button>
                                <span className="w-px h-4 bg-gray-300 mx-1"></span>
                                <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm">🔗</button>
                                <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm">⛓</button>
                                <span className="w-px h-4 bg-gray-300 mx-1"></span>
                                <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm">≡</button>
                                <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm">≡</button>
                                <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm">≡</button>
                                <span className="w-px h-4 bg-gray-300 mx-1"></span>
                                <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm">1.</button>
                                <button className="px-2 py-1 hover:bg-gray-200 rounded text-sm">•</button>
                            </div>
                            <Textarea
                                value={dischargeSummary}
                                onChange={(e) => setDischargeSummary(e.target.value)}
                                placeholder="Enter discharge summary..."
                                rows={8}
                                className="border-0 focus-visible:ring-0"
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
                            Discharge
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
