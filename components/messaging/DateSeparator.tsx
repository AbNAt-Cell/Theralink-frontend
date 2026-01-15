'use client';

import React from 'react';
import { format } from 'date-fns';

interface DateSeparatorProps {
    date: Date;
}

export default function DateSeparator({ date }: DateSeparatorProps) {
    const getDateLabel = () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        return format(date, 'MMMM d, yyyy');
    };

    return (
        <div className="flex items-center justify-center my-4">
            <div className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                {getDateLabel()}
            </div>
        </div>
    );
}
