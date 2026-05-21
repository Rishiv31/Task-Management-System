import { create } from 'zustand';
import api from '../services/api';

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  members: [],
  activities: [],
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/workspaces');
      const workspacesList = response.data;
      set({ workspaces: workspacesList, isLoading: false });
      
      // Auto-set first workspace if none active
      if (workspacesList.length > 0 && !get().activeWorkspace) {
        get().switchWorkspace(workspacesList[0]);
      }
      return workspacesList;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch workspaces', isLoading: false });
    }
  },

  switchWorkspace: (workspace) => {
    set({ activeWorkspace: workspace });
    localStorage.setItem('taskflow-active-workspace-id', workspace.id.toString());
  },

  createWorkspace: async (name, description) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/workspaces', { name, description });
      const newWorkspace = response.data;
      set((state) => ({
        workspaces: [...state.workspaces, newWorkspace],
        isLoading: false,
      }));
      get().switchWorkspace(newWorkspace);
      return newWorkspace;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to create workspace', isLoading: false });
      throw err;
    }
  },

  fetchWorkspaceMembers: async (workspaceId) => {
    try {
      const response = await api.get(`/workspaces/${workspaceId}/members`);
      set({ members: response.data });
      return response.data;
    } catch (err) {
      console.error('Failed to fetch workspace members', err);
    }
  },

  fetchWorkspaceActivities: async (workspaceId) => {
    try {
      const response = await api.get(`/workspaces/${workspaceId}/activities`);
      set({ activities: response.data });
      return response.data;
    } catch (err) {
      console.error('Failed to fetch workspace activities', err);
    }
  },

  inviteMember: async (workspaceId, usernameOrEmail, role = 'MEMBER') => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/workspaces/${workspaceId}/invite`, {
        usernameOrEmail,
        role
      });
      set((state) => ({
        members: [...state.members, response.data],
        isLoading: false
      }));
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to invite member';
      set({ error: msg, isLoading: false });
      throw err;
    }
  }
}));
