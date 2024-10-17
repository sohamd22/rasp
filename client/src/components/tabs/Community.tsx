import { useEffect } from 'react';
import useCommunityStore from '../../stores/communityStore';
import UserCard from '../users/UserCard';
import SelectedUserCard from '../users/SelectedUserCard';
import useChatStore from '../../stores/chatStore';
import useUserStore from '../../stores/userStore';
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
    <div>
      <div className="flex gap-20">
      <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-bold">Community</h1>
          <div className="flex flex-wrap gap-4">
              {communityUsers.map((user) => (
                <UserCard key={user._id} user={ {...user, relevantInfo: user.status ? `says "${user.status}"` : ""} } selectUser={setSelectedUser} />
              ))}
          </div>
        </div>

        <div className="col-span-1">
          {selectedUser && <SelectedUserCard selectedUser={selectedUser} openChat={openChat} />}
        </div>
      </div>
    </div>
    
  );
};

export default Community;
