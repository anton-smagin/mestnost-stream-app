import { useAuthStore } from '@/stores/authStore';
import { type User, type AuthTokens } from '@/types';

// Reset Zustand store state between tests
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    tokens: null,
    isAuthenticated: false,
  });
});

describe('authStore', () => {
  it('should initialize with empty state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.tokens).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set auth state on setAuth', () => {
    const mockUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      displayName: 'Test User',
      avatarUrl: null,
      createdAt: new Date().toISOString(),
    };

    const mockTokens: AuthTokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    useAuthStore.getState().setAuth(mockUser, mockTokens);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.tokens).toEqual(mockTokens);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should clear auth state on clearAuth', () => {
    const mockUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      displayName: 'Test User',
      avatarUrl: null,
      createdAt: new Date().toISOString(),
    };

    const mockTokens: AuthTokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    useAuthStore.getState().setAuth(mockUser, mockTokens);
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.tokens).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should update user fields on updateUser', () => {
    const mockUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      displayName: 'Test User',
      avatarUrl: null,
      createdAt: new Date().toISOString(),
    };

    const mockTokens: AuthTokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    useAuthStore.getState().setAuth(mockUser, mockTokens);
    useAuthStore.getState().updateUser({ displayName: 'Updated Name' });

    const state = useAuthStore.getState();
    expect(state.user?.displayName).toBe('Updated Name');
    expect(state.user?.email).toBe('test@example.com');
  });
});
