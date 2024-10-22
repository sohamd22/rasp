import axios from "axios";
import React, { useEffect, useCallback, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import getCookie from "../utils/getCookie";

import EditProfile from "../components/tabs/EditProfile";
import Search from "../components/tabs/Search";
import ChatPage from "../components/tabs/ChatPage";
import Navbar from "../components/NavBar";
import Community from "../components/tabs/Community";

import useUserStore from '../states/userStore';
import useChatStore from '../states/chatStore';
import useSocketStore from '../states/socketStore';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const { setCurrentChatId } = useChatStore();
  const [currentTab, setCurrentTab] = useState("search");

  const { connectSocket, disconnectSocket } = useSocketStore();

  const Logout = useCallback(() => {
    setUser(null);
    googleLogout();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    navigate("/signin");
  }, [navigate, setUser]);

  useEffect(() => {
    const verifyCookie = async () => {
      const token = getCookie('token');
      console.log(token);
      if (!token || token === "undefined") {
        navigate("/signin");
        return;
      }
      try { 
        const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}`, {}, { withCredentials: true });
        const { status, user } = data;
        
        if (status) {
          setUser(user);
          connectSocket(user._id);
          
          return () => {
            disconnectSocket();
          }
        } else {
          Logout();
        }
      } catch (error) {
        console.error("Error verifying cookie", error);
        Logout();
      }
    };
    verifyCookie(); 
  }, [navigate, Logout, setUser, connectSocket, disconnectSocket]);

  return (
        <section className="flex">
          <Navbar Logout={Logout} currentTab={currentTab} setCurrentTab={setCurrentTab} />
          <div className="container mx-auto flex flex-col gap-16 py-24 w-full">
            {user ? (
              currentTab === "editProfile" ? (
                <EditProfile />
              ) : currentTab === "search" ? (
                <Search 
                  setCurrentTab={setCurrentTab} 
                  setCurrentChatId={setCurrentChatId}
                />
              ) : currentTab === "chat" ? (
                <ChatPage /> // Pass the chatReceiver to ChatPage
              ) : (
                <Community />
              )
            ) : null}
          </div>
        </section>
  );
}

export default Dashboard;
