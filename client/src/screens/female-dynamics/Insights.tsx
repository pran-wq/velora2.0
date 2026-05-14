import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  Brain, Sparkles, TrendingUp, Moon, Zap, Target,
  ArrowRight, ShieldPlus, Activity, AlertTriangle, BatteryCharging,
  Dumbbell, Calendar, ChevronDown, Layers, Flame, HeartPulse, Heart,
  Scale, Droplets, Thermometer, Timer
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FemaleInsights() {
   const { profile, stats } = useApp();
   const [timeframe, setTimeframe] = useState<"Weekly" | "Monthly" | "90-Day">("Weekly");

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

   const hrvPaths = useMemo(() => ({
     area: timeframe === "Weekly" 
       ? "M 0 40 Q 80 20 150 50 T 300 30 T 400 60 L 400 100 L 0 100 Z" 
       : timeframe === "Monthly" 
         ? "M 0 60 Q 120 10 240 70 T 400 40 L 400 100 L 0 100 Z"
         : "M 0 20 Q 100 90 200 40 T 400 80 L 400 100 L 0 100 Z",
     line: timeframe === "Weekly" 
       ? "M 0 40 Q 80 20 150 50 T 300 30 T 400 60" 
       : timeframe === "Monthly" 
         ? "M 0 60 Q 120 10 240 70 T 400 40"
         : "M 0 20 Q 100 90 200 40 T 400 80"
   }), [timeframe]);

   const hormonalPaths = useMemo(() => ({
     estrogen: timeframe === "Weekly"
       ? "M 0 150 C 100 140, 200 180, 300 100 C 400 20, 500 50, 600 140 C 700 180, 800 160, 1000 150"
       : timeframe === "Monthly"
         ? "M 0 160 C 200 170, 400 40, 500 20 C 600 40, 800 170, 1000 160"
         : "M 0 150 Q 250 20 500 150 T 1000 150",
     temp: timeframe === "Weekly"
       ? "M 0 160 C 150 165, 300 155, 450 160 C 600 165, 750 120, 900 110 C 950 105, 1000 110, 1000 110"
       : timeframe === "Monthly"
         ? "M 0 170 Q 500 180 1000 120"
         : "M 0 160 Q 500 150 1000 140"
   }), [timeframe]);

  if (!profile) return null;

  const correlations = [
    { factor: 'Follicular Phase', impact: '+22%', metric: 'Energy Output', color: '#FB7185' },
    { factor: 'Magnesium Prep', impact: '-30%', metric: 'PMS Symptoms', color: '#EC4899' },
    { factor: 'Cycle Day 10', impact: '+15%', metric: 'Deep Sleep', color: '#F472B6' },
  ];

  const recommendations = [
    { title: 'Estrogen Peak Strategy', desc: 'Your estrogen peaks in 48 hours. This is the optimal window for maximum cognitive output and high-intensity metabolic training.', type: 'Cycle Optimization', color: '#FB7185' },
    { title: 'Iron Replenishment', desc: 'Pre-period iron loading protocol: Increase spinach and lean protein intake to offset upcoming menstrual iron loss.', type: 'Biochemistry', color: '#EC4899' },
    { title: 'Progesterone Prep', desc: 'As you transition to the luteal phase, prioritize cortisol-lowering activities (yoga, meditation) to maintain emotional stability.', type: 'Emotional Care', color: '#8B5CF6' }
  ];

  return (
    <div className="min-h-screen bg-[#FFFBFB] pb-32 selection:bg-[#FB7185]/10 overflow-x-hidden relative overflow-y-auto no-scrollbar h-full">
      
      {/* Background soft gradients */}
      <div className="absolute top-0 right-[-100px] w-[500px] h-[500px] bg-[#FB7185]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-200px] w-[600px] h-[600px] bg-[#EC4899]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-16 relative z-10">
        
        {/* Interactive Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#FB7185] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#FB7185]/30">
                   <Brain size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FB7185]">Analytic Core</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#1F111F]">Biological <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FB7185] to-[#EC4899]">Intelligence</span></h1>
             <p className="text-sm md:text-base text-[#8E7E8E] font-medium">Extracting actionable hormonal correlations from your biological flow.</p>
          </div>

          {/* Timeframe Switcher */}
          <div className="flex items-center gap-1 p-1 bg-white border border-[#FDEFF2] shadow-sm rounded-2xl w-fit backdrop-blur-sm">
             {(['Weekly', 'Monthly', '90-Day'] as const).map((t) => (
                <button
                   key={t}
                   onClick={() => setTimeframe(t)}
                   className={cn(
                      "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                      timeframe === t ? "bg-[#1F111F] text-white shadow-md" : "text-[#8E7E8E] hover:bg-[#FFFBFB]"
                   )}
                >
                   {t}
                </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* LEFT PANEL - CORE HERO & PATTERNS */}
           <div className="lg:col-span-8 space-y-8">
              
              {/* BIG HERO SCORE CARD */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] p-1 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-white overflow-hidden"
              >
                 <div className="bg-gradient-to-br from-[#FFFBFB] via-white to-white rounded-[2.8rem] p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center relative overflow-hidden">
                    {/* Artistic backdrop lines */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                       <svg width="100%" height="100%"><defs><pattern id="femaleGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#femaleGrid)" /></svg>
                    </div>

                    <div className="relative z-10 flex-1 space-y-6 text-center md:text-left">
                       <div className="space-y-2">
                          <span className="px-3 py-1 bg-[#FB7185]/10 text-[#FB7185] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#FB7185]/10">Current Cycle State</span>
                          <h2 className="text-3xl font-black text-[#1F111F]">Metabolic Potential</h2>
                          <p className="text-[#8E7E8E] font-medium leading-relaxed text-sm md:text-base max-w-md">
                             Your rising estrogen is optimizing glycogen storage and insulin sensitivity. This is your peak window for strength and endurance.
                          </p>
                       </div>
                       
                       <div className="flex flex-wrap justify-center md:justify-start gap-4">
                          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-[#FDEFF2]">
                             <Flame size={16} className="text-orange-500" />
                             <span className="text-xs font-black text-[#1F111F]">Zone: Power</span>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-[#FDEFF2]">
                             <Heart size={16} className="text-rose-500" />
                             <span className="text-xs font-black text-[#1F111F]">Cycle Day: {stats?.cycleDay || 14}</span>
                          </div>
                       </div>
                    </div>

                    {/* Radial Visual Container */}
                    <div className="relative w-56 h-56 flex items-center justify-center shrink-0 z-10">
                       <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#FDEFF2" strokeWidth="6" />
                          <motion.circle 
                             cx="50" cy="50" r="45" fill="none" stroke="url(#grad_female_ready)" strokeWidth="8" strokeLinecap="round"
                             initial={{ strokeDasharray: "0, 283" }}
                             animate={{ strokeDasharray: "220, 283" }}
                             transition={{ duration: 2, ease: "easeOut" }}
                          />
                          <defs>
                             <linearGradient id="grad_female_ready" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FB7185" />
                                <stop offset="100%" stopColor="#EC4899" />
                             </linearGradient>
                          </defs>
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black text-[#1F111F] tracking-tighter">82</span>
                          <span className="text-[10px] font-bold uppercase text-[#8E7E8E] tracking-widest">Wellness Score</span>
                       </div>
                    </div>
                 </div>
              </motion.div>

               {/* BIOMETRIC CORRELATIONS */}
              <div className="space-y-4">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8E7E8E] flex items-center gap-2 pl-1">
                    <HeartPulse size={14} /> Biometric Correlations
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#FDEFF2] p-8 rounded-[2.5rem] shadow-sm">
                       <div className="flex justify-between items-center mb-6">
                          <div>
                             <h4 className="font-black text-[#1F111F] text-lg">Resting Heart Rate</h4>
                             <p className="text-xs text-[#8E7E8E] font-bold">Monthly Trend</p>
                          </div>
                          <div className="text-right">
                             <span className="text-2xl font-black text-[#FB7185]">68</span>
                             <span className="text-[10px] font-bold text-[#8E7E8E] ml-1">avg bpm</span>
                          </div>
                       </div>
                        <div className="h-24 w-full relative">
                           <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                              <defs>
                                 <linearGradient id="rhrGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FB7185" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
                                 </linearGradient>
                              </defs>
                              <motion.path 
                                 d={rhrPaths.area}
                                 fill="url(#rhrGradient)"
                                 animate={{ d: rhrPaths.area }}
                                 transition={{ duration: 0.3 }}
                              />
                              <motion.path 
                                 d={rhrPaths.line}
                                 fill="none" stroke="#FB7185" strokeWidth="3" strokeLinecap="round"
                                 animate={{ d: rhrPaths.line }}
                                 transition={{ duration: 0.3 }}
                              />
                           </svg>
                        </div>
                       <p className="text-[10px] text-[#8E7E8E] mt-4 font-bold leading-relaxed">
                          Your RHR typically rises by 2-3 bpm during the Luteal phase. Currently 1 bpm below your baseline.
                       </p>
                    </div>
                    <div className="bg-white border border-[#FDEFF2] p-8 rounded-[2.5rem] shadow-sm">
                        <div className="h-24 w-full relative">
                           <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                              <defs>
                                 <linearGradient id="hrvGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                                 </linearGradient>
                              </defs>
                              <motion.path 
                                 d={hrvPaths.area}
                                 fill="url(#hrvGradient)"
                                 animate={{ d: hrvPaths.area }}
                                 transition={{ duration: 0.3 }}
                              />
                              <motion.path 
                                 d={hrvPaths.line}
                                 fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round"
                                 animate={{ d: hrvPaths.line }}
                                 transition={{ duration: 0.3 }}
                              />
                           </svg>
                        </div>
                       <div className="h-24 flex items-end gap-1.5 pt-2">
                          {[70, 65, 80, 50, 45, 60, 75, 85, 90, 70, 60, 55].map((h, i) => (
                             <div key={i} className="flex-1 h-full bg-emerald-50/30 rounded-t-lg relative group overflow-hidden border border-emerald-100/30">
                                <motion.div 
                                  initial={{ height: "4%" }} animate={{ height: `${h}%` }} transition={{ delay: i*0.05, duration: 0.6 }}
                                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-emerald-400 to-teal-500 opacity-40 group-hover:opacity-100 transition-opacity rounded-t-lg shadow-sm" 
                                />
                             </div>
                          ))}
                       </div>
                       <p className="text-[10px] text-[#8E7E8E] mt-4 font-bold leading-relaxed">
                          HRV is highest during your Follicular phase, indicating superior recovery capacity and stress resilience.
                       </p>
                    </div>
                 </div>
              </div>

              {/* METABOLIC HEALTH CARD */}
              <div className="bg-gradient-to-br from-white to-[#FFFBFB] border border-[#FDEFF2] rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Scale size={140} />
                 </div>
                 <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-2 space-y-6">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                             <Zap size={24} />
                          </div>
                          <div>
                             <h3 className="text-2xl font-black text-[#1F111F]">Metabolic Stability</h3>
                             <p className="text-sm font-bold text-[#8E7E8E]">Glucose & Weight Correlation</p>
                          </div>
                       </div>
                       <p className="text-base text-[#4D3D4D] leading-relaxed font-medium">
                          Your body is currently in an **anabolic state**. Insulin sensitivity is at its peak, allowing for efficient carbohydrate utilization. Weight fluctuations are minimal (+0.2kg over 7 days), consistent with your current follicular progress.
                       </p>
                       <div className="flex gap-6">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-[#8E7E8E] uppercase tracking-widest">Insulin Sensitivity</p>
                             <p className="text-xl font-black text-emerald-500">OPTIMAL</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-[#8E7E8E] uppercase tracking-widest">Basal Metabolic Rate</p>
                             <p className="text-xl font-black text-[#1F111F]">1,450 kcal</p>
                          </div>
                       </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-[#FDEFF2] shadow-sm space-y-6">
                       <h4 className="font-black text-[#1F111F] text-sm uppercase tracking-widest">Weight Trend</h4>
                       <div className="space-y-4">
                          <div className="flex justify-between items-end">
                             <span className="text-3xl font-black text-[#1F111F]">64.2</span>
                             <span className="text-xs font-bold text-[#FB7185] mb-1">-0.4 kg</span>
                          </div>
                          <div className="h-16 w-full flex items-end gap-1.5">
                             {[50, 48, 52, 49, 47, 46, 45].map((h, i) => (
                                <div key={i} className="flex-1 h-full bg-[#FDEFF2] rounded-full overflow-hidden relative">
                                   <motion.div 
                                      initial={{ height: "10%" }} animate={{ height: `${h}%` }} transition={{ delay: i*0.05, duration: 0.5 }}
                                      className="w-full bg-[#FB7185] rounded-full absolute bottom-0 left-0" 
                                   />
                                </div>
                             ))}
                          </div>
                          <p className="text-[10px] text-[#8E7E8E] font-bold text-center">Last 7 Days</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* DEEP TREND VISUALIZER */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-[#FDEFF2] shadow-sm space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                       <h3 className="font-black text-[#1F111F] text-xl">Hormonal Stability</h3>
                       <p className="text-xs font-medium text-[#8E7E8E]">Basal Body Temp vs Cycle Progress</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FB7185]" /><span className="text-[10px] font-bold text-[#8E7E8E]">Estrogen</span></div>
                       <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#EC4899]" /><span className="text-[10px] font-bold text-[#8E7E8E]">Temp</span></div>
                    </div>
                 </div>

                  <div className="h-64 w-full relative pt-10">
                     <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                        {/* ESTROGEN CURVE */}
                        <motion.path 
                           d={hormonalPaths.estrogen}
                           fill="none" stroke="#FB7185" strokeWidth="4" strokeLinecap="round"
                           animate={{ d: hormonalPaths.estrogen }}
                           transition={{ duration: 0.4 }}
                        />
                        {/* TEMP CURVE */}
                        <motion.path 
                           d={hormonalPaths.temp}
                           fill="none" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8"
                           animate={{ d: hormonalPaths.temp }}
                           transition={{ duration: 0.4 }}
                        />
                        {/* X-AXIS LABELS */}
                        {timeframe === 'Weekly' ? (
                           [0, 1, 2, 3, 4, 5, 6].map((i) => (
                              <text key={i} x={i * 166} y="195" fontSize="12" fontWeight="900" fill="#D1BBD1" textAnchor="middle" className="uppercase italic tracking-widest">
                                 Day {i + (stats?.cycleDay || 1)}
                              </text>
                           ))
                        ) : timeframe === 'Monthly' ? (
                           ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((w, i) => (
                              <text key={i} x={i * 333} y="195" fontSize="12" fontWeight="900" fill="#D1BBD1" textAnchor="middle" className="uppercase italic tracking-widest">
                                 {w}
                              </text>
                           ))
                        ) : (
                           ['Mar', 'Apr', 'May'].map((m, i) => (
                              <text key={i} x={i * 500} y="195" fontSize="12" fontWeight="900" fill="#D1BBD1" textAnchor="middle" className="uppercase italic tracking-widest">
                                 {m}
                              </text>
                           ))
                        )}
                     </svg>
                  </div>
              </div>
           </div>

           {/* RIGHT PANEL - RECOMMENDATIONS & PREDICTION */}
           <div className="lg:col-span-4 space-y-8">
              
              {/* INTELLIGENCE PROTOCOLS */}
              <div className="bg-[#1F111F] rounded-[2.5rem] p-8 shadow-xl shadow-rose-900/10 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#FB7185]/20 rounded-full blur-2xl" />
                 
                 <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-[#FB7185] border border-white/10">
                       <Sparkles size={20} />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg leading-tight">AI Protocols</h3>
                       <p className="text-xs text-[#D1BBD1] font-medium">Synced with Cycle</p>
                    </div>
                 </div>

                 <div className="space-y-4 relative z-10">
                    {recommendations.map((rec, i) => (
                       <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: 20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: 0.2 + (i*0.1) }}
                          className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-2 group cursor-pointer hover:bg-white/10 transition-colors"
                       >
                          <div className="flex items-center justify-between">
                             <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[#FB7185]/20 text-[#FB7185]">{rec.type}</span>
                             <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#D1BBD1]" />
                          </div>
                          <h4 className="text-sm font-bold leading-snug">{rec.title}</h4>
                          <p className="text-xs text-[#D1BBD1] leading-relaxed font-medium">{rec.desc}</p>
                       </motion.div>
                    ))}
                 </div>
              </div>

              {/* SLEEP ARCHITECTURE */}
              <div className="bg-white border border-[#FDEFF2] rounded-[2.5rem] p-8 shadow-sm flex flex-col gap-6">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                       <Moon size={22} />
                    </div>
                    <div>
                       <h4 className="font-black text-[#1F111F]">Sleep Architecture</h4>
                       <p className="text-xs text-[#8E7E8E] font-medium">Deep vs REM Correlation</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#1F111F]">Deep Sleep</span>
                       </div>
                       <span className="text-xs font-black text-[#1F111F]">1h 42m</span>
                    </div>
                    <div className="flex justify-between items-center px-2">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-sky-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#1F111F]">REM Sleep</span>
                       </div>
                       <span className="text-xs font-black text-[#1F111F]">2h 15m</span>
                    </div>
                    <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden flex">
                       <div className="h-full bg-indigo-500 w-[25%]" />
                       <div className="h-full bg-sky-400 w-[35%]" />
                       <div className="h-full bg-gray-200 w-[40%]" />
                    </div>
                    <p className="text-[10px] text-[#8E7E8E] font-bold leading-relaxed px-2">
                       Progesterone levels in your Luteal phase may decrease REM latency. Current Follicular state shows optimal REM/Deep ratio.
                    </p>
                 </div>
              </div>

              {/* FORECAST & RISK MODULE */}
              <div className="bg-white border border-[#FDEFF2] rounded-[2.5rem] p-8 shadow-sm flex flex-col gap-6">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                       <AlertTriangle size={22} />
                    </div>
                    <div>
                       <h4 className="font-black text-[#1F111F]">Emotional Horizon</h4>
                       <p className="text-xs text-[#8E7E8E] font-medium">AI Mood Forecast</p>
                    </div>
                 </div>

                 <div className="p-5 bg-rose-50/50 border border-rose-100 rounded-[2rem] space-y-3">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-black text-rose-600 uppercase tracking-widest">Stress Sensitivity</span>
                       <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-black rounded-lg">Minimal (4%)</span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full border border-rose-100 overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '4%' }} className="h-full bg-rose-500 rounded-full" />
                    </div>
                    <p className="text-xs font-medium text-rose-800 leading-relaxed">
                       Current hormonal window is protective. High social energy and verbal performance predicted for the next 72 hours.
                    </p>
                 </div>

                 <button className="w-full py-4 bg-[#FFFBFB] border border-[#FDEFF2] text-[#1F111F] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#FFF1F2] transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <HeartPulse size={16} /> Optimize Cycle Flow
                 </button>
              </div>

              {/* SYSTEMIC TRENDS (GENERAL HEALTH) */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8E7E8E] pl-1">Systemic Stability</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                       { label: 'Glucose', val: '88', sub: 'mg/dL', color: '#FB7185' },
                       { label: 'SpO2', val: '99', sub: '%', color: '#8B5CF6' },
                    ].map((s, i) => (
                       <div key={i} className="p-6 bg-white border border-[#FDEFF2] rounded-[2rem] flex flex-col items-center shadow-sm">
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#8E7E8E] mb-2">{s.label}</span>
                          <div className="flex items-baseline gap-1">
                             <span className="text-2xl font-black text-[#1F111F]">{s.val}</span>
                             <span className="text-[10px] font-bold text-[#D1BBD1]">{s.sub}</span>
                          </div>
                          <div className="w-12 h-1 bg-gray-50 rounded-full mt-3 overflow-hidden">
                             <div className="h-full bg-current" style={{ width: '85%', color: s.color }} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
