// frontend/types/chat.d.ts (Or a suitable common types file)

// This interface is already defined in your ChatSidebar, ensuring consistency.
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

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
}

interface Group {
  id: string;
  name: string;
  avatar: string; // Group avatar
  lastMessage?: string;
  time?: string;
  unread?: number;
  members: GroupMember[]; // List of group members
  membersCount: number; // Total number of members
  onlineMembersCount: number; // Number of online members (optional, for display)
}

// Discriminant Union Type for the active chat passed to ChatWindow
type ActiveChatData = { type: 'individual'; data: Contact } | { type: 'group'; data: Group };