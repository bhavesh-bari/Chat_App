// frontend/components/chat/ChatWindow.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import ChatHeader from '@/components/chat/chat-header';
import ChatMessages from '@/components/chat/chat-messages';
import ChatInput from '@/components/chat/chat-input';
import socket from '@/lib/socket';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
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
  onBack: () => void;
}

export default function ChatWindow({ contact, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false); // This controls the typing indicator display
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Effect to get current user's profile on mount to get their ID
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('get_profile');

    socket.on('getProfile_success', (data) => {
      console.log("✅ ChatWindow: Got current user profile:", data.user);
      setCurrentUser(data.user);
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
      socket.off('getProfile_success');
      socket.off('getProfile_error');
    };
  }, [toast]);

  // Effect for fetching messages and handling real-time message & typing events
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (contact?.id && currentUser?._id) {
        socket.emit('get_messages', { contactId: contact.id });
        console.log(`Requesting messages for contact: ${contact.id}`);
    }

    socket.on('get_messages_success', (data) => {
      console.log("✅ Got messages:", data.messages);
      setMessages(data.messages);
    });

    socket.on('message_sent', (data) => {
      console.log("✅ Message sent:", data.message);
      setMessages(prevMessages => prevMessages.map(msg =>
        (msg.id === data.message._id || msg.id === `temp-msg-${data.message.timestamp}`) ? { ...data.message, status: 'sent' } : msg
      ));
      scrollToBottom();
    });

    socket.on('message_received', (data) => {
      console.log("✅ Message received:", data.message);
      // Ensure the received message is for the currently active chat
      if (data.message.senderId === contact.id) {
        setMessages(prevMessages => [...prevMessages, { ...data.message, status: 'delivered' }]);
        scrollToBottom();
      }
    });

    socket.on('message_error', (data) => {
      console.error("❌ Message error:", data.error);
      toast({
        title: "Message Error",
        description: data.error || "Failed to send or retrieve message.",
        variant: "destructive",
      });
    });

    // --- Typing Indicator Listeners ---
    socket.on('typing_started', (data) => {
      if (data.senderId === contact.id) { // Only show typing for the current contact
        setIsTyping(true);
      }
    });

    socket.on('typing_stopped', (data) => {
      if (data.senderId === contact.id) { // Only hide typing for the current contact
        setIsTyping(false);
      }
    });
    // --- End Typing Indicator Listeners ---


    return () => {
      socket.off('get_messages_success');
      socket.off('message_sent');
      socket.off('message_received');
      socket.off('message_error');
      socket.off('typing_started'); // Clean up typing listeners
      socket.off('typing_stopped'); // Clean up typing listeners
      setMessages([]);
      setIsTyping(false); // Reset typing status when chat changes
    };
  }, [contact.id, toast, currentUser?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !currentUser || !contact.id) {
      toast({
        title: "Cannot Send Message",
        description: "Please ensure you are logged in and have selected a contact.",
        variant: "destructive",
      });
      return;
    }

    const tempId = `temp-msg-${Date.now()}`;

    const newMessage: Message = {
      id: tempId,
      senderId: currentUser._id,
      receiverId: contact.id,
      text,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    socket.emit('send_message', {
      senderId: currentUser._id,
      receiverId: contact.id,
      text,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader contact={contact} onBack={onBack} />
      <ChatMessages
        messages={messages}
        contactId={contact.id}
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
      />
      <ChatInput
        onSendMessage={handleSendMessage}
        receiverId={contact.id} // Pass receiver ID
        senderId={currentUser?._id || ''} // Pass sender ID (current user)
      />
    </div>
  );
}