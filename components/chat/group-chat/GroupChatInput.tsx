'use client';

import React, { useState, useRef } from 'react';
import { Smile, Paperclip, Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GroupData } from '@/hooks/mockGroupData';
interface GroupChatMessagesProps {
  group: GroupData;
  currentUserId: string;
}
export default function ChatInput({ group, currentUserId }: GroupChatMessagesProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Send:', message);
      setMessage('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '😂', '😎', '🙏', '👏', '🤔'];

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Emoji and Attachment Buttons */}
        <div className="flex gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start" side="top">
              <div className="grid grid-cols-5 gap-2">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    className="h-9 w-9 p-0 text-xl"
                    onClick={() => setMessage((prev) => prev + emoji)}
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

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-32 py-3 pr-12 resize-none"
            rows={1}
          />

          {/* Send or Mic Button */}
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
