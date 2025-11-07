import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserStore {
  user: any;
  setUser: (user: any) => void;
  removeUser: () => void;
}

export const useUserStore = create(
  devtools<UserStore>((set) => ({
    user: null,
    setUser: (user: any) => set((state) => ({ ...state, user })),
    removeUser: () => set((state) => ({ ...state, user: null })),
  })),
);
