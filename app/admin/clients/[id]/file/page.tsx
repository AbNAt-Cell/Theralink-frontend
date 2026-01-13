'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Plus, Trash, File, Download, FolderOpen } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientFiles, deleteClientFile, ClientFile } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function FilesPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, filesData] = await Promise.all([
        getClientById(params.id),
        getClientFiles(params.id)
      ]);
      setClient(clientData);
      setFiles(filesData);
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
    if (!confirm('Are you sure you want to delete this file?')) return;

    setDeletingId(id);
    try {
      await deleteClientFile(id);
      toast({ title: 'Success', description: 'File deleted' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete file' });
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

  const getFileIcon = () => {
    return <File className="w-5 h-5 text-blue-500" />;
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
        <h2 className="text-xl font-semibold">Files</h2>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>

      {files.length === 0 ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <FolderOpen className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-500">No Files Uploaded</p>
          <p className="text-gray-400 text-sm mt-1">Click &quot;Upload File&quot; to add files to this client</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  {getFileIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.fileName}</p>
                  <p className="text-sm text-gray-500">{file.category || 'General'}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatFileSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
                {file.fileUrl && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(file.id)}
                  disabled={deletingId === file.id}
                  className="text-red-500 hover:text-red-700"
                >
                  {deletingId === file.id ? (
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
