'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Search,
    Plus,
    Loader2,
    Trash2,
    Download,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    File,
    X
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/Partials/use-toast';
import { getClinicFiles, uploadClinicFile, deleteClinicFile, ClinicFile } from '@/hooks/admin/clinicFiles';

export default function ClinicFilesPage() {
    const { user } = useUser();
    const { toast } = useToast();

    // State
    const [files, setFiles] = useState<ClinicFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modal state
    const [fileName, setFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch files
    const fetchFiles = useCallback(async () => {
        if (!user?.clinicId) return;
        setLoading(true);

        try {
            const data = await getClinicFiles(user.clinicId);
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load clinic files.',
            });
        } finally {
            setLoading(false);
        }
    }, [user?.clinicId, toast]);

    useEffect(() => {
        if (user?.clinicId) {
            fetchFiles();
        }
    }, [user?.clinicId, fetchFiles]);

    // Filter files by search
    const filteredFiles = files.filter(file =>
        file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.fileTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (!fileName) {
                setFileName(file.name.split('.').slice(0, -1).join('.') || file.name);
            }
        }
    };

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (!fileName) {
                setFileName(file.name.split('.').slice(0, -1).join('.') || file.name);
            }
        }
    };

    // Handle upload
    const handleUpload = async () => {
        if (!selectedFile || !fileName || !user?.clinicId || !user?.id) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please provide a file name and select a file.',
            });
            return;
        }

        setUploading(true);

        try {
            await uploadClinicFile(user.clinicId, user.id, fileName, selectedFile);

            toast({
                title: 'File Uploaded!',
                description: `${fileName} has been uploaded successfully.`,
            });

            // Reset modal
            setFileName('');
            setSelectedFile(null);
            setIsModalOpen(false);
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Refresh files
            fetchFiles();
        } catch (error) {
            console.error('Error uploading file:', error);
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: 'Failed to upload file. Please try again.',
            });
        } finally {
            setUploading(false);
        }
    };

    // Handle delete
    const handleDelete = async (file: ClinicFile) => {
        if (!confirm(`Are you sure you want to delete "${file.fileName}"?`)) return;

        try {
            await deleteClinicFile(file.id, file.fileUrl);

            toast({
                title: 'File Deleted',
                description: `${file.fileName} has been deleted.`,
            });

            fetchFiles();
        } catch (error) {
            console.error('Error deleting file:', error);
            toast({
                variant: 'destructive',
                title: 'Delete Failed',
                description: 'Failed to delete file. Please try again.',
            });
        }
    };

    // Format file size
    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '-';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFileName('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-blue-700">Clinic Files</h1>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-1" /> Add File
                </Button>
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-9 border-gray-300"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">File Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">File Tags</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Uploaded By</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Files</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Date Uploaded</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                                </td>
                            </tr>
                        ) : paginatedFiles.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-orange-500">
                                    No records available
                                </td>
                            </tr>
                        ) : (
                            paginatedFiles.map((file) => (
                                <tr key={file.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm">{file.fileName}</td>
                                    <td className="px-4 py-3 text-sm">
                                        {file.fileTags.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {file.fileTags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {file.uploadedByName || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {formatFileSize(file.fileSize)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {formatDate(file.createdAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={file.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Download className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(file)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </button>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(v) => {
                            setItemsPerPage(parseInt(v));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-16 h-8 border-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>items per page</span>
                </div>
                <div>
                    {filteredFiles.length === 0
                        ? '0 - 0 of 0 items'
                        : `${startIndex + 1} - ${Math.min(endIndex, filteredFiles.length)} of ${filteredFiles.length} items`
                    }
                </div>
            </div>

            {/* Add File Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-slate-800">
                            Add File
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 pt-4">
                        {/* File Name */}
                        <div className="space-y-2">
                            <Label className="text-red-600 font-medium">File Name</Label>
                            <Input
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="Enter file name"
                                className="border-blue-400 focus:border-blue-600"
                            />
                        </div>

                        {/* File Upload Area */}
                        <div className="space-y-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {selectedFile ? (
                                <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded-md">
                                    <File className="w-5 h-5 text-blue-600" />
                                    <span className="flex-1 text-sm truncate">{selectedFile.name}</span>
                                    <span className="text-xs text-gray-500">
                                        {formatFileSize(selectedFile.size)}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setSelectedFile(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                    >
                                        <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`flex items-center gap-4 p-4 border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                        }`}
                                >
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="bg-slate-800 hover:bg-slate-700 text-white"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Select files...
                                    </Button>
                                    <span className="text-sm text-gray-500">
                                        <span className="text-blue-600">Drop</span> files here to upload
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                onClick={handleUpload}
                                disabled={uploading || !selectedFile || !fileName}
                                className="bg-slate-800 hover:bg-slate-700 text-white"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    'Upload'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeModal}
                                disabled={uploading}
                                className="border-slate-600 text-slate-600"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
