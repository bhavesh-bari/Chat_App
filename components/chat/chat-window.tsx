// frontend/components/chat/ChatWindow.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import ChatHeader from '@/components/chat/chat-header';
import ChatMessages from '@/components/chat/chat-messages';
import ChatInput from '@/components/chat/chat-input';
import socket from '@/lib/socket';
import { useToast } from "@/hooks/use-toast";
// No need for 'set' from 'mongoose' here, remove it if it's not used.
// import { set } from 'mongoose'; // This line seems out of place for frontend
import GroupChatWindow from './group-chat/GroupChatWindow'; // Keep if used for group chat

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
  status: 'sent' | 'delivered' | 'read';
}

interface ChatWindowProps {
  contact: {
    id: string;
    name: string;
    email?: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
  };
  Tab: string;
  onBack: () => void;
}

export default function ChatWindow({ contact, onBack, Tab }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false); // Consider if this is still needed, contact.status might be enough
  const [deliver, setDeliver] = useState(false); // Consider if this is still needed, message.status should handle this

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('get_profile');

    socket.on('getProfile_success', (data) => {
      setCurrentUser(data.user);
    });
    // This listener seems to be for the *other* user joining the room
    socket.on('contact_joined', ({ contactId, inroom }) => {
      // You might want to update the *contact's* status here, not the current user's.
      // The current user knows they are online.
      if (contactId === contact.id && inroom) { // Check if the joined contact is the currently active contact
        setIsOnline(true); // This variable `isOnline` here refers to the *contact's* in-room status.
      }
    });
    socket.on('getProfile_error', (err) => {
      console.error("❌ ChatWindow: Profile error:", err);
      toast({
        title: "Error",
        description: err.error || "Failed to load user profile.",
        variant: "destructive",
      });
    });

    return () => {
      socket.off('contact_joined');
      socket.off('getProfile_success');
      socket.off('getProfile_error');
    };
  }, [toast, contact.id]); // Add contact.id to dependency array

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    if (contact?.id && currentUser?._id) {
      socket.emit('get_messages', { contactId: contact.id });
    }

    socket.on('get_messages_success', (data) => {
      setMessages(data.messages);
      scrollToBottom();
    });

    // --- UPDATED message_sent LISTENER ---
    socket.on('message_sent', ({ message }) => {
      // Ensure the message object matches the Message interface
      const newMessage: Message = {
        id: message._id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        type: message.type, // Use the type from the backend
        text: message.text, // Text will be null for file messages
        fileUrl: message.fileUrl,
        fileName: message.fileName,
        fileSize: message.fileSize,
        timestamp: message.timestamp,
        status: message.status,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollToBottom();
    });

    // --- UPDATED message_received LISTENER ---
    socket.on('message_received', (data) => {
      // Ensure the message object matches the Message interface
      if (data.message.senderId === contact.id) {
        setMessages(prevMessages => [...prevMessages, {
          id: data.message._id,
          senderId: data.message.senderId,
          receiverId: data.message.receiverId,
          type: data.message.type,
          text: data.message.text,
          fileUrl: data.message.fileUrl,
          fileName: data.message.fileName,
          fileSize: data.message.fileSize,
          timestamp: data.message.timestamp,
          status: 'delivered', // Mark as delivered upon receipt
        }]);
        scrollToBottom();
      }
    });

    socket.on('message_status_updated', ({ messageId, status, updatedBy }) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, status: status } : msg
        )
      );
      // Removed specific 'setDeliver' state as message status should be enough
    });


    socket.on('message_error', (data) => {
      console.error("❌ Message error:", data.error);
      toast({
        title: "Message Error",
        description: data.error || "Failed to send or retrieve message.",
        variant: "destructive",
      });
    });
    socket.on('typing_started', (data) => {
      if (data.senderId === contact.id) {
        setIsTyping(true);
      }
    });

    socket.on('typing_stopped', (data) => {
      if (data.senderId === contact.id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off('get_messages_success');
      socket.off('message_sent');
      socket.off('message_received');
      socket.off('message_error');
      socket.off('typing_started');
      socket.off('typing_stopped');
      socket.off('message_status_updated');
      setMessages([]);
      setIsTyping(false);
      setIsOnline(false); // Reset this when chat window unmounts
      setDeliver(false); // Reset this
    };
  }, [contact.id, toast, currentUser?._id]); // Removed isOnline and deliver from dependencies

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]); // Scroll when messages or typing status changes


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- MODIFIED handleSendMessage to accept file data ---
  const handleSendMessage = (payload: { text?: string; type: 'text' | 'image' | 'video' | 'file'; fileData?: string; fileName?: string; fileSize?: number }) => {
    if (!currentUser || !contact.id) {
      toast({
        title: "Cannot Send Message",
        description: "Please ensure you are logged in and have selected a contact.",
        variant: "destructive",
      });
      return;
    }

    if (payload.type === 'text' && (!payload.text || !payload.text.trim())) {
      toast({
        title: "Cannot Send Message",
        description: "Text message cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (payload.type !== 'text' && !payload.fileData) {
      toast({
        title: "Cannot Send Message",
        description: "File data is missing for file message.",
        variant: "destructive",
      });
      return;
    }

    socket.emit('send_message', {
      senderId: currentUser._id,
      receiverId: contact.id,
      ...payload, // Pass the entire payload (text/type/fileData/fileName/fileSize)
    });
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <ChatHeader contact={contact} onBack={onBack} />
        <ChatMessages
          messages={messages}
          contactId={contact.id}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          currentUserId={currentUser?._id} // Pass current user ID
        />
        <ChatInput
          onSendMessage={handleSendMessage}
          receiverId={contact.id}
          senderId={currentUser?._id || ''}
        />
      </div>
    </>
  );
}