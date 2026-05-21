import { create } from 'zustand';
import api from '../services/api';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  subtasks: {}, // taskID -> subtasks array
  comments: [],
  activeTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async (workspaceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/tasks/workspace/${workspaceId}`);
      set({ tasks: response.data, isLoading: false });
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch tasks', isLoading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      set((state) => ({
        tasks: [...state.tasks, response.data]
      }));
      return response.data;
    } catch (err) {
      console.error('Failed to create task', err);
      throw err;
    }
  },

  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
        activeTask: state.activeTask?.id === id ? response.data : state.activeTask,
      }));
      return response.data;
    } catch (err) {
      console.error('Failed to update task', err);
      throw err;
    }
  },

  // OPTIMISTIC UPDATES: Instantly updates Kanban Board locally and syncs with API in background
  moveTask: async (id, status, boardPosition) => {
    const previousTasks = [...get().tasks];
    
    // 1. Optimistic Local State Update
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status, boardPosition } : task
      ),
    }));

    try {
      const response = await api.patch(`/tasks/${id}/move`, { status, boardPosition });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
      }));
      return response.data;
    } catch (err) {
      // 2. Rollback if API fails
      console.error('Failed to sync card position. Rolling back state.', err);
      set({ tasks: previousTasks });
      throw err;
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        activeTask: state.activeTask?.id === id ? null : state.activeTask,
      }));
    } catch (err) {
      console.error('Failed to delete task', err);
      throw err;
    }
  },

  fetchSubtasks: async (parentId) => {
    try {
      const response = await api.get(`/tasks/${parentId}/subtasks`);
      set((state) => ({
        subtasks: {
          ...state.subtasks,
          [parentId]: response.data
        }
      }));
      return response.data;
    } catch (err) {
      console.error('Failed to fetch subtasks', err);
    }
  },

  fetchComments: async (taskId) => {
    try {
      const response = await api.get(`/comments/task/${taskId}`);
      set({ comments: response.data });
      return response.data;
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  },

  addComment: async (taskId, content) => {
    try {
      const response = await api.post(`/comments/task/${taskId}`, { content });
      set((state) => {
        if (state.activeTask && state.activeTask.id === taskId) {
          return { comments: [...state.comments, response.data] };
        }
        return state;
      });
      return response.data;
    } catch (err) {
      console.error('Failed to add comment', err);
      throw err;
    }
  },

  setActiveTask: (task) => set({ activeTask: task }),


}));
