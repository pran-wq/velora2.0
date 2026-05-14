import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import * as aiService from '../../services/geminiService';
import { 
  Search, Bell, Zap, Dumbbell, Activity, ShieldPlus, Brain,
  ChevronRight, Utensils, Droplets, Moon, Edit3, Camera, FileText,
  Clock, Calendar, Target, Plus, X, ArrowRight, Pill
} from 'lucide-react';
import { cn } from '../../lib/utils';
import QuickActionModal from '../../components/QuickActionModal';
import DiseasePredictionAndRecovery from '../../components/DiseasePredictionAndRecovery';

export default function MaleHome() {
  const { profile, stats } = useApp();
  const navigate = useNavigate();
  const [summary, setSummary] = useState('');
  const [activeModal, setActiveModal] = useState<'workout' | 'sleep' | 'vitals' | null>(null);
  const [showReminders, setShowReminders] = useState(false);
  const reminderRef = useRef<HTMLDivElement>(null);

  // Close reminders on click outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (reminderRef.current && !reminderRef.current.contains(event.target)) {
        setShowReminders(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadAI() {
      if (!profile) return;
      try {
        const s = await aiService.getAIHealthSummary(profile, stats);
        setSummary(s);
      } catch {
        setSummary("Your recovery improved 12% this week. Consider increasing your calorie intake on training days.");
      }
    }
    loadAI();
  }, [profile, stats]);

  if (!profile) return null;

  const firstName = profile.name?.split(' ')[0] || 'Alex';

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B] flex justify-center p-2 md:p-6 overflow-x-hidden">
      
      <div className="w-full max-w-[1400px] relative">
        
        {/* HEADER */}
        <header className="flex justify-between items-center py-6 md:px-8 relative z-20">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">
              Good Morning, {firstName}! 👋
            </h1>
            <p className="text-[#64748B] text-sm font-medium">Optimize your health. Unlock your best self.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-full max-w-[320px] hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search metrics, insights, reports..." className="w-full pl-10 pr-6 py-3 bg-white rounded-full shadow-sm border border-gray-100 text-sm outline-none placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-[#818CF8]/20" />
            </div>
            <div className="relative" ref={reminderRef}>
              <div 
                onClick={() => setShowReminders(!showReminders)}
                className="relative cursor-pointer hover:scale-105 hover:bg-gray-50 transition-all bg-white p-3 rounded-full shadow-sm border border-gray-100"
              >
                <Bell size={20} className="text-[#475569]" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#818CF8] rounded-full border-2 border-[#F8FAFC] flex items-center justify-center text-[10px] text-white font-bold">3</div>
              </div>
              
              <AnimatePresence>
                {showReminders && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                     <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-[#F8FAFC]">
                        <h3 className="font-bold text-sm text-[#0F172A]">Reminders</h3>
                        <span className="text-[10px] text-[#818CF8] font-bold uppercase cursor-pointer hover:underline">Clear All</span>
                     </div>
                     <div className="max-h-80 overflow-y-auto p-2">
                        {[
                          { t: 'Vitamin D3', s: 'Take 1 capsule', time: '8:00 AM', c: '#FBBF24' },
                          { t: 'Cardiology Follow-up', s: 'Appt in 2 days', time: 'May 12', c: '#EF4444' },
                          { t: 'Log Evening Hydration', s: 'Remaining: 800ml', time: '7:00 PM', c: '#60A5FA' }
                        ].map((r, i) => (
                          <div key={i} className="p-3 hover:bg-[#F8FAFC] rounded-xl flex gap-3 transition-colors cursor-pointer">
                             <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: r.c }} />
                             <div>
                                <p className="text-xs font-bold text-[#0F172A]">{r.t}</p>
                                <p className="text-[10px] text-[#64748B] mt-0.5">{r.s}</p>
                                <div className="flex items-center gap-1 mt-1.5 text-[9px] font-bold text-[#818CF8]">
                                   <Clock size={10} /> {r.time}
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                     <div className="p-3 bg-white border-t border-gray-50 text-center">
                        <button className="text-[11px] font-bold text-[#64748B] hover:text-[#0F172A] transition-colors">View All Notifications</button>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" className="w-12 h-12 rounded-full object-cover shadow-sm cursor-pointer hover:shadow-md transition-shadow border-2 border-white" alt="Profile" onClick={() => navigate('/profile')} />
          </div>
        </header>

         {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 px-4 md:px-8 relative z-10 pb-16">
          
          {/* LEFT/MAIN AREA */}
          <div className="flex flex-col gap-6">
            
            {/* QUICK ACTIONS STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: 'Set Reminders', icon: Bell, color: 'bg-[#EEF2FF] text-[#818CF8]', path: '/reminders' },
                 { label: 'Book Appointment', icon: Calendar, color: 'bg-[#FDF2F8] text-[#F472B6]', path: '/appointments' },
                 { label: 'Start Exercise', icon: Dumbbell, color: 'bg-[#ECFDF5] text-[#10B981]', path: '/workouts' },
                 { label: 'Nutrition Log', icon: Utensils, color: 'bg-[#FFFBEB] text-[#F59E0B]', path: '/nutrition' }
               ].map((action) => (
                 <button 
                   key={action.label}
                   onClick={() => navigate(action.path)}
                   className="group bg-white hover:bg-[#F8FAFC] border border-gray-100 rounded-2xl p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex items-center gap-3 text-left"
                 >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", action.color)}>
                       <action.icon size={20} />
                    </div>
                    <span className="text-xs font-bold text-[#0F172A]">{action.label}</span>
                 </button>
               ))}
            </div>
            
            {/* HERO SECTION */}
            <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col relative overflow-hidden">
               <div className="mb-6">
                 <h2 className="text-xl font-bold text-[#0F172A]">Men's Dynamics Overview</h2>
                 <p className="text-[#64748B] text-sm">Your body. Your performance. Your edge.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center relative z-10">
                  {/* Left Metrics */}
                  <div className="space-y-6">
                    {[
                      { label: 'Energy', val: Math.min(100, Math.round(stats.recoveryScore * 0.9)), color: '#FCD34D', icon: Zap },
                      { label: 'Strength', val: Math.min(100, Math.round(stats.recoveryScore * 1.1)), color: '#34D399', icon: Dumbbell },
                      { label: 'Hormones', val: Math.min(100, Math.round(stats.recoveryScore * 0.85)), color: '#818CF8', icon: Activity },
                      { label: 'Recovery', val: stats.recoveryScore, color: '#FBBF24', icon: ShieldPlus },
                      { label: 'Mind & Focus', val: Math.min(100, Math.round(stats.recoveryScore * 1.05)), color: '#A78BFA', icon: Brain },
                    ].map(m => (
                      <div key={m.label} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <m.icon size={16} color={m.color} />
                            <span className="text-sm font-bold text-[#334155]">{m.label}</span>
                          </div>
                          <div className="text-right leading-none">
                            <span className="text-sm font-bold text-[#0F172A]">{m.val}</span>
                            <span className="text-[10px] text-gray-400 ml-1">/100</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${m.val}%`, backgroundColor: m.color }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Center Ring */}
                  <div className="relative w-64 h-64 flex items-center justify-center mx-auto">
                     <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#818CF8" />
                            <stop offset="25%" stopColor="#F472B6" />
                            <stop offset="50%" stopColor="#FBBF24" />
                            <stop offset="75%" stopColor="#34D399" />
                            <stop offset="100%" stopColor="#60A5FA" />
                          </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="44" fill="none" stroke="#F1F5F9" strokeWidth="6" />
                        <circle cx="50" cy="50" r="44" fill="none" stroke="url(#ringGrad)" strokeWidth="8" strokeDasharray="276" strokeDashoffset="63" strokeLinecap="round" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Overall Score</span>
                        <div className="flex items-baseline">
                          <span className="text-6xl font-bold text-[#0F172A] tracking-tighter">{Math.round(stats.recoveryScore * 0.95)}</span>
                        </div>
                        <span className="text-sm text-gray-400 font-medium mb-1">/100</span>
                        <span className="text-lg font-bold text-[#818CF8]">{stats.recoveryScore > 80 ? 'Optimal' : stats.recoveryScore > 70 ? 'Good' : 'Needs Rest'}</span>
                        <span className="text-[10px] text-[#64748B] mt-1">{stats.recoveryScore > 80 ? 'Peak condition!' : 'Keep pushing forward!'}</span>
                     </div>
                     {/* Floating Icons */}
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-[#818CF8]"><Zap size={14} fill="currentColor" /></div>
                     <div className="absolute right-0 top-[20%] w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-[#F472B6]"><Brain size={14} /></div>
                     <div className="absolute right-4 bottom-[15%] w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-[#FBBF24]"><ShieldPlus size={14} /></div>
                     <div className="absolute left-6 bottom-[10%] w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-[#34D399]"><Moon size={14} fill="currentColor" /></div>
                     <div className="absolute left-[-0.5rem] top-[40%] w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-[#60A5FA]"><Dumbbell size={14} /></div>
                  </div>

                  {/* Right Status */}
                  <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 flex flex-col justify-center h-full space-y-6">
                     <div>
                       <h3 className="text-sm font-bold text-[#64748B] mb-2">Your Status</h3>
                       <div className="flex items-center gap-2">
                         <span className="text-2xl font-bold text-[#10B981]">Good</span>
                         <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                       </div>
                       <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                         You're on the right track. Consistency is your advantage.
                       </p>
                     </div>
                     <div>
                       <div className="flex justify-between items-center mb-4">
                         <h4 className="text-xs font-bold text-[#64748B]">Trend (This Week)</h4>
                         <span className="px-2 py-1 bg-[#10B981]/10 text-[#10B981] rounded text-[10px] font-bold">↑ 8%</span>
                       </div>
                       {/* Real Sparkline / Trend Data */}
                       <div className="w-full h-12 flex items-end gap-1">
                          {stats.adherenceRate > 0 ? (
                            Array.from({ length: 7 }).map((_, i) => (
                              <div key={i} className="flex-1 bg-[#A78BFA] rounded-t-sm opacity-80" style={{ height: `${Math.random() * 40 + 40}%` }} />
                            ))
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Logging data...</div>
                          )}
                       </div>
                       <p className="text-xs text-[#64748B] mt-2 text-center">Trend analysis active</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* AI DISEASE PREDICTION & RECOVERY GRAPH */}
            <DiseasePredictionAndRecovery />

            {/* COMPACT MEDICATION STRIP (AFTER RING) */}
            <div className="space-y-6">
               <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-3">
                     <div className="w-1 h-6 bg-[#10B981] rounded-full" />
                     <h2 className="text-lg font-display font-black tracking-tight text-[#0F172A] uppercase italic">Medication & Supplements</h2>
                  </div>
                  <button className="text-[9px] font-black text-[#10B981] uppercase tracking-widest hover:underline">Manage Rx</button>
               </div>
               <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2 snap-x snap-mandatory">
                  {[
                    { name: 'Magnesium Glycinate', dose: '400mg • 9 PM', status: 'TAKEN', bg: 'bg-[#F0FDF4]', border: 'border-[#DCFCE7]', color: 'text-[#10B981]' },
                    { name: 'Omega-3', dose: '1000mg • 8 AM', status: 'TAKEN', bg: 'bg-[#F0FDF4]', border: 'border-[#DCFCE7]', color: 'text-[#10B981]' },
                    { name: 'Vitamin D3 + K2', dose: '2000IU • 8 AM', status: 'LOG NOW', bg: 'bg-white', border: 'border-gray-100', color: 'text-[#0F172A]' },
                    { name: 'Iron Bisglycinate', dose: '25mg • 10 AM', status: 'LOG NOW', bg: 'bg-white', border: 'border-gray-100', color: 'text-[#0F172A]' },
                  ].map((m, i) => (
                    <div key={i} className={cn("flex-shrink-0 w-56 rounded-[28px] p-5 border shadow-sm transition-all snap-center", m.bg, m.border)}>
                       <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                             <Pill size={16} className={m.status === 'TAKEN' ? 'text-[#10B981]' : 'text-gray-400'} />
                          </div>
                          <button className={cn("px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm", m.status === 'TAKEN' ? 'bg-white text-[#10B981] border border-emerald-100' : 'bg-[#0F172A] text-white')}>
                             {m.status}
                          </button>
                       </div>
                       <div>
                          <h4 className="text-[11px] font-black text-[#0F172A] truncate">{m.name}</h4>
                          <p className="text-[9px] font-bold text-gray-400 mt-0.5">{m.dose}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* DYNAMIC GOAL-BASED WIDGETS */}
            {profile?.healthGoals?.includes('Weight Loss') && (
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-50 rounded-xl text-orange-500"><Utensils size={20} /></div>
                  <h3 className="font-bold text-[#0F172A]">Weight Loss Focus</h3>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#64748B]">Calorie Deficit Target</span>
                  <span className="font-bold text-[#0F172A]">500 kcal</span>
                </div>
              </div>
            )}

            {profile?.healthGoals?.includes('Stress Reduction') && (
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500"><Moon size={20} /></div>
                  <h3 className="font-bold text-[#0F172A]">Stress Management</h3>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#64748B]">Meditation Adherence</span>
                  <span className="font-bold text-[#0F172A]">{stats.adherenceRate}%</span>
                </div>
              </div>
            )}

            {/* METRICS ROW */}
            <div className="grid grid-cols-1 gap-4">
               {/* Sleep Quality */}
               <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-4 text-[#A78BFA]">
                    <Moon size={16} />
                    <span className="text-xs font-bold text-[#0F172A]">Sleep Quality</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-[#0F172A]">{Math.floor(stats.sleepHours)}</span>
                    <span className="text-[14px] font-medium text-gray-500">h</span>
                    <span className="text-3xl font-bold text-[#0F172A] ml-1">{Math.round((stats.sleepHours % 1) * 60)}</span>
                    <span className="text-[14px] font-medium text-gray-500">m</span>
                    <span className="ml-auto px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] rounded text-[10px] font-bold">{stats.sleepHours >= 7 ? 'Good' : 'Low'}</span>
                  </div>
                  <div className="w-full h-8 flex items-end gap-1.5 justify-between">
                     {[40, 60, 30, 80, 50, 70, stats.sleepHours * 10].map((v, i) => (
                       <div key={i} className="w-2 bg-[#A78BFA] rounded-full" style={{ height: `${Math.min(100, v)}%`, opacity: v > 60 ? 1 : 0.4 }} />
                     ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                    <span>11:00 PM</span>
                    <span>6:15 AM</span>
                  </div>
               </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

               {/* Recovery Status */}
               <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col justify-between">
                  <h3 className="font-bold text-[#0F172A] mb-4">Recovery Status</h3>
                  <div className="flex items-center gap-4">
                     <div className="relative w-20 h-20 shrink-0">
                       <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#818CF8" strokeWidth="8" strokeDasharray="251" strokeDashoffset={251 - (251 * stats.recoveryScore) / 100} strokeLinecap="round" />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-xl font-bold text-[#0F172A]">{stats.recoveryScore}%</span>
                       </div>
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-[#0F172A]">Recovered</h4>
                       <p className="text-[10px] text-[#64748B] mt-1 leading-relaxed">
                         Your body is adapting well. Keep balancing stress & recovery.
                       </p>
                     </div>
                  </div>
                  <button className="w-full mt-6 py-3 bg-[#F8FAFC] text-[#818CF8] font-bold text-xs rounded-xl hover:bg-[#EEF2FF] transition-colors border border-gray-100">
                    View Recovery Insights
                  </button>
               </div>

               {/* AI Coach Insight */}
               <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#818CF8]/10 rounded-full blur-3xl -z-0" />
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-2">
                          <Brain size={20} className="text-[#818CF8]" />
                          <h3 className="font-bold text-[#0F172A]">AI Performance Coach</h3>
                       </div>
                       <span className="px-2 py-0.5 bg-[#818CF8]/10 text-[#818CF8] text-[9px] font-black uppercase rounded-full tracking-wider">Active Analysis</span>
                    </div>
                    
                    <p className="text-xs font-bold text-[#334155] mb-3 leading-relaxed italic">
                       "{summary || "Calculating real-time vector analytics..."}"
                    </p>
                    
                    <div className="space-y-2 mt-1">
                       <div className="flex items-center gap-2 text-[11px] text-[#475569] font-medium">
                          <div className="w-1 h-1 rounded-full bg-[#818CF8]" />
                          <span>Focus on Sleep Efficiency tonight (target 8h)</span>
                       </div>
                       <div className="flex items-center gap-2 text-[11px] text-[#475569] font-medium">
                          <div className="w-1 h-1 rounded-full bg-[#34D399]" />
                          <span>Current anabolic window peaks at 5 PM</span>
                       </div>
                    </div>

                    <div className="mt-auto pt-4 flex gap-2">
                       <button className="flex-1 py-2.5 bg-[#0F172A] text-white font-bold text-[11px] rounded-xl shadow-md hover:bg-[#1E293B] transition-colors">
                          Full Action Plan
                       </button>
                       <button className="w-10 h-10 bg-[#F8FAFC] border border-gray-100 rounded-xl flex items-center justify-center text-[#64748B] hover:bg-white transition-colors">
                          <ArrowRight size={16} />
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="flex flex-col gap-6">
             
             {/* Today's Focus */}
             <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50">
               <div className="flex items-center gap-2 mb-6">
                 <div className="w-8 h-8 rounded-full bg-[#818CF8]/10 flex items-center justify-center text-[#818CF8]"><Activity size={16} /></div>
                 <h3 className="font-bold text-[#0F172A] text-[15px]">Today's Focus</h3>
               </div>
               <div className="space-y-4">
                  {[
                    { title: 'Hit Protein Goal', val: '160 / 180 g', icon: Utensils, color: 'text-[#F472B6]', bg: 'bg-[#F472B6]/10' },
                    { title: 'Workout', val: 'Upper Body Strength', icon: Dumbbell, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10' },
                    { title: 'Hydration', val: '2.1 / 3 L', icon: Droplets, color: 'text-[#60A5FA]', bg: 'bg-[#60A5FA]/10' },
                    { title: 'Sleep', val: '7.2 / 8 hr', icon: Moon, color: 'text-[#A78BFA]', bg: 'bg-[#A78BFA]/10' },
                  ].map(f => (
                    <div key={f.title} className="flex items-center justify-between group cursor-pointer hover:bg-[#F8FAFC] p-2 -mx-2 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                         <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", f.bg, f.color)}>
                            <f.icon size={16} />
                         </div>
                         <div>
                            <h4 className="font-bold text-[#0F172A] text-xs">{f.title}</h4>
                            <p className="text-[11px] text-[#64748B] mt-0.5">{f.val}</p>
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                  ))}
               </div>
               <button className="w-full mt-6 text-[#818CF8] font-bold text-xs hover:underline">
                 View Full Plan
               </button>
             </div>

             {/* Daily Nutrition */}
             <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24]"><Utensils size={16} /></div>
                   <h3 className="font-bold text-[#0F172A] text-[15px]">Daily Nutrition</h3>
                 </div>
                 <span className="text-[11px] font-bold text-[#64748B]">1,850 kcal</span>
               </div>
               <div className="space-y-4">
                  {[
                    { label: 'Protein', current: 160, goal: 180, color: 'bg-[#60A5FA]' },
                    { label: 'Carbs', current: 200, goal: 250, color: 'bg-[#FBBF24]' },
                    { label: 'Fats', current: 65, goal: 70, color: 'bg-[#F472B6]' },
                  ].map((macro) => (
                    <div key={macro.label} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-[#475569]">{macro.label}</span>
                        <span className="text-[#0F172A]">{macro.current} / {macro.goal}g</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", macro.color)} style={{ width: `${Math.min(100, (macro.current / macro.goal) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
               </div>
             </div>

              {/* Medication & Supplement Hub */}
              <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><Pill size={16} /></div>
                    <h3 className="font-bold text-[#0F172A] text-[15px]">Supplements</h3>
                  </div>
                  <button className="text-[11px] font-bold text-emerald-500 hover:underline">Manage</button>
                </div>
                <div className="space-y-3">
                   {[
                     { name: 'Vitamin D3 + K2', dose: '5000IU', status: 'Taken', color: 'bg-emerald-50 text-emerald-600' },
                     { name: 'Creatine Monohydrate', dose: '5g', status: 'Taken', color: 'bg-emerald-50 text-emerald-600' },
                     { name: 'Whey Isolate', dose: '30g', status: 'Log Now', color: 'bg-gray-50 text-gray-400' },
                     { name: 'ZMA', dose: '1 serving', status: 'Nightly', color: 'bg-gray-50 text-gray-400' },
                   ].map((m, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-all cursor-pointer group">
                        <div>
                           <h4 className="text-xs font-bold text-[#0F172A]">{m.name}</h4>
                           <p className="text-[10px] text-[#64748B]">{m.dose}</p>
                        </div>
                        <span className={cn("text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider", m.color)}>
                           {m.status}
                        </span>
                     </div>
                   ))}
                </div>
              </div>

             {/* Upcoming */}
             <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50">
               <div className="flex items-center gap-2 mb-6">
                 <div className="w-8 h-8 rounded-full bg-[#818CF8]/10 flex items-center justify-center text-[#818CF8]"><Activity size={16} /></div>
                 <h3 className="font-bold text-[#0F172A] text-[15px]">Upcoming</h3>
               </div>
               <div className="flex items-center justify-between group cursor-pointer hover:bg-[#F8FAFC] p-2 -mx-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-[#818CF8]">
                        <Dumbbell size={16} />
                     </div>
                     <div>
                        <h4 className="font-bold text-[#0F172A] text-xs">Leg Day</h4>
                        <p className="text-[11px] text-[#64748B] mt-0.5">Tomorrow, 7:00 AM</p>
                     </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
               </div>
             </div>

          </div>
        </div>
      </div>
      
      {/* Modals */}
      <QuickActionModal 
        isOpen={activeModal !== null} 
        actionType={activeModal} 
        onClose={() => setActiveModal(null)} 
      />
    </div>
  );
}
