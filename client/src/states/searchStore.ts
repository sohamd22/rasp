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
  error: string | null;  // Add this line
  setQuery: (query: string) => void;
  setSearchResults: (results: UserCardInfo[]) => void;
  setSelectedUser: (user: UserCardInfo | null) => void;
  setError: (error: string | null) => void;  // Add this line
  searchUser: (query: string, currentUser: any) => Promise<void>;
}

const useSearchStore = create<SearchState>((set) => ({
  query: '',
  searchResults: [],
  selectedUser: null,
  error: null,  // Add this line
  setQuery: (query) => set({ query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  setError: (error) => set({ error }),  // Add this line
  searchUser: async (query, currentUser) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/search`, { query, user: currentUser });
      set({ searchResults: response.data, error: null });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 429) {
          const remainingCooldown = error.response.data.remainingCooldown;
          set({ 
            searchResults: [], 
            error: `Please wait ${Math.ceil(remainingCooldown / 1000)} seconds before searching again.` 
          });
          
          // Automatically clear the error after the cooldown
          setTimeout(() => {
            set({ error: null });
          }, remainingCooldown);
        } else {
          console.error("Error fetching users:", error);
          set({ searchResults: [], error: 'An error occurred while processing your request.' });
        }
      } else {
        console.error("Unexpected error:", error);
        set({ searchResults: [], error: 'An unexpected error occurred.' });
      }
    }
  },
}));

export default useSearchStore;