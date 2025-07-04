// components/chat/DateSeparator.tsx
import React from 'react';

interface DateSeparatorProps {
    date: string; // This will be the formatted date string like "Yesterday", "Last Tuesday"
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
    return (
        <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full   dark:border-gray-700"></span>
            </div>
            <div className="relative bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-500 dark:text-gray-400 shadow-sm">
                {date}
            </div>
        </div>
    );
};

export default DateSeparator;