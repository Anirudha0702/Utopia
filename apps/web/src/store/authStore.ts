import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AuthStore } from "./types";
import { type StateCreator } from "zustand";
const initialValue = {
  token: null,
  user: null,
};

const store: StateCreator<AuthStore> = (set) => ({
  ...initialValue,

  setAuth: (auth) => set({ token: auth.token, user: auth.user }),

  clearAuth: () => set(initialValue),

  setToken: (token) => set((state) => ({ ...state, token })),

  setUser: (user) => set((state) => ({ ...state, user })),
});

export const useAuthStore =
  import.meta.env.MODE === "development"
    ? create<AuthStore>()(devtools(store, { name: "AuthStore" }))
    : create<AuthStore>()(store);

export default useAuthStore;
