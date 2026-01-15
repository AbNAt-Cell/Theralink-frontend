'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, Plus, Trash, Edit, FileText, Download, User } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientContactNotes, deleteClientContactNote, addClientContactNote, ClientContactNote } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';
import AddContactNoteModal, { ContactNoteFormData } from '@/components/modals/AddContactNoteModal';

interface PageProps {
  params: { id: string };
}

export default function ContactNotesPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [notes, setNotes] = useState<ClientContactNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<ClientContactNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Date filter state
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

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

  // Filter notes by date
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);

      const filtered = notes.filter(note => {
        const noteDate = new Date(note.contactDate);
        return noteDate >= start && noteDate <= end;
      });
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [notes, startDate, endDate]);

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

  const handleAddNote = async (data: ContactNoteFormData) => {
    try {
      await addClientContactNote({
        clientId: params.id,
        contactDate: data.dateOfContact,
        contactType: data.methodOfContact.toLowerCase().replace(' ', '_'),
        contactWith: data.contacted,
        subject: `${data.direction === 'outgoing' ? 'Outgoing' : 'Incoming'} - ${data.methodOfContact}`,
        notes: data.contactNote,
        followUpRequired: false,
        createdBy: data.staffId
      });
      toast({ title: 'Success', description: 'Contact note added' });
      loadData();
    } catch (error) {
      console.error('Error adding note:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add note' });
      throw error;
    }
  };

  const clearFilter = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  const exportToPdf = () => {
    // Simulated PDF export
    toast({ title: 'Export', description: 'PDF export functionality coming soon' });
  };

  const exportToCsv = () => {
    // Create CSV content
    const headers = ['Date', 'Staff', 'Contacted', 'Method', 'Direction', 'Note'];
    const rows = filteredNotes.map(note => [
      new Date(note.contactDate).toLocaleDateString(),
      note.createdBy || '',
      note.contactWith || '',
      note.contactType || '',
      note.subject?.includes('Outgoing') ? 'Outgoing' : 'Incoming',
      note.notes?.replace(/"/g, '""') || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact_notes_${params.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

      <div className="border rounded-lg bg-white overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-blue-800">Contact Notes</h2>
          <div className="flex gap-2">
            <Button
              className="bg-blue-900 hover:bg-blue-800"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Notes
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={exportToPdf}
              title="Export to PDF"
            >
              <FileText className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={exportToCsv}
              title="Export to CSV"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Select Date</span>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
              <span className="text-gray-400">-</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
          <button
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={clearFilter}
          >
            Clear Filter
          </button>
        </div>

        {/* Notes List */}
        <div className="divide-y">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No contact notes found for the selected date range
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div key={note.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-blue-700">{note.createdBy || 'Staff'}</span>
                        {' contacted '}
                        <span className="font-medium text-blue-700">-{note.contactWith || 'Contact'}</span>
                        {' via '}
                        <span className="text-orange-600">{note.contactType || 'Unknown'}</span>
                        {' on '}
                        <span className="text-orange-600">
                          {new Date(note.contactDate).toLocaleDateString()} at{' '}
                          {new Date(note.contactDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </p>
                      {note.notes && (
                        <p className="text-gray-700 mt-2">{note.notes}</p>
                      )}
                      {note.subject && (
                        <p className="text-sm text-blue-600 mt-1">
                          ({note.subject.includes('Outgoing') ? 'Outgoing Message' : 'Incoming Message'})
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(note.id)}
                      disabled={deletingId === note.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingId === note.id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Contact Note Modal */}
      <AddContactNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNote}
      />
    </div>
  );
}
