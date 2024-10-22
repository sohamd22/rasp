import { create } from 'zustand';
import axios from 'axios';

interface UserCardInfo {
  name: string;
  email: string;
  photo: any;
  relevantInfo: string;
}

interface CommunityState {
    communityUsers: any[];
    fetchCommunityUsers: () => Promise<void>;
    selectedUser: UserCardInfo | null;
    error: string | null;
    setSelectedUser: (user: UserCardInfo | null) => void;
}

const useCommunityStore = create<CommunityState>((set) => ({
    communityUsers: [],
    error: null,
    selectedUser: null,
    setSelectedUser: (user: UserCardInfo | null) => set({ selectedUser: user }),
    fetchCommunityUsers: async () => {
      try {
        const response = await axios.get('/api/user/community');
        set({ communityUsers: response.data });
      } catch (error) {
        console.error('Error fetching community users:', error);
        set({ error: 'Failed to fetch community users' });
      }
    }
}));

export default useCommunityStore;
