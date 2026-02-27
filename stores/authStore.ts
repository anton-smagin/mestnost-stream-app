import { create } from 'zustand';
import { type User } from '@/types';
import { setAccessToken } from '@/services/api';

// ─── State Shape ─────────────────────────────────────────────────────────────

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setToken: (token) => {
    setAccessToken(token);
    set({ token, isAuthenticated: true });
  },

  setUser: (user) => {
    set({ user });
  },

  setAuth: (token, user) => {
    setAccessToken(token);
    set({ token, user, isAuthenticated: true });
  },

  clearAuth: () => {
    setAccessToken(null);
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
