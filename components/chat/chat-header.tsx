"use client";

import { Phone, Video, MoreVertical, ChevronLeft } from 'lucide-react';
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

interface ChatHeaderProps {
  contact: any;
  onBack: () => void;
}

export default function ChatHeader({ contact, onBack }: ChatHeaderProps) {
  return (
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
            <DropdownMenuItem>View contact</DropdownMenuItem>
            <DropdownMenuItem>Mute notifications</DropdownMenuItem>
            <DropdownMenuItem>Search</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Block contact</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}