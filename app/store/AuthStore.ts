import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  user_id: number;
  name: string;
  email: string;
  category_preference: string | null;
};

type AuthState = {
  token: string | null;
  user: User | null;
  hasHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hasHydrated: false,
      setAuth: (token, user) => set({ token, user, hasHydrated: true }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // kasih tanda sudah hydrate ketika selesai rehydrate
          useAuthStore.setState({ hasHydrated: true });
        }
      },
    }
  )
);
