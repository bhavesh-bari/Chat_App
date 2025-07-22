"use client";

import { Phone, Video, MoreVertical, ChevronLeft, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import UserStatusDot from '@/components/chat/user-status-dot';
import { useState, useEffect } from 'react';
import socket from '@/lib/socket'; // Direct import of the socket instance
import { useToast } from "@/hooks/use-toast";// Assuming you have Shadcn UI Toast

interface ChatHeaderProps {
  contact: {
    id: string; // Ensure contact has an 'id' for deletion
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
    phone?: string;
    email?: string;
    about?: string;
  };
  onBack: () => void;
  // Optional: A callback to notify the parent component that a contact was deleted
  onContactDeleted?: (deletedContactId: string) => void;
}

export default function ChatHeader({ contact, onBack, onContactDeleted }: ChatHeaderProps) {
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const { toast } = useToast(); // Get the toast function

  // --- Socket.IO Event Handlers ---
  useEffect(() => {
    // No need to check for `socket` being null, as it's directly imported and always exists
    // (though its connection status might vary).

    const handleDeleteSuccess = (data: { message: string, deletedContactId: string }) => {
      toast({
        title: "Contact Deleted",
        description: data.message,
        // Assuming you have a 'success' variant for toast, or use 'default'
        // For Shadcn UI, 'variant' can be 'default', 'destructive', 'success', etc.
        // If you don't have a 'success' variant, use 'default'.
        // variant: "success",
      });
      console.log('Delete contact success:', data.message);

      // Notify parent component to update contact list
      if (onContactDeleted) {
        onContactDeleted(data.deletedContactId);
      }
      onBack(); // Go back to the contact list after deletion
    };

    const handleDeleteError = (data: { error: string }) => {
      toast({
        title: "Error Deleting Contact",
        description: data.error,
        variant: "destructive",
      });
      console.error('Delete contact error:', data.error);
    };

    // Listen for the event that the other user was removed from someone's contacts
    const handleContactRemovedFromOtherSide = (data: { removerId: string, removedContactId: string, message: string }) => {
      // Check if *our* current user's ID matches the `removedContactId`
      // This implies the other person (removerId) removed *us*
      // The `contact.id` here is the ID of the person we are chatting with.
      // If the `removerId` (the person who removed) is the current `contact.id`,
      // it means the person we are chatting with just removed us from their contacts.
      if (data.removerId === contact.id) {
        toast({
          title: "Contact Removed You",
          description: data.message || `${contact.name} has removed you from their contacts.`,
          // variant: "warning", // Or 'info'
        });
        console.log(data.message);
        // You might want to automatically navigate back or update UI here
        if (onContactDeleted) {
          onContactDeleted(data.removerId); // Pass the ID of the user who removed you
        }
        onBack();
      }
    };


    socket.on('delete_contact_success', handleDeleteSuccess);
    socket.on('delete_contact_error', handleDeleteError);
    socket.on('contact_removed_from_other_side', handleContactRemovedFromOtherSide);

    return () => {
      socket.off('delete_contact_success', handleDeleteSuccess);
      socket.off('delete_contact_error', handleDeleteError);
      socket.off('contact_removed_from_other_side', handleContactRemovedFromOtherSide);
    };
  }, [toast, contact.id, contact.name, onBack, onContactDeleted]); // Add dependencies

  const handleDeleteContact = () => {
    if (confirm(`Are you sure you want to delete ${contact.name} from your contacts? This action cannot be undone.`)) {
      // Since `socket` is directly imported, it will always be defined.
      // Its connection status is handled by `initializeSocket` and listeners in `socket.ts`.
      socket.emit('delete_contact', { contactId: contact.id });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="relative">
            <Avatar>
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <UserStatusDot status={contact.status} className="absolute bottom-0 right-0" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-medium">{contact.name}</div>
            <div className="text-xs text-muted-foreground">
              {contact.status === 'online'
                ? 'Online'
                : contact.status === 'away'
                  ? 'Away'
                  : 'Last seen recently'}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Video className="h-5 w-9" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowProfileDetails(true)}>View contact</DropdownMenuItem>
                <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                <DropdownMenuItem>Search</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleDeleteContact} // Attach the handler here
                >
                  Delete Contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>


      {showProfileDetails && (
        <div
          onClick={() => setShowProfileDetails(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-10 backdrop-blur-sm"
        />
      )}

      {/* Slide-in Profile View Panel */}
      <div
        className={`
          fixed right-0 top-0 h-full w-[90%] sm:w-[400px] bg-white dark:bg-gray-950
          shadow-xl border-l border-gray-200 dark:border-gray-800 z-20
          transform transition-transform duration-300 ease-in-out
          ${showProfileDetails ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
        `}
      >
        <div className="flex justify-end w-full px-4 pt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowProfileDetails(false)}
            className="rounded-full border-gray-300 dark:border-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center px-6 py-4 space-y-2">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-blue-500 dark:ring-blue-400">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback className="text-4xl">
                {contact.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <UserStatusDot
              status={contact.status}
              className="absolute bottom-0 right-0 h-5 w-5"
            />
          </div>

          <h2 className="text-2xl font-semibold">{contact.name}</h2>
          <p className="text-sm text-muted-foreground italic">
            {contact.status === 'online'
              ? 'Online'
              : contact.status === 'away'
                ? 'Away'
                : 'Last seen recently'}
          </p>
        </div>

        <div className="px-6 py-4 space-y-4 overflow-y-auto">
          {contact.phone && (
            <div className="bg-muted p-4 rounded-xl text-center">
              <span className="text-xs text-muted-foreground uppercase">Phone</span>
              <div className="text-sm mt-1 text-blue-600 dark:text-blue-400">
                <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a>
              </div>
            </div>
          )}

          {contact.email && (
            <div className="bg-muted p-4 rounded-xl text-center">
              <span className="text-xs text-muted-foreground uppercase">Email</span>
              <div className="text-sm mt-1 text-blue-600 dark:text-blue-400">
                <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
              </div>
            </div>
          )}

          {contact.about && (
            <div className="bg-muted p-4 rounded-xl text-center">
              <span className="text-xs text-muted-foreground uppercase">About</span>
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300 italic">{contact.about}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}