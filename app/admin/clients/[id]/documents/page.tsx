'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader, Trash, FileText, Calendar, Download } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientDocuments, deleteClientDocument, ClientDocument } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function DocumentsPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, docsData] = await Promise.all([
        getClientById(params.id),
        getClientDocuments(params.id)
      ]);
      setClient(clientData);
      setDocuments(docsData);
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
    if (!confirm('Are you sure you want to delete this document?')) return;

    setDeletingId(id);
    try {
      await deleteClientDocument(id);
      toast({ title: 'Success', description: 'Document deleted' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete document' });
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

      <h2 className="text-xl font-semibold">Documents</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="pl-8 pr-3 py-2 rounded-full flex items-center gap-1 relative">
          <Calendar className="h-4 w-4 absolute left-2" />
          Date (DOCS) | All
        </Badge>
        <Badge variant="outline" className="px-3 py-2 rounded-full flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-400"></span>
          Staff
        </Badge>
        <Badge variant="outline" className="px-3 py-2 rounded-full flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-400"></span>
          Template
        </Badge>
        <div className="ml-auto">
          <Button variant="ghost" size="sm">
            Clear Filter
          </Button>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <FileText className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-500">No Documents Available</p>
        </div>
      ) : (
        <div className="border rounded-lg bg-white overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Document Name</th>
                <th className="text-left p-4 font-medium text-gray-600">Type</th>
                <th className="text-left p-4 font-medium text-gray-600">Date</th>
                <th className="text-left p-4 font-medium text-gray-600">Size</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{doc.documentName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{doc.documentType || '-'}</td>
                  <td className="p-4 text-gray-600">
                    {doc.documentDate ? new Date(doc.documentDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4 text-gray-600">{formatFileSize(doc.fileSize)}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {doc.fileUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        disabled={deletingId === doc.id}
                        className="text-red-500 hover:text-red-700"
                      >
                        {deletingId === doc.id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
