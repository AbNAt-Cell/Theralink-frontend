'use client';

import React, { useRef, useState } from 'react';
import { Paperclip, X, Image as ImageIcon, FileText, Loader } from 'lucide-react';

interface FileUploadButtonProps {
    onFileSelect: (file: File) => void;
    uploading?: boolean;
    disabled?: boolean;
}

export default function FileUploadButton({
    onFileSelect,
    uploading = false,
    disabled = false
}: FileUploadButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
        setPreviewFile(file);
    };

    const handleConfirm = () => {
        if (previewFile) {
            onFileSelect(previewFile);
            clearPreview();
        }
    };

    const clearPreview = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <button
                onClick={handleClick}
                disabled={disabled || uploading}
                className="p-2 hover:bg-gray-200 rounded-full transition disabled:opacity-50"
            >
                {uploading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                ) : (
                    <Paperclip className="w-5 h-5" />
                )}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                className="hidden"
            />

            {/* File Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Send File</h3>
                            <button onClick={clearPreview} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            {previewUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded" />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                        {previewFile.type.includes('pdf') ? (
                                            <FileText className="w-6 h-6 text-red-500" />
                                        ) : previewFile.type.startsWith('image/') ? (
                                            <ImageIcon className="w-6 h-6 text-blue-500" />
                                        ) : (
                                            <FileText className="w-6 h-6 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{previewFile.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {(previewFile.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={clearPreview}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={uploading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Send'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
