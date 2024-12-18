import React, { useEffect, useState, useCallback } from "react";
import UserCard from "../users/UserCard";
import SelectedUserCard from "../users/SelectedUserCard";
import Heading from "../text/Heading";
import Input from "../inputs/Input";
import SelectInput from "../inputs/SelectInput";
import SubmitButton from "../inputs/SubmitButton";
import useUserStore from "../../stores/userStore";
import useSearchStore from "../../stores/searchStore";
import useChatStore from "../../stores/chatStore";
import Highlight from "../text/Highlight";

const Search: React.FC<{ setCurrentTab: (tab: string) => void }> = ({ setCurrentTab }) => {
  const { user, status, setStatus, fetchUserStatus, updateUserStatus, statusError  } = useUserStore();
  const { 
    query, 
    searchResults, 
    selectedUser, 
    error,
    setQuery, 
    setSelectedUser, 
    searchUser 
  } = useSearchStore();

  const { createChat, setCurrentChatId } = useChatStore();

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchUserStatus(user?._id);
  }, [user?._id, fetchUserStatus]);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      await searchUser(query, user?._id);
    } finally {
      setIsSearching(false);
    }
  }, [query, user, searchUser]);

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
      return `${days} day(s) ${hours} hour(s)`;
    } else if (hours > 0) {
      return `${hours} hour(s)`;
    } else {
      return "Expired";
    }
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-5 gap-8 md:gap-20 overflow-y-auto p-4">
      <div className="flex flex-col gap-8 w-full md:col-span-3">
        <Heading><Highlight>Search</Highlight> for people!</Heading>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            name="search"
            id="search"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            className="bg-neutral-800 p-3 text-neutral-200 rounded-md w-full sm:w-96"
            autoComplete="off"
            maxLength={80}
          />
          <SubmitButton 
            onClick={handleSearch}
            loading={isSearching}
          >
            search
          </SubmitButton>
        </form>

        {error && (
          <div className="text-red-500 mt-2">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <form className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full sm:w-auto">
            <div className="w-full sm:w-72">
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
            <div className="sm:w-24">
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
          <div className="w-full sm:w-auto">
            <SubmitButton onClick={setUserStatus}>
              save
            </SubmitButton>
          </div>
        </form>
  
        {status?.content && status?.expirationDate && (
          <div>            
            <p>
              Status expires in {calculateRemainingTime(status.expirationDate.toString())}
            </p>
            {statusError && <p className="text-red-500">{statusError}</p>}
          </div>
        )}
        </div>

        <ul className="flex flex-wrap gap-4">
          {isSearching ? (
            <div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
              <div className="flex flex-col gap-4 w-48 p-4 h-60 rounded bg-neutral-800">
                  <div className="flex items-center justify-center w-40 h-28 rounded bg-neutral-700">
                  </div>
                  <div className="flex items-center justify-center w-40 h-6 rounded bg-neutral-700">
                  </div>
                  <div className="flex items-center justify-center w-40  h-12 rounded bg-neutral-700">
                  </div>
              </div>
              <div className="flex flex-col gap-4 w-48 p-4 h-60 rounded bg-neutral-800">
                  <div className="flex items-center justify-center w-40 h-28 rounded bg-neutral-700">
                  </div>
                  <div className="flex items-center justify-center w-40 h-6 rounded bg-neutral-700">
                  </div>
                  <div className="flex items-center justify-center w-40  h-12 rounded bg-neutral-700">
                  </div>
              </div>
              <div className="flex flex-col gap-4 w-48 p-4 h-60 rounded bg-neutral-800">
                  <div className="flex items-center justify-center w-40 h-28 rounded bg-neutral-700">
                  </div>
                  <div className="flex items-center justify-center w-40 h-6 rounded bg-neutral-700">
                  </div>
                  <div className="flex items-center justify-center w-40  h-12 rounded bg-neutral-700">
                  </div>
              </div>
          </div>
          ) : (
            searchResults.map((user, index) => (
              <UserCard key={index} user={user} selectUser={setSelectedUser} />
            ))
          )}
        </ul>
      </div>

      <div className="w-full md:col-span-2">
        {selectedUser && <SelectedUserCard selectedUser={selectedUser} openChat={openChat} setCurrentTab={setCurrentTab} />}
      </div>
    </div>
  );
};

export default Search;
