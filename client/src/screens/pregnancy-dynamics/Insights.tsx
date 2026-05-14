import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/Common';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, Brain, Sparkles, Moon, Activity, Flame, Heart, 
  ArrowRight, ShieldAlert, Zap, Baby, Droplets, Info, Star,
  HeartPulse, Scale, Timer, ChevronDown, BatteryCharging
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function PregnancyInsights() {
  const { profile, stats, vitals: appContextVitals } = useApp();
  const [timeframe, setTimeframe] = useState<"Weekly" | "Monthly" | "90-Day">("Weekly");

  if (!profile || !profile.isPregnant) return null;

  const accent = '#FF8BA7';
  const bgTheme = 'bg-[#FFF5F7]';
  const textDark = '#2E2528';

  // Mock path data for graphs based on timeframe
  const rhrPaths = useMemo(() => ({
    area: timeframe === "Weekly" 
      ? "M 0 80 Q 50 60 100 70 T 200 40 T 300 65 T 400 50 L 400 100 L 0 100 Z" 
      : timeframe === "Monthly" 
        ? "M 0 70 Q 100 90 200 60 T 300 40 T 400 80 L 400 100 L 0 100 Z"
        : "M 0 50 Q 50 80 150 40 T 300 70 T 400 30 L 400 100 L 0 100 Z",
    line: timeframe === "Weekly" 
      ? "M 0 80 Q 50 60 100 70 T 200 40 T 300 65 T 400 50" 
      : timeframe === "Monthly" 
        ? "M 0 70 Q 100 90 200 60 T 300 40 T 400 80"
        : "M 0 50 Q 50 80 150 40 T 300 70 T 400 30"
  }), [timeframe]);

  const babyDevelopment = [
    { week: 16, milestone: 'Hearing', desc: 'Baby can hear your voice and may start responding to sounds.', icon: Star },
    { week: 18, milestone: 'Movement', desc: 'Baby is very active now. You might feel "quickening" or small flutters.', icon: Activity },
    { week: 20, milestone: 'Growth', desc: 'Baby is about the size of a banana and has developing eyebrows.', icon: Baby },
  ];

  const guidanceFeed = [
    { title: 'Drink more water today', type: 'Health', time: '2h ago' },
    { title: 'Your baby can hear your voice now', type: 'Bonding', time: '5h ago' },
    { title: 'Good week for light yoga', type: 'Wellness', time: '1d ago' },
  ];

  const recommendations = [
    { title: 'Sleep Architecture Shift', desc: 'Your deep sleep cycles are shorter this week. Progesterone rises may be affecting your REM latency. Prioritize a cooler room temp.', type: 'Bio-Sync', color: '#8B5CF6' },
    { title: 'BMR Optimization', desc: 'Your basal metabolic rate has increased by 150kcal/day this trimester. Focus on complex carbohydrates for sustained energy.', type: 'Nutrition', color: '#FF8BA7' },
    { title: 'Pelvic Stability', desc: 'As center of gravity shifts, emphasize core engagement during walks to prevent lower back strain.', type: 'Movement', color: '#10B981' }
  ];

  const currentWeek = 18;

  return (
    <div className={cn("flex flex-col gap-10 pt-10 px-6 md:px-10 pb-32 overflow-y-auto no-scrollbar h-full max-w-[1400px] mx-auto", bgTheme)}>
      
      {/* HEADER WITH TIMEFRAME SWITCHER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-8 bg-[#FF8BA7] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#FF8BA7]/30">
                <Brain size={16} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FF8BA7]">Intelligence Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter" style={{ color: textDark }}>
            Maternal <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8BA7] to-[#8B5CF6]">Insights</span>
          </h1>
        </div>

        <div className="flex items-center gap-1 p-1 bg-white border border-rose-50 shadow-sm rounded-2xl w-fit backdrop-blur-sm">
           {(['Weekly', 'Monthly', '90-Day'] as const).map((t) => (
              <button
                 key={t}
                 onClick={() => setTimeframe(t)}
                 className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                    timeframe === t ? "bg-[#2E2528] text-white shadow-md" : "text-gray-400 hover:bg-rose-50/30"
                 )}
              >
                 {t}
              </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* BIG HERO SCORE CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-1 shadow-[0_32px_64px_-16px_rgba(255,139,167,0.1)] border border-white overflow-hidden"
          >
             <div className="bg-gradient-to-br from-[#FFFBFB] via-white to-white rounded-[2.8rem] p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                   <svg width="100%" height="100%"><defs><pattern id="pregGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#pregGrid)" /></svg>
                </div>

                <div className="relative z-10 flex-1 space-y-6 text-center md:text-left">
                   <div className="space-y-2">
                      <span className="px-3 py-1 bg-rose-50 text-[#FF8BA7] text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-100">Bio-Sync Status</span>
                      <h2 className="text-3xl font-black text-[#2E2528]">Maternal Readiness</h2>
                      <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base max-w-md">
                         Your systemic markers indicate high cardiovascular efficiency and stable glucose levels for Trimester 2.
                      </p>
                   </div>
                   
                   <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-rose-50">
                         <Zap size={16} className="text-rose-500" />
                         <span className="text-xs font-black text-[#2E2528]">Energy: High</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-rose-50">
                         <Scale size={16} className="text-emerald-500" />
                         <span className="text-xs font-black text-[#2E2528]">Weight: Stable</span>
                      </div>
                   </div>
                </div>

                <div className="relative w-56 h-56 flex items-center justify-center shrink-0 z-10">
                   <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#FFF5F7" strokeWidth="6" />
                      <motion.circle 
                         cx="50" cy="50" r="45" fill="none" stroke="url(#grad_preg_ready)" strokeWidth="8" strokeLinecap="round"
                         initial={{ strokeDasharray: "0, 283" }}
                         animate={{ strokeDasharray: "235, 283" }}
                         transition={{ duration: 2, ease: "easeOut" }}
                      />
                      <defs>
                         <linearGradient id="grad_preg_ready" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FF8BA7" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                         </linearGradient>
                      </defs>
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-[#2E2528] tracking-tighter">84</span>
                      <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Wellness Score</span>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* SECTION 1 - BABY DEVELOPMENT TIMELINE */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Baby Development Timeline</h3>
            <GlassCard className="p-8 bg-white border-none shadow-sm !rounded-[3rem] space-y-10">
              <div className="flex flex-col md:flex-row items-center gap-10">
                 <div className="w-48 h-48 rounded-full bg-[#FFF5F2] flex items-center justify-center border-8 border-white shadow-xl shrink-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1520121401995-928cd50d4e27?auto=format&fit=crop&q=80&w=400" alt="Baby growth" className="w-full h-full object-cover scale-125" />
                 </div>
                 <div className="space-y-4 text-center md:text-left">
                    <h4 className="text-3xl font-display font-bold text-[#2E2528]">Development This Week</h4>
                    <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
                      "Your baby is the size of a <span className="font-bold text-[#FF8BA7]">Sweet Potato</span>. They can now hear your heartbeat and your voice, which is very comforting to them."
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                       <span className="px-4 py-2 bg-rose-50 text-[#FF8BA7] rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100">Length: 14.2 cm</span>
                       <span className="px-4 py-2 bg-rose-50 text-[#FF8BA7] rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100">Weight: 190 gm</span>
                    </div>
                 </div>
              </div>

              <div className="relative pt-10">
                 <div className="absolute top-10 left-0 right-0 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF8BA7] rounded-full" style={{ width: '45%' }} />
                 </div>
                 <div className="relative flex justify-between">
                    {[12, 16, 18, 20, 24].map((w, i) => (
                      <div key={i} className="flex flex-col items-center gap-3">
                         <div className={cn(
                           "w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all",
                           w === currentWeek ? "bg-[#FF8BA7] scale-150" : "bg-gray-200"
                         )} />
                         <span className={cn(
                           "text-[10px] font-black uppercase tracking-widest",
                           w === currentWeek ? "text-[#FF8BA7]" : "text-gray-300"
                         )}>{w}w</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {babyDevelopment.map((dev, i) => (
                  <div key={i} className={cn(
                    "p-5 rounded-[2rem] border transition-all",
                    dev.week === currentWeek ? "bg-rose-50/30 border-rose-100" : "bg-gray-50 border-gray-100"
                  )}>
                    <dev.icon size={20} className={dev.week === currentWeek ? "text-[#FF8BA7]" : "text-gray-400"} />
                    <h5 className="font-bold text-gray-800 mt-3">{dev.milestone}</h5>
                    <p className="text-[10px] font-medium text-gray-500 mt-1 leading-relaxed">{dev.desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>

          {/* SECTION 2 - BIOMETRIC CORRELATIONS */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Biometric Health Correlates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white border border-rose-50 p-8 rounded-[3rem] shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h4 className="font-black text-[#2E2528] text-lg">Heart Rate Stability</h4>
                        <p className="text-xs text-gray-400 font-bold">{timeframe} Trend</p>
                     </div>
                     <div className="text-right">
                        <span className="text-2xl font-black text-[#FF8BA7]">74</span>
                        <span className="text-[10px] font-bold text-gray-400 ml-1">avg bpm</span>
                     </div>
                  </div>
                   <div className="h-24 w-full relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                         <defs>
                            <linearGradient id="pregRhrGradient" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="0%" stopColor="#FF8BA7" stopOpacity="0.4" />
                               <stop offset="100%" stopColor="#FF8BA7" stopOpacity="0" />
                            </linearGradient>
                         </defs>
                         <motion.path 
                            d={rhrPaths.area}
                            fill="url(#pregRhrGradient)"
                            animate={{ d: rhrPaths.area }}
                            transition={{ duration: 0.3 }}
                         />
                         <motion.path 
                            d={rhrPaths.line}
                            fill="none" stroke="#FF8BA7" strokeWidth="3" strokeLinecap="round"
                            animate={{ d: rhrPaths.line }}
                            transition={{ duration: 0.3 }}
                         />
                      </svg>
                   </div>
                  <p className="text-[10px] text-gray-400 mt-4 font-bold leading-relaxed">
                     Your RHR has increased by 8 bpm since Trimester 1, which is optimal as blood volume expands to support fetal growth.
                  </p>
               </div>

               <div className="bg-white border border-rose-50 p-8 rounded-[3rem] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                        <Moon size={22} />
                     </div>
                     <div>
                        <h4 className="font-black text-[#2E2528]">Sleep Architecture</h4>
                        <p className="text-xs text-gray-400 font-medium">Deep vs REM Correlation</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-indigo-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-[#2E2528]">Deep Sleep</span>
                        </div>
                        <span className="text-xs font-black text-[#2E2528]">1h 12m</span>
                     </div>
                     <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden flex">
                        <div className="h-full bg-indigo-500 w-[20%]" />
                        <div className="h-full bg-sky-400 w-[30%]" />
                        <div className="h-full bg-gray-100 w-[50%]" />
                     </div>
                     <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                        Physical changes are increasing sleep latency. Focus on lateral sleeping with support to improve deep recovery cycles.
                     </p>
                  </div>
               </div>
            </div>
          </section>

          {/* SECTION 3 - METABOLIC STABILITY */}
          <section className="space-y-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Metabolic Intelligence</h3>
             <div className="bg-gradient-to-br from-white to-rose-50/20 border border-rose-50 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                   <Scale size={140} />
                </div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                   <div className="md:col-span-2 space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                            <Zap size={24} />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-[#2E2528]">Metabolic Stability</h3>
                            <p className="text-sm font-bold text-gray-400">Glucose & Weight Tracking</p>
                         </div>
                      </div>
                      <p className="text-base text-gray-600 leading-relaxed font-medium">
                         Your basal metabolic rate has increased by **180 kcal/day** to support tissue expansion. Glucose levels remain stable (92 mg/dL fasting), indicating healthy insulin sensitivity.
                      </p>
                      <div className="flex gap-8">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fasting Glucose</p>
                            <p className="text-xl font-black text-emerald-500">STABLE</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weight Change</p>
                            <p className="text-xl font-black text-[#2E2528]">+0.4 kg / week</p>
                         </div>
                      </div>
                   </div>
                   <div className="bg-white rounded-[2rem] p-6 border border-rose-50 shadow-sm space-y-6">
                      <h4 className="font-black text-[#2E2528] text-sm uppercase tracking-widest">Weight Trend</h4>
                      <div className="space-y-4">
                         <div className="flex justify-between items-end">
                            <span className="text-3xl font-black text-[#2E2528]">56.8</span>
                            <span className="text-xs font-bold text-rose-500 mb-1">Optimal</span>
                         </div>
                         <div className="h-16 w-full flex items-end gap-1.5">
                            {[40, 42, 45, 44, 46, 48, 50].map((h, i) => (
                               <div key={i} className="flex-1 h-full bg-rose-50/40 rounded-full overflow-hidden relative">
                                  <motion.div 
                                     initial={{ height: "10%" }} animate={{ height: `${h}%` }} transition={{ delay: i*0.05, duration: 0.5 }}
                                     className="w-full bg-[#FF8BA7] rounded-full absolute bottom-0 left-0" 
                                  />
                               </div>
                            ))}
                         </div>
                         <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-tighter">Healthy Projection</p>
                      </div>
                   </div>
                </div>
             </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* AI PROTOCOLS MODULE */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Intelligence Protocols</h3>
            <div className="bg-[#2E2528] rounded-[3rem] p-8 shadow-xl text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8BA7]/10 rounded-full blur-2xl" />
               
               <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-[#FF8BA7] border border-white/10">
                     <Sparkles size={20} />
                  </div>
                  <div>
                     <h3 className="font-bold text-lg leading-tight">AI Protocols</h3>
                     <p className="text-xs text-white/40 font-medium">Synced with Trimester 2</p>
                  </div>
               </div>

               <div className="space-y-4 relative z-10">
                  {recommendations.map((rec, i) => (
                     <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.2 + (i*0.1) }}
                        className="bg-white/5 border border-white/5 rounded-[2rem] p-5 space-y-2 group cursor-pointer hover:bg-white/10 transition-colors"
                     >
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[#FF8BA7]/20 text-[#FF8BA7]">{rec.type}</span>
                           <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-white/40" />
                        </div>
                        <h4 className="text-sm font-bold leading-snug">{rec.title}</h4>
                        <p className="text-xs text-white/40 leading-relaxed font-medium">{rec.desc}</p>
                     </motion.div>
                  ))}
               </div>
               
               <button className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white hover:text-[#2E2528] transition-all flex items-center justify-center gap-2">
                  <BatteryCharging size={16} /> Load Daily Protocol
               </button>
            </div>
          </section>

          {/* DAILY GUIDANCE FEED */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Daily Guidance Feed</h3>
            <GlassCard className="p-8 bg-white border-none shadow-sm !rounded-[3rem] space-y-6">
               <div className="space-y-4">
                 {guidanceFeed.map((item, i) => (
                   <div key={i} className="flex gap-4 p-4 rounded-[2rem] bg-gray-50 border border-gray-100 hover:bg-rose-50/20 hover:border-rose-100 transition-all cursor-pointer group">
                      <div className="w-2 h-2 rounded-full bg-[#FF8BA7] mt-1.5 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-800 leading-snug group-hover:text-[#FF8BA7] transition-colors">{item.title}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">{item.type}</span>
                           <span className="text-[9px] font-medium text-gray-300">• {item.time}</span>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
               <button className="w-full py-4 bg-gray-50 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all">
                 View History
               </button>
            </GlassCard>
          </section>

          {/* SYSTEMIC TRENDS (SPARKCARDS) */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Systemic Stability</h3>
             <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Glucose', val: '92', sub: 'mg/dL', color: '#FF8BA7' },
                  { label: 'SpO2', val: '98', sub: '%', color: '#8B5CF6' },
                ].map((s, i) => (
                   <GlassCard key={i} className="p-6 bg-white border-none shadow-sm !rounded-[2.5rem] flex flex-col items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">{s.label}</span>
                      <div className="flex items-baseline gap-1">
                         <span className="text-2xl font-black text-[#2E2528]">{s.val}</span>
                         <span className="text-[10px] font-bold text-gray-300">{s.sub}</span>
                      </div>
                      <div className="w-12 h-1 bg-gray-50 rounded-full mt-3 overflow-hidden">
                         <div className="h-full bg-current" style={{ width: '80%', color: s.color }} />
                      </div>
                   </GlassCard>
                ))}
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}
