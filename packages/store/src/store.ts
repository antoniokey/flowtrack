import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Store {
  user: any;
  setUser: (user: any) => void;
}

const useStore = create(
  devtools<Store>((set) => ({
    user: null,
    setUser: (user: any) => set((state) => ({ ...state, user })),
  }))
);

export default useStore;
