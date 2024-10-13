import { create } from 'zustand';

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
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
