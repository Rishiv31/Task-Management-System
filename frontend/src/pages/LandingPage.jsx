import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Cpu, 
  Users, 
  Layers, 
  TrendingUp, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// Framer Motion Animation Presets
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How do the Sprints and Team Analytics work?",
      a: "TaskFlow captures real-time status transitions and estimates to compute daily completion velocity, hourly active waves, and active backlog statistics, keeping your sprint velocity perfectly calibrated."
    },
    {
      q: "Does TaskFlow support real-time team collaboration?",
      a: "Yes! TaskFlow utilizes seamless workspace synchronization. When a teammate creates, assigns, or moves a task on the Kanban board, updates are refreshed instantly to keep everyone in the workspace aligned."
    },
    {
      q: "Can I self-host TaskFlow?",
      a: "Absolutely! We provide complete Docker configurations so you can spin up the full-stack system on your own servers with a single command."
    },
    {
      q: "Is there a free tier available?",
      a: "Yes, our Free Tier provides access to 1 personal workspace, essential Kanban boards, and standard productivity insights."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030303]">
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none z-0"></div>

      {/* Floating Glowing Orbs */}
      <div className="absolute top-[15%] left-[5%] w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow z-0"></div>
      <div className="absolute bottom-[20%] right-[5%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow z-0"></div>

      {/* Header / Navbar */}
      <header className="relative z-50 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-extrabold text-xl text-white">⚡</span>
          </div>
          <span className="font-extrabold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            TASKFLOW
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold glass-card border border-indigo-500/30 hover:bg-indigo-500/10 transition-all flex items-center gap-2"
            >
              Enter Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button 
                onClick={() => navigate('/auth/login')}
                className="text-slate-300 hover:text-white text-sm font-semibold transition-all"
              >
                Log In
              </button>
              <button 
                onClick={() => navigate('/auth/signup')}
                className="btn-neon-indigo px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg"
              >
                Start Free
              </button>
            </>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="flex flex-col items-center justify-center"
        >
          {/* Productivity Banner Pill */}
          <motion.div 
            variants={fadeInUp}
            className="glass-card px-4 py-1.5 rounded-full border border-indigo-500/20 text-xs text-indigo-300 font-bold uppercase tracking-widest flex items-center gap-2 mb-6"
          >
            <Zap className="w-3.5 h-3.5" /> Premium Task Workspace Active
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400"
          >
            The Premium Operating System for <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">Agile Teams</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={fadeInUp}
            className="text-slate-400 text-lg md:text-xl mt-6 max-w-2xl leading-relaxed font-light"
          >
            TaskFlow bridges responsive Kanban task management, instant workspace updates, and gorgeous team performance analytics into a stunning, premium workspace.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 mt-10 justify-center w-full sm:w-auto"
          >
            <button 
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/signup')}
              className="btn-neon-indigo px-8 py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 text-white"
            >
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('features');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="glass-card px-8 py-4 rounded-2xl text-base font-semibold hover:bg-white/5 border border-white/10 flex items-center justify-center gap-2 transition-all"
            >
              Explore Features
            </button>
          </motion.div>
        </motion.div>

        {/* HERO MOCKUP CARD PREVIEW */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 relative mx-auto max-w-5xl glass-card rounded-2xl border border-white/10 p-2 shadow-2xl shadow-indigo-500/5 overflow-hidden animate-float-slow"
        >
          {/* Window Buttons bar */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
            <span className="w-3 h-3 rounded-full bg-red-500/40"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/40"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/40"></span>
            <div className="mx-auto text-[10px] text-slate-500 bg-white/5 px-4 py-1 rounded-md border border-white/5">taskflow.ai/dashboard</div>
          </div>
          
          {/* Mock Dashboard Layout */}
          <div className="bg-[#08080c] grid grid-cols-12 min-h-[300px] md:min-h-[480px]">
            {/* Sidebar Mock */}
            <div className="col-span-3 border-r border-white/5 p-4 flex flex-col gap-3 text-left">
              <div className="h-6 w-20 bg-white/10 rounded-md mb-4"></div>
              <div className="h-8 bg-indigo-500/10 border-l-2 border-indigo-500 rounded-r-md"></div>
              <div className="h-8 bg-white/5 rounded-md"></div>
              <div className="h-8 bg-white/5 rounded-md"></div>
              <div className="h-8 bg-white/5 rounded-md mt-auto"></div>
            </div>
            {/* Board Mock */}
            <div className="col-span-9 p-6 text-left flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="h-8 w-36 bg-white/10 rounded-md"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/10"></div>
                  <div className="h-8 w-8 rounded-full bg-white/10"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 flex-1">
                {/* Column Todo */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col gap-3">
                  <div className="flex justify-between items-center"><div className="h-4 w-12 bg-white/10 rounded"></div><span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[10px]">2</span></div>
                  <div className="glass-card border border-white/5 p-3 rounded-lg flex flex-col gap-2">
                    <div className="h-3 w-full bg-white/10 rounded"></div>
                    <div className="h-3 w-2/3 bg-white/10 rounded"></div>
                    <div className="flex justify-between items-center mt-2"><div className="h-4 w-8 bg-red-500/20 rounded"></div><div className="w-5 h-5 rounded-full bg-indigo-500"></div></div>
                  </div>
                </div>
                {/* Column InProgress */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col gap-3">
                  <div className="flex justify-between items-center"><div className="h-4 w-16 bg-white/10 rounded"></div><span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[10px]">1</span></div>
                  <div className="glass-card border border-indigo-500/20 p-3 rounded-lg flex flex-col gap-2 shadow-lg shadow-indigo-500/5">
                    <div className="h-3 w-full bg-white/10 rounded"></div>
                    <div className="h-3 w-4/5 bg-indigo-500/20 rounded"></div>
                    <div className="flex justify-between items-center mt-2"><div className="h-4 w-12 bg-indigo-500/20 text-indigo-400 rounded"></div><div className="w-5 h-5 rounded-full bg-purple-500"></div></div>
                  </div>
                </div>
                {/* Column Done */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col gap-3">
                  <div className="flex justify-between items-center"><div className="h-4 w-10 bg-white/10 rounded"></div><span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[10px]">1</span></div>
                  <div className="glass-card border border-white/5 opacity-50 p-3 rounded-lg flex flex-col gap-2">
                    <div className="h-3 w-full bg-white/10 rounded line-through"></div>
                    <div className="flex justify-between items-center mt-2"><div className="h-4 w-8 bg-green-500/20 rounded"></div><div className="w-5 h-5 rounded-full bg-indigo-500"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* METRICS SECTION */}
        <section className="mt-24 border-t border-white/5 pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">30%</h3>
              <p className="text-sm text-slate-400 mt-2 font-medium">Faster Sprint Completion</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">0ms</h3>
              <p className="text-sm text-slate-400 mt-2 font-medium">Instant Sync Latency</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">10k+</h3>
              <p className="text-sm text-slate-400 mt-2 font-medium">Active Tasks Automated</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">88%</h3>
              <p className="text-sm text-slate-400 mt-2 font-medium">Task Focus Score Sprints</p>
            </div>
          </div>
        </section>

        {/* PILLARS / FEATURES SECTION */}
        <section id="features" className="py-24 border-t border-white/5 text-left">
          <div className="max-w-4xl">
            <div className="text-indigo-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
              <Zap className="w-3.5 h-3.5" /> High Performance Systems
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Everything you need to accelerate your team delivery loops.</h2>
            <p className="text-slate-400 text-lg mt-4 font-light">Crafted for modern engineering, marketing, and product squads who demand visual excellence and rapid, uninterrupted execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {/* Feature Card 1 */}
            <div className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col gap-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Interactive Sprints & Analytics</h3>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">Visualize hourly team activity waves, daily sprint completion velocity, workload ratings, and team velocity metrics.</p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col gap-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Resilient Sync Engine</h3>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">High-performance polling systems automatically refresh board adjustments, comment threads, and dashboard statistics for all active browsers.</p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col gap-6">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Agile Kanban Boards</h3>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">Features highly custom fluid spring-based animations, infinite-precision drag sorting, parent-subtask nesting, and detailed inline filters.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="py-24 border-t border-white/5 text-left">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold">Predictable, premium pricing.</h2>
            <p className="text-slate-400 mt-4 font-light">Zero lock-in. Cancel any time, or host the full stack on your own Docker containers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="glass-card p-8 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-300">Sandbox</h3>
                <div className="text-4xl font-extrabold text-white mt-4">$0 <span className="text-sm font-light text-slate-500">/ free forever</span></div>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">Perfect for personal sandboxes, developer task portfolios, and lightweight tracking.</p>
                <div className="border-t border-white/5 my-6"></div>
                <ul className="flex flex-col gap-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-400" /> 1 Active Workspace</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-400" /> Unlimited Tasks & Boards</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-400" /> Basic Productivity Analytics</li>
                </ul>
              </div>
              <button 
                onClick={() => navigate('/auth/signup')}
                className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-bold text-white mt-8"
              >
                Sign Up
              </button>
            </div>

            {/* Pro */}
            <div className="glass-card p-8 rounded-2xl border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white font-extrabold text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Popular</div>
              <div>
                <h3 className="text-lg font-bold text-indigo-400">Pro Sprint</h3>
                <div className="text-4xl font-extrabold text-white mt-4">$9 <span className="text-sm font-light text-slate-500">/ month</span></div>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">Fully supercharged for high-velocity teams and fast-growing software startups.</p>
                <div className="border-t border-white/5 my-6"></div>
                <ul className="flex flex-col gap-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-400" /> Unlimited Workspaces</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-400" /> Complete Velocity & Analytics Suite</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-400" /> Premium Workspace Sync</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-400" /> Custom Avatars & Priority Alerts</li>
                </ul>
              </div>
              <button 
                onClick={() => navigate('/auth/signup')}
                className="w-full btn-neon-indigo py-3 rounded-xl text-sm font-bold text-white mt-8"
              >
                Try 14-Day Free Trial
              </button>
            </div>

            {/* Docker Self-Host */}
            <div className="glass-card p-8 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-300">Developer Mesh</h3>
                <div className="text-4xl font-extrabold text-white mt-4">Free <span className="text-sm font-light text-slate-500">/ self-hosted</span></div>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">Deploy the full React, Spring Boot, and MySQL stack on your private servers.</p>
                <div className="border-t border-white/5 my-6"></div>
                <ul className="flex flex-col gap-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-400" /> Zero Hosting Limitations</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-400" /> 1-Command Docker Setup</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-400" /> Secure Local JWT Auth</li>
                </ul>
              </div>
              <button 
                onClick={() => {
                  window.open('https://github.com', '_blank');
                }}
                className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-bold text-white mt-8"
              >
                Clone Repository
              </button>
            </div>
          </div>
        </section>

        {/* FAQS SECTION */}
        <section className="py-24 border-t border-white/5 text-left">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-indigo-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 mb-4">
                <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold">Got questions? We have answers.</h2>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <span className="text-indigo-400 font-extrabold text-lg">{activeFaq === index ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-5 text-sm text-slate-400 border-t border-white/5 pt-4 leading-relaxed font-light"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="py-16 border-t border-white/5 relative z-10">
          <div className="glass-card max-w-6xl mx-auto rounded-3xl p-12 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl shadow-indigo-500/5">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none z-0"></div>
            <div className="text-left relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to supercharge your squad?</h2>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">Join thousands of high-velocity developers, designers, and managers pushing updates at the speed of light.</p>
            </div>
            <button 
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/signup')}
              className="btn-neon-indigo px-8 py-4 rounded-2xl text-base font-semibold text-white flex items-center gap-2 whitespace-nowrap z-10 shadow-lg shadow-indigo-500/20"
            >
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-16 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-xs border-t border-white/5 pt-8">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-400">⚡ TASKFLOW</span>
              <span>© {new Date().getFullYear()} TaskFlow. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-slate-400">
              <span className="hover:text-white cursor-pointer transition-all">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-all">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition-all">Docker Registry</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
