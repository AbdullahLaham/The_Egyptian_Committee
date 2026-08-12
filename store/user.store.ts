import { create } from "zustand";

type UserState = {
  user: any | null;
  setUser: (user: any) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: {},
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
