// frontend/components/chat/ChatInput.tsx
"use client";

import { useState, useRef } from 'react';
import { Smile, Paperclip, Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import socket from '@/lib/socket'; // Import socket

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  receiverId: string; // Add receiverId prop
  senderId: string; // Add senderId prop
}

const TYPING_TIMEOUT = 3000; // 3 seconds after last keypress to stop typing

export default function ChatInput({ onSendMessage, receiverId, senderId }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTypingLocal, setIsTypingLocal] = useState(false); // To track typing state locally

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      textareaRef.current?.focus();
      // Ensure typing stops after sending a message
      stopTyping();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else {
      // Start typing if not already typing
      if (!isTypingLocal) {
        setIsTypingLocal(true);
        socket.emit('typing_started', { senderId, receiverId });
      }
      // Reset the timeout on each keypress
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, TYPING_TIMEOUT);
    }
  };

  const stopTyping = () => {
    if (isTypingLocal) {
      setIsTypingLocal(false);
      socket.emit('typing_stopped', { senderId, receiverId });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // If the message becomes empty, immediately stop typing
    if (e.target.value.trim() === '') {
      stopTyping();
    }
  };

  // Simple emoji picker with just a few emojis for demo
  const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '😂', '😎', '🙏', '👏', '🤔'];

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start" side="top">
              <div className="grid grid-cols-5 gap-2">
                {emojis.map(emoji => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    className="h-9 w-9 p-0"
                    onClick={() => setMessage(prev => prev + emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange} // Use handleChange
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-32 py-3 pr-12 resize-none"
            rows={1}
          />

          {message.trim() ? (
            <Button
              type="submit"
              size="icon"
              className="absolute bottom-1.5 right-1.5 h-8 w-8 rounded-full p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute bottom-1.5 right-1.5 h-8 w-8 rounded-full p-0"
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}