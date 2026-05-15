import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/Common';
import { useApp } from '../../context/AppContext';
import * as aiService from '../../services/geminiService';
import { 
  Sparkles, Pill, Activity, Droplets, 
  Moon, UploadCloud, Heart, ShieldAlert,
  Baby, Utensils, Music, Wind, Brain, Target, ArrowRight,
  Search, Bell, Clock, Calendar, X, Check
} from 'lucide-react';
import { cn } from '../../lib/utils';
import DiseasePredictionAndRecovery from '../../components/DiseasePredictionAndRecovery';

export default function PregnancyHome() {
  const { profile, stats } = useApp();
  const navigate = useNavigate();
  const [summary, setSummary] = useState('');
  const [showReminders, setShowReminders] = useState(false);
  const [maternalSupps, setMaternalSupps] = useState([
    { id: 1, name: 'Prenatal Multivitamin', dose: '1 daily', status: 'Taken' },
    { id: 2, name: 'DHA / Omega-3', dose: '200mg', status: 'Taken' },
    { id: 3, name: 'Calcium', dose: '500mg', status: 'Pending' },
  ]);
  const reminderRef = useRef<HTMLDivElement>(null);

  const toggleSupp = (id: number) => {
    setMaternalSupps(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'Taken' ? 'Pending' : 'Taken' } : s
    ));
  };

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
        setSummary("Your baby is growing beautifully. Remember to stay hydrated.");
      }
    }
    loadAI();
  }, [profile, stats]);

  if (!profile || !profile.isPregnant) return null;

  const currentMonth = profile.pregnancyMonth || 5;
  const currentWeek = Math.floor(currentMonth * 4.3);
  const accent = '#6366f1';

  const wellnessActivities = [
    { label: 'Talking with Baby', icon: Music, color: 'bg-indigo-50 text-indigo-500', desc: '10 min bonding' },
    { label: 'Prenatal Yoga', icon: Activity, color: 'bg-green-50 text-[#2D8C63]', desc: '15 min flow' },
    { label: 'Breathing Exercise', icon: Wind, color: 'bg-blue-50 text-[#06B6D4]', desc: '5 min calm' },
    { label: 'Guided Meditation', icon: Brain, color: 'bg-purple-50 text-[#8B5CF6]', desc: '10 min zen' },
    { label: 'Kegel Exercise', icon: Target, color: 'bg-orange-50 text-[#F97316]', desc: '5 min strength' },
  ];

  return (
    <div className="flex flex-col gap-6 pt-6 px-6 md:px-10 pb-32 overflow-y-auto no-scrollbar h-full bg-[#F8FAFC] max-w-[1400px] mx-auto font-sans relative">
      
      {/* GLOBAL HEADER */}
      <header className="flex justify-between items-center py-4 relative z-50">
        <div className="flex items-center gap-3 text-indigo-500">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
             <Baby size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Journey</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-full max-w-[240px] hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search tracking..." className="w-full pl-10 pr-6 py-2 bg-white rounded-full border border-slate-100 text-[13px] outline-none shadow-sm transition-all focus:border-indigo-300" />
          </div>
          
          <div className="relative" ref={reminderRef}>
            <div 
              onClick={() => setShowReminders(!showReminders)}
              className="relative cursor-pointer hover:scale-105 transition-all p-2.5 bg-white rounded-full shadow-sm border border-slate-100 text-slate-500"
            >
              <Bell size={20} />
              <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full border-2 border-[#F8FAFC] flex items-center justify-center text-[8px] text-white font-bold">2</div>
            </div>
            
            <AnimatePresence>
              {showReminders && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-72 bg-white rounded-[24px] shadow-xl border border-indigo-100 overflow-hidden z-50"
                >
                   <div className="p-4 border-b border-indigo-50 flex justify-between items-center bg-indigo-50/30">
                      <h3 className="font-bold text-sm text-slate-800">Pregnancy Tracker</h3>
                   </div>
                   <div className="max-h-64 overflow-y-auto p-2">
                      {[
                        { t: 'Prenatal Vitamin', s: 'Take with lunch', time: '12:30 PM', c: '#6366f1' },
                        { t: 'Appointment Tomorrow', s: 'Dr. Sarah Khan (Scan)', time: 'Tomorrow', c: '#06B6D4' }
                      ].map((r, i) => (
                        <div key={i} className="p-3 hover:bg-indigo-50/40 rounded-2xl flex gap-3 transition-colors cursor-pointer">
                           <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: r.c }} />
                           <div>
                              <p className="text-xs font-bold text-slate-800">{r.t}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{r.s}</p>
                              <div className="flex items-center gap-1 mt-1.5 text-[9px] font-bold text-indigo-500">
                                 <Clock size={10} /> {r.time}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Reminders', icon: Bell, color: 'bg-indigo-50 text-indigo-500', path: '/reminders' },
           { label: 'Book OB-GYN', icon: Calendar, color: 'bg-[#E0F2FE] text-[#0284C7]', path: '/appointments' },
           { label: 'Yoga Plan', icon: Activity, color: 'bg-[#ECFDF5] text-[#059669]', path: '/workouts' },
           { label: 'Nutrients', icon: Utensils, color: 'bg-[#FFF7ED] text-[#D97706]', path: '/nutrition' }
         ].map((action) => (
           <button 
             key={action.label}
             onClick={() => navigate(action.path)}
             className="group bg-white hover:shadow-md border border-white rounded-[24px] p-4 transition-all flex items-center gap-3 text-left shadow-sm"
           >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", action.color)}>
                 <action.icon size={18} />
              </div>
              <span className="text-xs font-bold text-slate-800">{action.label}</span>
           </button>
         ))}
      </div>

      {/* SECTION 1 - HERO ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT: Compact Hero Card */}
        <section className="lg:col-span-5 relative overflow-hidden rounded-[2rem] shadow-lg bg-white border border-white/60">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-400/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative p-5 md:p-6 space-y-4">
            
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 text-[8px] font-black uppercase tracking-widest">
                <Baby size={10} />
                <span>Week 18</span>
              </div>
              <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800 tracking-tight leading-snug">
                You & your baby <span style={{ color: accent }}>matter every day</span>
              </h1>
              <p className="text-[11px] font-medium text-slate-500">Pregnancy • 18 Weeks 3 Days</p>
            </div>

            <div className="p-3 bg-indigo-50/40 rounded-xl border border-white/50 flex items-start gap-2.5">
               <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-indigo-500 shrink-0 shadow-sm">
                 <Sparkles size={12} />
               </div>
               <div>
                 <p className="text-[7px] font-black uppercase tracking-widest text-indigo-500">Today's Tip</p>
                 <p className="text-[10px] font-bold text-slate-800/80 leading-relaxed italic mt-0.5">
                   "Stay hydrated and take short walks — it boosts mood for you and baby."
                 </p>
               </div>
            </div>

            {/* Mini Stats Row */}
            <div className="flex gap-3">
              {[
                { label: 'Heart Rate', val: '148 bpm', color: '#6366f1' },
                { label: 'Weight', val: '+4.2 kg', color: '#06B6D4' },
                { label: 'Next Scan', val: '13 days', color: '#8B5CF6' },
              ].map((s, i) => (
                <div key={i} className="flex-1 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <p className="text-sm font-bold text-slate-800">{s.val}</p>
                  <p className="text-[7px] font-black uppercase tracking-widest mt-0.5" style={{ color: s.color }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT: Baby Development Card */}
        <section className="lg:col-span-7 relative overflow-hidden rounded-[2rem] shadow-lg bg-gradient-to-br from-indigo-50/40 to-white border border-indigo-100/40">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-400/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400/5 rounded-full blur-[60px]" />
          
          <div className="relative p-5 md:p-6 flex flex-col md:flex-row gap-6 h-full">
            
            {/* Baby Illustration */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-200/30 to-purple-200/10 animate-pulse" style={{ animationDuration: '3s' }} />
                {/* Image circle */}
                <div className="absolute inset-3 rounded-full bg-white shadow-xl shadow-indigo-500/10 border-2 border-white overflow-hidden flex items-center justify-center p-3">
                   <img 
                     src="/images/baby/babyimg.png" 
                     alt="Baby Development" 
                     className="w-full h-full object-contain"
                   />
                </div>
                {/* Week badge */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-white rounded-full shadow-md border border-indigo-100 text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-indigo-500">18 Weeks 3 Days</p>
                </div>
              </div>
            </div>
            
            {/* Development Milestones */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-indigo-500">Baby Development</p>
                <h2 className="text-lg md:text-xl font-display font-bold text-slate-800 tracking-tight mt-1">Size of a bell pepper</h2>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">Your baby is about 14cm long and weighs around 190g. They can now yawn, hiccup, and even suck their thumb!</p>
              </div>
              
              <div className="space-y-2.5">
                {[
                  { milestone: 'Ears are in final position', done: true },
                  { milestone: 'Nervous system maturing rapidly', done: true },
                  { milestone: 'Unique fingerprints forming', done: true },
                  { milestone: 'Baby can hear your voice', done: false },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-white transition-all",
                      m.done ? "bg-indigo-500 shadow-sm shadow-indigo-500/20" : "bg-gray-200"
                    )}>
                      {m.done ? <Check size={11} strokeWidth={3} /> : <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                    </div>
                    <p className={cn("text-[11px] font-bold", m.done ? "text-slate-800" : "text-gray-400")}>{m.milestone}</p>
                  </div>
                ))}
              </div>

                <button 
                   onClick={() => navigate('/predict')}
                   className="mt-4 w-full py-2.5 rounded-xl text-white font-bold text-[9px] uppercase tracking-widest shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2" 
                   style={{ backgroundColor: accent }}
                >
                   <Baby size={12} />
                   Full Growth Timeline
                </button>
            </div>
          </div>
        </section>

      </div>

      {/* AI DISEASE PREDICTION & RECOVERY GRAPH */}
      <DiseasePredictionAndRecovery />

      {/* SECTION 2 - HOLISTIC WELLNESS MATRIX (NEW) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sleep Quality', val: '82%', sub: '7h 20m • Deep', icon: Moon, color: '#8B5CF6' },
          { label: 'Hydration', val: '2.1L', sub: 'Goal: 2.8L', icon: Droplets, color: '#06B6D4' },
          { label: 'Daily Steps', val: '6,432', sub: 'Goal: 8,000', icon: Activity, color: '#10B981' },
          { label: 'Mental Calm', val: 'High', sub: 'Last HRV: 64ms', icon: Brain, color: '#F59E0B' },
        ].map((item, i) => (
          <GlassCard key={i} className="p-5 bg-white border-none shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}10`, color: item.color }}>
               <item.icon size={20} />
            </div>
            <div>
               <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
               <h4 className="text-lg font-bold text-slate-800 mt-0.5">{item.val}</h4>
               <p className="text-[8px] font-medium text-gray-400 mt-0.5">{item.sub}</p>
            </div>
          </GlassCard>
        ))}
      </section>

      {/* SECTION 3 - DUAL TRACKING: PREGNANCY & GENERAL HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: General Vitality Monitor */}
        <section className="lg:col-span-5 space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">General Vitality Monitor</h3>
           <GlassCard className="p-6 bg-slate-800 text-white border-none shadow-xl !rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-[50px]" />
              
              <div className="relative space-y-6">
                <div className="flex justify-between items-start">
                   <div>
                      <h4 className="text-3xl font-display font-bold">94%</h4>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Overall Health Score</p>
                   </div>
                   <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10">
                      <p className="text-[8px] font-bold text-indigo-400">Optimal</p>
                   </div>
                </div>

                <div className="space-y-3">
                   {[
                     { label: 'Blood Pressure', val: '118/76', status: 'Stable', color: '#10B981' },
                     { label: 'Glucose Level', val: '92 mg/dL', status: 'Optimal', color: '#6366f1' },
                     { label: 'Respiratory Rate', val: '14 rpm', status: 'Stable', color: '#06B6D4' },
                   ].map((v, i) => (
                     <div key={i} className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/5">
                        <div>
                           <p className="text-[9px] font-black uppercase tracking-widest text-white/40">{v.label}</p>
                           <p className="text-base font-bold mt-0.5">{v.val}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[8px] font-bold" style={{ color: v.color }}>{v.status}</p>
                           <div className="w-10 h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full bg-current" style={{ width: '80%', color: v.color }} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <button className="w-full py-3.5 bg-white text-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
                   Deep Vitals History
                </button>
              </div>
           </GlassCard>
        </section>

        {/* RIGHT: Maternal Progress & Daily Activities */}
        <section className="lg:col-span-7 space-y-4">
           <div className="flex justify-between items-end px-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Holistic Wellness Plan</h3>
              <button onClick={() => navigate('/health')} className="text-[10px] font-bold text-indigo-500 hover:underline">View Full Hub</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Prenatal Yoga', sub: '20 min session', icon: Activity, color: '#8B5CF6', path: '/workouts' },
                { title: 'Mindful Breathing', sub: '5 min focused calm', icon: Wind, color: '#06B6D4', path: '/mental-wellness' },
                { title: 'Vitamin Intake', sub: 'D3 + Omega-3', icon: ShieldAlert, color: '#6366f1', path: '/reminders' },
                { title: 'Hydration Tracking', sub: 'Track your water', icon: Droplets, color: '#3B82F6', path: '/nutrition' },
              ].map((act, i) => (
                <GlassCard 
                   key={i} 
                   onClick={() => navigate(act.path)}
                   className="p-5 bg-white border-none shadow-sm hover:bg-indigo-50/50 transition-colors cursor-pointer group flex items-center gap-4 !rounded-[2rem] hover:shadow-md active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: `${act.color}10`, color: act.color }}>
                     <act.icon size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#6366f1] transition-colors">{act.title}</h4>
                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">{act.sub}</p>
                  </div>
                </GlassCard>
              ))}
           </div>
           
           <div className="p-6 bg-gradient-to-br from-indigo-50/30 to-white rounded-[2rem] border border-indigo-100/40 flex items-center justify-between">
              <div className="space-y-1">
                 <h4 className="text-sm font-bold text-slate-800">Pregnancy Readiness</h4>
                 <p className="text-[10px] text-slate-500">Your body is adapting well to Week 18 changes.</p>
              </div>
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                     {i}
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* SECTION 4 - DAILY OVERVIEW */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Daily Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Hydration', val: '1.8L', target: '2.5L', progress: 72, trend: '+0.4L', icon: Droplets, color: '#06B6D4' },
                { label: 'Activity', val: '6,432', target: '8k', progress: 80, trend: '+12%', icon: Activity, color: '#10B981' },
                { label: 'Deep Sleep', val: '7h 20m', target: '8h', progress: 91, trend: 'Optimal', icon: Moon, color: '#8B5CF6' },
                { label: 'Metabolism', val: '1,540', target: '2.1k', progress: 68, trend: 'Stable', icon: Utensils, color: '#F59E0B' },
              ].map((stat, i) => (
                <GlassCard key={i} className="p-6 bg-white hover:shadow-xl transition-all border-none shadow-sm group relative overflow-hidden !rounded-[2.5rem]">
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                          <stat.icon size={20} />
                       </div>
                       <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-400">{stat.trend}</span>
                    </div>
                    
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                       <div className="flex items-baseline gap-1">
                          <h4 className="text-xl font-bold text-slate-800">{stat.val}</h4>
                          <span className="text-[9px] font-medium text-gray-300">/ {stat.target}</span>
                       </div>
                    </div>

                    <div className="mt-4 space-y-2">
                       <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.progress}%` }}
                            className="h-full rounded-full" 
                            style={{ backgroundColor: stat.color }}
                          />
                       </div>
                       <p className="text-[8px] font-bold text-gray-300 text-right">{stat.progress}% of goal</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* SECTION 5 - NUTRITION SUMMARY */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Maternal Nutrition</h3>
             <GlassCard className="p-8 bg-white flex flex-col md:flex-row items-center justify-between gap-10 border-none shadow-sm !rounded-[3rem]">
                <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#F9FAFB" strokeWidth="12" />
                    <circle cx="80" cy="80" r="70" fill="none" stroke={accent} strokeWidth="12" strokeLinecap="round" strokeDasharray="440" strokeDashoffset={440 - (440 * 1450/2100)} />
                  </svg>
                  <div className="text-center space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Goal</p>
                    <p className="text-3xl font-display font-bold text-slate-800">1,450</p>
                    <p className="text-[10px] font-bold text-gray-400">/ 2,100 kcal</p>
                  </div>
                </div>
                
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {[
                     { label: 'Iron Rich Food', desc: 'Spinach, Lentils, Beans', color: '#EF4444' },
                     { label: 'Calcium Rich Food', desc: 'Milk, Yogurt, Almonds', color: '#3B82F6' }
                   ].map((item, i) => (
                     <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                        <div className="flex justify-between items-start">
                          <h5 className="text-xs font-bold text-gray-800">{item.label}</h5>
                          <ArrowRight size={14} className="text-gray-400" />
                        </div>
                        <p className="text-[10px] font-medium text-gray-500 leading-relaxed">{item.desc}</p>
                     </div>
                   ))}
                </div>
             </GlassCard>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-10">
          
           {/* SECTION 7.5 - MATERNAL SUPPLEMENTS */}
           <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Maternal Supplements</h3>
              <GlassCard className="p-6 bg-white border-none shadow-sm space-y-4 !rounded-[2.5rem]">
                 {maternalSupps.map((m) => {
                   const isTaken = m.status === 'Taken';
                   return (
                     <div 
                        key={m.id} 
                        onClick={() => toggleSupp(m.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group active:scale-[0.98]",
                          isTaken ? "bg-emerald-50/30 border-emerald-100" : "bg-white border-gray-50 hover:bg-gray-50"
                        )}
                     >
                        <div className="flex items-center gap-3">
                           <div className={cn(
                             "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                             isTaken ? "bg-emerald-100 text-emerald-600" : "bg-gray-50 text-gray-400"
                           )}>
                              <Pill size={18} />
                           </div>
                           <div>
                              <h4 className="text-xs font-bold text-slate-800">{m.name}</h4>
                              <p className="text-[10px] text-gray-400">{m.dose}</p>
                           </div>
                        </div>
                        <span className={cn(
                          "text-[9px] font-black px-2 py-1 rounded-lg uppercase transition-colors",
                          isTaken ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400 group-hover:bg-[#6366f1] group-hover:text-white'
                        )}>
                           {isTaken ? 'Taken' : 'Log Now'}
                        </span>
                     </div>
                   );
                 })}
                 <button 
                    onClick={() => navigate('/reminders')}
                    className="w-full py-3 bg-indigo-50/50 text-[#6366f1] font-bold text-[11px] rounded-xl uppercase tracking-widest hover:bg-[#6366f1] hover:text-white transition-all mt-2"
                 >
                    Manage Supplements
                 </button>
              </GlassCard>
           </section>

          {/* SECTION 6 - AI ASSISTANT CARD UPGRADED */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">AI Companion</h3>
             <GlassCard className="p-8 bg-[#6366f1] border-none !rounded-[3rem] shadow-xl shadow-[#6366f1]/20 relative overflow-hidden text-white group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[40px] -mr-10 -mt-10" />
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                   <div className="p-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl shadow-sm border border-white/20">
                     <Sparkles size={18} />
                   </div>
                   <h4 className="font-bold text-base">Maternal Assistant</h4>
                </div>
                
                <p className="text-sm font-bold text-white leading-relaxed mb-4 italic relative z-10">
                   "{summary || "Analyzing your vitals... Bonding time recommended."}"
                </p>

                <div className="space-y-2 mb-6 relative z-10">
                   <div className="flex items-center gap-2 text-[11px] text-indigo-200">
                      <div className="w-1 h-1 rounded-full bg-white" />
                      <span>Fetal development check: Heart Rate optimal</span>
                   </div>
                   <div className="flex items-center gap-2 text-[11px] text-indigo-200">
                      <div className="w-1 h-1 rounded-full bg-white" />
                      <span>Increase vitamin D by 10% this week</span>
                   </div>
                </div>
                
                <div className="flex gap-2 relative z-10">
                  <button 
                    onClick={() => navigate('/predict')}
                    className="flex-1 py-3 bg-white text-[#6366f1] rounded-2xl text-xs font-bold hover:bg-indigo-50 transition-all shadow-md active:scale-95"
                  >
                    Predict
                  </button>
                  <button 
                    onClick={() => navigate('/predict')}
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center border border-white/20 transition-colors active:scale-90"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
             </GlassCard>
          </section>

          {/* SECTION 7 - UPCOMING APPOINTMENT */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Upcoming</h3>
             <GlassCard className="p-6 bg-white border-none shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100">
                      <span className="text-lg font-bold text-[#6366f1]">24</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">May</span>
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-gray-800">Dr. Sarah Khan</h4>
                      <p className="text-[10px] font-medium text-gray-400">10:30 AM • OB-GYN</p>
                   </div>
                </div>
                <ChevronRight className="text-gray-200" size={20} />
             </GlassCard>
          </section>

        </div>
      </div>
    </div>
  );
}

const Plus = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ChevronRight = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
