import { create } from 'zustand';
import api from '../services/api';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/notifications');
      const unread = response.data.filter((n) => !n.isRead).length;
      set({
        notifications: response.data,
        unreadCount: unread,
        isLoading: false,
      });
      return response.data;
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    // Optimistic Update
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));

    try {
      await api.put(`/notifications/${id}/read`);
    } catch (err) {
      console.error('Failed to mark notification as read', err);
      // Re-fetch in case of API failure to sync correct state
      get().fetchNotifications();
    }
  },

  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));

    try {
      await api.put('/notifications/read-all');
    } catch (err) {
      console.error('Failed to mark all as read', err);
      get().fetchNotifications();
    }
  },


}));
