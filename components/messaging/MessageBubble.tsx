'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck, Smile, Download, FileText, Image as ImageIcon } from 'lucide-react';
import ReactionPicker from './ReactionPicker';

interface Reaction {
    emoji: string;
    count: number;
    userReacted: boolean;
}

interface MessageBubbleProps {
    id: string;
    text?: string;
    type?: 'text' | 'image' | 'file';
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    timestamp: string;
    isOwn: boolean;
    isRead?: boolean;
    isDelivered?: boolean;
    senderName?: string;
    senderAvatar?: string;
    reactions?: Reaction[];
    showAvatar?: boolean;
    isLastInGroup?: boolean;
    onAddReaction?: (messageId: string, emoji: string) => void;
    onRemoveReaction?: (messageId: string, emoji: string) => void;
}

export default function MessageBubble({
    id,
    text,
    type = 'text',
    fileUrl,
    fileName,
    fileType,
    timestamp,
    isOwn,
    isRead = false,
    isDelivered = false,
    senderName,
    senderAvatar,
    reactions = [],
    showAvatar = true,
    isLastInGroup = true,
    onAddReaction,
    onRemoveReaction,
}: MessageBubbleProps) {
    const [showReactionPicker, setShowReactionPicker] = useState(false);

    const handleReaction = (emoji: string) => {
        const existingReaction = reactions.find(r => r.emoji === emoji && r.userReacted);
        if (existingReaction) {
            onRemoveReaction?.(id, emoji);
        } else {
            onAddReaction?.(id, emoji);
        }
        setShowReactionPicker(false);
    };

    const renderContent = () => {
        if (type === 'image' && fileUrl) {
            return (
                <div className="mb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={fileUrl}
                        alt={fileName || 'Image'}
                        className="max-w-[250px] max-h-[200px] rounded-lg object-cover cursor-pointer hover:opacity-90 transition"
                        onClick={() => window.open(fileUrl, '_blank')}
                    />
                    {text && <p className="text-sm mt-2">{text}</p>}
                </div>
            );
        }

        if (type === 'file' && fileUrl) {
            const isImage = fileType?.startsWith('image/');
            const isPdf = fileType === 'application/pdf';

            return (
                <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg mb-1">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        {isImage ? (
                            <ImageIcon className="w-5 h-5" />
                        ) : isPdf ? (
                            <FileText className="w-5 h-5 text-red-400" />
                        ) : (
                            <FileText className="w-5 h-5" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{fileName || 'File'}</p>
                        <p className="text-xs opacity-70">{fileType}</p>
                    </div>
                    <a
                        href={fileUrl}
                        download={fileName}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                    >
                        <Download className="w-4 h-4" />
                    </a>
                </div>
            );
        }

        return <p className="text-sm whitespace-pre-wrap break-words">{text}</p>;
    };

    const renderStatus = () => {
        if (!isOwn) return null;

        if (isRead) {
            return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />;
        }
        if (isDelivered) {
            return <CheckCheck className="w-3.5 h-3.5 opacity-70" />;
        }
        return <Check className="w-3.5 h-3.5 opacity-70" />;
    };

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
            {/* Avatar for received messages */}
            {!isOwn && showAvatar && (
                <div className="flex-shrink-0 mr-2">
                    {isLastInGroup ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={senderAvatar || '/images/Blank_Profile.jpg'}
                            alt={senderName || 'Sender'}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8" />
                    )}
                </div>
            )}

            <div className={`relative max-w-[70%] ${isOwn ? 'order-1' : ''}`}>
                {/* Message Bubble */}
                <div
                    className={`relative px-4 py-2 rounded-2xl ${isOwn
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
                            : 'bg-white text-gray-900 shadow-sm border border-gray-100 rounded-bl-sm'
                        }`}
                >
                    {renderContent()}

                    {/* Timestamp and Status */}
                    <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                        <span className="text-[10px]">
                            {format(new Date(timestamp), 'p')}
                        </span>
                        {renderStatus()}
                    </div>
                </div>

                {/* Reactions Display */}
                {reactions.length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        {reactions.map((reaction, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleReaction(reaction.emoji)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition ${reaction.userReacted
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <span>{reaction.emoji}</span>
                                {reaction.count > 1 && <span>{reaction.count}</span>}
                            </button>
                        ))}
                    </div>
                )}

                {/* Reaction Button */}
                <button
                    onClick={() => setShowReactionPicker(!showReactionPicker)}
                    className={`absolute -bottom-1 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} 
            opacity-0 group-hover:opacity-100 p-1.5 bg-white rounded-full shadow-md 
            hover:bg-gray-50 transition-all duration-200 z-10`}
                >
                    <Smile className="w-4 h-4 text-gray-500" />
                </button>

                {/* Reaction Picker Popup */}
                {showReactionPicker && (
                    <ReactionPicker
                        onSelect={handleReaction}
                        onClose={() => setShowReactionPicker(false)}
                        position={isOwn ? 'left' : 'right'}
                    />
                )}
            </div>
        </div>
    );
}
