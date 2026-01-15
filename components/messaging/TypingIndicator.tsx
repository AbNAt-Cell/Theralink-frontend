'use client';

import React from 'react';

interface TypingIndicatorProps {
    userName?: string;
}

export default function TypingIndicator({ userName }: TypingIndicatorProps) {
    return (
        <div className="flex items-center gap-3 px-4 py-2">
            <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            {userName && (
                <span className="text-xs text-gray-500">{userName} is typing...</span>
            )}
        </div>
    );
}
