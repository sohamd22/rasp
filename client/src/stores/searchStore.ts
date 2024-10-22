import { create } from 'zustand';
import axios from 'axios';

interface UserCardInfo {
  name: string;
  email: string;
  photo: any;
  relevantInfo: string;
}

interface SearchState {
  query: string;
  searchResults: UserCardInfo[];
  selectedUser: UserCardInfo | null;
  error: string | null;
  isLoading: boolean;
  setQuery: (query: string) => void;
  setSearchResults: (results: UserCardInfo[]) => void;
  setSelectedUser: (user: UserCardInfo | null) => void;
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  searchUser: (query: string, userId: string) => Promise<void>;
}

const useSearchStore = create<SearchState>((set) => ({
  query: '',
  searchResults: [],
  selectedUser: null,
  error: null,
  isLoading: false,
  setQuery: (query) => set({ query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  setError: (error) => set({ error }),
  setIsLoading: (isLoading) => set({ isLoading }),
  searchUser: async (query, userId) => {
    set({ isLoading: true, error: null });
    try {
      if (!query.trim()) {
        throw new Error('Search query cannot be empty');
      }
      const response = await axios.post(`/api/user/search`, { query, userId: userId });
      set({ searchResults: response.data, error: null, selectedUser: null });
    } catch (error) {
      set({ searchResults: [], selectedUser: null });
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 429) {
            const remainingCooldown = error.response.data.remainingCooldown;
            set({ 
              error: `Please wait ${Math.ceil(remainingCooldown / 1000)} seconds before searching again.` 
            });
            // Automatically clear the error after the cooldown
            setTimeout(() => {
              set({ error: null });
            }, remainingCooldown);
          } else {
            set({ error: error.response.data.message || 'An error occurred while processing your request.' });
          }
        } else if (error.request) {
          set({ error: 'No response received from the server. Please try again later.' });
        } else {
          set({ error: 'An unexpected error occurred. Please try again.' });
        }
      } else if (error instanceof Error) {
        set({ error: error.message });
      } else {
        set({ error: 'An unknown error occurred. Please try again.' });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useSearchStore;
