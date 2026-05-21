import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// Curated Sleek Avatars list for instant premium onboard choices
const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
];

export default function Signup() {
  const navigate = useNavigate();
  const signupStore = useAuthStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_OPTIONS[0]); // default selected avatar

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validations
    if (!username.trim() || !email.trim() || !password.trim()) {
      setValidationError('Please fill in all onboarding fields.');
      return;
    }
    if (username.length < 3) {
      setValidationError('Username must be at least 3 characters.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    try {
      await signupStore.signup(username, email, password, avatarUrl);
      navigate('/dashboard');
    } catch (err) {
      // Handled by store
    }
  };

  return (
    <div className="min-h-screen flex text-left relative overflow-hidden bg-[#030303]">
      {/* Decorative dot grid */}
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none z-0"></div>

      {/* Split Layout: Left Half (Onboarding Panel) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#06060a] relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Dynamic glows */}
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

        {/* Visual Mockup */}
        <div className="relative z-10 my-auto max-w-md">
          <div className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> Seamless Team Onboarding
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight">Your personal sandbox is generated instantly upon registration.</h2>
          <p className="text-slate-400 text-sm mt-4 font-light leading-relaxed font-sans">We believe in zero-lag experiences. Signing up automatically creates a default personal workspace customized for you, allowing you to create tasks and profile projects immediately.</p>
          
          {/* Custom mock features checklist */}
          <div className="mt-8 flex flex-col gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">✓</span>
              <span>Stateless JWT session tokens generated on sync</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">✓</span>
              <span>Resilient workspace synchronization active</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">✓</span>
              <span>Curated developer metrics profile hydrated</span>
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="text-slate-600 text-xs relative z-10">
          © {new Date().getFullYear()} TaskFlow AI OS. Intelligent agile planning.
        </div>
      </div>

      {/* Split Layout: Right Half (Signup Form Panel) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">Create Account</h1>
            <p className="text-slate-400 text-sm font-light">Get started instantly with a premium personal workspace.</p>
          </div>

          {/* Form Card */}
          <div className="glass-card p-8 rounded-3xl border border-white/8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Errors */}
              {(validationError || signupStore.error) && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl font-medium">
                  ⚠️ {validationError || signupStore.error}
                </div>
              )}

              {/* Username */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="sarah_connor"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-white futuristic-input"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="sarah@taskflow.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-white futuristic-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secure Password</label>
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
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl text-white futuristic-input"
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

              {/* PREMIUM USER UX ADDITION: Interactive Avatar Picker */}
              <div className="flex flex-col gap-2 mt-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Avatar Profile</label>
                <div className="flex gap-3.5 items-center">
                  <img src={avatarUrl} alt="Active Preview" className="w-11 h-11 rounded-xl object-cover border-2 border-indigo-500 shadow-md shadow-indigo-500/20" />
                  <div className="flex gap-2">
                    {AVATAR_OPTIONS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${avatarUrl === url ? 'border-indigo-400 scale-105 shadow-sm' : 'border-white/5 opacity-55 hover:opacity-100'}`}
                      >
                        <img src={url} alt={`Selection ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Neon */}
              <button
                type="submit"
                disabled={signupStore.isLoading}
                className="w-full btn-neon-indigo py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
              >
                {signupStore.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Provisioning Sandbox...
                  </>
                ) : (
                  <>
                    Initialize Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center text-sm text-slate-500">
            Already have an active profile?{' '}
            <span 
              onClick={() => navigate('/auth/login')}
              className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer underline underline-offset-4"
            >
              Sign In
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
