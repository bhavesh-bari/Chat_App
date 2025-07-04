// components/chat/GroupChatLayout.tsx
"use client"; // This component needs to be client-side to manage state

import React, { useState } from 'react';
import GroupChatWindow from './GroupChatWindow';
import RecentGroupsList from './RecentGroupsList';

// Import the GroupData type and recentGroupsData for initial state/lookup
import { GroupData, recentGroupsData, currentUserId } from '@/hooks/mockGroupData';

function GroupChatLayout() {
  // State to hold the currently selected group
  // Initialize with the first group from recentGroupsData or null
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(
    recentGroupsData.length > 0 ? recentGroupsData[0] : null
  );

  // Function to handle group selection from RecentGroupsList
  const handleSelectGroup = (group: GroupData) => {
    setSelectedGroup(group);
  };
  const onBack = () => {
    setSelectedGroup(null);
  };
  return (
    <div className="flex h-screen w-screen overflow-hidden ">
      <div className=" border-r overflow-y-auto scrollbar-hide">
        <RecentGroupsList
          onSelectGroup={handleSelectGroup}
          activeGroupId={selectedGroup ? selectedGroup._id : null}
        />
      </div>
      <div className={`md:flex flex-1 scrollbar-hide ${selectedGroup === null ? 'hidden' : 'flex'} `}>
        {selectedGroup ? (
          <GroupChatWindow
            group={selectedGroup}
            currentUserId={currentUserId}
            onBack={onBack}
          />
        ) : (
          <div className={`flex items-center justify-center h-full text-gray-500 dark:text-gray-400 `}>
            Please select a group to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupChatLayout;