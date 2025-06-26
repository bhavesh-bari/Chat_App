"use client";

import { useRef, useEffect, RefObject, useState } from "react";
import { formatRelative } from "date-fns";
import ChatBubble from "@/components/chat/chat-bubble";
import socket from "@/lib/socket";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

interface ChatMessagesProps {
  messages: Message[];
  contactId: string;
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export default function ChatMessages({
  messages,
  contactId,
  isTyping,
  messagesEndRef,
}: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("get_profile");
    socket.on("getProfile_success", (data: any) =>
      setCurrentUserId(data.user._id)
    );
    return () => {
      socket.off("getProfile_success");
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

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
