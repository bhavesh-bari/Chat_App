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
    receiverId: string; // Or chatId if it's a unified message interface
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
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('get_profile');

        socket.on('getProfile_success', (data) => {
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

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
        // Fetch messages for the selected contact
        if (contact?.id && currentUser?._id) {
            socket.emit('get_messages', { contactId: contact.id });
        }

        socket.on('get_messages_success', (data) => {
            setMessages(data.messages);
            scrollToBottom();
        });

        socket.on('message_sent', ({ message }) => {
            const newMessage: Message = {
                id: message._id,
                senderId: message.senderId,
                receiverId: message.receiverId,
                text: message.text,
                timestamp: message.timestamp,
                status: message.status,
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            scrollToBottom();
        });

        socket.on('message_received', (data) => {
            if (data.message.senderId === contact.id) {
                setMessages(prevMessages => [...prevMessages, { ...data.message, status: 'delivered' }]);
                scrollToBottom();
            }
        });

        socket.on('message_status_updated', ({ messageId, status }) => {
            // Logic to update message status in UI if needed
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === messageId ? { ...msg, status: status } : msg
                )
            );
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
            setMessages([]); // Clear messages when contact changes
            setIsTyping(false);
        };
    }, [contact.id, toast, currentUser?._id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]); // Scroll on new messages or typing status change

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
                receiverId={contact.id}
                senderId={currentUser?._id || ''}
            />
        </div>
    );
}