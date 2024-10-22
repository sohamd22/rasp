import { create } from 'zustand';
import axios from 'axios';

interface UserState {
  user: any;
  setUser: (user: any) => void;
  status: {
    content: string;
    duration: string;
  };
  setStatus: (status: { content: string; duration: string }) => void;
  fetchUserStatus: (userId: string) => Promise<void>;
  updateUserStatus: (userId: string, content: string, duration: string) => Promise<void>;
  isUpdatingStatus: boolean;
  isUpdatingProfile: boolean;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  status: {
    content: '',
    duration: '',
  },
  setStatus: (status) => set({ status }),
  isUpdatingStatus: false,
  isUpdatingProfile: false,
  fetchUserStatus: async (userId) => {
    try { 
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/status/${userId}`);
      set({ status: response.data });
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  },
  updateUserStatus: async (userId, content, duration) => {
    set({ isUpdatingStatus: true });
    try {   
      await axios.patch(`${process.env.REACT_APP_SERVER_URL}/user/status`, { status: content, duration, userId });
      set({ status: { content, duration }, isUpdatingStatus: false });
    } catch (error) {
      set({ isUpdatingStatus: false });
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const remainingCooldown = error.response.data.remainingCooldown;
        console.error(`Status update on cooldown. Please wait ${Math.ceil(remainingCooldown / 1000)} seconds.`);
      } else {
        console.error('Error updating user status:', error);
      }
      throw error;
    }
  },
  updateUserProfile: async (userData: any) => {
    set({ isUpdatingProfile: true });
    try { 
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/save`, { user: userData });
      set({ user: userData, isUpdatingProfile: false });
    } catch (error) {
      set({ isUpdatingProfile: false });
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const remainingCooldown = error.response.data.remainingCooldown;
        console.error(`Profile update on cooldown. Please wait ${Math.ceil(remainingCooldown / 1000)} seconds.`);
      } else {
        console.error('Error updating user profile:', error);
      }
      throw error;
    }
  },
}));

export default useUserStore;