'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Calendar, Loader, Trash, FileText } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientProgress, deleteClientProgress, ClientProgress } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
    params: { id: string };
}

export default function ClientProgressPage({ params }: PageProps) {
    const [client, setClient] = useState<ClientProfile | null>(null);
    const [progress, setProgress] = useState<ClientProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Date filter - default to last year
    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        return date.toISOString().split('T')[0];
    });
    const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);

    const { toast } = useToast();

    const loadData = useCallback(async () => {
        try {
            const [clientData, progressData] = await Promise.all([
                getClientById(params.id),
                getClientProgress(params.id, fromDate, toDate)
            ]);
            setClient(clientData);
            setProgress(progressData);
        } catch (error) {
            console.error('Error loading data:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    }, [params.id, fromDate, toDate, toast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this progress note?')) return;

        setDeletingId(id);
        try {
            await deleteClientProgress(id);
            toast({ title: 'Success', description: 'Progress note deleted' });
            loadData();
        } catch (error) {
            console.error('Error deleting:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete progress note' });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AdminClientProfile client={client} />

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Client Progress</h2>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 border rounded-full px-4 py-2 bg-white">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Date (1 Year)</span>
                    <span className="text-gray-400">|</span>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="text-sm border-none outline-none"
                    />
                    <span>-</span>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="text-sm border-none outline-none"
                    />
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                    const date = new Date();
                    date.setFullYear(date.getFullYear() - 1);
                    setFromDate(date.toISOString().split('T')[0]);
                    setToDate(new Date().toISOString().split('T')[0]);
                }}>
                    Clear Filter
                </Button>
            </div>

            {/* Progress List */}
            {progress.length === 0 ? (
                <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
                    <div className="relative w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                        <FileText className="w-12 h-12 text-gray-300" />
                    </div>
                    <p className="text-gray-500">No progress data available for the selected date range.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {progress.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        <span className="font-medium">
                                            {new Date(item.progressDate).toLocaleDateString()}
                                        </span>
                                        {item.sessionType && (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                {item.sessionType}
                                            </span>
                                        )}
                                        {item.durationMinutes && (
                                            <span className="text-xs text-gray-500">
                                                {item.durationMinutes} mins
                                            </span>
                                        )}
                                    </div>
                                    {item.progressNote && (
                                        <p className="text-gray-700 text-sm">{item.progressNote}</p>
                                    )}
                                    {item.clientResponse && (
                                        <p className="text-gray-600 text-sm mt-2">
                                            <strong>Response:</strong> {item.clientResponse}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                    disabled={deletingId === item.id}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    {deletingId === item.id ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
