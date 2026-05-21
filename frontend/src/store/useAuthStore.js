import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (usernameOrEmail, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { usernameOrEmail, password });
          const { token, ...userData } = response.data;
          set({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return userData;
        } catch (err) {
          const message = err.response?.data?.message || 'Invalid username or password';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      signup: async (username, email, password, avatarUrl) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/signup', { username, email, password, avatarUrl });
          const { token, ...userData } = response.data;
          set({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return userData;
        } catch (err) {
          const message = err.response?.data?.message || 'Failed to sign up';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'taskflow-auth-storage', // Key name in localStorage
    }
  )
);
