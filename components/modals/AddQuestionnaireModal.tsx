'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, ArrowLeft } from 'lucide-react';
import { questionnaireTemplates, QuestionnaireTemplate, QuestionnaireQuestion } from '@/lib/questionnaire-templates';

interface AddQuestionnaireModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: QuestionnaireFormData) => Promise<void>;
    clientName: string;
}

export interface QuestionnaireFormData {
    templateId: string;
    templateName: string;
    answers: Record<string, string | number>;
    comments: string;
    completedDate: string;
    score?: number;
}

export default function AddQuestionnaireModal({
    isOpen,
    onClose,
    onSave
}: AddQuestionnaireModalProps) {
    const [loading, setLoading] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [selectedTemplate, setSelectedTemplate] = useState<QuestionnaireTemplate | null>(null);
    const [answers, setAnswers] = useState<Record<string, string | number>>({});
    const [comments, setComments] = useState('');
    const [completedDate, setCompletedDate] = useState(new Date().toISOString().split('T')[0]);

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplateId(templateId);
        const template = questionnaireTemplates.find(t => t.id === templateId);
        setSelectedTemplate(template || null);
        setAnswers({});
    };

    const handleAnswerChange = (questionId: string, value: string | number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const calculateScore = (): number | undefined => {
        if (!selectedTemplate) return undefined;
        let score = 0;
        selectedTemplate.questions.forEach(q => {
            const answer = answers[q.id];
            if (q.type === 'scale' && q.options && typeof answer === 'number') {
                score += answer;
            } else if (q.type === 'yesno' && answer === 'yes') {
                score += 1;
            }
        });
        return score;
    };

    const handleSubmit = async () => {
        if (!selectedTemplate) {
            alert('Please select a questionnaire template');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                templateId: selectedTemplateId,
                templateName: selectedTemplate.name,
                answers,
                comments,
                completedDate,
                score: calculateScore()
            });
            // Reset form
            setSelectedTemplateId('');
            setSelectedTemplate(null);
            setAnswers({});
            setComments('');
            setCompletedDate(new Date().toISOString().split('T')[0]);
            onClose();
        } catch (error) {
            console.error('Error saving questionnaire:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        setSelectedTemplate(null);
        setSelectedTemplateId('');
        setAnswers({});
    };

    const renderQuestionInput = (question: QuestionnaireQuestion, index: number) => {
        switch (question.type) {
            case 'scale':
                return (
                    <div key={question.id} className="border rounded-lg p-4 bg-white mb-4">
                        <p className="font-medium mb-3">
                            {index + 1}. {question.text}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {question.options?.map((option, optIndex) => (
                                <label
                                    key={optIndex}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${answers[question.id] === optIndex
                                        ? 'bg-blue-100 border-blue-500'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={question.id}
                                        checked={answers[question.id] === optIndex}
                                        onChange={() => handleAnswerChange(question.id, optIndex)}
                                        className="sr-only"
                                    />
                                    <span className="text-sm">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            case 'yesno':
                return (
                    <div key={question.id} className="border rounded-lg p-4 bg-white mb-4">
                        <p className="font-medium mb-3">
                            {index + 1}. {question.text}
                        </p>
                        <div className="flex gap-4">
                            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${answers[question.id] === 'yes' ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                                }`}>
                                <input
                                    type="radio"
                                    name={question.id}
                                    checked={answers[question.id] === 'yes'}
                                    onChange={() => handleAnswerChange(question.id, 'yes')}
                                    className="sr-only"
                                />
                                Yes
                            </label>
                            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${answers[question.id] === 'no' ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                                }`}>
                                <input
                                    type="radio"
                                    name={question.id}
                                    checked={answers[question.id] === 'no'}
                                    onChange={() => handleAnswerChange(question.id, 'no')}
                                    className="sr-only"
                                />
                                No
                            </label>
                        </div>
                    </div>
                );
            case 'text':
                return (
                    <div key={question.id} className="border rounded-lg p-4 bg-white mb-4">
                        <p className="font-medium mb-3">
                            {index + 1}. {question.text}
                        </p>
                        <Textarea
                            value={answers[question.id] as string || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            rows={3}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {selectedTemplate ? (
                            <button
                                onClick={handleGoBack}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Go Back
                            </button>
                        ) : (
                            'Add Questionnaire'
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Template Selector */}
                    {!selectedTemplate && (
                        <div>
                            <Label>Questions</Label>
                            <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a questionnaire template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {questionnaireTemplates.map(template => (
                                        <SelectItem key={template.id} value={template.id}>
                                            {template.shortName} - {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Questions Section */}
                    {selectedTemplate && (
                        <>
                            <div className="border-b pb-4">
                                <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
                                <p className="text-gray-600 mt-2">{selectedTemplate.instructions}</p>
                                {selectedTemplate.scoringInfo && (
                                    <p className="text-sm text-gray-500 mt-1">{selectedTemplate.scoringInfo}</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                {selectedTemplate.questions.map((question, index) =>
                                    renderQuestionInput(question, index)
                                )}
                            </div>

                            {/* Additional Comments */}
                            <div>
                                <Label>Additional Comments</Label>
                                <Textarea
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Additional notes or observations..."
                                    rows={4}
                                />
                            </div>

                            {/* Date */}
                            <div className="max-w-xs">
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={completedDate}
                                    onChange={(e) => setCompletedDate(e.target.value)}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-blue-900 hover:bg-blue-800"
                                >
                                    {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Submit
                                </Button>
                                <Button variant="outline" onClick={onClose} disabled={loading}>
                                    Cancel
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
