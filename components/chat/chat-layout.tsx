"use client";

import { useState, useEffect, useRef } from 'react';
import ChatSidebar from '@/components/chat/chat-sidebar';
import ChatWindow from '@/components/chat/chat-window';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import socket from '@/lib/socket';
import { useToast } from "@/hooks/use-toast";


interface Contact {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  status: 'online' | 'offline' | 'away';
}


export default function ChatLayout() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();
  const prevContactIdRef = useRef<string | null>(null);
  const [tab, setTab] = useState<string>("contact");

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('go_online');

    socket.on('join_all_rooms_error', (data) => {
      console.error('❌ Failed to join all rooms:', data.error);
      toast({
        title: 'Join Room Error',
        description: data.error,
        variant: 'destructive',
      });
    });

    return () => {
      socket.emit('go_offline');
      socket.off('join_all_rooms_success');
      socket.off('join_all_rooms_error');
    };
  }, []);


  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('join_room_success', (data) => {
      console.log('Successfully joined room:', data.room);
    });

    socket.on('join_room_error', (data) => {
      console.error('Error joining room:', data.error);
      toast({
        title: "Error Joining Chat",
        description: data.error || "Failed to join chat room.",
        variant: "destructive",
      });
      setSelectedContact(null);
    });

    return () => {
      socket.off('join_room_success');
      socket.off('join_room_error');
    };
  }, [toast]);

  useEffect(() => {
    if (selectedContact) {
      if (socket.connected) {
        socket.emit('join_room', { contactid: selectedContact.id });
        console.log(`Attempting to join room with contact ID: ${selectedContact.id}`);
      } else {
        toast({
          title: "Connection Error",
          description: "Socket not connected. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [selectedContact, toast]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Mobile menu button
      {isMobile && !isMobileMenuOpen && !selectedContact && (
        <div className="fixed top-4 left-4 z-20">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )} */}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? 'fixed inset-0 z-10' : 'w-1/4'}
          ${isMobile && !isMobileMenuOpen ? 'hidden' : 'flex'}
          flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950
        `}
      >
        <ChatSidebar
          onSelectContact={(contact) => {
            const prevId = prevContactIdRef.current;

            // Leave previous room if switching
            if (prevId && prevId !== contact.id) {
              socket.emit('leave_room', prevId);
              console.log(`Left room: ${prevId}`);
            }

            setSelectedContact(contact);
            // Emit join room
            if (socket.connected) {
              socket.emit('join_room', { contactid: contact.id });
              console.log(`Joined room: ${contact.id}`);
            }

            prevContactIdRef.current = contact.id;
            if (isMobile) setIsMobileMenuOpen(false);
          }}

          selectedContactId={selectedContact?.id}
        />

      </div>

      {/* Chat window */}
      <div
        className={`
          ${isMobile ? 'fixed inset-0' : 'flex-1'}
          ${isMobile && (!selectedContact || isMobileMenuOpen) ? 'hidden' : 'flex'}
          flex-col bg-gray-50 dark:bg-gray-900
        `}
      >
        {selectedContact ? (
          <ChatWindow
            contact={selectedContact}
            Tab={tab}
            onBack={() => {
              const prevId = prevContactIdRef.current;
              if (prevId) {
                socket.emit('leave_room', prevId);
                console.log(`Left room: ${prevId}`);
              }

              setSelectedContact(null);
              if (isMobile) setIsMobileMenuOpen(true);

              prevContactIdRef.current = null;
            }}

          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 max-w-md">
              <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a contact from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}