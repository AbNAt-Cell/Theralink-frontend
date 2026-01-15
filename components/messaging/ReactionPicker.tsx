'use client';

import React, { useEffect, useRef } from 'react';

interface ReactionPickerProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
    position?: 'left' | 'right';
}

const COMMON_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export default function ReactionPicker({
    onSelect,
    onClose,
    position = 'right'
}: ReactionPickerProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className={`absolute bottom-full mb-2 ${position === 'left' ? 'left-0' : 'right-0'
                } bg-white rounded-full shadow-lg border border-gray-100 p-1 flex items-center gap-1 z-20`}
        >
            {COMMON_REACTIONS.map((emoji) => (
                <button
                    key={emoji}
                    onClick={() => onSelect(emoji)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-lg"
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
}
