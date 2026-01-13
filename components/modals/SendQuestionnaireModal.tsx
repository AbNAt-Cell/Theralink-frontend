'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, Mail, CheckCircle } from 'lucide-react';
import { questionnaireTemplates } from '@/lib/questionnaire-templates';

interface SendQuestionnaireModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientName: string;
    clientEmail: string;
    onSend: (templateId: string, templateName: string) => Promise<void>;
}

export default function SendQuestionnaireModal({
    isOpen,
    onClose,
    clientName,
    clientEmail,
    onSend
}: SendQuestionnaireModalProps) {
    const [loading, setLoading] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        if (!selectedTemplateId) {
            alert('Please select a questionnaire to send');
            return;
        }

        const template = questionnaireTemplates.find(t => t.id === selectedTemplateId);
        if (!template) return;

        setLoading(true);
        try {
            await onSend(selectedTemplateId, template.name);
            setSent(true);
            setTimeout(() => {
                setSent(false);
                setSelectedTemplateId('');
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Error sending questionnaire:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSent(false);
        setSelectedTemplateId('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-600" />
                        Send Questionnaire to Client
                    </DialogTitle>
                </DialogHeader>

                {sent ? (
                    <div className="py-8 flex flex-col items-center justify-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <p className="text-lg font-medium text-green-700">Questionnaire Sent!</p>
                        <p className="text-gray-500 text-sm mt-1">Email sent to {clientEmail}</p>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <strong>Sending to:</strong> {clientName}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Email:</strong> {clientEmail}
                            </p>
                        </div>

                        <div>
                            <Label>Select Questionnaire</Label>
                            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a questionnaire to send" />
                                </SelectTrigger>
                                <SelectContent>
                                    {questionnaireTemplates
                                        .filter(t => t.id !== 'custom')
                                        .map(template => (
                                            <SelectItem key={template.id} value={template.id}>
                                                {template.shortName} - {template.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedTemplateId && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    The client will receive an email with a link to complete the{' '}
                                    <strong>
                                        {questionnaireTemplates.find(t => t.id === selectedTemplateId)?.name}
                                    </strong>{' '}
                                    questionnaire.
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4 border-t">
                            <Button
                                onClick={handleSend}
                                disabled={loading || !selectedTemplateId}
                                className="bg-blue-900 hover:bg-blue-800"
                            >
                                {loading ? (
                                    <Loader className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Mail className="w-4 h-4 mr-2" />
                                )}
                                Send Questionnaire
                            </Button>
                            <Button variant="outline" onClick={handleClose} disabled={loading}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
