import { create } from 'zustand';
import axios from 'axios';

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
  error: string | null;
  setMessage: (message: string) => void;
  setChats: (chats: Chat[]) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setCurrentChatId: (chatId: string) => void;
  getChats: (userId: string) => Promise<void>;
  getMessages: (chatId: string, page: number, limit: number) => Promise<void>;
  saveMessage: (chatId: string, senderId: string, message: string) => Promise<void>;
  createChat: (users: string[], name?: string, isGroupChat?: boolean) => Promise<string>;
  messageCache: {
    get: (chatId: string) => ChatMessage[] | null;
    set: (chatId: string, messages: ChatMessage[]) => void;
    addMessage: (chatId: string, message: ChatMessage) => void;
  };
  addMessageToCache: (chatId: string, message: ChatMessage) => void;
  updateChat: (updatedChat: Chat) => void;
  setError: (error: string | null) => void;
}

const CACHE_PREFIX = 'chat_messages_';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: [],
  currentChatId: '',
  message: '',
  error: null,
  setMessage: (message) => set({ message }),
  setChats: (chats) => set({ chats }),
  setMessages: (messages) => set({ messages }),
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
  setError: (error) => set({ error }),
  getChats: async (userId) => {
    try {
      const response = await axios.get<Chat[]>(`/api/chat/getall/${userId}`);
      set({ chats: response.data, error: null });
    } catch (error) {
      console.error('Error fetching chats:', error);
      set({ chats: [], error: 'Failed to fetch chats' });
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
        `/api/chat/get/${chatId}?page=${page}&limit=${limit}`
      );
      set(() => {
        const newMessages = response.data;
        const existingMessages = get().messageCache.get(chatId) || [];
        const updatedMessages = page === 1 ? newMessages : [...existingMessages, ...newMessages];
        get().messageCache.set(chatId, updatedMessages);
        return {
          messages: updatedMessages,
          error: null
        };
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ messages: [], error: 'Failed to fetch messages' });
    }
  },
  saveMessage: async (chatId, senderId, message) => {
    try {
      const response = await axios.post<ChatMessage>(`/api/chat/save/${chatId}`, { senderId, message });
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
        const errorMessage = `Message sending on cooldown. Please wait ${Math.ceil(remainingCooldown / 1000)} seconds.`;
        console.error(errorMessage);
        set({ error: errorMessage });
      } else {
        console.error('Error saving message:', error);
        set({ error: 'Failed to save message' });
      }
      throw error;
    }
  },
  createChat: async (users, name, isGroupChat = false) => {
    try {
      const response = await axios.post<Chat>(`/api/chat/create`, { users, name, isGroupChat });
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
      set({ error: 'Failed to create chat' });
    }
    return '';
  },
  messageCache: {
    get: (chatId: string) => {
      const cachedData = localStorage.getItem(`${CACHE_PREFIX}${chatId}`);
      if (cachedData) {
        const { messages, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return messages;
        } else {
          localStorage.removeItem(`${CACHE_PREFIX}${chatId}`);
        }
      }
      return null;
    },
    set: (chatId: string, messages: ChatMessage[]) => {
      localStorage.setItem(`${CACHE_PREFIX}${chatId}`, JSON.stringify({
        messages,
        timestamp: Date.now()
      }));
    },
    addMessage: (chatId: string, message: ChatMessage) => {
      const cachedMessages = get().messageCache.get(chatId) || [];
      get().messageCache.set(chatId, [...cachedMessages, message]);
    }
  },
  addMessageToCache: (chatId, message) => {
    get().messageCache.addMessage(chatId, message);
  },
  updateChat: (updatedChat: Chat) => set((state) => {
    try {
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
        chats: updatedChats,
        error: null
      };
    } catch (error) {
      console.error('Error updating chat:', error);
      return { ...state, error: 'Failed to update chat' };
    }
  }),
}));

export type { ChatMessage, Chat, LastMessage };
export default useChatStore;
