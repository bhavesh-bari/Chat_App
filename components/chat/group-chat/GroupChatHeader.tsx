// components/chat/group-chat/GroupChatHeader.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Phone, Video, MoreVertical, ChevronLeft, X, Users, Info, MessageSquare, LogOut, Trash2, Edit, UserPlus, FileText } from 'lucide-react';
import { useState } from 'react';

// Import the centralized dummy data and types
import { GroupData, currentUserId } from '@/hooks/mockGroupData';

interface GroupChatHeaderProps {
    group: GroupData;
    currentUserId: string;
    onBack: () => void;
}

function GroupChatHeader({ group, currentUserId, onBack }: GroupChatHeaderProps) {
    const [isOpenMenu, setOpenMenu] = useState<boolean>(false);
    const [hidden, setHidden] = useState<boolean>(true); // Controls visibility of the group details sidebar

    // Use the passed group data
    const dummyGroup: GroupData = group; // Renamed for consistency if you prefer, but can use 'group' directly

    const onlineMembersCount = dummyGroup.members.filter(member => member.isOnline).length;
    const totalMembersCount = dummyGroup.members.length;

    // Find the admin's username for display
    const adminUser = dummyGroup.members.find(member => member.user === dummyGroup.admin);
    const adminUsername = adminUser ? adminUser.username : "Unknown Admin";


    return (
        <div className="w-full">
            <div className="flex items-center p-1 bg-white dark:bg-gray-800 rounded-md shadow-md h-16 w-full">
                <div className="md:hidden mr-2" onClick={onBack}>
                    <ChevronLeft size={30} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded cursor-pointer" />
                </div>
                {/* Avatar */}
                <div className="h-12 w-12 flex-shrink-0">
                    <Image
                        src={dummyGroup.avatarUrl}
                        alt="Group Avatar"
                        width={48}
                        height={48}
                        className="rounded-full shadow-lg object-cover"
                    />
                </div>

                {/* Group Info */}
                <div className="flex flex-col justify-center ml-3 flex-grow min-w-0">
                    <div className="text-black dark:text-white font-medium truncate">{dummyGroup.name}</div>
                    <div className="text-gray-400 text-xs">{`${onlineMembersCount} Members Online`}</div>
                </div>

                {/* Action Icons */}
                <div className="flex items-center ml-auto mr-3 gap-3 relative">
                    <Phone size={30} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded cursor-pointer" />
                    <Video size={30} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded cursor-pointer" />
                    <MoreVertical size={30} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded cursor-pointer" onClick={() => setOpenMenu(!isOpenMenu)} />
                    {/* Dropdown Menu for MoreVertical */}
                    <div className={`absolute top-12 right-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg p-2 z-10 ${isOpenMenu ? 'block' : 'hidden'}`}>
                        <div
                            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-2 rounded-md cursor-pointer"
                            onClick={() => {
                                setHidden(false); // Open the group details sidebar
                                setOpenMenu(false); // Close the dropdown menu
                            }}
                        >
                            <Info size={18} /> <span>View Group Info</span>
                        </div>
                        <div className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-2 rounded-md cursor-pointer">
                            <UserPlus size={18} /> <span>Add Members</span>
                        </div>
                        <div className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-2 rounded-md cursor-pointer">
                            <MessageSquare size={18} /> <span>Clear Chat</span>
                        </div>
                        <div className="h-px bg-gray-300 dark:bg-gray-700 my-2" />
                        <div className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-2 rounded-md cursor-pointer">
                            <Trash2 size={18} /> <span>Delete Group</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Group Details / View Group Sidebar --- */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] lg:w-[450px] bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${hidden ? "translate-x-full" : "translate-x-0"} z-50 overflow-y-auto scrollbar-hide`}>
                <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Group Info</h2>
                    <X size={28} onClick={() => setHidden(true)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer text-gray-600 dark:text-gray-300" />
                </div>

                <div className="p-4 space-y-4">
                    {/* Group Avatar and Name */}
                    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <Image
                            src={dummyGroup.avatarUrl}
                            alt="Group Avatar"
                            width={100}
                            height={100}
                            className="rounded-full shadow-lg object-cover border-4 border-blue-500"
                        />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">{dummyGroup.name}</h2>
                        <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400">
                            <span className='rounded-full w-3 h-3 bg-green-400'></span>
                            <p className="text-sm">{`${onlineMembersCount} Members Online`}</p>
                        </div>
                        {/* Edit Group Icon/Button (Example) */}
                        <button className="mt-3 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                            <Edit size={16} /> Edit Group Info
                        </button>
                    </div>

                    {/* Group Description */}
                    <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                <FileText size={20} className="text-blue-500" /> Group Description
                            </h3>
                            <button className="text-blue-500 hover:text-blue-600 text-sm">Edit</button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">
                            {dummyGroup.description}
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                            Created By: <span className="font-medium text-gray-700 dark:text-gray-300">{adminUsername}</span>
                        </p>
                    </div>

                    {/* Members List */}
                    <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                            <Users size={20} className="text-purple-500" /> Members ({totalMembersCount})
                        </h3>
                        <div className="mt-4 space-y-3">
                            {dummyGroup.members.map((member) => (
                                <div key={member.user} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Image
                                                src={member.avatarUrl}
                                                alt={`${member.username}'s Avatar`}
                                                width={40}
                                                height={40}
                                                className="rounded-full shadow-sm object-cover"
                                            />
                                            {member.isOnline && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                                            )}
                                        </div>
                                        <div className="font-medium text-gray-800 dark:text-white">{member.username}</div>
                                        {member.isAdmin && (
                                            <div className='bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full'>Admin</div>
                                        )}
                                    </div>
                                    {/* Optional: More options for member here if needed */}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
                        <button className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-medium py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                            <LogOut size={20} /> Leave Group
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupChatHeader;