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
import { useState } from 'react';

interface ChatHeaderProps {
  contact: any;
  onBack: () => void;
}

export default function ChatHeader({ contact, onBack }: ChatHeaderProps) {
  const [showProfileDetails, setShowProfileDetails] = useState(false);

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
              <Video className="h-5 w-5" />
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
                <DropdownMenuItem className="text-destructive">Delete Contact</DropdownMenuItem>
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
