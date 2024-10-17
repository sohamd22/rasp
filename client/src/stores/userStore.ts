import { create } from 'zustand';
import axios from 'axios';

interface UserState {
  user: any;
  setUser: (user: any) => void;
  status: {
    content: string;
    duration: string;
    expirationDate: Date;
  };
  setStatus: (status: { content: string; duration: string; expirationDate: Date }) => void;
  fetchUserStatus: (userId: string) => Promise<void>;
  updateUserStatus: (userId: string, content: string, duration: string) => Promise<void>;
  updateUserProfile: (userData: any) => Promise<void>;
  isUpdatingStatus: boolean;
  isUpdatingProfile: boolean;
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (isLoading: boolean, message: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  status: {
    content: '',
    duration: '',
    expirationDate: new Date(),
  },
  setStatus: (status) => set({ status }),
  isUpdatingStatus: false,
  isUpdatingProfile: false,
  isLoading: false,
  loadingMessage: '',
  error: null,
  setError: (error) => set({ error }),
  setLoading: (isLoading, message) => set({ isLoading, loadingMessage: message }),
  fetchUserStatus: async (userId) => {
    set({ isLoading: true, loadingMessage: 'Fetching user status...', error: null });
    try {
      const response = await axios.get(`/api/user/status/${userId}`);
      set({ status: { content: response.data.status, duration: response.data.duration, expirationDate: response.data.expirationDate }, isLoading: false, loadingMessage: '' });
    } catch (error) {
      console.error('Error fetching user status:', error);
      set({ 
        isLoading: false, 
        loadingMessage: '', 
        error: axios.isAxiosError(error) 
          ? error.response?.data?.message || 'Error fetching user status' 
          : 'An unexpected error occurred'
      });
    }
  },
  updateUserStatus: async (userId, content, duration) => {
    set({ isUpdatingStatus: true, error: null });
    if (!content || !duration) {
      set({ error: 'Status and duration are required' });
      return;
    }
    try {
      const expirationDate = new Date(Date.now() + (duration === "24h" ? 24 : (duration === "48h" ? 2 * 24 : 7 * 24)) * 60 * 60 * 1000);
      await axios.patch(`/api/user/status`, { status: content, duration, expirationDate, userId });
      set({ status: { content, duration, expirationDate }, isUpdatingStatus: false });
    } catch (error) {
      set({ isUpdatingStatus: false });
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          const remainingCooldown = error.response.data.remainingCooldown;
          set({ error: `Status update on cooldown. Please wait ${Math.ceil(remainingCooldown / 1000)} seconds.` });
        } else {
          set({ error: error.response?.data?.message || 'Error updating user status' });
        }
      } else {
        set({ error: 'An unexpected error occurred' });
      }
      console.error('Error updating user status:', error);
      throw error;
    }
  },
  updateUserProfile: async (userData: any) => {
    set({ isUpdatingProfile: true, error: null });
    try {
      await axios.patch(`/api/user/save`, { user: userData });
      set({ user: userData, isUpdatingProfile: false });
    } catch (error) {
      set({ isUpdatingProfile: false });
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          const remainingCooldown = error.response.data.remainingCooldown;
          set({ error: `Profile update on cooldown. Please wait ${Math.ceil(remainingCooldown / 1000)} seconds.` });
        } else {
          set({ error: error.response?.data?.message || 'Error updating user profile' });
        }
      } else {
        set({ error: 'An unexpected error occurred' });
      }
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
}));

export default useUserStore;
