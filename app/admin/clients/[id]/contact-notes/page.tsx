'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Plus, Trash, MessageSquare, Phone, Mail, Calendar, AlertCircle } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientContactNotes, deleteClientContactNote, ClientContactNote } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function ContactNotesPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [notes, setNotes] = useState<ClientContactNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, notesData] = await Promise.all([
        getClientById(params.id),
        getClientContactNotes(params.id)
      ]);
      setClient(clientData);
      setNotes(notesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    setDeletingId(id);
    try {
      await deleteClientContactNote(id);
      toast({ title: 'Success', description: 'Note deleted' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete note' });
    } finally {
      setDeletingId(null);
    }
  };

  const getContactTypeIcon = (type?: string) => {
    switch (type) {
      case 'phone': return <Phone className="w-4 h-4 text-blue-500" />;
      case 'email': return <Mail className="w-4 h-4 text-green-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
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
        <h2 className="text-xl font-semibold">Contact Notes</h2>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <MessageSquare className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-500">No Contact Notes</p>
          <p className="text-gray-400 text-sm mt-1">Click &quot;Add Contact Note&quot; to log a communication</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getContactTypeIcon(note.contactType)}
                    <span className="font-medium">{note.subject || 'No Subject'}</span>
                    <span className="text-xs text-gray-400">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(note.contactDate).toLocaleDateString()}
                    </span>
                    {note.followUpRequired && (
                      <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        <AlertCircle className="w-3 h-3" />
                        Follow-up Required
                      </span>
                    )}
                  </div>
                  {note.contactWith && (
                    <p className="text-sm text-gray-500 mb-2">
                      Contact with: <span className="capitalize">{note.contactWith}</span>
                    </p>
                  )}
                  {note.notes && (
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{note.notes}</p>
                  )}
                  {note.followUpDate && (
                    <p className="text-xs text-orange-600 mt-2">
                      Follow-up by: {new Date(note.followUpDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(note.id)}
                  disabled={deletingId === note.id}
                  className="text-red-500 hover:text-red-700"
                >
                  {deletingId === note.id ? (
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
