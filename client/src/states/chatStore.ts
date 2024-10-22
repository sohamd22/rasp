import { create } from 'zustand';
import axios from 'axios';
import { LRUCache } from 'lru-cache';

interface ChatMessage {
  _id: string;
  sender: string;
  senderName: string;
  chat: string;
  content: string;
  timestamp: Date;
}

interface LastMessage {
  messageId: string;
  content: string;
  timestamp: Date;
  senderName: string;
  senderId: string;
}

interface Chat {
  _id: string;
  users: string[];
  groupName?: string;
  isGroupChat: boolean;
  pendingApprovals: string[];
  lastMessage: LastMessage | null;
  otherUserName: string;
  unreadMessages: { [key: string]: boolean };
}

interface ChatState {
  chats: Chat[];
  messages: ChatMessage[];
  currentChatId: string;
  message: string;
  setMessage: (message: string) => void;
  setChats: (chats: Chat[]) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setCurrentChatId: (chatId: string) => void;
  getChats: (userId: string) => Promise<void>;
  getMessages: (chatId: string, page: number, limit: number) => Promise<void>;
  saveMessage: (chatId: string, senderId: string, message: string) => Promise<void>;
  createChat: (users: string[], name?: string, isGroupChat?: boolean) => Promise<string>;
  messageCache: LRUCache<string, ChatMessage[]>;
  addMessageToCache: (chatId: string, message: ChatMessage) => void;
  updateChat: (updatedChat: Chat) => void;
}

const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: [],
  currentChatId: '',
  message: '',
  setMessage: (message) => set({ message }),
  setChats: (chats) => set({ chats }),
  setMessages: (messages) => set({ messages }),
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
  getChats: async (userId) => {
    try {
      const response = await axios.get<Chat[]>(`${process.env.REACT_APP_SERVER_URL}/chat/getall/${userId}`);
      set({ chats: response.data });
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  },
  getMessages: async (chatId, page = 1, limit = 50) => {
    try {
      const cachedMessages = get().messageCache.get(chatId);
      if (cachedMessages && page === 1) {
        set({ messages: cachedMessages });
        return;
      }

      const response = await axios.get<ChatMessage[]>(
        `${process.env.REACT_APP_SERVER_URL}/chat/get/${chatId}?page=${page}&limit=${limit}`
      );
      set(state => {
        const newMessages = response.data;
        const existingMessages = state.messageCache.get(chatId) || [];
        const updatedMessages = page === 1 ? newMessages : [...existingMessages, ...newMessages];
        state.messageCache.set(chatId, updatedMessages);
        state.messages = updatedMessages;
        return state;
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },
  saveMessage: async (chatId, senderId, message) => {
    try {
      const response = await axios.post<ChatMessage>(`${process.env.REACT_APP_SERVER_URL}/chat/save/${chatId}`, { senderId, message });
      if (response.status === 201) {
        set({ message: '' });
        
        // Update the chat locally
        const { chats, updateChat } = get();
        const updatedChat = chats.find(chat => chat._id === chatId);
        if (updatedChat) {
          updatedChat.lastMessage = {
            messageId: response.data._id,
            content: response.data.content,
            timestamp: response.data.timestamp,
            senderName: 'You',
            senderId: senderId
          };
          updatedChat.unreadMessages = updatedChat.users.reduce((acc, userId) => {
            acc[userId] = userId !== senderId;
            return acc;
          }, {} as { [key: string]: boolean });
          updateChat(updatedChat);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const remainingCooldown = error.response.data.remainingCooldown;
        console.error(`Message sending on cooldown. Please wait ${Math.ceil(remainingCooldown / 1000)} seconds.`);
      } else {
        console.error('Error saving message:', error);
      }
      throw error;
    }
  },
  createChat: async (users, name, isGroupChat = false) => {
    try {
      const response = await axios.post<Chat>(`${process.env.REACT_APP_SERVER_URL}/chat/create`, { users, name, isGroupChat });
      if (response.status === 201 || response.status === 200) {
        const newChat = {
          ...response.data,
          unreadMessages: users.reduce((acc, userId) => {
            acc[userId] = false;
            return acc;
          }, {} as { [key: string]: boolean })
        };
        set(state => ({
          chats: [newChat, ...state.chats]
        }));
        return newChat._id;
      }
    } catch (error) {
      console.error('Error creating/getting chat:', error);
    }
    return '';
  },
  messageCache: new LRUCache<string, ChatMessage[]>({
    max: 100,
    ttl: 1000 * 60 * 60, // Cache for 1 hour
  }),
  addMessageToCache: (chatId, message) => {
    set(state => {
      const chatMessages = state.messageCache.get(chatId) || [];
      state.messageCache.set(chatId, [...chatMessages, message]);
      return state;
    });
  },
  updateChat: (updatedChat: Chat) => set((state) => {
    let updatedChats = state.chats;
    if (!state.chats.find(chat => chat._id === updatedChat._id)) {
      updatedChats = [...state.chats, updatedChat];
    }
    else {
      updatedChats = state.chats.map(chat => 
        chat._id === updatedChat._id ? {
        ...chat,
        ...updatedChat,
        lastMessage: updatedChat.lastMessage ? {
          ...updatedChat.lastMessage
        } : null,
        otherUserName: chat.otherUserName, // Preserve the existing otherUserName
        unreadMessages: updatedChat.unreadMessages || chat.unreadMessages // Use the updated unreadMessages or keep the existing ones
      } : chat
      );
    }

    // Sort the chats
    updatedChats.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
    });

    return { 
      ...state,
      chats: updatedChats 
    };
  }),
}));

export type { ChatMessage, Chat, LastMessage };
export default useChatStore;