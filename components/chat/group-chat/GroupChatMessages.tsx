// components/chat/group-chat/GroupChatMessages.tsx
"use client";

import { ScrollArea } from '@radix-ui/react-scroll-area';
import React from 'react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import DateSeparator from '@/components/chat/group-chat/DateSeparator';

// Import the centralized dummy data and types
// No need to import dummyMessages globally anymore
import { currentUserId, GroupData, Message } from '@/hooks/mockGroupData';
interface GroupChatMessagesProps {
    group: GroupData; // Now receives the active group with its messages
    currentUserId: string;
}

function GroupChatMessages({ group, currentUserId }: GroupChatMessagesProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Directly use the messages from the passed group object
    const groupMessages = group.messages; // <<< This is the key change here

    // Scroll to bottom whenever messages or the selected group changes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [group.messages.length, group._id]); // Dependency on group.messages.length and group._id ensures re-scroll when group changes or new messages arrive

    // --- Helper function to format timestamp into relative date/time for separators ---
    const formatSeparatorDate = (isoString: string) => {
        const messageDate = new Date(isoString);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

        if (messageDay.getTime() === today.getTime()) {
            return "Today";
        }
        else if (messageDay.getTime() === yesterday.getTime()) {
            return `Yesterday`;
        }
        else if (now.getTime() - messageDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
            return `${messageDate.toLocaleDateString('en-US', { weekday: 'long' })}`;
        }
        else {
            return `${messageDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
        }
    };

    // --- Helper function for individual message timestamps (just time) ---
    const formatMessageTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    // Prepare messages with flags for date separators
    const messagesWithSeparators = [];
    let lastMessageDate: Date | null = null;

    // Sort messages by timestamp to ensure correct grouping
    // Use the messages directly from the group prop
    const sortedMessages = [...groupMessages].sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });


    sortedMessages.forEach((msg) => {
        const messageDate = new Date(msg.timestamp);
        const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

        if (!lastMessageDate || messageDay.getTime() !== lastMessageDate.getTime()) {
            messagesWithSeparators.push({
                type: 'separator',
                date: formatSeparatorDate(msg.timestamp),
                key: `separator-${messageDay.getTime()}-${group._id}` // Ensure key is unique per group and date
            });
        }

        messagesWithSeparators.push({
            type: 'message',
            data: {
                ...msg,
                isCurrentUser: msg.senderId === currentUserId,
                formattedTime: formatMessageTime(msg.timestamp),
            },
            key: `message-${msg._id}`
        });

        lastMessageDate = messageDay;
    });


    return (
        <div className="flex flex-col h-full w-full">
            <ScrollArea className="flex-1 px-4 py-2">
                <div className="flex flex-col gap-4">
                    {messagesWithSeparators.map((item) => {
                        if (item.type === 'separator') {
                            return <DateSeparator key={item.key} date={item.date} />;
                        } else {
                            const message = item.data;
                            return (
                                <div
                                    key={message._id}
                                    className={`flex items-start gap-3 ${message.isCurrentUser ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {!message.isCurrentUser && (
                                        <Image
                                            src={message.senderAvatarUrl}
                                            alt={`${message.sendername}'s Avatar`}
                                            width={30}
                                            height={30}
                                            className='rounded-full shadow-lg object-cover flex-shrink-0'
                                        />
                                    )}
                                    <div className='flex flex-col max-w-[70%]'>
                                        {!message.isCurrentUser && (
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                                {message.sendername}
                                            </span>
                                        )}
                                        <div
                                            className={`${message.isCurrentUser
                                                ? "bg-blue-100 dark:bg-blue-800 text-gray-800 dark:text-gray-200"
                                                : "bg-green-100 dark:bg-green-800 text-gray-800 dark:text-gray-200"
                                                } p-3 rounded-lg shadow-sm break-words whitespace-pre-wrap`}
                                        >
                                            <p className='text-sm'>{message.text}</p>
                                            <span className='text-xs text-gray-500 block mt-1 text-right'>
                                                {message.formattedTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>
        </div>
    );
}

export default GroupChatMessages;