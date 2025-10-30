import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserStore {
  user: any;
  setUser: (user: any) => void;
}

export const useUserStore = create(
  devtools<UserStore>((set) => ({
    user: null,
    setUser: (user: any) => set((state) => ({ ...state, user })),
  })),
);
