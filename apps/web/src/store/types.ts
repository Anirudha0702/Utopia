import { z } from "zod";

// Your existing Zod schemas
export const authUser = z.object({
  name: z.string(),
  id: z.string(),
  email: z.string(),
  privacy: z.enum(["Public", "Private", "Friends"]),
});

export const auth = z.object({
  token: z.string().nullable(),
  user: authUser.nullable(),
});

export type Auth = z.infer<typeof auth>;
export type AuthUser = z.infer<typeof authUser>;

// Zustand store type
export type AuthStore = {
  token: string | null;
  user: AuthUser | null;
  setAuth: (auth: Auth) => void;
  clearAuth: () => void;
  setToken: (token: string) => void;
};
