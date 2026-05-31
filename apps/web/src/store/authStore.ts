import { create } from 'zustand';
import type { User } from '@leaklens/types';

// Standard API response payloads
interface AuthResponseData {
  user: User;
  accessToken: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, organizationName?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
}

const API_URL = '/api/auth';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Login failed.');
      }

      const { user, accessToken } = result.data as AuthResponseData;

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || 'An unexpected error occurred during login.',
        isLoading: false,
      });
      throw err;
    }
  },

  register: async (email, password, firstName, lastName, organizationName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, organizationName }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Registration failed.');
      }

      // Automatically log in after registration, or instruct user to log in.
      // For smooth onboarding, we log them in immediately!
      await get().login(email, password);
    } catch (err: any) {
      set({
        error: err.message || 'An unexpected error occurred during registration.',
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await fetch(`${API_URL}/logout`, { method: 'POST' });
    } catch (err) {
      console.warn('Logout request failed on server, clearing local session anyway.', err);
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  checkSession: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    try {
      // 1. Attempt to refresh accessToken using HttpOnly refresh token cookie
      const refreshResponse = await fetch(`${API_URL}/refresh`, { method: 'POST' });
      const refreshResult = await refreshResponse.json();

      if (!refreshResult.success) {
        throw new Error('Refresh session expired.');
      }

      const { accessToken } = refreshResult.data;

      // 2. Fetch user profile using the new accessToken
      const meResponse = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const meResult = await meResponse.json();

      if (!meResult.success) {
        throw new Error('Unable to retrieve user session.');
      }

      set({
        user: meResult.data as User,
        accessToken,
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
      });
    } catch (err) {
      // Session check failed, user needs to login manually
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });
    }
  },
}));
