import { useAuthStore } from '@/stores/authStore';
import { type User } from '@/types';

// Reset Zustand store state between tests
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
  });
});

describe('authStore', () => {
  it('should initialize with empty state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set auth state on setAuth', () => {
    const mockUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      displayName: 'Test User',
      createdAt: new Date().toISOString(),
    };

    useAuthStore.getState().setAuth('access-token', mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('access-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should clear auth state on clearAuth', () => {
    const mockUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      displayName: 'Test User',
      createdAt: new Date().toISOString(),
    };

    useAuthStore.getState().setAuth('access-token', mockUser);
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should update user fields on updateUser', () => {
    const mockUser: User = {
      id: 'user-1',
      email: 'test@example.com',
      displayName: 'Test User',
      createdAt: new Date().toISOString(),
    };

    useAuthStore.getState().setAuth('access-token', mockUser);
    useAuthStore.getState().updateUser({ displayName: 'Updated Name' });

    const state = useAuthStore.getState();
    expect(state.user?.displayName).toBe('Updated Name');
    expect(state.user?.email).toBe('test@example.com');
  });

  it('should set token independently', () => {
    useAuthStore.getState().setToken('new-token');

    const state = useAuthStore.getState();
    expect(state.token).toBe('new-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should set user independently', () => {
    const mockUser: User = {
      id: 'user-2',
      email: 'other@example.com',
      displayName: null,
      createdAt: new Date().toISOString(),
    };

    useAuthStore.getState().setUser(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
  });
});
