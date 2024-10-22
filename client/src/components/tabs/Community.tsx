import { useEffect } from 'react';
import useCommunityStore from '../../stores/communityStore';
import UserCard from '../users/UserCard';
import SelectedUserCard from '../users/SelectedUserCard';
import useChatStore from '../../stores/chatStore';
import useUserStore from '../../stores/userStore';
import Heading from '../text/Heading';
import Highlight from '../text/Highlight';

const Community = ({ setCurrentTab }: { setCurrentTab: (tab: string) => void }) => {
  const { communityUsers, fetchCommunityUsers, selectedUser, setSelectedUser } = useCommunityStore();
  const { createChat, setCurrentChatId } = useChatStore();
  const { user } = useUserStore();

  useEffect(() => {
    fetchCommunityUsers();
  }, [fetchCommunityUsers]);

  const openChat = async (receiverId: string) => {
    const chatId = await createChat([user._id, receiverId]);
    if (chatId) {
      setCurrentChatId(chatId);
      setCurrentTab("chat");
    }
  };

  return (
    <div className="container mx-auto px-4 overflow-y-auto">
      <div className="md:grid md:grid-cols-5 flex flex-col md:flex-row gap-8 md:gap-20">
        <div className="flex flex-col gap-16 md:col-span-3">
        <Heading>The RASP <Highlight>Community</Highlight></Heading>
          <div className="flex flex-wrap gap-4">
            {communityUsers.map((user) => (
              <UserCard
                key={user._id}
                user={{ ...user, relevantInfo: user.status ? `says "${user.status}"` : "" }}
                selectUser={setSelectedUser}
              />
            ))}
          </div>
        </div>

        <div className="w-full md:col-span-2">
          {selectedUser && (
            <SelectedUserCard
              selectedUser={selectedUser}
              openChat={openChat}
              setCurrentTab={setCurrentTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
