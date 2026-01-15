'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, Save, FileSpreadsheet, FileText } from 'lucide-react';
import { ClientQuestionnaire } from '@/hooks/admin/client-pages';

interface ViewEditQuestionnaireModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: QuestionnaireEditData) => Promise<void>;
    questionnaire: ClientQuestionnaire | null;
    clientName: string;
}

export interface QuestionnaireEditData {
    id: string;
    questionnaireName: string;
    questionnaireType?: string;
    completedDate?: string;
    score?: number;
    status: string;
    notes?: string;
}

export default function ViewEditQuestionnaireModal({
    isOpen,
    onClose,
    onSave,
    questionnaire,
    clientName
}: ViewEditQuestionnaireModalProps) {
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    // Form state
    const [name, setName] = useState(questionnaire?.questionnaireName || '');
    const [type, setType] = useState(questionnaire?.questionnaireType || '');
    const [date, setDate] = useState(questionnaire?.completedDate || '');
    const [score, setScore] = useState<number | undefined>(questionnaire?.score);
    const [status, setStatus] = useState(questionnaire?.status || 'completed');
    const [notes, setNotes] = useState(questionnaire?.notes || '');

    // Update form when questionnaire changes
    useState(() => {
        if (questionnaire) {
            setName(questionnaire.questionnaireName || '');
            setType(questionnaire.questionnaireType || '');
            setDate(questionnaire.completedDate || '');
            setScore(questionnaire.score);
            setStatus(questionnaire.status || 'completed');
            setNotes(questionnaire.notes || '');
        }
    });

    const handleSave = async () => {
        if (!questionnaire) return;

        setLoading(true);
        try {
            await onSave({
                id: questionnaire.id,
                questionnaireName: name,
                questionnaireType: type,
                completedDate: date,
                score,
                status,
                notes
            });
            onClose();
        } catch (error) {
            console.error('Error saving questionnaire:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = async () => {
        if (!questionnaire) return;

        setExporting(true);
        try {
            // Create PDF content
            const content = `
QUESTIONNAIRE REPORT
====================

Client: ${clientName}
Date: ${new Date().toLocaleDateString()}

Questionnaire: ${questionnaire.questionnaireName}
Type: ${questionnaire.questionnaireType || 'N/A'}
Status: ${questionnaire.status}
Completed Date: ${questionnaire.completedDate ? new Date(questionnaire.completedDate).toLocaleDateString() : 'N/A'}
Score: ${questionnaire.score ?? 'N/A'}

Notes:
${questionnaire.notes || 'No notes'}
            `.trim();

            // Create blob and download
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${questionnaire.questionnaireName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } finally {
            setExporting(false);
        }
    };

    const exportToExcel = async () => {
        if (!questionnaire) return;

        setExporting(true);
        try {
            // Create CSV content (can be opened in Excel)
            const headers = ['Field', 'Value'];
            const rows = [
                ['Client', clientName],
                ['Questionnaire', questionnaire.questionnaireName],
                ['Type', questionnaire.questionnaireType || 'N/A'],
                ['Status', questionnaire.status],
                ['Completed Date', questionnaire.completedDate ? new Date(questionnaire.completedDate).toLocaleDateString() : 'N/A'],
                ['Score', String(questionnaire.score ?? 'N/A')],
                ['Notes', questionnaire.notes || 'No notes'],
                ['Report Generated', new Date().toLocaleString()]
            ];

            const csvContent = [headers, ...rows]
                .map(row => row.map(cell => `"${cell}"`).join(','))
                .join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${questionnaire.questionnaireName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } finally {
            setExporting(false);
        }
    };

    if (!questionnaire) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>View/Edit Questionnaire</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Export Buttons */}
                    <div className="flex gap-2 pb-4 border-b">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportToPDF}
                            disabled={exporting}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Export as Text/PDF
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportToExcel}
                            disabled={exporting}
                        >
                            <FileSpreadsheet className="w-4 h-4 mr-2" />
                            Export to Excel
                        </Button>
                        {exporting && <Loader className="w-4 h-4 animate-spin ml-2" />}
                    </div>

                    {/* Edit Form */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label>Questionnaire Name</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Type</Label>
                            <Input
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder="e.g., phq9, gad7"
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Completed Date</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Score</Label>
                            <Input
                                type="number"
                                value={score ?? ''}
                                onChange={(e) => setScore(e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="Optional"
                            />
                        </div>
                        <div className="col-span-2">
                            <Label>Notes</Label>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                placeholder="Additional notes..."
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-blue-900 hover:bg-blue-800"
                        >
                            {loading ? (
                                <Loader className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Changes
                        </Button>
                        <Button variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
