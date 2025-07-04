// data/mockGroupData.ts

// Define types for your dummy data to ensure consistency and type safety
export interface GroupMember {
    user: string; // This would be the User _id in real app (string representation of ObjectId)
    username: string; // Added for displaying member names
    avatarUrl: string; // Added for displaying member avatars
    isAdmin: boolean; // To identify the admin in the members list
    isOnline: boolean; // For dummy 'online' status
    unread?: number; // Optional for RecentGroupsList
    status?: "online" | "offline"; // Optional, matches Mongoose schema enum
}

export interface Message {
    _id: string; // Message _id
    senderId: string; // User _id of the sender
    sendername: string;
    senderAvatarUrl: string;
    text: string;
    timestamp: string; // ISO string (Date in Mongoose, but string after JSON.stringify/transfer)
}

export interface GroupData {
    _id: string; // Group _id
    name: string;
    avatarUrl: string;
    description: string;
    members: GroupMember[];
    admin: string; // User _id of the admin
    lastmessage?: string; // Optional for RecentGroupsList
    messages: Message[]; // This will now be mandatory and hold messages specific to this group
    createdAt?: string; // Optional, from Mongoose timestamps
    updatedAt?: string; // Optional, from Mongoose timestamps
}

// --- Dummy Users (to simulate ObjectId references) ---
// In a real app, these would come from your User model
const dummyUsers = {
    "user_bhavesh_bari": {
        _id: "6687d903f0b2f5d7e8e8e8e8", // Example ObjectId string
        username: "Bhavesh Bari",
        avatarUrl: "https://github.com/shadcn.png",
        isOnline: true,
    },
    "user_alice": {
        _id: "6687d903f0b2f5d7e8e8e8e9",
        username: "Alice Smith",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=AliceSmith&backgroundColor=b6e3f4,c0aede",
        isOnline: true,
    },
    "user_charlie": {
        _id: "6687d903f0b2f5d7e8e8e8ea",
        username: "Charlie Brown",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=CharlieBrown&backgroundColor=ffd5dc,f7d399",
        isOnline: false,
    },
    "user_david": {
        _id: "6687d903f0b2f5d7e8e8e8eb",
        username: "David Johnson",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=DavidJohnson&backgroundColor=c0aede,d9d9f9",
        isOnline: true,
    },
    "user_emily": {
        _id: "6687d903f0b2f5d7e8e8e8ec",
        username: "Emily Davis",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=EmilyDavis&backgroundColor=a7d9b5,ffdeb3",
        isOnline: false,
    },
    "user_frank": {
        _id: "6687d903f0b2f5d7e8e8e8ed",
        username: "Frank Miller",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=FrankMiller&backgroundColor=d1d4f9,b6e3f4",
        isOnline: true,
    },
    "user_grace": {
        _id: "6687d903f0b2f5d7e8e8e8ee",
        username: "Grace Wilson",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=GraceWilson&backgroundColor=ffd5dc,c0aede",
        isOnline: true,
    },
    "user_henry": {
        _id: "6687d903f0b2f5d7e8e8e8ef",
        username: "Henry White",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=HenryWhite&backgroundColor=a7d9b5,f7d399",
        isOnline: false,
    },
    "user_isabelle": {
        _id: "6687d903f0b2f5d7e8e8e8f0",
        username: "Isabelle Green",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=IsabelleGreen&backgroundColor=d9d9f9,ffdeb3",
        isOnline: true,
    },
    "user_jack": {
        _id: "6687d903f0b2f5d7e8e8e8f1",
        username: "Jack Black",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=JackBlack&backgroundColor=b6e3f4,ffd5dc",
        isOnline: false,
    },
    "user_sarah": {
        _id: "6687d903f0b2f5d7e8e8e8f2",
        username: "Sarah",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=a7d9b5,ffdeb3",
        isOnline: true,
    },
    "user_mom": {
        _id: "6687d903f0b2f5d7e8e8e8f3",
        username: "Mom",
        avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Mom&backgroundColor=d9d9f9,c0aede",
        isOnline: true,
    },
};

// --- Dummy Messages Data for specific groups ---
// This makes it easier to assign messages directly to groups
const messagesForGroup1: Message[] = [
    {
        _id: "msg1_g1", senderId: dummyUsers["user_alice"]._id, sendername: dummyUsers["user_alice"].username,
        senderAvatarUrl: dummyUsers["user_alice"].avatarUrl,
        text: "Hey team! Good morning everyone. Hope you all had a great start to your day. Let's conquer this week!",
        timestamp: new Date("2025-07-04T09:00:00Z").toISOString(), // Today
    },
    {
        _id: "msg2_g1", senderId: dummyUsers["user_bhavesh_bari"]._id, sendername: dummyUsers["user_bhavesh_bari"].username,
        senderAvatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl,
        text: "Morning Alice! You too. Got my coffee, ready to dive into the tasks.",
        timestamp: new Date("2025-07-04T09:02:00Z").toISOString(), // Today
    },
    {
        _id: "msg3_g1", senderId: dummyUsers["user_charlie"]._id, sendername: dummyUsers["user_charlie"].username,
        senderAvatarUrl: dummyUsers["user_charlie"].avatarUrl,
        text: "Good morning! Just finished reviewing the latest PR. Looks solid.",
        timestamp: new Date("2025-07-04T09:05:00Z").toISOString(), // Today
    },
    {
        _id: "msg4_g1", senderId: dummyUsers["user_bhavesh_bari"]._id, sendername: dummyUsers["user_bhavesh_bari"].username,
        senderAvatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl,
        text: "Almost ready for the meeting!",
        timestamp: new Date("2025-07-04T10:16:00Z").toISOString(), // Today
    },
    {
        _id: "msg5_g1", senderId: dummyUsers["user_alice"]._id, sendername: dummyUsers["user_alice"].username,
        senderAvatarUrl: dummyUsers["user_alice"].avatarUrl,
        text: "Excellent, Charlie! We need to finalize the client presentation by tomorrow. Any blockers from anyone?",
        timestamp: new Date("2025-07-03T11:10:00Z").toISOString(), // Yesterday
    },
    {
        _id: "msg6_g1", senderId: dummyUsers["user_bhavesh_bari"]._id, sendername: dummyUsers["user_bhavesh_bari"].username,
        senderAvatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl,
        text: "I'm still working on the analytics report for slide 7. Should be done in an hour.",
        timestamp: new Date("2025-07-03T11:15:00Z").toISOString(), // Yesterday
    },
    {
        _id: "msg7_g1", senderId: dummyUsers["user_david"]._id, sendername: dummyUsers["user_david"].username,
        senderAvatarUrl: dummyUsers["user_david"].avatarUrl,
        text: "Got it! 'hi too'",
        timestamp: new Date("2025-07-03T11:43:00Z").toISOString(), // Yesterday
    },
    {
        _id: "msg8_g1", senderId: dummyUsers["user_david"]._id, sendername: dummyUsers["user_david"].username,
        senderAvatarUrl: dummyUsers["user_david"].avatarUrl,
        text: "hh",
        timestamp: new Date("2025-07-03T11:41:00Z").toISOString(), // Yesterday
    },
    {
        _id: "msg9_g1", senderId: dummyUsers["user_david"]._id, sendername: dummyUsers["user_david"].username,
        senderAvatarUrl: dummyUsers["user_david"].avatarUrl,
        text: "No blockers on my end. The design mockups are ready to be integrated.",
        timestamp: new Date("2025-07-01T10:16:00Z").toISOString(), // Last Tuesday
    },
    {
        _id: "msg10_g1", senderId: dummyUsers["user_alice"]._id, sendername: dummyUsers["user_alice"].username,
        senderAvatarUrl: dummyUsers["user_alice"].avatarUrl,
        text: "Perfect! David, can you coordinate with Bhavesh for the data integration once his report is ready?",
        timestamp: new Date("2025-07-01T09:22:00Z").toISOString(), // Last Tuesday
    },
    {
        _id: "msg11_g1", senderId: dummyUsers["user_bhavesh_bari"]._id, sendername: dummyUsers["user_bhavesh_bari"].username,
        senderAvatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl,
        text: "hi",
        timestamp: new Date("2025-07-01T10:16:00Z").toISOString(), // Last Tuesday
    },
    {
        _id: "msg12_g1", senderId: dummyUsers["user_david"]._id, sendername: dummyUsers["user_david"].username,
        senderAvatarUrl: dummyUsers["user_david"].avatarUrl,
        text: "Sure, will do!",
        timestamp: new Date("2025-06-25T14:23:00Z").toISOString(), // Older (e.g., June 25th)
    },
    {
        _id: "msg13_g1", senderId: dummyUsers["user_bhavesh_bari"]._id, sendername: dummyUsers["user_bhavesh_bari"].username,
        senderAvatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl,
        text: "Sounds good, David. I'll ping you when it's uploaded to the shared drive.",
        timestamp: new Date("2025-06-20T09:25:00Z").toISOString(), // Even Older
    },
];

const messagesForGroup2: Message[] = [
    {
        _id: "msg1_g2", senderId: dummyUsers["user_david"]._id, sendername: dummyUsers["user_david"].username,
        senderAvatarUrl: dummyUsers["user_david"].avatarUrl,
        text: "Anyone up for a game this Saturday?",
        timestamp: new Date("2025-07-03T10:00:00Z").toISOString(),
    },
    {
        _id: "msg2_g2", senderId: dummyUsers["user_bhavesh_bari"]._id, sendername: dummyUsers["user_bhavesh_bari"].username,
        senderAvatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl,
        text: "I'm in! What time?",
        timestamp: new Date("2025-07-03T10:05:00Z").toISOString(),
    },
    {
        _id: "msg3_g2", senderId: dummyUsers["user_emily"]._id, sendername: dummyUsers["user_emily"].username,
        senderAvatarUrl: dummyUsers["user_emily"].avatarUrl,
        text: "Me too! Let's aim for late afternoon.",
        timestamp: new Date("2025-07-03T10:10:00Z").toISOString(),
    },
];

const messagesForGroup3: Message[] = [
    {
        _id: "msg1_g3", senderId: dummyUsers["user_emily"]._id, sendername: dummyUsers["user_emily"].username,
        senderAvatarUrl: dummyUsers["user_emily"].avatarUrl,
        text: "The new mockups are ready for review.",
        timestamp: new Date("2025-07-02T14:00:00Z").toISOString(),
    },
    {
        _id: "msg2_g3", senderId: dummyUsers["user_bhavesh_bari"]._id, sendername: dummyUsers["user_bhavesh_bari"].username,
        senderAvatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl,
        text: "Great, I'll take a look this afternoon.",
        timestamp: new Date("2025-07-02T14:05:00Z").toISOString(),
    },
    {
        _id: "msg3_g3", senderId: dummyUsers["user_frank"]._id, sendername: dummyUsers["user_frank"].username,
        senderAvatarUrl: dummyUsers["user_frank"].avatarUrl,
        text: "Looks promising, good job!",
        timestamp: new Date("2025-07-02T14:10:00Z").toISOString(),
    },
];

const messagesForGroup4: Message[] = [
    {
        _id: "msg1_g4", senderId: dummyUsers["user_mom"]._id, sendername: dummyUsers["user_mom"].username,
        senderAvatarUrl: dummyUsers["user_mom"].avatarUrl,
        text: "Dinner at 7 PM tonight?",
        timestamp: new Date("2025-07-01T16:00:00Z").toISOString(),
    },
    {
        _id: "msg2_g4", senderId: dummyUsers["user_bhavesh_bari"]._id, sendername: dummyUsers["user_bhavesh_bari"].username,
        senderAvatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl,
        text: "Yes, I'll be there!",
        timestamp: new Date("2025-07-01T16:05:00Z").toISOString(),
    },
];

const messagesForGroup5: Message[] = [
    {
        _id: "msg1_g5", senderId: dummyUsers["user_isabelle"]._id, sendername: dummyUsers["user_isabelle"].username,
        senderAvatarUrl: dummyUsers["user_isabelle"].avatarUrl,
        text: "New ideas for Q3 campaign are due by end of week.",
        timestamp: new Date("2025-06-30T09:00:00Z").toISOString(),
    },
    {
        _id: "msg2_g5", senderId: dummyUsers["user_bhavesh_bari"]._id, sendername: dummyUsers["user_bhavesh_bari"].username,
        senderAvatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl,
        text: "Got it, brainstorming now.",
        timestamp: new Date("2025-06-30T09:05:00Z").toISOString(),
    },
];

const messagesForGroup6: Message[] = [
    {
        _id: "msg1_g6", senderId: dummyUsers["user_alice"]._id, sendername: dummyUsers["user_alice"].username,
        senderAvatarUrl: dummyUsers["user_alice"].avatarUrl,
        text: "Chapter 3 was intense!",
        timestamp: new Date("2025-06-28T21:00:00Z").toISOString(),
    },
];

const messagesForGroup7: Message[] = [
    {
        _id: "msg1_g7", senderId: dummyUsers["user_bhavesh_bari"]._id, sendername: dummyUsers["user_bhavesh_bari"].username,
        senderAvatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl,
        text: "Flights are booked!",
        timestamp: new Date("2025-06-01T12:00:00Z").toISOString(),
    },
];


// --- Dummy Recent Groups for RecentGroupsList ---
export const recentGroupsData: GroupData[] = [
    {
        _id: "6687d903f0b2f5d7e8e8e8e0", // Example ObjectId string
        name: "Dev Team Squad",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=DevTeam&scale=90",
        description: "Our core development team for project Aurora.",
        members: [
            { user: dummyUsers["user_alice"]._id, username: dummyUsers["user_alice"].username, avatarUrl: dummyUsers["user_alice"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_alice"].isOnline, unread: 2, status: dummyUsers["user_alice"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_bhavesh_bari"]._id, username: dummyUsers["user_bhavesh_bari"].username, avatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_bhavesh_bari"].isOnline, unread: 2, status: dummyUsers["user_bhavesh_bari"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_charlie"]._id, username: dummyUsers["user_charlie"].username, avatarUrl: dummyUsers["user_charlie"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_charlie"].isOnline, unread: 0, status: dummyUsers["user_charlie"].isOnline ? "online" : "offline" }
        ],
        admin: dummyUsers["user_alice"]._id,
        lastmessage: "Alice: Don't forget the stand-up at 10 AM!",
        createdAt: new Date("2025-07-01T08:00:00Z").toISOString(),
        updatedAt: new Date("2025-07-04T10:15:00Z").toISOString(), // Use updatedAt for "time"
        messages: messagesForGroup1, // Assign messages directly
    },
    {
        _id: "6687d903f0b2f5d7e8e8e8e1",
        name: "Weekend Warriors ⚽",
        avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Warriors",
        description: "Casual football matches and weekend hangouts.",
        members: [
            { user: dummyUsers["user_david"]._id, username: dummyUsers["user_david"].username, avatarUrl: dummyUsers["user_david"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_david"].isOnline, unread: 0, status: dummyUsers["user_david"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_bhavesh_bari"]._id, username: dummyUsers["user_bhavesh_bari"].username, avatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_bhavesh_bari"].isOnline, unread: 0, status: dummyUsers["user_bhavesh_bari"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_emily"]._id, username: dummyUsers["user_emily"].username, avatarUrl: dummyUsers["user_emily"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_emily"].isOnline, unread: 0, status: dummyUsers["user_emily"].isOnline ? "online" : "offline" }
        ],
        admin: dummyUsers["user_david"]._id,
        lastmessage: "David: Game's on for Saturday!",
        createdAt: new Date("2025-06-25T15:30:00Z").toISOString(),
        updatedAt: new Date("2025-07-03T18:00:00Z").toISOString(), // Yesterday
        messages: messagesForGroup2, // Assign messages directly
    },
    {
        _id: "6687d903f0b2f5d7e8e8e8e2",
        name: "Project Phoenix 🔥",
        avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=Phoenix",
        description: "Critical project discussion and progress updates.",
        members: [
            { user: dummyUsers["user_emily"]._id, username: dummyUsers["user_emily"].username, avatarUrl: dummyUsers["user_emily"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_emily"].isOnline, unread: 5, status: dummyUsers["user_emily"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_bhavesh_bari"]._id, username: dummyUsers["user_bhavesh_bari"].username, avatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_bhavesh_bari"].isOnline, unread: 5, status: dummyUsers["user_bhavesh_bari"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_frank"]._id, username: dummyUsers["user_frank"].username, avatarUrl: dummyUsers["user_frank"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_frank"].isOnline, unread: 0, status: dummyUsers["user_frank"].isOnline ? "online" : "offline" }
        ],
        admin: dummyUsers["user_emily"]._id,
        lastmessage: "Bhavesh: Meeting minutes uploaded.",
        createdAt: new Date("2025-06-20T10:00:00Z").toISOString(),
        updatedAt: new Date("2025-07-02T11:00:00Z").toISOString(), // Day before yesterday (Wed)
        messages: messagesForGroup3, // Assign messages directly
    },
    {
        _id: "6687d903f0b2f5d7e8e8e8e3",
        name: "Family Chat 🏡",
        avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Family",
        description: "Keeping up with family.",
        members: [
            { user: dummyUsers["user_grace"]._id, username: dummyUsers["user_grace"].username, avatarUrl: dummyUsers["user_grace"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_grace"].isOnline, unread: 0, status: dummyUsers["user_grace"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_bhavesh_bari"]._id, username: dummyUsers["user_bhavesh_bari"].username, avatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_bhavesh_bari"].isOnline, unread: 0, status: dummyUsers["user_bhavesh_bari"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_henry"]._id, username: dummyUsers["user_henry"].username, avatarUrl: dummyUsers["user_henry"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_henry"].isOnline, unread: 0, status: dummyUsers["user_henry"].isOnline ? "online" : "offline" }
        ],
        admin: dummyUsers["user_grace"]._id,
        lastmessage: "Mom: What's for dinner tonight?",
        createdAt: new Date("2025-06-15T09:00:00Z").toISOString(),
        updatedAt: new Date("2025-07-01T17:00:00Z").toISOString(), // Tue
        messages: messagesForGroup4, // Assign messages directly
    },
    {
        _id: "6687d903f0b2f5d7e8e8e8e4",
        name: "Marketing Brainstorm",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=MB",
        description: "Ideas for our next campaign.",
        members: [
            { user: dummyUsers["user_isabelle"]._id, username: dummyUsers["user_isabelle"].username, avatarUrl: dummyUsers["user_isabelle"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_isabelle"].isOnline, unread: 1, status: dummyUsers["user_isabelle"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_bhavesh_bari"]._id, username: dummyUsers["user_bhavesh_bari"].username, avatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_bhavesh_bari"].isOnline, unread: 1, status: dummyUsers["user_bhavesh_bari"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_jack"]._id, username: dummyUsers["user_jack"].username, avatarUrl: dummyUsers["user_jack"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_jack"].isOnline, unread: 0, status: dummyUsers["user_jack"].isOnline ? "online" : "offline" }
        ],
        admin: dummyUsers["user_isabelle"]._id,
        lastmessage: "Sarah: Let's schedule another session.",
        createdAt: new Date("2025-06-10T11:00:00Z").toISOString(),
        updatedAt: new Date("2025-06-30T14:00:00Z").toISOString(), // Mon
        messages: messagesForGroup5, // Assign messages directly
    },
    {
        _id: "6687d903f0b2f5d7e8e8e8e5",
        name: "Book Club Reads 📚",
        avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=BookClub",
        description: "Discussions on our monthly book selection.",
        members: [
            { user: dummyUsers["user_alice"]._id, username: dummyUsers["user_alice"].username, avatarUrl: dummyUsers["user_alice"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_alice"].isOnline, unread: 0, status: dummyUsers["user_alice"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_bhavesh_bari"]._id, username: dummyUsers["user_bhavesh_bari"].username, avatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_bhavesh_bari"].isOnline, unread: 0, status: dummyUsers["user_bhavesh_bari"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_charlie"]._id, username: dummyUsers["user_charlie"].username, avatarUrl: dummyUsers["user_charlie"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_charlie"].isOnline, unread: 0, status: dummyUsers["user_charlie"].isOnline ? "online" : "offline" }
        ],
        admin: dummyUsers["user_alice"]._id,
        lastmessage: "Emily: Chapter 3 was intense!",
        createdAt: new Date("2025-05-20T19:00:00Z").toISOString(),
        updatedAt: new Date("2025-06-28T21:00:00Z").toISOString(), // Last Week
        messages: messagesForGroup6, // Assign messages directly
    },
    {
        _id: "6687d903f0b2f5d7e8e8e8e6",
        name: "Travel Plans ✈️",
        avatarUrl: "https://api.dicebear.com/7.x/big-ears/svg?seed=Travel",
        description: "Planning our next adventure!",
        members: [
            { user: dummyUsers["user_david"]._id, username: dummyUsers["user_david"].username, avatarUrl: dummyUsers["user_david"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_david"].isOnline, unread: 0, status: dummyUsers["user_david"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_bhavesh_bari"]._id, username: dummyUsers["user_bhavesh_bari"].username, avatarUrl: dummyUsers["user_bhavesh_bari"].avatarUrl, isAdmin: true, isOnline: dummyUsers["user_bhavesh_bari"].isOnline, unread: 0, status: dummyUsers["user_bhavesh_bari"].isOnline ? "online" : "offline" },
            { user: dummyUsers["user_emily"]._id, username: dummyUsers["user_emily"].username, avatarUrl: dummyUsers["user_emily"].avatarUrl, isAdmin: false, isOnline: dummyUsers["user_emily"].isOnline, unread: 0, status: dummyUsers["user_emily"].isOnline ? "online" : "offline" }
        ],
        admin: dummyUsers["user_david"]._id,
        lastmessage: "You: Flights are booked!",
        createdAt: new Date("2025-04-10T10:00:00Z").toISOString(),
        updatedAt: new Date("2025-06-01T12:00:00Z").toISOString(), // Last Month
        messages: messagesForGroup7, // Assign messages directly
    },
];

export const currentUserId = dummyUsers["user_bhavesh_bari"]._id;

// Optional: You can keep activeGroupData if you still need a single, pre-defined active group for some default state or testing.
// However, with `recentGroupsData` now containing all group data, including messages,
// you might initialize `selectedGroup` in GroupChatLayout using `recentGroupsData[0]` or a lookup by ID.
export const activeGroupData: GroupData = recentGroupsData[0]; // Example: Default to the first group