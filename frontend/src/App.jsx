import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useWorkspaceStore } from './store/useWorkspaceStore';
import { useTaskStore } from './store/useTaskStore';
import { useNotificationStore } from './store/useNotificationStore';
import { ProtectedRoute, AnonymousRoute } from './routes';

// Import Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainDashboard from './pages/MainDashboard';

// Global Glassmorphic Toast Component
export const GlobalToast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    TASK_CREATED: '⚡',
    TASK_MOVED: '🚀',
    TASK_UPDATED: '🔧',
    TASK_DELETED: '🗑️',
    COMMENT_ADDED: '💬',
    NOTIFICATION: '🔔',
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] glass-card px-5 py-4 rounded-xl border border-indigo-500/30 flex items-center gap-3 animate-float-slow shadow-lg shadow-indigo-500/5 max-w-sm">
      <div className="text-2xl bg-indigo-500/10 p-2 rounded-lg">{icons[type] || '🔔'}</div>
      <div>
        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Workspace Alert</h4>
        <p className="text-sm text-slate-200 mt-0.5">{message}</p>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-white ml-auto text-xs font-bold p-1">✕</button>
    </div>
  );
};

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const fetchWorkspaces = useWorkspaceStore((state) => state.fetchWorkspaces);
  
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type) => {
    const id = Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  // Resilient Real-Time Sync via high-efficiency REST polling (every 10 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load initial workspaces and notifications
    fetchWorkspaces();
    fetchNotifications();

    const syncInterval = setInterval(() => {
      if (activeWorkspace) {
        fetchTasks(activeWorkspace.id);
      }
      fetchNotifications();
    }, 10000);

    return () => {
      clearInterval(syncInterval);
    };
  }, [isAuthenticated, activeWorkspace]);

  // Handle active workspace subscription shifts
  useEffect(() => {
    if (isAuthenticated && activeWorkspace) {
      fetchTasks(activeWorkspace.id);
    }
  }, [activeWorkspace, isAuthenticated]);

  return (
    <Router>
      <div className="min-h-screen relative bg-[#030303]">
        {/* Dynamic Glowing Mesh Background Elements */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse-slow z-0"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse-slow z-0"></div>
        
        {/* Main App Container */}
        <div className="relative z-10 min-h-screen">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/auth/login" element={
              <AnonymousRoute>
                <Login />
              </AnonymousRoute>
            } />
            
            <Route path="/auth/signup" element={
              <AnonymousRoute>
                <Signup />
              </AnonymousRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Global Toast Stack */}
        <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3">
          {toasts.map((toast) => (
            <GlobalToast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            />
          ))}
        </div>
      </div>
    </Router>
  );
}

export default App;
