// components/chat/group-chat/GroupChatWindow.tsx
import React from 'react';
import GroupChatHeader from '@/components/chat/group-chat/GroupChatHeader';
import GroupChatMessages from '@/components/chat/group-chat/GroupChatMessages';
import GroupChatInput from '@/components/chat/group-chat/GroupChatInput';

import { GroupData, Message } from '@/hooks/mockGroupData'; // Import types

interface GroupChatWindowProps {
  group: GroupData;
  currentUserId: string;
  onBack: () => void;

}

function GroupChatWindow({ group, currentUserId, onBack }: GroupChatWindowProps) {
  // For the messages component, we'll need to filter the dummyMessages
  // based on the selected group's ID.
  // In a real application, 'group.messages' would already contain only the messages
  // for this specific group fetched from the API.
  // For this mock, let's assume activeGroupData has a 'messages' field
  // or we pass all dummyMessages and filter within GroupChatMessages.

  // A more realistic scenario for mock data for messages would be:
  // 1. Each GroupData object in mockGroupData.ts has its own `messages` array.
  // 2. Or, a separate mock data file mapping group IDs to message arrays.
  // For simplicity in this example, we'll pass the 'group' object itself
  // and let GroupChatMessages handle filtering if needed, or we'll ensure
  // the messages passed are already relevant to the group.

  // For the current setup, dummyMessages contains ALL messages.
  // We'll pass the entire 'group' object down, and GroupChatMessages
  // will need to adapt if it's expected to filter.
  // For now, let's just pass the group data and assume messages will be handled.
  // **Important**: In a real app, 'group.messages' would be populated.
  // For this mock, `GroupChatMessages` still uses its internal `dummyMessages`.
  // If you want `GroupChatMessages` to show only messages related to `group`,
  // you'd need a more complex mock `GroupData` structure or a way to filter `dummyMessages` here.
  // For now, GroupChatMessages remains largely independent of `group.messages`
  // because `activeGroupData` in `mockGroupData.ts` does not contain messages.
  // To connect them, `activeGroupData` (or the `group` prop here) needs a `messages` array.

  // Let's modify GroupData to explicitly include messages, and `activeGroupData` in `mockGroupData.ts`
  // will need to be adjusted or simulated.
  // Given the current structure, dummyMessages is a global list.
  // If you want the messages to change based on the selected group, the `GroupData`
  // type in `mockGroupData.ts` needs a `messages` array, and `activeGroupData` should
  // be created such that it includes the messages for that specific group.

  // For now, I'll pass the `group` object. `GroupChatMessages` will still use its global dummyMessages
  // as you've implemented the date separators with that global list.
  // To truly connect, you'd fetch/filter messages specific to `group.id` and pass them.

  return (
    <div className={`md:flex flex-col h-screen w-screen md:h-full md:w-full ${group === null ? 'hidden' : 'flex'}`}>
      <GroupChatHeader group={group} currentUserId={currentUserId} onBack={onBack} />
      <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {/*
                    Currently, GroupChatMessages uses its internal dummyMessages.
                    To make it dynamic, you'd ideally pass group.messages if
                    your GroupData type included a messages array, like this:
                    <GroupChatMessages messages={group.messages} currentUserId={currentUserId} />
                    For this iteration, it will continue to use the global dummyMessages.
                */}
        <GroupChatMessages group={group} currentUserId={currentUserId} />
      </div>
      <GroupChatInput group={group} currentUserId={currentUserId} />
    </div>
  );
}
export default GroupChatWindow;