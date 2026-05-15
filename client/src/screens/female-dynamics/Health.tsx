import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Heart, Activity, Droplets, Moon, Dumbbell, Brain, Zap, Utensils, Flame, ShieldAlert, Battery,
  X, Play, CheckCircle, Timer, Wind, Sparkles, Calendar, HeartPulse,
  ArrowRight, Scale, Pill, Plus, ShieldPlus
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FemaleHealth() {
  const navigate = useNavigate();
  const { profile, stats, vitals } = useApp();
  const [activeExercise, setActiveExercise] = useState<null | { title: string; type: string; duration: string; img: string }>(null);
  const [showBreathing, setShowBreathing] = useState(false);

  if (!profile) return null;

  return (
    <div className="flex flex-col gap-12 pt-10 px-6 md:px-10 pb-32 overflow-y-auto no-scrollbar h-full w-full bg-[#FFFBFB]">
      
      <header className="space-y-2 max-w-[1400px] mx-auto w-full">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FB7185]">Women's Health & Wellness Center</h2>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-[#1F111F]">
          Health Management
        </h1>
      </header>

      <div className="max-w-[1400px] mx-auto w-full space-y-12">
        
        {/* SECTION 1 - CLINICAL VITALS */}
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#8E7E8E] pl-2 border-l-4 border-[#FB7185]">Clinical Vitals</h3>
            <button onClick={() => navigate('/predict')} className="text-[10px] font-black text-[#FB7185] uppercase tracking-widest hover:underline flex items-center gap-2">
              AI hub <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Heart Rate', val: `${vitals.find(v => v.type === 'Heart Rate')?.value || '72'} bpm`, icon: Heart, color: '#F43F5E' },
              { label: 'Blood Pressure', val: vitals.find(v => v.type === 'Blood Pressure')?.value || '118/75', icon: Activity, color: '#FB7185' },
              { label: 'Oxygen Level', val: `${vitals.find(v => v.type === 'SpO2')?.value || '99'}%`, icon: Droplets, color: '#0EA5E9' },
              { label: 'Weight', val: `${profile.weight || 64} kg`, icon: Scale, color: '#EC4899' },
              { label: 'Sleep Score', val: `${stats.recoveryScore}/100`, icon: Moon, color: '#10B981' },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-[24px] p-6 shadow-sm border border-[#FDEFF2] flex flex-col items-center justify-center gap-3 hover:border-[#FB7185] hover:shadow-md transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${v.color}15`, color: v.color }}>
                  <v.icon size={24} />
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-[#1F111F]">{v.val}</p>
                  <p className="text-[9px] font-black text-[#8E7E8E] uppercase tracking-widest mt-1">{v.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 1.5 - METABOLIC & BODY COMPOSITION */}
        <section className="space-y-6">
           <h3 className="text-sm font-black uppercase tracking-widest text-[#8E7E8E] pl-2 border-l-4 border-indigo-500">Metabolic Intelligence</h3>
           <div className="bg-white rounded-[32px] p-10 shadow-sm border border-[#FDEFF2] grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center"><Zap size={20} /></div>
                    <h4 className="font-black text-[#1F111F]">Metabolic Rate</h4>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#1F111F]">1,450</span>
                    <span className="text-xs font-bold text-[#8E7E8E]">kcal/day</span>
                 </div>
                 <p className="text-[10px] text-[#8E7E8E] font-bold uppercase tracking-widest">Basal Metabolic Rate (BMR)</p>
              </div>
              <div className="space-y-4 border-x border-[#FDEFF2] px-10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><Activity size={20} /></div>
                    <h4 className="font-black text-[#1F111F]">BMI Analysis</h4>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#1F111F]">21.4</span>
                    <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-md font-black">HEALTHY</span>
                 </div>
                 <p className="text-[10px] text-[#8E7E8E] font-bold uppercase tracking-widest">Body Mass Index</p>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center"><HeartPulse size={20} /></div>
                    <h4 className="font-black text-[#1F111F]">Body Fat %</h4>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#1F111F]">22.5%</span>
                    <span className="text-xs font-bold text-[#10B981]">-0.8%</span>
                 </div>
                 <p className="text-[10px] text-[#8E7E8E] font-bold uppercase tracking-widest">Est. Bio-Composition</p>
              </div>
           </div>
        </section>

        {/* SECTION 2 - HORMONAL WELLNESS */}
        <section className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#8E7E8E] pl-2 border-l-4 border-[#EC4899]">Hormonal Harmony</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-[#FDEFF2] flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 bg-[#FB7185]/10 rounded-2xl flex items-center justify-center text-[#FB7185]">
                   <Activity size={24} />
                 </div>
                 <div>
                   <h4 className="text-lg font-black text-[#1F111F]">Estrogen & Progesterone Sync</h4>
                   <p className="text-[10px] font-black text-[#D1BBD1] uppercase tracking-wider">Hormonal Profile · Follicular Phase</p>
                 </div>
               </div>
               <div className="flex items-baseline gap-2 mb-4">
                 <span className="text-4xl font-black text-[#1F111F]">Balanced</span>
                 <span className="ml-4 px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-lg text-xs font-black">OPTIMAL</span>
               </div>
               <p className="text-sm text-[#4D3D4D] leading-relaxed max-w-lg font-medium">
                 Your hormonal trajectory is perfectly aligned with your cycle phase. Estrogen is rising steadily, supporting cognitive clarity and physical endurance. Maintain your current iron and magnesium intake to support this growth.
               </p>
            </div>
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#FDEFF2] flex flex-col justify-between">
               <h4 className="font-black text-[#1F111F] mb-4 text-sm uppercase tracking-widest">Hormonal Load</h4>
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-bold text-[#4D3D4D]">LH Surge Risk</span>
                   <span className="text-sm font-bold text-[#FB7185]">Low</span>
                 </div>
                 <div className="w-full h-2 bg-[#FDEFF2] rounded-full overflow-hidden">
                   <div className="h-full bg-[#FB7185] rounded-full w-[15%]" />
                 </div>
               </div>
               <div className="mt-6 p-4 bg-[#FFFBFB] rounded-2xl border border-[#FDEFF2]">
                 <p className="text-[11px] text-[#8E7E8E] leading-relaxed font-bold italic">
                   "Your body is preparing for the ovulatory window. Energy optimization is active."
                 </p>
               </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 - CYCLE TRACKING */}
        <section className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#8E7E8E] pl-2 border-l-4 border-[#F472B6]">Cycle Dynamics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 bg-white rounded-[32px] p-8 shadow-sm border border-[#FDEFF2] flex flex-col items-center justify-center text-center">
               <Calendar size={32} className="text-[#F472B6] mb-4" />
               <h4 className="text-sm font-black text-[#8E7E8E] uppercase tracking-wider mb-2">Cycle Day</h4>
               <span className="text-4xl font-display font-black text-[#1F111F]">{stats.cycleDay || 14}</span>
               <p className="text-xs text-[#4D3D4D] font-bold mt-2 uppercase tracking-tight text-[#FB7185]">Mid-Cycle Peak</p>
            </div>
            <div className="md:col-span-3 bg-white rounded-[32px] p-8 shadow-sm border border-[#FDEFF2]">
               <h4 className="text-lg font-black text-[#1F111F] mb-6">Phase Indicators</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { label: 'Flow Intensity', val: 'None', color: '#8E7E8E' },
                   { label: 'Fertility', val: 'Peak', color: '#FB7185' },
                   { label: 'Cramps Risk', val: 'Minimal', color: '#10B981' },
                   { label: 'Skin Clarity', val: 'High', color: '#EC4899' },
                 ].map(i => (
                   <div key={i.label} className="space-y-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#8E7E8E]">{i.label}</span>
                     <div className="text-lg font-black" style={{ color: i.color }}>{i.val}</div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 - NUTRITION */}
        <section className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#8E7E8E] pl-2 border-l-4 border-[#FBBF24]">Hormonal Fueling</h3>
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#FDEFF2]">
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#FFFBFB] text-[#FBBF24]">
                   <Utensils size={24} />
                 </div>
                 <div>
                   <h4 className="text-xl font-black text-[#1F111F]">Daily Nutrients</h4>
                   <p className="text-sm font-bold text-[#8E7E8E]">1,650 / 2,100 kcal</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="text-right">
                   <p className="text-sm font-black text-[#1F111F]">Hydration</p>
                   <p className="text-xs text-[#0EA5E9] font-black">{(stats.hydrationMl / 1000).toFixed(1)}L / 2.5L</p>
                 </div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               {[
                 { label: 'Protein', val: '120g', target: '140g', color: 'bg-[#FB7185]' },
                 { label: 'Iron', val: '14mg', target: '18mg', color: 'bg-[#EC4899]' },
                 { label: 'Magnesium', current: 320, target: 400, color: 'bg-[#8B5CF6]', val: '320mg' },
               ].map((m, i) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between text-xs font-black text-[#4D3D4D]">
                     <span>{m.label}</span>
                     <span>{m.val} / {m.target}</span>
                   </div>
                   <div className="w-full h-2 bg-[#FDEFF2] rounded-full overflow-hidden">
                     <div className={cn("h-full rounded-full", m.color)} style={{ width: '75%' }} />
                   </div>
                 </div>
               ))}
             </div>

             <div className="p-5 bg-[#FFF1F2] rounded-2xl border border-[#FB7185]/10 flex items-start gap-4">
               <Brain size={20} className="text-[#FB7185] shrink-0 mt-0.5" />
               <div>
                 <h5 className="text-xs font-black text-[#1F111F] uppercase tracking-widest">AI Cycle Nutrition</h5>
                 <p className="text-sm text-[#4D3D4D] mt-1 leading-relaxed font-medium">
                   Your body is utilizing carbohydrates more efficiently right now. Focus on complex grains and berries to maintain steady blood glucose during your rising estrogen phase.
                 </p>
               </div>
             </div>
          </div>
        </section>

        {/* SECTION 5 - FITNESS SYNC */}
        <section className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#8E7E8E] pl-2 border-l-4 border-[#F43F5E]">Fitness Sync</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {[
               { title: 'Follicular Flow', type: 'Vinyasa Yoga', duration: '35 min', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400' },
               { title: 'Metabolic Cardio', type: 'Interval Run', duration: '20 min', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400' },
             ].map((ex, i) => (
               <div 
                 key={i} 
                 onClick={() => navigate('/workouts')}
                 className="group relative overflow-hidden rounded-[32px] bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer h-72 border border-[#FDEFF2] flex items-end p-8"
               >
                  <img src={ex.img} alt={ex.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F111F]/90 via-[#1F111F]/40 to-transparent" />
                  <div className="relative z-10 text-white w-full">
                     <div className="flex justify-between items-end">
                       <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-[#D1BBD1] mb-1">{ex.type}</p>
                         <h4 className="text-2xl font-black">{ex.title}</h4>
                         <p className="text-xs font-bold text-[#FDEFF2] mt-2">{ex.duration} • AI Recommended for Phase</p>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-[#1F111F] transition-colors">
                         <Play size={18} fill="currentColor" />
                       </div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* SECTION 7 - PREVENTATIVE CARE & SCREENING */}
        <section className="space-y-6">
           <h3 className="text-sm font-black uppercase tracking-widest text-[#8E7E8E] pl-2 border-l-4 border-amber-500">Preventative Care & Screenings</h3>
           <div className="bg-[#1F111F] rounded-[32px] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                 <ShieldPlus size={160} />
              </div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                 <div className="lg:col-span-1 space-y-6">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 border border-white/10 shadow-lg">
                       <ShieldPlus size={28} />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-2xl font-black tracking-tight">Wellness Checklist</h4>
                       <p className="text-sm text-white/60 leading-relaxed font-medium">Your age-specific screening timeline is synchronized with your health history.</p>
                    </div>
                 </div>
                 <div className="lg:col-span-2 space-y-4">
                    {[
                      { title: 'Annual Gynae Exam', date: 'Due in 3 days', status: 'URGENT', color: 'text-amber-400', icon: Calendar },
                      { title: 'Dermatology Screening', date: 'Oct 12, 2026', status: 'SCHEDULED', color: 'text-emerald-400', icon: Activity },
                      { title: 'Pap Smear / Cytology', date: 'Compliant', status: 'DONE', color: 'text-emerald-400', icon: CheckCircle },
                      { title: 'Bone Density (DEXA)', date: 'Due at age 45', status: 'FUTURE', color: 'text-white/30', icon: Timer },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/5", s.color)}>
                               <s.icon size={18} />
                            </div>
                            <div>
                               <h5 className="text-sm font-bold text-white">{s.title}</h5>
                               <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">{s.date}</p>
                            </div>
                         </div>
                         <span className={cn("text-[9px] font-black px-3 py-1 rounded-lg border", s.status === 'URGENT' ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' : 'bg-white/5 border-white/10 text-white/60')}>
                            {s.status}
                         </span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION 8 - EMOTIONAL CARE */}
        <section className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#8E7E8E] pl-2 border-l-4 border-[#8B5CF6]">Emotional Care</h3>
          <div className="bg-gradient-to-br from-[#FFFBFB] to-white rounded-[32px] p-8 shadow-sm border border-[#FDEFF2]">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
               <div className="space-y-6">
                 <h4 className="text-2xl font-black text-[#1F111F]">Mindset Stability</h4>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white rounded-2xl border border-[#FDEFF2] shadow-sm">
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#8E7E8E]">Stress Level</span>
                     <p className="text-xl font-black text-[#10B981] mt-1">Low</p>
                   </div>
                   <div className="p-4 bg-white rounded-2xl border border-[#FDEFF2] shadow-sm">
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#8E7E8E]">Emotional Resilience</span>
                     <p className="text-xl font-black text-[#8B5CF6] mt-1">High</p>
                   </div>
                 </div>
                 <p className="text-sm text-[#4D3D4D] leading-relaxed font-medium">
                   Your emotional landscape is stable and vibrant. The rising estrogen in your follicular phase is enhancing verbal memory and social confidence. This is an excellent time for collaborative work.
                 </p>
               </div>
               
               <div className="flex flex-col gap-4">
                 <button 
                   onClick={() => navigate('/mental-wellness')}
                   className="w-full py-5 bg-[#FFF1F2] rounded-[24px] text-[#FB7185] font-black text-sm shadow-sm hover:bg-[#FCE7F3] transition-colors flex items-center justify-center gap-3"
                 >
                   <Wind size={20} />
                   Start Sync-Breathing
                 </button>
                 <button 
                   onClick={() => navigate('/mental-wellness')}
                   className="w-full py-5 bg-white rounded-[24px] text-[#1F111F] font-black text-sm shadow-sm hover:shadow-md border border-[#FDEFF2] transition-all flex items-center justify-center gap-3"
                 >
                   <Sparkles size={20} />
                   Emotional Health Log
                 </button>
               </div>
             </div>
          </div>
        </section>

      </div>

      <AnimatePresence>
        {activeExercise && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal content similar to male health but themed */}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
