import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Seminar } from '../models/studentProcess';
import { UserResponse } from '../services/models/LoginResponse';

interface IProcessStore {
  process: Seminar | null;
  // eslint-disable-next-line no-unused-vars
  setProcess: (newProcess: Seminar) => void;
}

interface IUserStore {
  user: UserResponse | null;
  // eslint-disable-next-line no-unused-vars
  setUser: (user: UserResponse | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);

export const useProcessStore = create<IProcessStore>((set) => ({
  process: null,
  setProcess: (newProcess: Seminar) => set({ process: newProcess }),
}));
