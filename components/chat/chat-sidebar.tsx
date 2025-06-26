"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Sliders, Plus, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface Group {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  members: string[];
}

interface ChatSidebarProps {
  onSelectContact: (contact: Contact) => void;
  selectedContactId?: string;
  // IMPORTANT: Add these props for group handling if you implement it in ChatLayout
  onSelectGroup: (group: Group) => void;
  selectedGroupId?: string;
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
  onSelectGroup, // Destructure the new prop
  selectedGroupId, // Destructure the new prop
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [newContactEmail, setNewContactEmail] = useState("");
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [profile, setProfile] = useState<{
    name?: string;
    email?: string;
    avatar?: string; // Changed from avatarUrl to avatar to match your Contact interface and user object
  }>({});
  
  const [userAvatar, setUserAvatar] = useState("https://github.com/shadcn.png"); // For immediate preview
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contactAdded, setContactAdded] = useState(false);
  const { toast } = useToast();
  const [statusChanged, setStatusChanged] = useState(false);
  const [isContacts, setIsContacts] = useState(true); // Default to contacts view

  // Mock group data (replace with actual fetch from backend)
  const mockGroups: Group[] = [
    {
      id: "group1",
      name: "Work Team",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=WorkTeam",
      lastMessage: "Project deadline is next week!",
      time: "10:30 AM",
      unread: 3,
      members: ["Alice", "Bob", "Charlie"],
    },
    {
      id: "group2",
      name: "Family Chat",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FamilyChat",
      lastMessage: "Don't forget dinner tonight.",
      time: "Yesterday",
      unread: 0,
      members: ["Mom", "Dad", "Sister"],
    },
    {
      id: "group3",
      name: "Gaming Squad",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GamingSquad",
      lastMessage: "New game out!",
      time: "1 week ago",
      unread: 1,
      members: ["Player1", "Player2"],
    },
  ];

  useEffect(() => {
    setGroups(mockGroups);

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
      setUserAvatar(data.user.avatar); // Ensure avatar is updated with the new URL
    });

    socket.on("updateProfile_error", (data) => { // LISTEN FOR UPDATE ERROR
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
      // Optionally revert avatar if upload failed and you want to be precise
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
    socket.on("contact_profile_updated", (data) => { // LISTEN FOR OTHER CONTACTS' PROFILE UPDATES
        console.log("Received contact profile update:", data);
        setContacts((prevContacts) =>
            prevContacts.map((contact) =>
                contact.id === data.contactId
                    ? { ...contact, ...data.updatedData } // Merge updated data
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
            contact.contactUser.avatarUrl || // Use 'avatar' field from backend
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.contactUser.email}`,
          lastMessage: contact.lastMessage || "",
          time: formattedTime,
          unread: contact.unread || 0,
          status: contact.status || "offline", // Initial status from DB
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
      const contactUserAvatar = data.contact.contactUser?.avatar; // Use 'avatar'
      const contactUserStatus = data.contact.contactUser?.status;

      const newContact: Contact = {
        id: data.contact._id,
        name:
          contactUserName ||
          (contactUserEmail ? contactUserEmail.split("@")[0] : "Unknown"),
        email: contactUserEmail,
        avatar:
          contactUserAvatar || // Use 'avatar'
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
      setTimeout(() => setContactAdded(false), 1000); // Reset after 3 seconds
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
      socket.off("updateProfile_success"); // Clean up
      socket.off("updateProfile_error");   // Clean up
      socket.off("get_contacts_success");
      socket.off("get_contacts_error");
      socket.off("add_contact_success");
      socket.off("add_contact_error");
      socket.off("contact_status_update");
      socket.off("contact_profile_updated"); // Clean up
      socket.off("handleOffline_success");
      socket.off("handleOnline_success");
    };
  }, [toast, contactAdded, onSelectContact, setStatusChanged]); // Removed setStatusChanged from deps as it's not used here

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.members.some((member) =>
        member.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleAddContact = () => {
    if (!newContactEmail.trim() || !newContactEmail.includes("@")) return;
    socket.emit("add_contact", { email: newContactEmail });
  };

  const handleProfilePictureChange = async ( // Made async
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

      // 1. Immediate Client-Side Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        // 2. Upload to Cloudinary via Next.js API route
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

        // 3. Emit update to Socket.IO backend
        console.log("Emitting updateProfile event with:", uploadedAvatarUrl);
        socket.emit('updateProfile', { avatarUrl: uploadedAvatarUrl });

        // Success and error toasts for this operation are handled by the
        // socket.on('updateProfile_success') and socket.on('updateProfile_error')
        // listeners in the useEffect hook.

      } catch (error: any) {
        console.error("Profile picture upload failed:", error);
        toast({
          title: "Upload Failed",
          description: error.message || "Could not upload profile picture.",
          variant: "destructive",
        });
        // Revert the preview if the upload completely failed
        setUserAvatar(profile?.avatar || "https://github.com/shadcn.png");
      }
    }
  };

  const handleSelectGroup = (group: Group) => {
    onSelectGroup(group); // Use the prop passed from ChatLayout
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
              <AvatarImage src={userAvatar} alt="User" /> {/* Uses userAvatar for preview */}
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
          <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Plus className="h-5 w-5" />
              </Button>
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
          <Button variant="ghost" size="icon">
            <Sliders className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={isContacts ? "Search contacts..." : "Search groups..."}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Contact/Group list toggle */}
      <div className="p-2">
        <div className="flex flex-row font-semibold gap-2 p-2 text-sm text-muted-foreground border-b border-gray-200 dark:border-gray-800">
          <span
            className={`cursor-pointer px-3 py-1 rounded-md ${
              isContacts ? " text-gray-900 dark:text-gray-50" : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
            }`}
            onClick={() => setIsContacts(true)}
          >
            Contacts
          </span>
          <span
            className={`cursor-pointer px-3 py-1 rounded-md ${
              !isContacts ? " text-gray-900 dark:text-gray-50" : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
            }`}
            onClick={() => setIsContacts(false)}
          >
            Groups
          </span>
        </div>
      </div>

      {/* Contact or Group list */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <AnimatePresence mode="wait">
            {isContacts ? (
              <motion.div
                key="contacts-list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
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
            ) : (
              <motion.div
                key="groups-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleSelectGroup(group)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg cursor-pointer
                        transition-all duration-200 transform hover:scale-[1.02]
                        ${
                          selectedGroupId === group.id // Use selectedGroupId here
                            ? "bg-gray-200 dark:bg-gray-800"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
                        }
                      `}
                    >
                      <Avatar>
                        <AvatarImage src={group.avatar} alt={group.name} />
                        <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{group.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {group.lastMessage || ``}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-xs text-muted-foreground">
                          {group.time}
                        </div>
                        {(group.unread ?? 0) > 0 && (
                          <Badge variant="default" className="px-1.5 py-0.5">
                            {group.unread}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No groups found.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}