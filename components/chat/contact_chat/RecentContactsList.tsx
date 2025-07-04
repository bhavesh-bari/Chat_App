// components/chat/RecentContactsList.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import UserStatusDot from "@/components/chat/user-status-dot"; // Assuming this path

interface Contact {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  status: "online" | "offline" | "away";
}

interface RecentContactsListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  selectedContactId?: string;
}

const RecentContactsList: React.FC<RecentContactsListProps> = ({
  contacts,
  onSelectContact,
  selectedContactId,
}) => {
  return (
    <motion.div
      key="contacts-list"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectContact(contact)}
            className={`
              flex items-center gap-3 p-3 rounded-lg cursor-pointer
              transition-all duration-200 transform hover:scale-[1.02]
              ${
                selectedContactId === contact.id
                  ? "bg-gray-200 dark:bg-gray-800"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
              }
            `}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <UserStatusDot
                status={contact.status}
                className="absolute bottom-0 right-0"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{contact.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {contact.lastMessage || contact.email}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-xs text-muted-foreground">
                {contact.time}
              </div>
              {(contact.unread ?? 0) > 0 && (
                <Badge variant="default" className="px-1.5 py-0.5">
                  {contact.unread}
                </Badge>
              )}
            </div>
          </motion.div>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-4">No contacts found.</p>
      )}
    </motion.div>
  );
};

export default RecentContactsList;