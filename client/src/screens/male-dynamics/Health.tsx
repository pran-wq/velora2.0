import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Heart, Activity, Droplets, Moon, Brain, Zap, Utensils, Battery, Flame,
  X, Play, Timer, Wind
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function MaleHealth() {
  const navigate = useNavigate();
  const { profile, stats, vitals } = useApp();
  const [activeExercise, setActiveExercise] = useState<null | { title: string; type: string; duration: string; img: string }>(null);
  const [showBreathing, setShowBreathing] = useState(false);

  if (!profile) return null;

  return (
    <div className="flex flex-col gap-12 pt-10 px-6 md:px-10 pb-32 overflow-y-auto no-scrollbar h-full w-full bg-[#F8FAFC]">
      
      <header className="space-y-2 max-w-[1400px] mx-auto w-full">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#818CF8]">Health & Performance Center</h2>
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-[#0F172A]">
          Health Management
        </h1>
      </header>

      <div className="max-w-[1400px] mx-auto w-full space-y-12">
        
        {/* SECTION 1 - VITALS */}
        <section className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#64748B] pl-2 border-l-4 border-[#818CF8]">Vitals</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Heart Rate', val: `${vitals.find(v => v.type === 'Heart Rate')?.value || '72'} bpm`, icon: Heart, color: '#F87171' },
              { label: 'Blood Pressure', val: vitals.find(v => v.type === 'Blood Pressure')?.value || '120/80', icon: Activity, color: '#818CF8' },
              { label: 'Oxygen Level', val: `${vitals.find(v => v.type === 'SpO2')?.value || '98'}%`, icon: Droplets, color: '#60A5FA' },
              { label: 'Weight', val: `${profile.weight || 82} kg`, icon: Activity, color: '#A78BFA' },
              { label: 'Sleep Score', val: `${stats.recoveryScore}/100`, icon: Moon, color: '#34D399' },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${v.color}15`, color: v.color }}>
                  <v.icon size={24} />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-[#0F172A]">{v.val}</p>
                  <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest mt-1">{v.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2 - RECOVERY TRACKING */}
        <section className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#64748B] pl-2 border-l-4 border-[#34D399]">Recovery Tracking</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center">
               <Battery size={32} className="text-[#34D399] mb-4" />
               <h4 className="text-sm font-bold text-[#64748B] uppercase tracking-wider mb-2">Sleep Recovery</h4>
               <span className="text-4xl font-display font-bold text-[#0F172A]">{stats.recoveryScore + 4}%</span>
               <p className="text-xs text-[#475569] mt-2">Deep sleep optimization successful.</p>
            </div>
            <div className="md:col-span-3 bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
               <h4 className="text-lg font-bold text-[#0F172A] mb-6">Readiness Indicators</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { label: 'Fatigue', val: 'Low', color: '#10B981' },
                   { label: 'Soreness', val: 'Mild', color: '#FBBF24' },
                   { label: 'Stress Load', val: 'Balanced', color: '#60A5FA' },
                   { label: 'Burnout Risk', val: 'Minimal', color: '#818CF8' },
                 ].map(i => (
                   <div key={i.label} className="space-y-2">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">{i.label}</span>
                     <div className="text-lg font-bold" style={{ color: i.color }}>{i.val}</div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 - NUTRITION */}
        <section className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#64748B] pl-2 border-l-4 border-[#FBBF24]">Nutrition</h3>
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#F8FAFC] text-[#FBBF24]">
                   <Utensils size={24} />
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-[#0F172A]">Daily Intake</h4>
                   <p className="text-sm font-medium text-[#64748B]">1,850 / 2,400 kcal</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="text-right">
                   <p className="text-sm font-bold text-[#0F172A]">Hydration</p>
                   <p className="text-xs text-[#60A5FA] font-medium">{(stats.hydrationMl / 1000).toFixed(1)}L / 3.0L</p>
                 </div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               {[
                 { label: 'Protein', val: '160g', target: '180g', color: 'bg-[#60A5FA]' },
                 { label: 'Carbs', val: '200g', target: '250g', color: 'bg-[#FBBF24]' },
                 { label: 'Fats', val: '65g', target: '70g', color: 'bg-[#F472B6]' },
               ].map((m, i) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between text-xs font-bold text-[#334155]">
                     <span>{m.label}</span>
                     <span>{m.val} / {m.target}</span>
                   </div>
                   <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                     <div className={cn("h-full rounded-full", m.color)} style={{ width: '75%' }} />
                   </div>
                 </div>
               ))}
             </div>

             <div className="p-5 bg-[#EEF2FF] rounded-2xl border border-[#818CF8]/10 flex items-start gap-4">
               <Brain size={20} className="text-[#818CF8] shrink-0 mt-0.5" />
               <div>
                 <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">AI Recovery Nutrition</h5>
                 <p className="text-sm text-[#475569] mt-1 leading-relaxed">
                   You are slightly behind on protein. A casein protein shake or Greek yogurt before bed will optimize overnight muscle synthesis and support your hormonal baseline.
                 </p>
               </div>
             </div>
          </div>
        </section>

        {/* SECTION 4 - MENTAL WELLNESS */}
        <section className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#64748B] pl-2 border-l-4 border-[#A78BFA]">Mental Wellness</h3>
          <div className="bg-gradient-to-br from-[#F8FAFC] to-white rounded-[32px] p-8 shadow-sm border border-gray-50">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
               <div className="space-y-6">
                 <h4 className="text-2xl font-bold text-[#0F172A]">Cognitive Focus</h4>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Stress Level</span>
                     <p className="text-xl font-bold text-[#34D399] mt-1">Low</p>
                   </div>
                   <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Focus Capacity</span>
                     <p className="text-xl font-bold text-[#818CF8] mt-1">Optimal</p>
                   </div>
                 </div>
                 <p className="text-sm text-[#475569] leading-relaxed">
                   Your emotional wellness is peaking. Burnout risk is exceptionally low. This is an ideal state for deep work and demanding mental tasks.
                 </p>
               </div>
               
               <div className="flex flex-col gap-4">
                 <button 
                   onClick={() => navigate('/mental-wellness')}
                   className="w-full py-5 bg-[#EEF2FF] rounded-[24px] text-[#818CF8] font-bold text-sm shadow-sm hover:bg-[#E0E7FF] transition-colors flex items-center justify-center gap-3"
                 >
                   <Moon size={20} />
                   Start Evening Wind-Down
                 </button>
                 <button 
                   onClick={() => navigate('/mental-wellness')}
                   className="w-full py-5 bg-white rounded-[24px] text-[#0F172A] font-bold text-sm shadow-sm hover:shadow-md border border-gray-100 transition-all flex items-center justify-center gap-3"
                 >
                   <Zap size={20} />
                   5-Min Focus Breathing
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
              <div className="relative h-56 w-full bg-gray-900">
                 <img src={activeExercise.img} alt={activeExercise.title} className="w-full h-full object-cover opacity-70" />
                 <button onClick={() => setActiveExercise(null)} className="absolute top-6 right-6 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors">
                    <X size={20} />
                 </button>
                 <div className="absolute bottom-6 left-8">
                    <span className="text-[10px] font-black tracking-widest text-white bg-[#818CF8] px-3 py-1 rounded-full uppercase">{activeExercise.type}</span>
                    <h2 className="text-3xl font-bold text-white mt-2">{activeExercise.title}</h2>
                 </div>
              </div>
              
              <div className="p-8 space-y-6">
                 <div className="flex gap-6 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2">
                       <Timer size={20} className="text-[#64748B]" />
                       <span className="text-sm font-bold text-[#0F172A]">{activeExercise.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Flame size={20} className="text-orange-400" />
                       <span className="text-sm font-bold text-[#0F172A]">Estimated 300-400 kcal</span>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <h4 className="font-bold text-[#0F172A]">Exercise Routine Overview</h4>
                    <div className="space-y-3">
                       {[
                         'Warm up and mobility drills (5 mins)',
                         'Primary lift set (15 mins)',
                         'Accessory movements (20 mins)',
                         'Cooldown and static stretches (5 mins)'
                       ].map((step, i) => (
                         <div key={i} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-gray-50">
                            <div className="w-6 h-6 rounded-full bg-[#818CF8]/10 text-[#818CF8] flex items-center justify-center text-xs font-bold">{i+1}</div>
                            <span className="text-sm font-medium text-[#475569]">{step}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 
                 <button className="w-full py-4 bg-[#0F172A] text-white rounded-[20px] font-bold shadow-lg flex items-center justify-center gap-3 hover:scale-[1.01] transition-all">
                    <Play size={18} fill="currentColor" /> Start Workout Session
                 </button>
              </div>
            </motion.div>
          </div>
        )}

        {showBreathing && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0F172A]/95 backdrop-blur-lg">
             <button onClick={() => setShowBreathing(false)} className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <X size={24} />
             </button>
             
             <div className="text-center flex flex-col items-center gap-12">
                <div className="space-y-2">
                   <h2 className="text-white text-3xl font-bold tracking-tight">Focused Resonance</h2>
                   <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Inhale, Hold, Exhale</p>
                </div>
                
                <motion.div 
                  animate={{ scale: [1, 1.6, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="w-40 h-40 rounded-full bg-gradient-to-br from-[#818CF8] to-[#60A5FA] relative flex items-center justify-center shadow-[0_0_80px_rgba(96,165,250,0.4)]"
                >
                   <Wind size={48} className="text-white" />
                   <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                </motion.div>
                
                <div className="max-w-sm text-center text-gray-300 font-medium px-6 text-lg leading-relaxed">
                   Match your breathing to the circle's rhythm. Deep, slow cycles to deactivate cortisol production.
                </div>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
