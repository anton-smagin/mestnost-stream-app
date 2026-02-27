import { create } from 'zustand';
import { type User, type AuthTokens } from '@/types';
import { setAccessToken } from '@/services/api';

// ─── State Shape ─────────────────────────────────────────────────────────────

interface AuthStore {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, tokens: AuthTokens) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,

  setAuth: (user, tokens) => {
    setAccessToken(tokens.accessToken);
    set({ user, tokens, isAuthenticated: true });
  },

  clearAuth: () => {
    setAccessToken(null);
    set({ user: null, tokens: null, isAuthenticated: false });
  },

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
