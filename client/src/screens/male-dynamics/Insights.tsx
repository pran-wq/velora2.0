import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  Brain, Sparkles, TrendingUp, Moon, Zap, Target,
  ArrowRight, ShieldPlus, Activity, AlertTriangle, BatteryCharging,
  Dumbbell, Calendar, ChevronDown, Layers, Flame, HeartPulse
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function MaleInsights() {
  const { profile } = useApp();
  const [timeframe, setTimeframe] = useState<'Weekly' | 'Monthly' | '90-Day'>('Weekly');

  if (!profile) return null;

  const correlations = [
    { factor: 'Sleep Consistency', impact: '+18%', metric: 'HRV Recovery', color: '#818CF8' },
    { factor: 'Sunlight Exposure', impact: '-22%', metric: 'Stress Spike', color: '#FBBF24' },
    { factor: 'Evening Screen Time', impact: '-15%', metric: 'Deep Sleep', color: '#F472B6' },
  ];

  const recommendations = [
    { title: 'Deload Week Trigger', desc: 'CNS fatigue patterns rising. A 3-day deload protocol will optimize the upcoming strength peak.', type: 'Performance', color: '#818CF8' },
    { title: 'Magnesium Protocol', desc: '400mg of Bisglycinate pre-sleep correlates with a 15% increase in your REM cycles.', type: 'Biochemistry', color: '#10B981' },
    { title: 'Cold Exposure Window', desc: 'Leverage 2 mins cold exposure post-training to further dampen latent inflammation spikes.', type: 'Longevity', color: '#60A5FA' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 selection:bg-[#818CF8]/10 overflow-x-hidden relative overflow-y-auto no-scrollbar h-full">
      
      {/* Background soft gradients */}
      <div className="absolute top-0 right-[-100px] w-[500px] h-[500px] bg-[#818CF8]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-200px] w-[600px] h-[600px] bg-[#34D399]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-16 relative z-10">
        
        {/* Interactive Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#818CF8] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#818CF8]/30">
                   <Brain size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#818CF8]">Analytic Core</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0F172A]">Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] to-[#6366F1]">Intelligence</span></h1>
             <p className="text-sm md:text-base text-[#64748B] font-medium">Extracting actionable correlations from your biological data flow.</p>
          </div>

          {/* Timeframe Switcher */}
          <div className="flex items-center gap-1 p-1 bg-white border border-gray-100 shadow-sm rounded-2xl w-fit backdrop-blur-sm">
             {(['Weekly', 'Monthly', '90-Day'] as const).map((t) => (
                <button
                   key={t}
                   onClick={() => setTimeframe(t)}
                   className={cn(
                      "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                      timeframe === t ? "bg-[#0F172A] text-white shadow-md" : "text-[#64748B] hover:bg-gray-50"
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
                 <div className="bg-gradient-to-br from-gray-50 via-white to-white rounded-[2.8rem] p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center relative overflow-hidden">
                    {/* Artistic backdrop lines */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                       <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
                    </div>

                    <div className="relative z-10 flex-1 space-y-6 text-center md:text-left">
                       <div className="space-y-2">
                          <span className="px-3 py-1 bg-[#818CF8]/10 text-[#818CF8] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#818CF8]/10">Current State</span>
                          <h2 className="text-3xl font-black text-[#0F172A]">Readiness Potential</h2>
                          <p className="text-[#64748B] font-medium leading-relaxed text-sm md:text-base max-w-md">
                             Your cellular integration and CNS recovery indicate peak performance readiness today. Optimal for maximum intensity.
                          </p>
                       </div>
                       
                       <div className="flex flex-wrap justify-center md:justify-start gap-4">
                          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-50">
                             <Flame size={16} className="text-orange-500" />
                             <span className="text-xs font-black text-[#0F172A]">Zone: Peak</span>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-50">
                             <HeartPulse size={16} className="text-rose-500" />
                             <span className="text-xs font-black text-[#0F172A]">HRV: +12ms</span>
                          </div>
                       </div>
                    </div>

                    {/* Radial Visual Container */}
                    <div className="relative w-56 h-56 flex items-center justify-center shrink-0 z-10">
                       <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" strokeWidth="6" />
                          <motion.circle 
                             cx="50" cy="50" r="45" fill="none" stroke="url(#grad_ready)" strokeWidth="8" strokeLinecap="round"
                             initial={{ strokeDasharray: "0, 283" }}
                             animate={{ strokeDasharray: "240, 283" }}
                             transition={{ duration: 2, ease: "easeOut" }}
                          />
                          <defs>
                             <linearGradient id="grad_ready" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#818CF8" />
                                <stop offset="100%" stopColor="#10B981" />
                             </linearGradient>
                          </defs>
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black text-[#0F172A] tracking-tighter">88</span>
                          <span className="text-[10px] font-bold uppercase text-[#64748B] tracking-widest">Global Score</span>
                       </div>
                    </div>
                 </div>
              </motion.div>

              {/* CORRELATION GRID (New Feature) */}
              <div className="space-y-4">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#64748B] flex items-center gap-2 pl-1">
                    <Layers size={14} /> Biological Correlations
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {correlations.map((item, idx) => (
                       <div key={idx} className="bg-white border border-gray-50 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] transition-all">
                          <div className="w-8 h-8 rounded-xl mb-4 flex items-center justify-center bg-opacity-10" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                             <Zap size={16} fill="currentColor" className="opacity-30" />
                          </div>
                          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">{item.factor}</p>
                          <div className="flex items-end justify-between">
                             <h4 className="text-lg font-black text-[#0F172A]">{item.metric}</h4>
                             <span className={cn("text-sm font-black", item.impact.startsWith('+') ? "text-[#10B981]" : "text-[#F472B6]")}>{item.impact}</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

               {/* BIOMETRIC CORRELATIONS */}
               <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#64748B] flex items-center gap-2 pl-1">
                     <HeartPulse size={14} /> Biometric Correlations
                  </h3>
                  <div className="bg-white border border-gray-50 p-8 rounded-[2.5rem] shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                        <div>
                           <h4 className="font-black text-[#0F172A] text-lg">Heart Rate Stability</h4>
                           <p className="text-xs text-[#64748B] font-bold">{timeframe} Trend</p>
                        </div>
                        <div className="text-right">
                           <span className="text-2xl font-black text-[#818CF8]">62</span>
                           <span className="text-[10px] font-bold text-[#64748B] ml-1">avg bpm</span>
                        </div>
                     </div>
                      <div className="h-24 w-full relative">
                         <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                            <defs>
                               <linearGradient id="maleRhrGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
                                  <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                               </linearGradient>
                            </defs>
                            <motion.path 
                               d="M 0 80 Q 50 60 100 70 T 200 40 T 300 65 T 400 50 L 400 100 L 0 100 Z"
                               fill="url(#maleRhrGradient)"
                            />
                            <motion.path 
                               d="M 0 80 Q 50 60 100 70 T 200 40 T 300 65 T 400 50"
                               fill="none" stroke="#818CF8" strokeWidth="3" strokeLinecap="round"
                            />
                         </svg>
                      </div>
                     <p className="text-[10px] text-[#64748B] mt-4 font-bold leading-relaxed">
                        Your Resting Heart Rate is 4% below your 90-day baseline, indicating superior cardiovascular recovery and high aerobic capacity.
                     </p>
                  </div>
               </div>

              {/* DEEP TREND VISUALIZER */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                       <h3 className="font-black text-[#0F172A] text-xl">System Stability</h3>
                       <p className="text-xs font-medium text-[#64748B]">Consistency vs Volume Tracking</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#818CF8]" /><span className="text-[10px] font-bold text-[#64748B]">Load</span></div>
                       <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#10B981]" /><span className="text-[10px] font-bold text-[#64748B]">Rest</span></div>
                    </div>
                 </div>

                 <div className="h-48 w-full relative flex items-end gap-3 pt-4 border-b border-gray-100 pb-2">
                    {/* Dynamic dynamic bars */}
                    {[40, 55, 80, 65, 95, 70, 85].map((h, i) => (
                       <div key={i} className="flex-1 flex flex-col gap-2 items-center group h-full justify-end">
                          <div className="w-full bg-gray-50 rounded-xl relative overflow-hidden h-full transition-all group-hover:bg-gray-100 cursor-pointer border border-gray-100/60 shadow-2xs">
                             {/* Primary Load Bar */}
                             <motion.div 
                                initial={{ height: "4%" }} 
                                animate={{ height: `${h}%` }} 
                                transition={{ delay: i*0.05, duration: 0.6 }}
                                className="w-full absolute bottom-0 left-0 bg-[#818CF8] opacity-85 group-hover:opacity-100 rounded-t-xl transition-opacity" 
                             />
                             {/* Secondary Overlay Rest Bar */}
                             <motion.div 
                                initial={{ height: "2%" }} 
                                animate={{ height: `${h*0.4}%` }} 
                                transition={{ delay: i*0.08, duration: 0.6 }}
                                className="w-full absolute bottom-0 left-0 bg-[#10B981] opacity-95 z-10 rounded-t-lg shadow-sm" 
                             />
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-1 block">D{i+1}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* RIGHT PANEL - RECOMMENDATIONS & PREDICTION */}
           <div className="lg:col-span-4 space-y-8">
              
              {/* INTELLIGENCE PROTOCOLS */}
              <div className="bg-[#0F172A] rounded-[2.5rem] p-8 shadow-xl shadow-indigo-900/10 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#818CF8]/20 rounded-full blur-2xl" />
                 
                 <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-[#818CF8] border border-white/10">
                       <Sparkles size={20} />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg leading-tight">AI Protocols</h3>
                       <p className="text-xs text-gray-400 font-medium">Updated just now</p>
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
                             <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[#818CF8]/20 text-[#818CF8]">{rec.type}</span>
                             <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gray-400" />
                          </div>
                          <h4 className="text-sm font-bold leading-snug">{rec.title}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-medium">{rec.desc}</p>
                       </motion.div>
                    ))}
                 </div>
              </div>

              {/* FORECAST & RISK MODULE */}
              <div className="bg-white border border-gray-50 rounded-[2.5rem] p-8 shadow-sm flex flex-col gap-6">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                       <AlertTriangle size={22} />
                    </div>
                    <div>
                       <h4 className="font-black text-[#0F172A]">Predictive Risk</h4>
                       <p className="text-xs text-[#64748B] font-medium">AI Forecast Horizon</p>
                    </div>
                 </div>

                 <div className="p-5 bg-rose-50/50 border border-rose-100 rounded-[2rem] space-y-3">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-black text-rose-600 uppercase tracking-widest">Burnout Probability</span>
                       <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-black rounded-lg">Low (8%)</span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full border border-rose-100 overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '8%' }} className="h-full bg-rose-500 rounded-full" />
                    </div>
                    <p className="text-xs font-medium text-rose-800 leading-relaxed">
                       System is resilient. Maintain existing load protocols. No regression indicators detected in recovery loop.
                    </p>
                 </div>

                 <button className="w-full py-4 bg-[#F8FAFC] border border-gray-100 text-[#0F172A] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <BatteryCharging size={16} /> Optimize Tomorrow
                 </button>
              </div>

              {/* SYSTEMIC TRENDS (GENERAL HEALTH) */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748B] pl-1">Systemic Stability</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                       { label: 'Glucose', val: '94', sub: 'mg/dL', color: '#818CF8' },
                       { label: 'SpO2', val: '98', sub: '%', color: '#10B981' },
                    ].map((s, i) => (
                       <div key={i} className="p-6 bg-white border border-gray-50 rounded-[2rem] flex flex-col items-center shadow-sm">
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B] mb-2">{s.label}</span>
                          <div className="flex items-baseline gap-1">
                             <span className="text-2xl font-black text-[#0F172A]">{s.val}</span>
                             <span className="text-[10px] font-bold text-gray-300">{s.sub}</span>
                          </div>
                          <div className="w-12 h-1 bg-gray-50 rounded-full mt-3 overflow-hidden">
                             <div className="h-full bg-current" style={{ width: '82%', color: s.color }} />
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

function Heart(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  );
}

