import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Kanban,
  List,
  Plus,
  Search,
  Bell,
  LogOut,
  UserPlus,
  CheckSquare,
  MessageSquare,
  Calendar,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Trash2,
  Check,
  X,
  Send,
  Target,
  Activity,
  Brain,
  SlidersHorizontal,
  Flame,
  ArrowUpRight
} from 'lucide-react';

// Recharts Custom styled Area and Bar charts
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Zustand stores
import { useAuthStore } from '../store/useAuthStore';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { useTaskStore } from '../store/useTaskStore';
import { useNotificationStore } from '../store/useNotificationStore';
import api from '../services/api';

export default function MainDashboard() {
  const navigate = useNavigate();

  // Stores bindings
  const { user, logout } = useAuthStore();
  const {
    workspaces,
    activeWorkspace,
    members,
    activities,
    createWorkspace,
    switchWorkspace,
    fetchWorkspaces,
    fetchWorkspaceMembers,
    fetchWorkspaceActivities,
    inviteMember
  } = useWorkspaceStore();

  const {
    tasks,
    subtasks,
    comments,
    activeTask,
    isLoading: tasksLoading,
    fetchTasks,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
    fetchSubtasks,
    fetchComments,
    addComment,
    setActiveTask
  } = useTaskStore();

  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useNotificationStore();

  // --- UI Layout and View States ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, kanban, list
  const [searchQuery, setSearchQuery] = useState('');

  // --- Modal Open States ---
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // --- New Task Form State ---
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('TODO');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newTaskPoints, setNewTaskPoints] = useState(3);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('');

  // --- New Workspace Form State ---
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');

  // --- Invite Form State ---
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');

  // --- Task Detail Checklist State ---
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [taskCommentText, setTaskCommentText] = useState('');
  const [inlineTaskTitle, setInlineTaskTitle] = useState('');

  // --- Dashboard Analytics & Statistics ---
  const [productivityInsights, setProductivityInsights] = useState(null);

  // --- Notification popover ref for close triggers ---
  const notifRef = useRef();

  // Keyboard navigation & Command Menu controller (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch initial resources when workspace changes
  useEffect(() => {
    if (activeWorkspace) {
      fetchWorkspaceMembers(activeWorkspace.id);
      fetchWorkspaceActivities(activeWorkspace.id);
      fetchTasks(activeWorkspace.id);
      fetchNotifications();
      loadDashboardAnalytics();
    }
  }, [activeWorkspace]);

  // Load custom dashboard analytics and statistics
  const loadDashboardAnalytics = async () => {
    try {
      const response = await api.get('/analytics/insights');
      setProductivityInsights(response.data);
    } catch (e) {
      console.error('Failed to load user productivity insights', e);
    }
  };

  // Switch workspace wrapper
  const handleSwitchWorkspace = (workspace) => {
    switchWorkspace(workspace);
    addSystemAuditLog(`Switched focus to workspace: "${workspace.name}"`);
  };

  // Create Workspace submission
  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    try {
      await createWorkspace(newWorkspaceName, newWorkspaceDesc);
      setNewWorkspaceName('');
      setNewWorkspaceDesc('');
      setIsWorkspaceModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Invite Member submission
  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      await inviteMember(activeWorkspace.id, inviteEmail, inviteRole);
      setInviteEmail('');
      setIsInviteModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Create Task submission
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const taskData = {
        title: newTaskTitle,
        description: newTaskDesc,
        status: newTaskStatus,
        priority: newTaskPriority,
        points: Number(newTaskPoints),
        dueDate: newTaskDueDate || null,
        assigneeId: newTaskAssigneeId ? Number(newTaskAssigneeId) : null,
        workspaceId: activeWorkspace.id
      };
      await createTask(taskData);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskDueDate('');
      setNewTaskAssigneeId('');
      setIsNewTaskModalOpen(false);
      
      // Instantly trigger workspace items reload
      fetchTasks(activeWorkspace.id);
      fetchWorkspaceActivities(activeWorkspace.id);
    } catch (e) {
      console.error(e);
    }
  };

  // Quick Inline Task Creator (Simple & frictionless task entry)
  const handleQuickAddTaskInline = async (e) => {
    e.preventDefault();
    if (!inlineTaskTitle.trim() || !activeWorkspace) return;
    try {
      const taskData = {
        title: inlineTaskTitle,
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        points: 3,
        dueDate: null,
        assigneeId: null,
        workspaceId: activeWorkspace.id
      };
      await createTask(taskData);
      setInlineTaskTitle('');
      
      // Reload items instantly
      fetchTasks(activeWorkspace.id);
      fetchWorkspaceActivities(activeWorkspace.id);
    } catch (e) {
      console.error('Failed to create quick task inline', e);
    }
  };

  // Double click task to open rich modal
  const handleOpenTaskModal = async (task) => {
    setActiveTask(task);
    setIsTaskModalOpen(true);
    
    // Hydrate task detail details
    fetchSubtasks(task.id);
    fetchComments(task.id);
  };

  // Close Task Modal
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setActiveTask(null);
  };

  // Edit details of active task
  const handleUpdateTaskDetail = async (fields) => {
    if (!activeTask) return;
    try {
      await updateTask(activeTask.id, {
        ...activeTask,
        ...fields
      });
      // Hydrate state local trigger
      setActiveTask({ ...activeTask, ...fields });
      fetchTasks(activeWorkspace.id);
    } catch (e) {
      console.error('Failed to update task detail', e);
    }
  };

  // Add Comment on Active Task
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!taskCommentText.trim() || !activeTask) return;
    try {
      await addComment(activeTask.id, taskCommentText);
      setTaskCommentText('');
      fetchComments(activeTask.id);
    } catch (e) {
      console.error('Failed to post comment', e);
    }
  };

  // Add Checklist Subtask Item
  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !activeTask) return;
    try {
      const subtaskData = {
        title: newSubtaskTitle,
        status: 'TODO',
        parentId: activeTask.id,
        workspaceId: activeWorkspace.id,
        points: 1
      };
      await api.post('/tasks', subtaskData);
      setNewSubtaskTitle('');
      fetchSubtasks(activeTask.id);
      fetchTasks(activeWorkspace.id);
    } catch (e) {
      console.error('Failed to create subtask', e);
    }
  };

  // Toggle Checklist Subtask Checkbox
  const handleToggleSubtask = async (subtask) => {
    try {
      const newStatus = subtask.status === 'DONE' ? 'TODO' : 'DONE';
      await api.put(`/tasks/${subtask.id}`, {
        ...subtask,
        status: newStatus
      });
      fetchSubtasks(activeTask.id);
      fetchTasks(activeWorkspace.id);
    } catch (e) {
      console.error('Failed to toggle subtask', e);
    }
  };

  // Delete checklist subtask
  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await api.delete(`/tasks/${subtaskId}`);
      fetchSubtasks(activeTask.id);
      fetchTasks(activeWorkspace.id);
    } catch (e) {
      console.error(e);
    }
  };



  // Drag and Drop native Kanban handler
  const handleDragOverColumn = (e) => {
    e.preventDefault();
  };

  const handleDropOnColumn = async (e, targetStatus) => {
    e.preventDefault();
    const taskIdStr = e.dataTransfer.getData('taskId');
    if (!taskIdStr) return;
    const taskId = Number(taskIdStr);
    
    // Fetch matching item to recalculate board position
    const colTasks = tasks
      .filter((t) => t.status === targetStatus)
      .sort((a, b) => a.boardPosition - b.boardPosition);
      
    let newPosition = 65535.0;
    if (colTasks.length > 0) {
      newPosition = colTasks[colTasks.length - 1].boardPosition + 65536.0;
    }
    
    try {
      await moveTask(taskId, targetStatus, newPosition);
      fetchWorkspaceActivities(activeWorkspace.id);
    } catch (e) {
      console.error('Failed to sync Kanban drop', e);
    }
  };



  // Clean helper to push mock logs to keep board active
  const addSystemAuditLog = (msg) => {
    // Local simulation fallback
    console.log(`[AUDIT] ${msg}`);
  };

  // --- Filtering and Sorting calculations for board & lists ---
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }
    return result;
  }, [tasks, searchQuery]);

  // Priority color decorators
  const priorityGlow = (p) => {
    switch (p) {
      case 'URGENT':
        return 'bg-red-500/10 border-red-500/30 text-red-400 shadow-sm shadow-red-500/10';
      case 'HIGH':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'MEDIUM':
        return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
      default:
        return 'bg-slate-500/10 border-white/10 text-slate-400';
    }
  };

  // Render initials avatar circle
  const initials = (name) => {
    if (!name) return '??';
    const split = name.split(/[._\s]/);
    if (split.length > 1) {
      return (split[0][0] + split[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Helper calculation for due date warning indicator
  const getDueDateLabel = (dueDateStr) => {
    if (!dueDateStr) return null;
    const due = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, color: 'text-red-400 font-bold animate-pulse' };
    }
    if (diffDays === 0) {
      return { text: 'Due Today', color: 'text-amber-400 font-bold' };
    }
    if (diffDays === 1) {
      return { text: 'Due Tomorrow', color: 'text-indigo-400 font-medium' };
    }
    return { text: `Due in ${diffDays}d`, color: 'text-slate-400 font-light' };
  };

  return (
    <div className="min-h-screen text-left flex bg-[#030303] text-white relative font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      {/* Mesh background effects */}
      <div className="absolute inset-0 grid-overlay opacity-[0.15] pointer-events-none z-0"></div>
      
      {/* 1. COLLAPSIBLE GLASSMORPHIC SIDEBAR */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? '72px' : '260px' }}
        transition={{ type: 'spring', damping: 20 }}
        className="hidden md:flex flex-col border-r border-white/5 bg-[#06060a]/75 backdrop-blur-xl z-20 shrink-0 h-screen relative overflow-hidden"
      >
        {/* Glow effect inside sidebar */}
        <div className="absolute top-[-30%] left-[-10%] w-[120%] h-[50%] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-extrabold text-sm text-white">⚡</span>
            </div>
            {!sidebarCollapsed && (
              <span className="font-extrabold text-sm tracking-wider text-white">
                TASKFLOW
              </span>
            )}
          </div>
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-slate-500 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-all"
          >
            <ChevronRight className={`w-4 h-4 transform transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Workspaces List section */}
        <div className="p-3 border-b border-white/5 relative z-10 flex flex-col gap-2">
          {!sidebarCollapsed && (
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Workspaces</span>
              <button
                onClick={() => setIsWorkspaceModalOpen(true)}
                className="text-indigo-400 hover:text-indigo-300 p-1 hover:bg-indigo-500/10 rounded-md transition-all"
                title="Create Workspace"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto">
            {workspaces.map((ws) => {
              const isActive = activeWorkspace?.id === ws.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => handleSwitchWorkspace(ws)}
                  className={`w-full text-left rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    sidebarCollapsed ? 'p-2 justify-center' : 'px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-indigo-500/10 border border-indigo-500/35 text-indigo-200'
                      : 'border border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={ws.name}
                >
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-400 animate-pulse' : 'bg-slate-600'}`}></div>
                  {!sidebarCollapsed && <span className="truncate">{ws.name}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-4 px-3 flex flex-col gap-1 relative z-10 overflow-y-auto">
          {!sidebarCollapsed && (
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2 block">Menu</span>
          )}
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'kanban', label: 'Kanban Board', icon: Kanban },
            { id: 'list', label: 'List View', icon: List }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 rounded-xl transition-all ${
                  sidebarCollapsed ? 'p-3 justify-center' : 'px-3 py-2.5 text-sm font-semibold'
                } ${
                  isActive
                    ? 'bg-white/5 border border-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}

          {/* Active Members Roster */}
          {!sidebarCollapsed && (
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Crew</span>
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="text-indigo-400 hover:text-indigo-300 p-0.5 hover:bg-indigo-500/10 rounded"
                >
                  <UserPlus className="w-3 h-3" />
                </button>
              </div>
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto px-1">
                {members.map((member) => (
                  <div key={member.userId} className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold flex items-center justify-center text-indigo-300 shrink-0">
                      {initials(member.username)}
                    </div>
                    <div className="truncate flex-1">
                      <p className="font-semibold text-slate-300 truncate">@{member.username}</p>
                      <p className="text-[9px] text-slate-500">{member.memberRole}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Card Profile Footer */}
        <div className="p-3 border-t border-white/5 relative z-10 bg-[#09090e]/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 font-extrabold flex items-center justify-center text-xs text-white">
              {initials(user?.username)}
            </div>
            {!sidebarCollapsed && (
              <div className="truncate flex-1 text-left">
                <h4 className="text-xs font-bold text-slate-200 truncate">@{user?.username}</h4>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              logout();
              navigate('/auth/login');
            }}
            className={`w-full flex items-center justify-center gap-2 rounded-lg py-2 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold text-xs transition-all ${
              sidebarCollapsed ? 'px-0' : ''
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            {!sidebarCollapsed && <span>Logout Session</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Layout Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        
        {/* 2. TOP NAVIGATION NAVBAR */}
        <header className="h-16 border-b border-white/5 bg-[#06060a]/50 backdrop-blur-xl flex items-center justify-between px-6 z-20 shrink-0">
          
          {/* Left metadata */}
          <div className="flex items-center gap-4">
            {/* Small Mobile Logo */}
            <div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="font-extrabold text-sm text-white">⚡</span>
            </div>
            
            <div className="text-left">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                {activeWorkspace ? activeWorkspace.name : 'TaskFlow Operating System'}
                <span className="text-[9px] uppercase tracking-wider bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </h2>
              <p className="hidden sm:block text-[10px] text-slate-500 truncate font-light max-w-xs">
                {activeWorkspace?.description || 'Syncing collaborative micro-activities...'}
              </p>
            </div>
          </div>

          {/* Right actions: Search, Inbox Popover, Create Task Button */}
          <div className="flex items-center gap-3">
            {/* Search Launcher */}
            <div
              onClick={() => setIsCommandMenuOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 cursor-pointer text-xs text-slate-500 w-[200px] transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search tasks...</span>
              <span className="ml-auto text-[9px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-slate-400">⌘K</span>
            </div>

            {/* Notification Inbox Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-xl border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition-all"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-sm shadow-indigo-500"></span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 glass-card rounded-2xl border border-white/10 p-4 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Inbox Notifications</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-slate-500 text-xs text-center py-6">Your inbox is clean</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              setIsNotificationsOpen(false);
                              if (n.taskId) {
                                // Find task inside list
                                const matchedTask = tasks.find((t) => t.id === n.taskId);
                                if (matchedTask) handleOpenTaskModal(matchedTask);
                              }
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                              n.isRead
                                ? 'bg-transparent border-transparent opacity-60'
                                : 'bg-indigo-500/5 border-indigo-500/20 hover:bg-indigo-500/10'
                            }`}
                          >
                            <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                              {!n.isRead && <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0"></span>}
                              {n.title}
                            </h5>
                            <p className="text-[10px] text-slate-400 mt-1 font-light leading-relaxed truncate">{n.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Action create task */}
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="btn-neon-indigo px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-indigo-500/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </header>

        {/* 3. CORE PAGE DISPLAY AREA */}
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          
          {/* Frictionless Quick Add task bar (Saves key clicks for user) */}
          {activeWorkspace && (
            <div className="mb-6">
              <form onSubmit={handleQuickAddTaskInline} className="glass-card flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/5 hover:border-indigo-500/20 focus-within:border-indigo-500/40 bg-[#09090e]/60 transition-all">
                <span className="text-sm select-none" title="Quick task creator">⚡</span>
                <input
                  type="text"
                  value={inlineTaskTitle}
                  onChange={(e) => setInlineTaskTitle(e.target.value)}
                  placeholder="Instantly add a task to this workspace... (type task name & press Enter)"
                  className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full font-light"
                />
                {inlineTaskTitle.trim() && (
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-[10px] font-extrabold text-white transition-all shadow-md shadow-indigo-500/20 shrink-0"
                  >
                    Quick Add
                  </button>
                )}
              </form>
            </div>
          )}
          
          {/* Tab 1: OVERVIEW ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Analytics Header Title */}
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div className="text-left">
                  <h1 className="text-xl font-extrabold text-white tracking-tight">Executive Control Mesh</h1>
                  <p className="text-xs text-slate-500 mt-1 font-light">Calculated statistics, completed vectors, and recent activity streams.</p>
                </div>
                <button
                  onClick={loadDashboardAnalytics}
                  className="text-xs border border-white/5 bg-white/[0.02] hover:bg-white/5 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 text-slate-400 hover:text-white transition-all"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Reload Analytics
                </button>
              </div>

              {/* Statistic widgets grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Total Backlog',
                    value: tasks.length,
                    meta: 'All scopes included',
                    icon: CheckSquare,
                    glow: 'shadow-indigo-500/5 border-white/5'
                  },
                  {
                    title: 'Active Blockers',
                    value: tasks.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW').length,
                    meta: 'In Progress & Review',
                    icon: AlertCircle,
                    glow: 'shadow-amber-500/5 border-amber-500/10'
                  },
                  {
                    title: 'Completed Scope',
                    value: `${tasks.filter((t) => t.status === 'DONE').length} / ${tasks.length}`,
                    meta: `${tasks.length > 0 ? Math.round((tasks.filter((t) => t.status === 'DONE').length * 100) / tasks.length) : 0}% velocity rating`,
                    icon: Target,
                    glow: 'shadow-green-500/5 border-white/5'
                  },
                  {
                    title: 'Focus rating',
                    value: `${productivityInsights?.focusScore || 88} / 100`,
                    meta: `Peak velocity ${productivityInsights?.peakHour || '10:00 AM'}`,
                    icon: Flame,
                    glow: 'shadow-purple-500/5 border-purple-500/15'
                  }
                ].map((wid, idx) => {
                  const Icon = wid.icon;
                  return (
                    <div
                      key={idx}
                      className={`glass-card p-5 rounded-2xl border text-left flex justify-between items-start shadow-xl ${wid.glow}`}
                    >
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{wid.title}</h4>
                        <div className="text-2xl font-extrabold text-white mt-1">{wid.value}</div>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">{wid.meta}</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                        <Icon className="w-4 h-4 text-indigo-400" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recharts Analytics Charts & Audit trail Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Charts Area (2/3 width on wide screens) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Chart 1: Productivity Waves (Area chart) */}
                  <div className="glass-card p-5 rounded-2xl border border-white/5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-indigo-400" /> Team Activity Waves (Hourly)
                    </h3>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={productivityInsights?.hourlyActivity || [
                            { hour: '09:00', efficiency: 65 },
                            { hour: '10:00', efficiency: 94 },
                            { hour: '11:00', efficiency: 88 },
                            { hour: '12:00', efficiency: 45 },
                            { hour: '13:00', efficiency: 30 },
                            { hour: '14:00', efficiency: 75 },
                            { hour: '15:00', efficiency: 82 },
                            { hour: '16:00', efficiency: 90 },
                            { hour: '17:00', efficiency: 60 }
                          ]}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="efficiencyGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(10,10,15,0.85)',
                              borderColor: 'rgba(99,102,241,0.3)',
                              borderRadius: '12px',
                              fontSize: '11px',
                              color: '#fff'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="efficiency"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#efficiencyGlow)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Sprint Velocity (Bar Chart) */}
                  <div className="glass-card p-5 rounded-2xl border border-white/5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-purple-400" /> Sprint Completion Velocity (Daily)
                    </h3>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={productivityInsights?.weeklyCompletion || [
                            { day: 'Mon', completed: 4, points: 8 },
                            { day: 'Tue', completed: 7, points: 15 },
                            { day: 'Wed', completed: 5, points: 10 },
                            { day: 'Thu', completed: 8, points: 18 },
                            { day: 'Fri', completed: 6, points: 12 },
                            { day: 'Sat', completed: 2, points: 4 },
                            { day: 'Sun', completed: 1, points: 2 }
                          ]}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(10,10,15,0.85)',
                              borderColor: 'rgba(139,92,246,0.3)',
                              borderRadius: '12px',
                              fontSize: '11px',
                              color: '#fff'
                            }}
                          />
                          <Bar dataKey="points" name="Story Points" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="completed" name="Tasks Closed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                {/* Audit Activities Feed (1/3 width) */}
                <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col h-full max-h-[500px]">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5 shrink-0">
                    <Activity className="w-4 h-4 text-indigo-400" /> Workspace Activity Audit
                  </h3>
                  
                  <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
                    {activities.length === 0 ? (
                      <p className="text-slate-500 text-xs py-12 text-center">No recent audit trails logged.</p>
                    ) : (
                      activities.map((log) => {
                        const date = new Date(log.createdAt);
                        return (
                          <div key={log.id} className="text-left border-l-2 border-indigo-500/30 pl-3 py-1 flex flex-col gap-1 hover:border-indigo-400 transition-all">
                            <p className="text-xs text-slate-300 font-medium leading-relaxed">
                              <span className="text-indigo-400 font-bold">@{log.user?.username || 'user'}</span> {log.action}
                            </p>
                            {log.details && (
                              <p className="text-[10px] text-slate-500 font-light truncate leading-normal">{log.details}</p>
                            )}
                            <span className="text-[9px] text-slate-600 font-semibold">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab 2: KANBAN BOARD */}
          {activeTab === 'kanban' && (
            <div className="flex flex-col h-full animate-fade-in">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div className="text-left">
                  <h1 className="text-xl font-extrabold text-white tracking-tight">Collaborative Kanban Stream</h1>
                  <p className="text-xs text-slate-500 mt-1 font-light">Drag cards optimized over positional boards. Double-click to expand checklists.</p>
                </div>
              </div>

              {/* Board Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 items-start min-h-[500px]">
                {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map((col) => {
                  const colTasks = filteredTasks
                    .filter((t) => t.status === col)
                    .sort((a, b) => a.boardPosition - b.boardPosition);
                  
                  const colHeaders = {
                    TODO: { title: 'Backlog Queue', style: 'border-slate-500/10 bg-slate-500/5' },
                    IN_PROGRESS: { title: 'In Progress', style: 'border-indigo-500/10 bg-indigo-500/5' },
                    IN_REVIEW: { title: 'In Review Code', style: 'border-amber-500/10 bg-amber-500/5' },
                    DONE: { title: 'Done Scope', style: 'border-green-500/10 bg-green-500/5' }
                  };

                  return (
                    <div
                      key={col}
                      onDragOver={handleDragOverColumn}
                      onDrop={(e) => handleDropOnColumn(e, col)}
                      className={`flex flex-col rounded-2xl border border-white/5 bg-[#09090e]/40 p-4 h-full min-h-[450px] transition-all`}
                    >
                      {/* Column Header */}
                      <div className="flex justify-between items-center mb-4 shrink-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {colHeaders[col].title}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                            {colTasks.length}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setNewTaskStatus(col);
                            setIsNewTaskModalOpen(true);
                          }}
                          className="text-indigo-400 hover:text-indigo-300 p-1 hover:bg-white/5 rounded-md transition-all"
                          title={`Add task to ${colHeaders[col].title}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Tasks Card Stack */}
                      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 min-h-[300px]">
                        {colTasks.map((task) => {
                          const dateLabel = getDueDateLabel(task.dueDate);
                          return (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('taskId', task.id.toString());
                              }}
                              onDoubleClick={() => handleOpenTaskModal(task)}
                              className="glass-card p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 cursor-grab active:cursor-grabbing text-left transition-all hover:translate-y-[-2px] relative overflow-hidden group shadow-lg shadow-black/35"
                            >
                              {/* Glowing stripe for active items */}
                              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/60 to-purple-500/60 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              
                              <div className="flex justify-between items-start gap-2">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${priorityGlow(task.priority)}`}>
                                  {task.priority}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500">
                                  ⚡ {task.points} pts
                                </span>
                              </div>

                              <h4 className="text-xs font-bold text-slate-200 mt-2.5 leading-snug group-hover:text-indigo-300 transition-colors truncate">
                                {task.title}
                              </h4>
                              
                              {task.description && (
                                <p className="text-[10px] text-slate-500 font-light mt-1 truncate leading-relaxed">
                                  {task.description}
                                </p>
                              )}

                              <div className="h-px bg-white/5 my-3"></div>

                              <div className="flex justify-between items-center">
                                {/* Due Date warning indicator */}
                                {dateLabel ? (
                                  <div className="flex items-center gap-1 text-[10px]">
                                    <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                                    <span className={dateLabel.color}>{dateLabel.text}</span>
                                  </div>
                                ) : (
                                  <div className="text-[9px] text-slate-600 font-light">No deadline</div>
                                )}

                                {/* Assignee Mini Avatar */}
                                {task.assignee ? (
                                  <div className="w-5.5 h-5.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-extrabold flex items-center justify-center text-indigo-300" title={`Assigned to @${task.assignee.username}`}>
                                    {initials(task.assignee.username)}
                                  </div>
                                ) : (
                                  <div className="w-5.5 h-5.5 rounded-md border border-dashed border-white/10 flex items-center justify-center text-[9px] text-slate-600 font-bold" title="Unassigned">
                                    Ø
                                  </div>
                                )}
                              </div>

                            </div>
                          );
                        })}
                        {colTasks.length === 0 && (
                          <div className="flex-1 border border-dashed border-white/5 rounded-xl flex items-center justify-center p-4 text-slate-600 text-xs font-light">
                            Drop task elements
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: LIST VIEW */}
          {activeTab === 'list' && (
            <div className="flex flex-col h-full animate-fade-in">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div className="text-left">
                  <h1 className="text-xl font-extrabold text-white tracking-tight">Structured Backlog Inventory</h1>
                  <p className="text-xs text-slate-500 mt-1 font-light">Filter, sort, and execute fast inline modifications. Double click rows to open details.</p>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-wrap items-center gap-3 mb-4 shrink-0 bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute inset-y-0 left-3 my-auto w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Fast inventory lookup query..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-lg text-white futuristic-input"
                  />
                </div>
              </div>

              {/* List Inventory Table */}
              <div className="flex-1 overflow-x-auto bg-[#06060a]/30 border border-white/5 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 font-bold bg-[#09090e]/50 uppercase tracking-widest">
                      <th className="p-3.5 pl-5">Status</th>
                      <th className="p-3.5">Priority</th>
                      <th className="p-3.5">Title</th>
                      <th className="p-3.5">Weight</th>
                      <th className="p-3.5">Deadline</th>
                      <th className="p-3.5">Crew Member</th>
                      <th className="p-3.5 text-right pr-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-12 text-center text-slate-500 font-light">
                          No matching task inventory elements.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task) => {
                        const dateLabel = getDueDateLabel(task.dueDate);
                        return (
                          <tr
                            key={task.id}
                            onDoubleClick={() => handleOpenTaskModal(task)}
                            className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                          >
                            <td className="p-3.5 pl-5 font-bold">
                              <select
                                value={task.status}
                                onChange={(e) => {
                                  updateTask(task.id, { ...task, status: e.target.value });
                                  fetchTasks(activeWorkspace.id);
                                }}
                                className="bg-[#0c0c12] border border-white/5 rounded px-2 py-1 text-[10px] text-slate-300 font-semibold focus:outline-none focus:border-indigo-500"
                              >
                                <option value="TODO">Backlog</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="IN_REVIEW">In Review</option>
                                <option value="DONE">Done Scope</option>
                              </select>
                            </td>
                            <td className="p-3.5 font-bold">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${priorityGlow(task.priority)}`}>
                                {task.priority}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                              {task.title}
                            </td>
                            <td className="p-3.5 font-bold text-indigo-400">
                              ⚡ {task.points} pts
                            </td>
                            <td className="p-3.5">
                              {dateLabel ? (
                                <span className={dateLabel.color}>{dateLabel.text}</span>
                              ) : (
                                <span className="text-slate-600">Ø</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              {task.assignee ? (
                                <div className="flex items-center gap-1.5">
                                  <div className="w-5 h-5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-extrabold flex items-center justify-center text-indigo-300">
                                    {initials(task.assignee.username)}
                                  </div>
                                  <span className="font-semibold text-slate-300">@{task.assignee.username}</span>
                                </div>
                              ) : (
                                <span className="text-slate-600">Unassigned</span>
                              )}
                            </td>
                            <td className="p-3.5 text-right pr-5">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenTaskModal(task)}
                                  className="p-1 border border-white/5 bg-white/[0.02] hover:bg-indigo-500/10 hover:border-indigo-500/30 rounded text-slate-400 hover:text-indigo-300 transition-all"
                                  title="Expand checklist details"
                                >
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (confirm('Delete this task?')) {
                                      await deleteTask(task.id);
                                      fetchTasks(activeWorkspace.id);
                                    }
                                  }}
                                  className="p-1 border border-transparent hover:border-red-500/30 hover:bg-red-500/10 rounded text-slate-500 hover:text-red-400 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 5. COMMAND MENU DIALOG (RAYCAST STYLE) */}
      <AnimatePresence>
        {isCommandMenuOpen && (
          <div className="fixed inset-0 bg-[#000]/60 backdrop-blur-md z-[999] flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl glass-card rounded-2xl border border-white/15 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Search Bar */}
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Swappable shortcuts: Switch Tab, Switch Workspace, search backlog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsCommandMenuOpen(false)}
                  className="text-slate-600 hover:text-white text-xs font-bold"
                >
                  ESC
                </button>
              </div>

              {/* Keyboard actionable items */}
              <div className="max-h-[300px] overflow-y-auto p-2 flex flex-col gap-1 text-xs">
                {/* 1. Swapping tabs shortcuts */}
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest p-2 text-left">Navigation Commands</div>
                {[
                  { label: 'Go to Overview Dashboard', tab: 'overview' },
                  { label: 'Go to Kanban Agile Stream', tab: 'kanban' },
                  { label: 'Go to Inventory List View', tab: 'list' }
                ].map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab(cmd.tab);
                      setIsCommandMenuOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-white/5 text-slate-300 font-medium flex items-center justify-between"
                  >
                    <span>{cmd.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono">⏎ NAV</span>
                  </button>
                ))}

                {/* 2. Workspace lists shortcuts */}
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest p-2 text-left">Workspaces Quick Swap</div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      handleSwitchWorkspace(ws);
                      setIsCommandMenuOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-white/5 text-slate-300 font-medium flex items-center justify-between"
                  >
                    <span>Swap to workspace: "{ws.name}"</span>
                    <span className="text-[10px] text-indigo-400 font-mono">⏎ SCOPE</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. GLASSMORPHIC NEW TASK MODAL */}
      <AnimatePresence>
        {isNewTaskModalOpen && (
          <div className="fixed inset-0 bg-[#000]/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg glass-card rounded-3xl border border-white/10 p-8 shadow-2xl relative"
            >
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">
                  Provision Backlog Task
                </h2>
                <button
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="flex flex-col gap-4 text-xs text-left">
                {/* Title */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Task Title</label>
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Migrate User profiles schema"
                    className="px-4 py-2.5 rounded-xl text-white futuristic-input"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Description</label>
                  <textarea
                    rows="3"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Technical scope details..."
                    className="px-4 py-2.5 rounded-xl text-white futuristic-input"
                  ></textarea>
                </div>

                {/* Meta Row: Status & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider">Status Column</label>
                    <select
                      value={newTaskStatus}
                      onChange={(e) => setNewTaskStatus(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-[#0c0c12] border border-white/5 focus:outline-none focus:border-indigo-500 text-slate-300 font-semibold"
                    >
                      <option value="TODO">Backlog</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="DONE">Done Scope</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider">Priority Weight</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-[#0c0c12] border border-white/5 focus:outline-none focus:border-indigo-500 text-slate-300 font-semibold"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Points & Due Date & Assignee */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider">Story Points</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="13"
                      value={newTaskPoints}
                      onChange={(e) => setNewTaskPoints(e.target.value)}
                      className="px-3 py-2.5 rounded-xl text-white futuristic-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider">Due Date</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="px-3 py-2 text-white bg-[#0c0c12] border border-white/5 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider">Assignee</label>
                    <select
                      value={newTaskAssigneeId}
                      onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-[#0c0c12] border border-white/5 focus:outline-none focus:border-indigo-500 text-slate-300 font-semibold"
                    >
                      <option value="">Select Assignee</option>
                      {members.map((m) => (
                        <option key={m.userId} value={m.userId}>
                          @{m.username}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-neon-indigo py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Provision Active Task
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. GLASSMORPHIC ACTIVE TASK DETAILS MODAL */}
      <AnimatePresence>
        {isTaskModalOpen && activeTask && (
          <div className="fixed inset-0 bg-[#000]/65 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              
              {/* Left Column: Task Core Title & Subtasks & comments */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-6 text-left border-r border-white/5">
                
                {/* Header Title Editor */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={activeTask.title}
                      onChange={(e) => handleUpdateTaskDetail({ title: e.target.value })}
                      className="w-full bg-transparent border-b border-transparent focus:border-indigo-500/30 text-lg font-bold text-white focus:outline-none pb-1"
                    />
                  </div>
                  <button
                    onClick={handleCloseTaskModal}
                    className="text-slate-400 hover:text-white p-1 ml-4"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Description Editor */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Technical Specifications</label>
                  <textarea
                    rows="3"
                    value={activeTask.description || ''}
                    onChange={(e) => handleUpdateTaskDetail({ description: e.target.value })}
                    placeholder="Describe technical goals..."
                    className="w-full bg-white/[0.02] border border-white/5 focus:border-indigo-500/40 rounded-xl p-3 text-xs text-slate-300 focus:outline-none font-light leading-relaxed"
                  ></textarea>
                </div>

                {/* Subtasks Checklist */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sprint Checklist Verification</h4>
                  
                  <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                    {(subtasks[activeTask.id] || []).map((sub) => (
                      <div key={sub.id} className="flex items-center gap-3 bg-white/[0.01] border border-white/5 px-3 py-2 rounded-xl group transition-all">
                        <button
                          type="button"
                          onClick={() => handleToggleSubtask(sub)}
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                            sub.status === 'DONE'
                              ? 'bg-indigo-500 border-indigo-500 text-white'
                              : 'border-white/20 hover:border-indigo-500'
                          }`}
                        >
                          {sub.status === 'DONE' && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        
                        <span className={`text-xs text-slate-300 flex-1 truncate ${sub.status === 'DONE' ? 'line-through text-slate-500 font-light' : ''}`}>
                          {sub.title}
                        </span>

                        <button
                          onClick={() => handleDeleteSubtask(sub.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-0.5 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add subtask item inline form */}
                  <form onSubmit={handleAddSubtask} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add checkbox check..."
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl text-white bg-white/[0.02] border border-white/5 focus:outline-none focus:border-indigo-500/40"
                    />
                    <button
                      type="submit"
                      className="px-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white rounded-xl text-xs font-bold border border-indigo-500/20 transition-all"
                    >
                      Add Check
                    </button>
                  </form>
                </div>

                {/* Comments Section */}
                <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Collaboration Dialogue
                  </h4>
                  
                  <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto">
                    {comments.length === 0 ? (
                      <p className="text-slate-500 text-xs py-4 text-center font-light">No comments posted yet.</p>
                    ) : (
                      comments.map((c) => {
                        const cDate = new Date(c.createdAt);
                        return (
                          <div key={c.id} className="bg-white/[0.01] border border-white/5 p-3 rounded-2xl text-left flex gap-3">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-extrabold flex items-center justify-center text-indigo-300 shrink-0">
                              {initials(c.author?.username)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <span className="font-extrabold text-slate-200">@{c.author?.username}</span>
                                <span className="text-[9px] text-slate-500 font-semibold">{cDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed whitespace-pre-wrap">{c.content}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contribute ideas..."
                      value={taskCommentText}
                      onChange={(e) => setTaskCommentText(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 text-xs rounded-xl text-white bg-white/[0.02] border border-white/5 focus:outline-none focus:border-indigo-500/40"
                    />
                    <button
                      type="submit"
                      className="px-4 btn-neon-indigo rounded-xl text-xs font-bold"
                    >
                      Post Comment
                    </button>
                  </form>
                </div>

              </div>

              {/* Right Column: Task Metadata parameters & AI risk predictor */}
              <div className="w-full md:w-[280px] bg-[#09090e]/80 p-6 flex flex-col gap-5 text-left shrink-0">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2 border-b border-white/5">
                  Parameters Configuration
                </h4>

                {/* Status selector */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold text-slate-400">STATUS COLUMN</label>
                  <select
                    value={activeTask.status}
                    onChange={(e) => handleUpdateTaskDetail({ status: e.target.value })}
                    className="w-full bg-[#0c0c12] border border-white/5 rounded-xl px-3 py-2 text-slate-300 font-semibold focus:outline-none"
                  >
                    <option value="TODO">Backlog</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done Scope</option>
                  </select>
                </div>

                {/* Priority Selector */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold text-slate-400">PRIORITY WEIGHT</label>
                  <select
                    value={activeTask.priority}
                    onChange={(e) => handleUpdateTaskDetail({ priority: e.target.value })}
                    className="w-full bg-[#0c0c12] border border-white/5 rounded-xl px-3 py-2 text-slate-300 font-semibold focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                {/* Story Points */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold text-slate-400">STORY POINTS Complexity</label>
                  <input
                    type="number"
                    min="1"
                    max="13"
                    value={activeTask.points || 1}
                    onChange={(e) => handleUpdateTaskDetail({ points: Number(e.target.value) })}
                    className="w-full bg-[#0c0c12] border border-white/5 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                {/* Due Date picker */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold text-slate-400">DUE DATE</label>
                  <input
                    type="date"
                    value={activeTask.dueDate || ''}
                    onChange={(e) => handleUpdateTaskDetail({ dueDate: e.target.value || null })}
                    className="w-full bg-[#0c0c12] border border-white/5 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                {/* Assignee */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold text-slate-400">ASSIGNED CREW</label>
                  <select
                    value={activeTask.assignee?.id || ''}
                    onChange={(e) => {
                      const selectedId = e.target.value ? Number(e.target.value) : null;
                      handleUpdateTaskDetail({ assigneeId: selectedId });
                    }}
                    className="w-full bg-[#0c0c12] border border-white/5 rounded-xl px-3 py-2 text-slate-300 font-semibold focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.userId} value={m.userId}>
                        @{m.username}
                      </option>
                    ))}
                  </select>
                </div>



              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. GLASSMORPHIC NEW WORKSPACE MODAL */}
      <AnimatePresence>
        {isWorkspaceModalOpen && (
          <div className="fixed inset-0 bg-[#000]/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-card rounded-3xl border border-white/10 p-8 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">
                  Configure Workspace Scope
                </h2>
                <button
                  onClick={() => setIsWorkspaceModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateWorkspace} className="flex flex-col gap-4 text-xs text-left">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Workspace Name</label>
                  <input
                    type="text"
                    required
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="e.g. Phoenix Core Engineering"
                    className="px-4 py-2.5 rounded-xl text-white futuristic-input"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Description</label>
                  <textarea
                    rows="3"
                    value={newWorkspaceDesc}
                    onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                    placeholder="Details about work streams..."
                    className="px-4 py-2.5 rounded-xl text-white futuristic-input"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full btn-neon-indigo py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Initialize Workspace
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. GLASSMORPHIC TEAM INVITE MODAL */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 bg-[#000]/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-card rounded-3xl border border-white/10 p-8 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">
                  Invite Workspace Contributor
                </h2>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInviteMember} className="flex flex-col gap-4 text-xs text-left">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Username or Email</label>
                  <input
                    type="text"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="name@taskflow.ai or username"
                    className="px-4 py-2.5 rounded-xl text-white futuristic-input"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider">Workspace Role Assignment</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-[#0c0c12] border border-white/5 focus:outline-none focus:border-indigo-500 text-slate-300 font-semibold"
                  >
                    <option value="MEMBER">Standard Member</option>
                    <option value="ADMIN">Workspace Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full btn-neon-indigo py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Grant Membership
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
