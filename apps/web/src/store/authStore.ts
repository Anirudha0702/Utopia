import { create } from "zustand";
import type { AuthStore } from "./types";

const initialValue = {
  token: null,
  user: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialValue,

  setAuth: (auth) => set({ token: auth.token, user: auth.user }),
  clearAuth: () => set(initialValue),
  setToken: (token) =>
    set((state) => ({
      ...state,
      token,
    })),
}));

export default useAuthStore;
