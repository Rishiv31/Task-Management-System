import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, Cpu } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const loginStore = useAuthStore();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!usernameOrEmail.trim() || !password.trim()) {
      setValidationError('Please fill in all credentials.');
      return;
    }

    try {
      await loginStore.login(usernameOrEmail, password);
      navigate('/dashboard');
    } catch (err) {
      // Handled by store error state, display via store
    }
  };

  return (
    <div className="min-h-screen flex text-left relative overflow-hidden bg-[#030303]">
      {/* Decorative dot grid */}
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none z-0"></div>

      {/* Split Layout: Left Half (Visualizer Panel) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#06060a] relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Dynamic mesh glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>

        {/* Logo */}
        <div className="flex items-center gap-2 relative z-10 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-extrabold text-xl text-white">⚡</span>
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white">
            TASKFLOW <span className="text-indigo-400">AI</span>
          </span>
        </div>

        {/* High-Fidelity Stats Visualizer Mockup */}
        <div className="relative z-10 my-auto max-w-md">
          <div className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} /> TaskFlow Analytics Mesh
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight">Accelerate your team delivery loops with absolute precision.</h2>
          <p className="text-slate-400 text-sm mt-4 font-light leading-relaxed">Login to monitor active Kanban statuses, track high-fidelity velocity reports, and coordinate instant workspace syncs with your active crew.</p>
          
          {/* Miniature Interactive Widget Cards */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-xl border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
              <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Focus Score</h4>
              <div className="text-2xl font-extrabold text-white mt-1">92 / 100</div>
              <p className="text-indigo-400 text-[10px] font-semibold mt-1">⚡ Peak efficiency</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/5">
              <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Sprint Speed</h4>
              <div className="text-2xl font-extrabold text-white mt-1">2.3 days</div>
              <p className="text-green-400 text-[10px] font-semibold mt-1">🚀 15% improvement</p>
            </div>
          </div>
        </div>

        {/* Small copyright note */}
        <div className="text-slate-600 text-xs relative z-10">
          © {new Date().getFullYear()} TaskFlow AI OS. Premium startup task management workspace.
        </div>
      </div>

      {/* Split Layout: Right Half (Form Panel) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md flex flex-col gap-8">
          
          {/* Header titles */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">Welcome Back</h1>
            <p className="text-slate-400 text-sm font-light">Enter credentials to reload your intelligent workspace.</p>
          </div>

          {/* Form Card */}
          <div className="glass-card p-8 rounded-3xl border border-white/8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Errors list */}
              {(validationError || loginStore.error) && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl font-medium">
                  ⚠️ {validationError || loginStore.error}
                </div>
              )}

              {/* Username/Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username or Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="name@taskflow.ai"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl text-white futuristic-input"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <span className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium">Forgot Password?</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-sm rounded-xl text-white futuristic-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Neon Button */}
              <button
                type="submit"
                disabled={loginStore.isLoading}
                className="w-full btn-neon-indigo py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginStore.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Authentication...
                  </>
                ) : (
                  <>
                    Access Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Logins Dummy Block */}
            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-white/5"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Or Sync Sessions With</span>
              <div className="h-px flex-1 bg-white/5"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => addToast('Google sync simulated', 'NOTIFICATION')} className="py-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 text-xs text-slate-300 font-semibold transition-all">Google</button>
              <button onClick={() => addToast('GitHub session linked', 'NOTIFICATION')} className="py-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 text-xs text-slate-300 font-semibold transition-all">GitHub</button>
            </div>
          </div>

          {/* Account redirect */}
          <div className="text-center text-sm text-slate-500">
            Don't have a workspace yet?{' '}
            <span 
              onClick={() => navigate('/auth/signup')}
              className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer underline underline-offset-4"
            >
              Start Free Trial
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
