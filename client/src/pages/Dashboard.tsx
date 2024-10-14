import { useState } from 'react';
import useUserStore from '../stores/userStore';
import Navbar from '../components/Navbar';
import EditProfile from '../components/tabs/EditProfile';
import Search from '../components/tabs/Search';
import ChatPage from '../components/tabs/ChatPage';
import Community from '../components/tabs/Community';

const Dashboard: React.FC = () => {
  const user = useUserStore(state => state.user);
  const [currentTab, setCurrentTab] = useState<string>("search");
  return (
    <section className="flex">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="container mx-auto flex flex-col gap-16 py-24 w-full">
        {user ? (
          currentTab === "editProfile" ? (
            <EditProfile />
          ) : currentTab === "search" ? (
            <Search />
          ) : currentTab === "chat" ? (
            <ChatPage /> // Pass the chatReceiver to ChatPage
          ) : (
            <Community />
          )
        ) : null}
      </div>
    </section>
  );
};

export default Dashboard;
