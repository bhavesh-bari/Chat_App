// frontend/components/chat/ChatInput.tsx
"use client";

import { useState, useRef } from 'react';
import { Smile, Paperclip, Send, Mic, X } from 'lucide-react'; // Added X for close button
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // For file preview
import socket from '@/lib/socket';
import { useToast } from "@/hooks/use-toast"; 

interface ChatInputProps {
  onSendMessage: (payload: { text?: string; type: 'text' | 'image' | 'video' | 'file'; fileData?: string; fileName?: string; fileSize?: number }) => void;
  receiverId: string;
  senderId: string;
}

const TYPING_TIMEOUT = 3000; // 3 seconds after last keypress to stop typing
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export default function ChatInput({ onSendMessage, receiverId, senderId }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTypingLocal, setIsTypingLocal] = useState(false);

  // --- File Upload States ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null); // For image/video preview
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      // Handle file sending
      handleSendFile();
    } else if (message.trim()) {
      // Handle text message sending
      onSendMessage({ type: 'text', text: message });
      setMessage('');
      textareaRef.current?.focus();
      stopTyping();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else {
      if (!isTypingLocal) {
        setIsTypingLocal(true);
        socket.emit('typing_started', { senderId, receiverId });
      }
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
    if (e.target.value.trim() === '') {
      stopTyping();
    }
  };

  // --- File Handling Functions ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File Too Large",
          description: `Please select a file smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
          variant: "destructive",
        });
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setSelectedFile(null);
        setFilePreview(null);
        return;
      }

      setSelectedFile(file);
      setIsFilePreviewOpen(true); // Open the preview dialog

      // Generate preview for image/video
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For other file types, just indicate that a file is selected
        setFilePreview(null);
      }
    } else {
      setSelectedFile(null);
      setFilePreview(null);
      setIsFilePreviewOpen(false);
    }
  };

  const handleSendFile = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = reader.result as string; 
        let messageType: 'image' | 'video' | 'file';

        if (selectedFile.type.startsWith('image/')) {
          messageType = 'image';
        } else if (selectedFile.type.startsWith('video/')) {
          messageType = 'video';
        } else {
          messageType = 'file';
        }

        onSendMessage({
          type: messageType,
          fileData: fileData,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          text: message.trim() ? message : undefined, // Include text if typed
        });

        // Reset states after sending
        setSelectedFile(null);
        setFilePreview(null);
        setIsFilePreviewOpen(false);
        setMessage(''); // Clear text input after sending file
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear file input
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setIsFilePreviewOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear file input
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

          {/* --- File Input Button --- */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" // Accepted file types
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 relative">
          {/* Display selected file info if available */}
          {selectedFile && (
            <div className="absolute -top-12 left-0 right-0 bg-gray-100 dark:bg-gray-800 p-2 rounded-t-lg flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={selectedFile ? `Add a caption... (optional)` : `Type a message...`}
            className="min-h-[44px] max-h-32 py-3 pr-12 resize-none"
            rows={1}
            disabled={isFilePreviewOpen}
          />

          {message.trim() || selectedFile ? ( // Enable send button if message or file is present
            <Button
              type="submit"
              size="icon"
              className="absolute bottom-1.5 right-1.5 h-8 w-8 rounded-full p-0"
              disabled={isFilePreviewOpen} // Disable send button if preview is open
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

      {/* --- File Preview Dialog --- */}
      <Dialog open={isFilePreviewOpen} onOpenChange={setIsFilePreviewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Preview File</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {filePreview && selectedFile?.type.startsWith('image/') && (
              <img src={filePreview} alt="Preview" className="max-w-full h-auto rounded-md object-contain max-h-80 mx-auto" />
            )}
            {filePreview && selectedFile?.type.startsWith('video/') && (
              <video controls src={filePreview} className="max-w-full h-auto rounded-md object-contain max-h-80 mx-auto" />
            )}
            {!filePreview && selectedFile && (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-md">
                <Paperclip className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-center text-sm text-muted-foreground break-all">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">({(selectedFile.size / 1024).toFixed(2)} KB)</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Ready to send {selectedFile?.type.startsWith('image') ? 'this image' : selectedFile?.type.startsWith('video') ? 'this video' : 'this file'}?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleRemoveFile}>Cancel</Button>
            <Button onClick={handleSendFile}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}