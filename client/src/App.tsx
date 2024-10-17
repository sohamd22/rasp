import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useUserStore from './stores/userStore';
import useSocketStore from './stores/socketStore';
import useChatStore, { Chat, ChatMessage } from './stores/chatStore';
import useDevspaceStore from './stores/devspaceStore';
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { user, setUser } = useUserStore(state => state);
  const { socket, connectSocket, disconnectSocket } = useSocketStore(state => state);
  const { chats, currentChatId, messages, setMessages, addMessageToCache, updateChat } = useChatStore(state => state);
  const { updateDevspaceInfo } = useDevspaceStore(state => state);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/check', { withCredentials: true });
        setIsAuthenticated(response.data.authenticated);

        if (response.data.authenticated) {
          const userResponse = await axios.get('/api/auth/user', { withCredentials: true });
          setUser(userResponse.data.user);
          connectSocket(userResponse.data.user._id);
        }
        else {
          disconnectSocket();
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        disconnectSocket();
      }
    };
    checkAuth();

    return () => {
      disconnectSocket();
    };
  }, [setUser, connectSocket, disconnectSocket]);

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected to the server');
    };

    const onMessage = (newMessage: ChatMessage) => {
      addMessageToCache(newMessage.chat, newMessage);
      
      if(newMessage.chat === currentChatId) {
        setMessages([...messages, newMessage]);
      }        
        
      const updatedChat = chats.find((chat: Chat) => chat._id === newMessage.chat);
      if (updatedChat) {
        updateChat({
          ...updatedChat,
          lastMessage: {
            messageId: newMessage._id,
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            senderName: newMessage.sender === user._id ? user.name : updatedChat.otherUserName,
            senderId: newMessage.sender
          },
          unreadMessages: newMessage.sender !== user._id && newMessage.chat !== currentChatId
            ? { ...updatedChat.unreadMessages, [user._id]: true }
            : updatedChat.unreadMessages
        });
      }
    };

    socket?.on('connect', onConnect);
    socket?.on('message', onMessage);

    return () => {
      socket?.off('connect', onConnect);
      socket?.off('message', onMessage);
    };
  }, [socket, currentChatId, chats, user, updateChat, addMessageToCache, messages, setMessages]);

  useEffect(() => {
    socket?.on('chat', (updatedChat: Chat) => {
      updateChat(updatedChat);
    });

    return () => {
      socket?.off('chat');
    };
  }, [socket, updateChat]);

  useEffect(() => {
    socket?.on('devspace-update', (updatedDevspace) => {
      updateDevspaceInfo(updatedDevspace);
    });

    return () => {
      socket?.off('devspace-update');
    };
  }, [socket, updateDevspaceInfo]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path='/signin' element={isAuthenticated ? <Navigate to="/" /> : <Signin />} />
      <Route path='/' element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
      <Route path='*' element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
