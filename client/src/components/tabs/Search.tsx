import React, { useEffect, useState } from "react";
import UserCard from "../user/UserCard";
import SelectedUserCard from "../user/SelectedUserCard";
import Heading from "../text/Heading";
import Input from "../inputs/Input";
import SelectInput from "../inputs/SelectInput";
import SubmitButton from "../inputs/SubmitButton";
import useUserStore from "../../states/userStore";
import useSearchStore from "../../states/searchStore";
import useChatStore from "../../states/chatStore";
import isToxic from "../../utils/isToxic";

interface SearchProps {
  setCurrentTab: (tab: string) => void;
  setCurrentChatId: (chatId: string) => void;
}

const Search: React.FC<SearchProps> = ({ setCurrentTab, setCurrentChatId }) => {
  const { user, status, setStatus, fetchUserStatus, updateUserStatus } = useUserStore();
  const { 
    query, 
    searchResults, 
    selectedUser, 
    error,
    setQuery, 
    setSelectedUser, 
    searchUser 
  } = useSearchStore();
  const { createChat } = useChatStore();

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchUserStatus(user?._id);
  }, [user?._id, fetchUserStatus]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    await searchUser(query, user);
    setIsSearching(false);
  };

  const openChat = async (receiverId: string) => {
    const chatId = await createChat([user._id, receiverId]);
    if (chatId) {
      setCurrentChatId(chatId);
      setCurrentTab("chat");
    }
  };

  const setUserStatus = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!status) {
      console.error("Status is null");
      return;
    }

    if (await isToxic(status?.content)) {
      alert("Your status contains inappropriate content. Please remove it before saving.");
      return;
    }

    await updateUserStatus(user?._id, status?.content, status.duration);
  }

  // Function to calculate the remaining time in days or hours
  const calculateRemainingTime = (expirationDate: string) => {
    const now = new Date();
    const expiration = new Date(expirationDate);
    const timeDiff = expiration.getTime() - now.getTime();
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day(s)`;
    } else if (hours > 0) {
      return `${hours} hour(s)`;
    } else {
      return "Expired";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-20">
      <div className="flex flex-col gap-12">
        <Heading>Search for people!</Heading>
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            name="search"
            id="search"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            className="bg-neutral-800 p-3 text-neutral-200 rounded-md w-96"
            autoComplete="off"
            maxLength={80}
          />
          <button 
            type="submit" 
            className={`px-4 py-2 bg-white text-neutral-800 rounded-md ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Status Input and Duration Dropdown Side-by-Side */}
        {error && (
          <div className="text-red-500 mt-2">{error}</div>
        )}

        <form className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-72"> {/* Apply width here */}
              <Input 
                label="Status" 
                name="content" 
                placeholder="What's on your mind?" 
                value={status?.content} 
                setValue={(value) => {
                  setStatus(({ ...status, content: value }));
                }} 
                maxLength={100}
              />
            </div>
            <div className="w-30"> {/* Apply width here */}
              <SelectInput 
                label="Duration" 
                name="duration" 
                options={["24h", "48h", "1w"]} 
                value={status?.duration} 
                setValue={(value) => {
                  setStatus({ ...status, duration: value });
                }} 
              />
            </div>
          </div>
          <div className="mt-9">
            <SubmitButton onClick={setUserStatus} />
          </div>

        </form>
        
        {user?.about?.status?.content && user?.about?.status?.expirationDate ? (
          <div>
            <p>
              Status expires in {calculateRemainingTime(user.about.status.expirationDate)}
            </p>
          </div>
        ) : null}

        <ul className="flex gap-4">
          {searchResults.map((user, index) => (
            <UserCard key={index} user={user} selectUser={setSelectedUser} />
          ))}
        </ul>
      </div>

      <div className="col-span-1">
        {selectedUser && <SelectedUserCard selectedUser={selectedUser} openChat={openChat} />}
      </div>
    </div>
  );
};

export default Search;