// components/chat/ChatSidebar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Sliders, Plus, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from 'lucide-react';
import RecentGroupsList from "./group-chat/RecentGroupsList";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import UserStatusDot from "@/components/chat/user-status-dot";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import socket from "@/lib/socket";
import RecentContactsList from "@/components/chat/contact_chat/RecentContactsList";

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

interface ChatSidebarProps {
  onSelectContact: (contact: Contact) => void;
  selectedContactId?: string;
  setTab: (tab: string) => void;
}

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export default function ChatSidebar({
  onSelectContact,
  selectedContactId,
  setTab,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContactEmail, setNewContactEmail] = useState("");
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the menu div
  const buttonRef = useRef<HTMLButtonElement>(null); // Ref for the button
  const [profile, setProfile] = useState<{
    name?: string;
    email?: string;
    avatar?: string;
  }>({});

  const [userAvatar, setUserAvatar] = useState("https://github.com/shadcn.png");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contactAdded, setContactAdded] = useState(false);
  const { toast } = useToast();
  const [statusChanged, setStatusChanged] = useState(false);
  const [isContacts, setIsContacts] = useState(true);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);


  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("get_profile");
    socket.emit("get_contacts");
    socket.emit('join_all_rooms');

    const handleContactsChange = (data: {
      receiverId: string;
      senderId: string;
      unread: number;
      lastMessage: string;
      time: string;
    }) => {
      const me = JSON.parse(localStorage.getItem('user') || '{}');
      if (data.receiverId !== me._id) return;

      setContacts(prev =>
        prev.map(c =>
          c.id === data.senderId
            ? {
              ...c,
              unread: data.unread,
              lastMessage: data.lastMessage,
              time: new Date(data.time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }
            : c
        )
      );
    };

    socket.on('contacts_changes', handleContactsChange);

    socket.on("getProfile_success", (data) => {
      console.log("✅ Got profile:", data.user);
      setProfile(data.user);
      setUserAvatar(data.user.avatarUrl || "https://github.com/shadcn.png");
    });

    socket.on('join_all_rooms_success', (data) => {
      console.log(data.message);
    });

    socket.on("updateProfile_success", (data) => {
      toast({
        title: "Success",
        description: data.message,
      });

      setProfile(data.user);
      setUserAvatar(data.user.avatar);
    });

    socket.on("updateProfile_error", (data) => {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
      setUserAvatar(profile?.avatar || "https://github.com/shadcn.png");
    });

    socket.on("handleOnline_success", () => {
      console.log("✅ User is online");
      setStatusChanged(true);
      setTimeout(() => {
        setStatusChanged(false);
      }, 1000);
    });

    socket.on("handleOffline_success", () => {
      console.log("✅ User is offline");
      setStatusChanged(true);
      setTimeout(() => {
        setStatusChanged(false);
      }, 1000);
    });

    socket.on("contact_status_update", (data) => {
      console.log("Received contact status update:", data);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === data.contactId
            ? { ...contact, status: data.status }
            : contact
        )
      );
    });

    socket.on("contact_profile_updated", (data) => {
      console.log("Received contact profile update:", data);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === data.contactId
            ? { ...contact, ...data.updatedData }
            : contact
        )
      );
    });

    socket.on("getProfile_error", (err) => {
      console.error("❌ Profile error:", err);
    });

    socket.on("get_contacts_success", (data) => {
      console.log("✅ Got contacts:", data.contacts);
      const formattedContacts: Contact[] = data.contacts.map((contact: any) => {
        const formattedTime = contact.time
          ? new Date(contact.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          : "";

        return {
          id: contact.contactUser._id,
          name:
            contact.contactUser.name || contact.contactUser.email.split("@")[0],
          email: contact.contactUser.email,
          avatar:
            contact.contactUser.avatarUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.contactUser.email}`,
          lastMessage: contact.lastMessage || "",
          time: formattedTime,
          unread: contact.unread || 0,
          status: contact.status || "offline",
        };
      });
      setContacts(formattedContacts);
    });

    socket.on("get_contacts_error", (err) => {
      console.error("❌ Get contacts error:", err);
      toast({
        title: "Error",
        description: err.error || "Failed to load contacts.",
        variant: "destructive",
      });
    });

    socket.on("add_contact_success", (data) => {
      toast({
        title: "Success",
        description: data.message,
      });

      const formattedTime = data.contact.time
        ? new Date(data.contact.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
        : "";

      const contactUserName = data.contact.contactUser?.name;
      const contactUserEmail = data.contact.contactUser?.email;
      const contactUserAvatar = data.contact.contactUser?.avatar;
      const contactUserStatus = data.contact.contactUser?.status;

      const newContact: Contact = {
        id: data.contact._id,
        name:
          contactUserName ||
          (contactUserEmail ? contactUserEmail.split("@")[0] : "Unknown"),
        email: contactUserEmail,
        avatar:
          contactUserAvatar ||
          (contactUserEmail
            ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${contactUserEmail}`
            : "https://github.com/shadcn.png"),
        lastMessage: data.contact.lastMessage,
        time: formattedTime,
        unread: data.contact.unread,
        status: contactUserStatus || "offline",
      };

      setContacts((prev) => [newContact, ...prev]);
      setNewContactEmail("");
      setIsAddingContact(false);
      setContactAdded(true);
      setTimeout(() => setContactAdded(false), 1000);
    });

    socket.on("add_contact_error", (data) => {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
    });

    return () => {
      socket.off("getProfile_success");
      socket.off("getProfile_error");
      socket.off("updateProfile_success");
      socket.off("updateProfile_error");
      socket.off("get_contacts_success");
      socket.off("get_contacts_error");
      socket.off("add_contact_success");
      socket.off("add_contact_error");
      socket.off("contact_status_update");
      socket.off("contact_profile_updated");
      socket.off("handleOffline_success");
      socket.off("handleOnline_success");
      socket.off("contacts_changes");
    };
  }, [toast, contactAdded, onSelectContact]);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleAddContact = () => {
    if (!newContactEmail.trim() || !newContactEmail.includes("@")) return;
    socket.emit("add_contact", { email: newContactEmail });
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Error",
          description: "Only .jpg, .jpeg, .png and .webp formats are supported",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Failed to upload image.');
        }

        const { url: uploadedAvatarUrl } = await uploadResponse.json();
        console.log("Uploaded to Cloudinary:", uploadedAvatarUrl);

        socket.emit('updateProfile', { avatarUrl: uploadedAvatarUrl });

      } catch (error: any) {
        console.error("Profile picture upload failed:", error);
        toast({
          title: "Upload Failed",
          description: error.message || "Could not upload profile picture.",
          variant: "destructive",
        });
        setUserAvatar(profile?.avatar || "https://github.com/shadcn.png");
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* User profile */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar} alt="User" />
              <AvatarFallback>{profile?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="h-4 w-4" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium">{profile?.name || "Your Name"}</div>
            <div className="text-xs text-muted-foreground truncate">
              {profile?.email || "your.email@example.com"}
            </div>
          </div>

          {/* New structure for responsive menu */}
          <div className="relative"> {/* This is the new parent for relative positioning */}
            <Button
              ref={buttonRef} // Assign ref to the button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
            {/* The menu dropdown */}
            <div
              ref={menuRef} // Assign ref to the menu div
              className={`absolute right-0 mt-2 w-44 bg-blue-100 dark:bg-gray-800 rounded-md shadow-lg p-2 flex flex-col gap-2 z-10 ${menuOpen ? 'block' : 'hidden'}`}
            >
              {/* Dialog for Add New Contact, now properly nested for the Trigger */}
              <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
                <DialogTrigger asChild>
                  <div
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-md"
                    onClick={() => setMenuOpen(false)}
                  >
                    Add contact
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="friend@example.com"
                        value={newContactEmail}
                        onChange={(e) => setNewContactEmail(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleAddContact}
                      disabled={!newContactEmail.includes("@")}
                    >
                      Add Contact
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-md">
                Create group
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            // Placeholder reflects the active tab for display
            placeholder={isContacts ? "Search contacts..." : "Search groups..."}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Contact/Group list toggle (as per your image) */}
      <div className="p-2">
        <div className="flex flex-row font-semibold gap-2 p-2 text-sm text-muted-foreground border-b border-gray-200 dark:border-gray-800">
          <span
            className={`cursor-pointer px-3 py-1 rounded-md ${isContacts ? " text-gray-900 dark:text-gray-50" : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
              }`}
            onClick={() => {
              setIsContacts(true);
              setTab("contact");
              setSearchQuery(""); // Clear search when switching tabs
            }}
          >
            Contacts
          </span>
          <span
            className={`cursor-pointer px-3 py-1 rounded-md ${!isContacts ? " text-gray-900 dark:text-gray-50" : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
              }`}
            onClick={() => {
              setIsContacts(false);
              setTab("group");
              setSearchQuery(""); // Clear search when switching tabs
            }}
          >
            Groups
          </span>
        </div>
      </div>

      {/* Content area: Contacts list or "No groups found" message */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <AnimatePresence mode="wait">
            {isContacts ? (
              <RecentContactsList
                contacts={filteredContacts}
                onSelectContact={onSelectContact}
                selectedContactId={selectedContactId}
              />
            ) : (
              <RecentGroupsList />
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}