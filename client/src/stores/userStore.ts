import { create } from 'zustand';
import axios from 'axios';

interface User {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  photo: string;
  about?: {
    dateOfBirth?: Date;
    gender?: string;
    campus?: string;
    standing?: string;
    major?: string;
    skills?: string[];
    hobbies?: string[];
    socials?: string[];
    bio?: string;
  };
  statusId?: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/user`, { withCredentials: true });
      set({ user: response.data });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      set({ user: null });
    }
  },
  logout: async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, { withCredentials: true });
      set({ user: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },
}));

export default useUserStore;
