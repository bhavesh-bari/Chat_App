// components/chat/group-chat/RecentGroupsList.tsx
import React from 'react';
import Image from 'next/image';
import { ScrollArea } from '@radix-ui/react-scroll-area';

// Import the centralized dummy data and types
import { recentGroupsData, currentUserId, GroupData } from '@/hooks/mockGroupData';

interface RecentGroupsListProps {
  onSelectGroup: (group: GroupData) => void;
  activeGroupId: string | null;
}

function RecentGroupsList({ onSelectGroup, activeGroupId }: RecentGroupsListProps) {
  // Use the imported dummy data
  const dummyGroups = recentGroupsData;

  // Helper function to format timestamp (e.g., "10:30 AM", "Yesterday", "Mon")
  const formatRelativeTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (diffDays <= 30) {
      return "Last Month";
    }
    return date.toLocaleDateString('en-US');
  };

  return (
    <div className={`md:w-[375px] w-screen h-screen md:h-full  md:block ${activeGroupId ? 'hidden' : 'block'} bg-white dark:bg-gray-900`}>
      <ScrollArea className="h-full">
        <div className="flex flex-col">
          {dummyGroups.map((group) => {
            // Find the unread count for the current user in this group
            const currentUserMember = group.members.find(
              (member) => member.user === currentUserId
            );
            const unreadCount = currentUserMember ? currentUserMember.unread : 0;

            const isActive = group._id === activeGroupId;

            return (
              <div
                key={group._id} // Use _id for the key
                className={`flex items-center p-3 rounded-md shadow-sm h-auto w-full m-1 cursor-pointer
                                    ${isActive
                    ? 'bg-blue-100 dark:bg-blue-700'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                onClick={() => onSelectGroup(group)} // Call the prop function on click
              >
                <div className='h-12 w-12 flex-shrink-0'>
                  <Image
                    src={group.avatarUrl}
                    alt={`${group.name} Avatar`}
                    width={48}
                    height={48}
                    className='rounded-full shadow-lg object-cover'
                  />
                </div>
                <div className='flex flex-col justify-center ml-3 flex-grow min-w-0'>
                  <div className='text-black dark:text-white font-medium truncate'>
                    {group.name}
                  </div>
                  <div className='text-gray-400 text-xs truncate'>
                    {group.lastmessage}
                  </div>
                </div>
                <div className='flex flex-col items-end justify-center ml-auto mr-2 gap-1'>
                  <div className="text-xs text-gray-400">
                    {formatRelativeTime(group.updatedAt!)}
                  </div>
                  {unreadCount && unreadCount > 0 && (
                    <div className='bg-blue-500 rounded-full px-2 py-0.5 text-xs text-white flex items-center justify-center min-w-[20px] h-[20px]'>
                      {unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
export default RecentGroupsList;