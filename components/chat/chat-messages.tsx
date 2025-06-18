// frontend/components/chat/ChatMessages.tsx
"use client";

import { useRef, useEffect, RefObject } from 'react';
import { formatRelative } from 'date-fns';
import ChatBubble from '@/components/chat/chat-bubble';
import { Loader2 } from 'lucide-react';
import socket from '@/lib/socket'; // Import socket to get current user ID
import { useState } from 'react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string; // ISO string
  status: 'sent' | 'delivered' | 'read';
}

interface ChatMessagesProps {
  messages: Message[]; // Use the defined Message interface
  contactId: string;
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export default function ChatMessages({ messages, contactId, isTyping, messagesEndRef }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch current user's ID to correctly determine 'isMe'
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('get_profile'); // Request profile from server

    const handleProfileSuccess = (data: any) => {
      setCurrentUserId(data.user._id);
    };

    socket.on('getProfile_success', handleProfileSuccess);

    return () => {
      socket.off('getProfile_success', handleProfileSuccess);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-4">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground">Send a message to start the conversation</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => {
            // Determine if the message was sent by the current user
            const isMe = message.senderId === currentUserId;
            const showTimestamp = index === 0 ||
              new Date(message.timestamp).getDate() !==
              new Date(messages[index - 1].timestamp).getDate();

            return (
              <div key={message.id || message._id} className="space-y-2"> {/* Use message.id or message._id */}
                {showTimestamp && (
                  <div className="flex justify-center my-4">
                    <div className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      {formatRelative(new Date(message.timestamp), new Date()).charAt(0).toUpperCase() +
                        formatRelative(new Date(message.timestamp), new Date()).slice(1)}
                    </div>
                  </div>
                )}
                <ChatBubble
                  message={message.text}
                  timestamp={message.timestamp}
                  isMe={isMe}
                  status={message.status}
                />
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-start gap-2 animate-in fade-in">
              <div className="flex-none w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg rounded-tl-none max-w-[75%]">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}