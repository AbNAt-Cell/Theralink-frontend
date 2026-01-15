'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader } from 'lucide-react';

interface EditBackgroundModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (content: string, notes: string) => Promise<void>;
    sectionLabel: string;
    currentContent: string;
    currentNotes: string;
}

export default function EditBackgroundModal({
    isOpen,
    onClose,
    onSave,
    sectionLabel,
    currentContent,
    currentNotes
}: EditBackgroundModalProps) {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState(currentContent);
    const [notes, setNotes] = useState(currentNotes);

    // Update form when props change
    useEffect(() => {
        setContent(currentContent);
        setNotes(currentNotes);
    }, [currentContent, currentNotes]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSave(content.trim(), notes.trim());
            onClose();
        } catch (error) {
            console.error('Error saving background:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{currentContent ? 'Edit' : 'Add'} {sectionLabel}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <Label>Content</Label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`Enter ${sectionLabel.toLowerCase()} details...`}
                            rows={8}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label>Notes (Optional)</Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Additional notes..."
                            rows={3}
                            className="mt-1"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-blue-900 hover:bg-blue-800"
                        >
                            {loading && <Loader className="w-4 h-4 animate-spin mr-2" />}
                            {currentContent ? 'Save Changes' : 'Add'}
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
