// frontend/components/chat/ChatMessages.tsx
"use client";

import { useRef, useEffect, RefObject, useState } from "react";
import { formatRelative } from "date-fns";
import ChatBubble from "@/components/chat/chat-bubble";
import socket from "@/lib/socket";

// --- UPDATED Message INTERFACE ---
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  type: 'text' | 'image' | 'video' | 'file'; // Add message type
  text?: string; // Make text optional
  fileUrl?: string; // Add file URL
  fileName?: string; // Add file name
  fileSize?: number; // Add file size
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

interface ChatMessagesProps {
  messages: Message[];
  contactId: string;
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
  currentUserId: string | null; // Pass current user ID from ChatWindow
}

export default function ChatMessages({
  messages,
  contactId,
  isTyping,
  messagesEndRef,
  currentUserId, // Receive current user ID
}: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, messagesEndRef]); // Add messagesEndRef to dependencies

  return (
    <div
      ref={containerRef}
      className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-hide"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-4 text-muted-foreground">
            No messages yet
            <p className="text-xs">Send a message to start the conversation</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isMe = message.senderId === currentUserId;
            const showTimestamp =
              index === 0 ||
              new Date(message.timestamp).getDate() !==
              new Date(messages[index - 1].timestamp).getDate();

            return (
              <div key={message.id} className="space-y-2">
                {showTimestamp && (
                  <div className="flex justify-center my-4 text-xs text-muted-foreground">
                    {formatRelative(new Date(message.timestamp), new Date())}
                  </div>
                )}
                {/* --- Pass the whole message object to ChatBubble --- */}
                <ChatBubble
                  message={message} // Pass the entire message object
                  isMe={isMe}
                />
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-start gap-2 animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg max-w-[75%]">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse delay-[0s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse delay-[0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse delay-[0.4s]" />
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