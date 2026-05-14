import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import * as aiService from '../../services/geminiService';
import { 
  Search, Bell, Zap, Dumbbell, Activity, ShieldPlus, Brain,
  ChevronRight, Utensils, Droplets, Moon, Edit3, Camera, FileText,
  Clock, Calendar, Target, Plus, X, ArrowRight, Heart, Sparkles, Smile, Flame, Waves,
  Thermometer, Stethoscope, Coffee, Pill, Check, Battery, Footprints, Scale, HeartPulse
} from 'lucide-react';
import { cn } from '../../lib/utils';
import QuickActionModal from '../../components/QuickActionModal';
import CycleRingDetailed from '../../components/CycleRingDetailed';
import DiseasePredictionAndRecovery from '../../components/DiseasePredictionAndRecovery';

export default function FemaleHome() {
  const { profile, stats, meds, setMeds } = useApp();
  const navigate = useNavigate();
  const [summary, setSummary] = useState('');
  const [showReminders, setShowReminders] = useState(false);
  const [showDietSuggestion, setShowDietSuggestion] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [showLogCycle, setShowLogCycle] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const reminderRef = useRef<HTMLDivElement>(null);

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
        setSummary("Endocrine patterns optimized. Focus on restorative mobility.");
      }
    }
    loadAI();
  }, [profile, stats]);

  const firstName = useMemo(() => profile?.name?.split(' ')[0] || 'Aria', [profile]);
  const cycleDay = stats?.cycleDay || 14;
  const cyclePhase = stats?.cyclePhase || 'Ovulation Phase';

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#FFF5F7] font-sans text-[#2D1B2D] flex justify-center p-2 md:p-6 overflow-x-hidden relative">
      
      {/* Simplified Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-[#FB7185]/5 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-[#EC4899]/5 blur-[80px] rounded-full" />
      </div>

      <div className="w-full max-w-[1280px] relative z-10 px-2 lg:px-4 xl:px-8">
        
        {/* HEADER */}
        <header className="flex justify-between items-center py-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black text-[#1F111F] tracking-tighter">
              Good Morning, <span className="text-[#FB7185]">{firstName}</span>! ✨
            </h1>
            <p className="text-[#8E7E8E] text-[9px] font-black tracking-[0.2em] uppercase opacity-60">Hormonal intelligence OS</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-full max-w-[280px] hidden lg:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D1BBD1]" size={14} />
              <input type="text" placeholder="Quick search..." className="w-full pl-10 pr-6 py-2.5 bg-white/80 rounded-full border border-[#FDEFF2] text-xs outline-none focus:bg-white transition-all" />
            </div>
            <div className="relative" ref={reminderRef}>
              <button 
                onClick={() => setShowReminders(!showReminders)}
                className="relative bg-white p-3 rounded-full shadow-sm border border-[#FDEFF2] hover:scale-105 transition-transform"
              >
                <Bell size={18} className="text-[#7A6B80]" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FB7185] rounded-full flex items-center justify-center text-[8px] text-white font-black">3</div>
              </button>
              
              <AnimatePresence>
                {showReminders && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-xl border border-[#FDEFF2] z-50 overflow-hidden"
                  >
                     <div className="p-4 border-b border-[#FDEFF2] bg-[#FFFBFB]">
                        <h3 className="font-black text-[10px] text-[#1F111F] uppercase tracking-wider">Alerts</h3>
                     </div>
                     <div className="max-h-60 overflow-y-auto p-2">
                        {[
                          { t: 'Magnesium', s: '400mg due', c: 'bg-[#FB7185]' },
                          { t: 'Checkup', s: 'In 3 days', c: 'bg-[#EC4899]' },
                        ].map((r, i) => (
                          <div key={i} className="p-3 hover:bg-[#FFF5F7] rounded-xl flex gap-3 transition-colors mb-1 last:mb-0">
                             <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", r.c)} />
                             <div>
                                <p className="text-[11px] font-black text-[#1F111F]">{r.t}</p>
                                <p className="text-[9px] text-[#8E7E8E] font-bold">{r.s}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer hover:opacity-80 transition-opacity" alt="Profile" onClick={() => navigate('/profile')} />
          </div>
        </header>

         {/* MAIN LAYOUT FLEX (Tight Gap) */}
        <div className="flex flex-col lg:flex-row gap-6 pb-12 items-start">
          
          <div className="flex-1 w-full lg:max-w-[760px] xl:max-w-[900px] flex flex-col gap-6">
            {/* QUICK ACTIONS STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {[
                 { label: 'Log Cycle', icon: Calendar, color: 'bg-[#FFF1F2] text-[#FB7185]', path: '/health' },
                 { label: 'Support / Mood', icon: Smile, color: 'bg-[#FDF2F8] text-[#DB2777]', path: '/mental-wellness' },
                 { label: 'Workout', icon: Dumbbell, color: 'bg-[#F0FDF4] text-[#16A34A]', path: '/workouts' },
                 { label: 'Nutrition', icon: Utensils, color: 'bg-[#FFFBEB] text-[#D97706]', path: '/nutrition' }
               ].map((action) => (
                 <button 
                   key={action.label} 
                   onClick={() => action.label === 'Log Cycle' ? setShowLogCycle(true) : navigate(action.path)} 
                   className="bg-white hover:bg-[#FFFDFD] border border-[#FDEFF2] rounded-[20px] p-3.5 shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-2.5 group"
                 >
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0", action.color)}>
                       <action.icon size={16} />
                    </div>
                    <span className="text-[11px] font-black text-[#1F111F] uppercase tracking-wider">{action.label}</span>
                 </button>
               ))}
            </div>

            {/* MEDICATION & SUPPLEMENTS HUB */}
            <div className="space-y-4">
               <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2.5">
                     <div className="w-1 h-5 bg-[#10B981] rounded-full" />
                     <h2 className="text-base font-display font-black tracking-tight text-[#1F111F] uppercase italic">Medication & Supplements</h2>
                  </div>
                  <button className="text-[9px] font-black text-[#10B981] uppercase tracking-widest hover:underline">Manage Rx</button>
               </div>
               <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 snap-x snap-mandatory">
                  {(meds?.length > 0 ? meds : []).map((m, i) => {
                    const isTaken = m.status?.toLowerCase() === 'taken';
                    return (
                      <div key={m.id || i} className={cn(
                        "flex-shrink-0 w-52 rounded-[24px] p-4 border shadow-sm transition-all snap-center",
                        isTaken ? "bg-[#F0FDF4] border-[#DCFCE7]" : "bg-white border-[#FDEFF2]"
                      )}>
                         <div className="flex justify-between items-start mb-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                               <Pill size={14} className={isTaken ? 'text-[#10B981]' : 'text-gray-400'} />
                            </div>
                            <button 
                              onClick={() => {
                                if (setMeds && meds) {
                                  const next = [...meds];
                                  next[i] = { ...next[i], status: isTaken ? 'Pending' : 'Taken' };
                                  setMeds(next);
                                }
                              }}
                              className={cn("px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95", isTaken ? "bg-white text-[#10B981] border border-emerald-100" : "bg-[#1F111F] text-white")}
                            >
                               {isTaken ? 'TAKEN' : 'LOG NOW'}
                            </button>
                         </div>
                         <div>
                            <h4 className={cn("text-[11px] font-black truncate", isTaken ? "text-[#10B981]" : "text-[#1F111F]")}>{m.name}</h4>
                            <p className="text-[9px] font-bold text-gray-400 mt-0.5">{m.dosage || ''} • {m.time || ''}</p>
                         </div>
                      </div>
                    );
                  })}
                  {(!meds || meds.length === 0) && (
                    <div className="w-full text-center py-5 text-xs text-gray-400 font-medium border border-dashed border-[#FDEFF2] rounded-2xl">
                       No active medications scheduled. Tap Manage Rx to add.
                    </div>
                  )}
               </div>
            </div>

            {/* OVERVIEW CARD (Compact) */}
            <div className="bg-white rounded-[24px] p-4 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#FDEFF2] flex flex-col">
               <div className="mb-2">
                 <h2 className="text-lg font-black text-[#1F111F] tracking-tighter">Women's Dynamics Overview</h2>
                 <p className="text-[#8E7E8E] text-[10px] font-bold tracking-wide mt-1">Hormonal intelligence optimization.</p>
               </div>

                <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr_160px] gap-6 items-start">
                   <div className="space-y-4 bg-[#FFFBFB]/50 p-5 rounded-[24px] border border-rose-50/50 backdrop-blur-sm">
                     <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8E7E8E] mb-2">Vitals</h3>
                     {[
                       { label: 'Energy', val: Math.min(100, Math.round((stats?.recoveryScore || 85) * 0.9)), color: '#FB7185', icon: Zap },
                       { label: 'Hormones', val: Math.min(100, Math.round((stats?.recoveryScore || 85) * 0.95)), color: '#A855F7', icon: Activity },
                       { label: 'Recovery', val: stats?.recoveryScore || 88, color: '#EC4899', icon: Heart },
                       { label: 'Mood', val: Math.min(100, Math.round((stats?.recoveryScore || 85) * 1.02)), color: '#8B5CF6', icon: Brain },
                     ].map(m => (
                       <div key={m.label} className="space-y-2.5">
                         <div className="flex justify-between items-center">
                           <span className="text-[11px] font-black text-[#4D3D4D] uppercase tracking-wider">{m.label}</span>
                           <span className="text-[12px] font-black text-[#1F111F]">{m.val}%</span>
                         </div>
                         <div className="w-full h-2 bg-rose-50 rounded-full overflow-hidden">
                           <div className="h-full rounded-full transition-all duration-700" style={{ width: `${m.val}%`, backgroundColor: m.color }} />
                         </div>
                       </div>
                     ))}
                   </div>

                   <div className="flex justify-center items-center w-full">
                      <div className="w-full max-w-[380px] -mt-14 aspect-square drop-shadow-[0_20px_60px_rgba(251,113,133,0.18)]">
                         <CycleRingDetailed currentDay={cycleDay} phase={cyclePhase} />
                      </div>
                   </div>

                  <div className="space-y-5">
                     <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-6 border border-[#FDEFF2] shadow-sm">
                       <h3 className="text-[9px] font-black uppercase tracking-widest text-[#FB7185] mb-2">Current Status</h3>
                       <span className="text-lg font-black text-[#1F111F] tracking-tight">Peak Energy</span>
                       <p className="text-[10px] text-[#4D3D4D] mt-3 font-semibold italic opacity-70 leading-relaxed">
                         "Estrogen rising. Cellular energy optimized."
                       </p>
                     </div>
                     <div className="px-4">
                       <h4 className="text-[9px] font-black uppercase tracking-widest text-[#8E7E8E] mb-3">24h Trend</h4>
                       <div className="w-full h-8 flex items-end gap-1.5">
                          {[40, 60, 45, 85, 55, 75, 95].map((h, i) => (
                             <div key={i} className="flex-1 bg-[#FB7185]/20 hover:bg-[#FB7185] rounded-full transition-all cursor-help" style={{ height: `${h}%` }} />
                          ))}
                       </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* AI DISEASE PREDICTION & RECOVERY GRAPH */}
            <DiseasePredictionAndRecovery />

            {/* SECONDARY ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#FDEFF2] group cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 rounded-xl text-rose-500"><Activity size={18} /></div>
                    <h3 className="text-base font-black text-[#1F111F]">Ovulation Tracking</h3>
                  </div>
                  <ChevronRight size={16} className="text-[#D1BBD1] group-hover:text-[#FB7185] transition-colors" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#FFFBFB] p-4 rounded-2xl border border-[#FDEFF2]">
                    <div>
                      <span className="text-[10px] text-[#8E7E8E] font-black uppercase tracking-widest block mb-1">Status</span>
                      <span className="text-sm font-black text-[#1F111F]">High Fertility Window</span>
                    </div>
                    <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-[9px] font-black uppercase">In 2 Days</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <div key={d} className={cn("flex-1 h-1.5 rounded-full", d <= 3 ? "bg-[#FB7185]" : "bg-[#FDEFF2]")} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#FDEFF2] group cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-xl text-purple-500"><Smile size={18} /></div>
                    <h3 className="text-base font-black text-[#1F111F]">Emotional Care</h3>
                  </div>
                  <ChevronRight size={16} className="text-[#D1BBD1] group-hover:text-[#FB7185] transition-colors" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#FFFBFB] p-4 rounded-2xl border border-[#FDEFF2]">
                    <div>
                      <span className="text-[10px] text-[#8E7E8E] font-black uppercase tracking-widest block mb-1">Stability</span>
                      <span className="text-sm font-black text-[#1F111F]">Resilient & Focused</span>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-[9px] font-black uppercase">88%</span>
                  </div>
                  <p className="text-[10px] text-[#8E7E8E] font-bold leading-relaxed px-1">
                    Estrogen levels are supporting verbal dexterity and social connection.
                  </p>
                </div>
              </div>
            </div>

            {/* Upcoming (Moved Down) */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#FDEFF2]">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-[#FB7185] rounded-full" />
                  <h3 className="text-lg font-display font-black tracking-tight text-[#1F111F] uppercase italic">Upcoming Highlights</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-[#FFFBFB] rounded-[24px] border border-[#FDEFF2] hover:bg-rose-50/30 transition-colors group">
                     <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#EC4899] shadow-sm group-hover:scale-110 transition-transform"><Stethoscope size={22} /></div>
                     <div>
                        <h4 className="font-black text-[#1F111F] text-xs uppercase tracking-tight">Annual Exam</h4>
                        <p className="text-[11px] text-[#8E7E8E] font-bold">Scheduled in 3 days • Health Center</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-[#FFFBFB] rounded-[24px] border border-[#FDEFF2] hover:bg-rose-50/30 transition-colors group">
                     <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#FB7185] shadow-sm group-hover:scale-110 transition-transform"><Sparkles size={22} /></div>
                     <div>
                        <h4 className="font-black text-[#1F111F] text-xs uppercase tracking-tight">Phase Shift</h4>
                        <p className="text-[11px] text-[#8E7E8E] font-bold">Predicted in 5 days • Follicular</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* DAILY SELF-CARE INSIGHT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-2 bg-gradient-to-br from-[#FB7185] to-[#EC4899] rounded-[32px] p-8 text-white relative overflow-hidden group shadow-lg">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                     <Sparkles size={120} />
                  </div>
                  <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl"><Zap size={20} /></div>
                        <h3 className="text-lg font-black tracking-tight">Phase Insight: Follicular</h3>
                     </div>
                     <p className="text-sm font-bold text-white/90 leading-relaxed max-w-lg mb-8">
                        "Your metabolism is shifting. Focus on complex carbohydrates and high-intensity movement before 4 PM to align with your rising cortisol and estrogen levels."
                     </p>
                     <div className="flex gap-4">
                        <button onClick={() => setShowDietSuggestion(true)} className="px-5 py-2.5 bg-white text-[#FB7185] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-colors">Adjust Diet</button>
                        <button onClick={() => navigate('/nutrition')} className="px-5 py-2.5 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-colors">See Routine</button>
                     </div>
                  </div>
               </div>
               <div className="bg-[#1F111F] rounded-[32px] p-8 text-white flex flex-col justify-between shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-[#FB7185] rounded-xl"><Moon size={20} /></div>
                     <h3 className="text-base font-black">Rest Sync</h3>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-white/60 leading-relaxed">
                        Tonight's recommendation:
                     </p>
                     <p className="text-lg font-black tracking-tight">Deep Sleep Ritual</p>
                     <p className="text-[10px] text-[#FB7185] font-black uppercase tracking-[0.2em] mt-2">Target: 8.5 Hours</p>
                  </div>
                  <div className="mt-6">
                     <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FB7185] w-3/4" />
                     </div>
                  </div>
               </div>
            </div>

            {/* ACTIVITY & BIOMETRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#FDEFF2] flex flex-col justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform"><Footprints size={18} /></div>
                     <h3 className="text-base font-black text-[#1F111F]">Daily Movement</h3>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <div>
                           <span className="text-3xl font-black text-[#1F111F]">8,432</span>
                           <span className="text-xs font-bold text-[#8E7E8E] ml-2">/ 10k steps</span>
                        </div>
                        <div className="text-[10px] font-black text-[#10B981]">+12%</div>
                     </div>
                     <div className="w-full h-2 bg-[#F0FDFA] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" />
                     </div>
                  </div>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#FDEFF2] flex flex-col justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-sky-50 rounded-xl text-sky-500 group-hover:scale-110 transition-transform"><Droplets size={18} /></div>
                     <h3 className="text-base font-black text-[#1F111F]">Hydration</h3>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <div>
                           <span className="text-3xl font-black text-[#1F111F]">2.4</span>
                           <span className="text-xs font-bold text-[#8E7E8E] ml-2">/ 3.0 L</span>
                        </div>
                        <div className="text-[10px] font-black text-[#0EA5E9]">78%</div>
                     </div>
                     <div className="w-full h-2 bg-[#F0F9FF] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" />
                     </div>
                  </div>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#FDEFF2] flex items-center gap-6 group hover:shadow-md transition-all">
                  <div className="relative w-24 h-24 shrink-0">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="42" fill="none" stroke="#FFF1F2" strokeWidth="10" />
                       <circle cx="50" cy="50" r="42" fill="none" stroke="#FB7185" strokeWidth="10" strokeDasharray="264" strokeDashoffset={264 - (264 * 88) / 100} strokeLinecap="round" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-[#1F111F]">88%</div>
                  </div>
                  <div>
                     <h4 className="font-black text-[#1F111F] text-sm uppercase">Recovery</h4>
                     <p className="text-[10px] text-[#8E7E8E] mt-2 font-bold leading-relaxed">Endocrine rhythms synchronized.</p>
                  </div>
               </div>
            </div>

            {/* AI FOOTER (Simplified) */}
            <div className="bg-[#1F111F] rounded-[40px] p-8 shadow-xl relative overflow-hidden group">
               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                  <div className="space-y-3">
                     <div className="flex items-center gap-3">
                        <Brain size={20} className="text-[#FB7185]" />
                        <h3 className="text-lg font-black text-white tracking-tight">Intelligence Summary</h3>
                     </div>
                     <p className="text-xs font-bold text-white/70 leading-relaxed italic max-w-xl">
                        "{summary || "Endocrine pattern optimized. Prioritize restorative hydration and mobility."}"
                     </p>
                  </div>
                  <button onClick={() => setShowForecast(true)} className="px-8 py-4 bg-[#FB7185] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-black/10">
                     Full Forecast
                  </button>
               </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="w-full lg:w-[260px] xl:w-[320px] flex flex-col gap-8">
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#FDEFF2]">
               <h3 className="font-black text-[#1F111F] text-[13px] uppercase tracking-tighter mb-6">Focus</h3>
               <div className="space-y-3">
                  {[
                    { title: 'Hydration', val: '2.4 / 3 L', icon: Droplets, color: 'text-sky-500' },
                    { label: 'Follicular', val: 'Yoga', icon: Dumbbell, color: 'text-rose-500' },
                    { title: 'Sleep', val: '7.5 / 8 hrs', icon: Moon, color: 'text-indigo-500' },
                    { title: 'Nutrition', val: 'High Protein', icon: Utensils, color: 'text-orange-500' },
                  ].map(f => (
                    <div key={f.title || f.label} className="flex items-center gap-3 p-2 hover:bg-[#FFFBFB] rounded-2xl transition-colors">
                       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[#FDEFF2]", f.color)}><f.icon size={16} /></div>
                       <div>
                          <h4 className="font-black text-[#1F111F] text-[10px] uppercase">{f.title || f.label}</h4>
                          <p className="text-[10px] text-[#8E7E8E] font-bold">{f.val}</p>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
 
          </aside>
        </div>
      </div>

      {/* DIET SUGGESTION MODAL */}
      <AnimatePresence>
        {showDietSuggestion && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDietSuggestion(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[40px] p-8 shadow-2xl border border-[#FDEFF2] overflow-hidden">
               <div className="absolute top-0 right-0 p-6">
                 <button onClick={() => setShowDietSuggestion(false)} className="w-10 h-10 rounded-full bg-[#FFF5F7] flex items-center justify-center text-[#FB7185] hover:rotate-90 transition-transform">
                   <X size={20} />
                 </button>
               </div>
               
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF1F2] flex items-center justify-center text-[#FB7185] shadow-sm"><Utensils size={28} /></div>
                  <div>
                     <h3 className="text-xl font-black text-[#1F111F] tracking-tight">Phase Suggestion: {cyclePhase}</h3>
                     <p className="text-[#8E7E8E] text-[11px] font-bold uppercase tracking-widest">AI Nutrition Optimization</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-[#FFF8F9] rounded-3xl p-6 border border-[#FDEFF2]">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FB7185] mb-4">Recommended Foods</h4>
                     <div className="grid grid-cols-2 gap-4">
                        {[
                          { name: 'Complex Carbs', d: 'Sweet potatoes, Quinoa' },
                          { name: 'High Protein', d: 'Salmon, Lentils, Eggs' },
                          { name: 'Healthy Fats', d: 'Avocados, Walnuts' },
                          { name: 'Fermented', d: 'Kefir, Kimchi' }
                        ].map(f => (
                          <div key={f.name} className="space-y-1">
                             <p className="text-[11px] font-black text-[#1F111F]">{f.name}</p>
                             <p className="text-[9px] text-[#8E7E8E] font-bold">{f.d}</p>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                     <div className="flex items-center gap-3 mb-3">
                        <Zap size={16} className="text-emerald-500" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">The "Why"</h4>
                     </div>
                     <p className="text-[11px] font-bold text-[#1F111F]/70 leading-relaxed italic">
                        "During the {cyclePhase.includes('Follicular') ? 'Follicular' : 'current'} phase, your body is more efficient at burning carbohydrates for fuel as estrogen rises. Prioritizing slow-release carbs helps sustain high cognitive and physical energy levels."
                     </p>
                  </div>

                  <button onClick={() => { setShowDietSuggestion(false); navigate('/nutrition'); }} className="w-full py-5 bg-[#1F111F] text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-lg shadow-black/10">
                     Explore Full Nutrition Plan
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
       {/* INTELLIGENCE FORECAST MODAL */}
       <AnimatePresence>
         {showForecast && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForecast(false)} className="absolute inset-0 bg-[#1F111F]/80 backdrop-blur-xl" />
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl border border-[#FDEFF2] overflow-hidden">
                <div className="bg-[#1F111F] p-8 text-white relative">
                   <div className="absolute top-0 right-0 p-6">
                      <button onClick={() => setShowForecast(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                        <X size={20} />
                      </button>
                   </div>
                   <div className="flex items-center gap-4 mb-2">
                      <div className="p-3 bg-[#FB7185] rounded-2xl shadow-lg shadow-rose-500/20"><Brain size={32} /></div>
                      <div>
                         <h3 className="text-2xl font-black tracking-tight">Intelligence Forecast</h3>
                         <p className="text-[#FB7185] text-[10px] font-black uppercase tracking-[0.3em]">Precision Endocrine Analysis</p>
                      </div>
                   </div>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] no-scrollbar">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#FFF8F9] rounded-3xl p-6 border border-[#FDEFF2]">
                         <div className="flex items-center gap-3 mb-4">
                            <Activity size={18} className="text-[#FB7185]" />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#1F111F]">Current Status</h4>
                         </div>
                         <p className="text-sm font-bold text-[#4D3D4D] leading-relaxed">
                            {summary || "Your endocrine rhythms are currently synchronized with peak metabolic efficiency. Estrogen levels are rising, supporting cognitive clarity and physical endurance."}
                         </p>
                      </div>
                      <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100/50">
                         <div className="flex items-center gap-3 mb-4">
                            <Zap size={18} className="text-emerald-500" />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#1F111F]">Optimization Goal</h4>
                         </div>
                         <p className="text-sm font-bold text-[#4D3D4D] leading-relaxed italic">
                            "Focus on explosive movement and social connection. Your verbal dexterity is at a 28-day peak."
                         </p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8E7E8E] px-2">Actionable Forecast</h4>
                      {[
                        { label: 'Fitness', desc: 'High Intensity Interval Training (HIIT) recommended before 2 PM.', icon: Dumbbell, color: 'text-[#FB7185]', bg: 'bg-rose-50' },
                        { label: 'Nutrition', desc: 'Prioritize magnesium-rich complex carbs and lean proteins.', icon: Utensils, color: 'text-[#D97706]', bg: 'bg-amber-50' },
                        { label: 'Recovery', desc: 'Target 8.5 hours of sleep. Body temperature is slightly elevated.', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-3xl border border-[#FDEFF2] hover:bg-[#FFFBFB] transition-colors">
                           <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                              <item.icon size={20} />
                           </div>
                           <div>
                              <h5 className="text-[11px] font-black text-[#1F111F] uppercase">{item.label}</h5>
                              <p className="text-[10px] font-bold text-[#8E7E8E] mt-1">{item.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-8 bg-[#FFFBFB] border-t border-[#FDEFF2]">
                   <button onClick={() => setShowForecast(false)} className="w-full py-5 bg-[#1F111F] text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-lg shadow-black/10">
                      Close Intelligence Briefing
                   </button>
                </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
       {/* LOG CYCLE MODAL */}
       <AnimatePresence>
         {showLogCycle && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogCycle(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[40px] p-8 shadow-2xl border border-[#FDEFF2] overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                  <button onClick={() => setShowLogCycle(false)} className="w-10 h-10 rounded-full bg-[#FFF5F7] flex items-center justify-center text-[#FB7185] hover:rotate-90 transition-transform">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-14 h-14 rounded-2xl bg-[#FFF1F2] flex items-center justify-center text-[#FB7185] shadow-sm"><Calendar size={28} /></div>
                   <div>
                      <h3 className="text-xl font-black text-[#1F111F] tracking-tight">Log Cycle</h3>
                      <p className="text-[#8E7E8E] text-[11px] font-bold uppercase tracking-widest">Day {cycleDay} • {cyclePhase}</p>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="grid grid-cols-2 gap-4">
                      <button className="flex flex-col items-center gap-3 p-6 bg-[#FB7185] text-white rounded-3xl shadow-lg shadow-rose-200 hover:scale-[1.02] transition-transform">
                         <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Droplets size={20} /></div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-center">Period Started</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 p-6 bg-white border border-[#FDEFF2] text-[#1F111F] rounded-3xl hover:bg-[#FFFBFB] hover:scale-[1.02] transition-transform">
                         <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center"><Droplets size={20} className="text-gray-400" /></div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-center">Period Ended</span>
                      </button>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8E7E8E] px-2">Flow Intensity</h4>
                      <div className="flex gap-2">
                         {['Light', 'Medium', 'Heavy'].map(flow => (
                           <button 
                             key={flow} 
                             onClick={() => setSelectedFlow(selectedFlow === flow ? null : flow)}
                             className={cn(
                               "flex-1 py-3 border rounded-2xl text-[10px] font-black uppercase transition-all",
                               selectedFlow === flow 
                                 ? "bg-[#FB7185] text-white border-[#FB7185] shadow-md shadow-rose-100" 
                                 : "bg-[#FFFBFB] border-[#FDEFF2] text-[#4D3D4D] hover:bg-[#FFF5F7]"
                             )}
                           >
                             {flow}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8E7E8E] px-2">Symptoms</h4>
                      <div className="flex flex-wrap gap-2">
                         {['Cramps', 'Headache', 'Bloating', 'Mood Swings', 'Fatigue'].map(s => {
                           const isSelected = selectedSymptoms.includes(s);
                           return (
                             <button 
                               key={s} 
                               onClick={() => {
                                 if (isSelected) {
                                   setSelectedSymptoms(selectedSymptoms.filter(item => item !== s));
                                 } else {
                                   setSelectedSymptoms([...selectedSymptoms, s]);
                                 }
                               }}
                               className={cn(
                                 "px-4 py-2 border rounded-full text-[9px] font-black uppercase transition-all",
                                 isSelected 
                                   ? "bg-[#FB7185] text-white border-[#FB7185]" 
                                   : "bg-white border-[#FDEFF2] text-[#4D3D4D] hover:border-[#FB7185] hover:text-[#FB7185]"
                               )}
                             >
                               {s}
                             </button>
                           );
                         })}
                      </div>
                   </div>

                   <button onClick={() => setShowLogCycle(false)} className="w-full py-5 bg-[#1F111F] text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-lg shadow-black/10 mt-4">
                      Save Daily Log
                   </button>
                </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
     </div>
  );
}
