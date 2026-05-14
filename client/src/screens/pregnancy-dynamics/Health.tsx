import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/Common';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Droplets, Moon, Utensils, Camera, Activity, 
  ShieldAlert, Dumbbell, Play, Plus, Clock, Baby, Scale,
  Music, Wind, Brain, Target, MessageSquare, BookOpen, Calendar, Sparkles,
  ChevronRight, Info, Check, Footprints, X, CheckCircle2, History, ScanLine,
  Phone, Shield, QrCode, Lock, ArrowRight, Pill
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function PregnancyHealth() {
  const navigate = useNavigate();
  const { profile } = useApp();
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Fatigue']);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isEditingRoutine, setIsEditingRoutine] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState<string[]>(['Prenatal Yoga', 'Talking with Baby', 'Vitamins']);

  if (!profile || !profile.isPregnant) return null;

  const accent = '#FF8BA7';
  const textDark = '#2E2528';

  const vitals = [
    { label: 'Blood Pressure', val: '118/76', icon: Heart, color: '#EF4444', bg: 'bg-red-50' },
    { label: 'Weight', val: '56.8kg', icon: Scale, color: '#2D8C63', bg: 'bg-green-50' },
    { label: 'Sleep', val: '7h 20m', icon: Moon, color: '#8B5CF6', bg: 'bg-purple-50' },
    { label: 'Water', val: '6/8 Glass', icon: Droplets, color: '#06B6D4', bg: 'bg-cyan-50' },
    { label: 'Activity', val: '4,250', icon: Activity, color: '#F59E0B', bg: 'bg-orange-50' },
  ];

  const prenatalExercises = [
    { 
      name: 'Prenatal Yoga', 
      duration: '20 min', 
      type: 'Flexibility', 
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
      content: "Prenatal yoga is designed specifically for pregnant bodies. It focuses on gentle stretching, mental centering, and breathwork to help prepare you for childbirth and improve overall flexibility.",
      tips: [
        "Focus on pelvic floor strengthening through gentle poses.",
        "Avoid any poses that require lying flat on your back after the first trimester.",
        "Always use a yoga block or pillow for extra support and balance."
      ]
    },
    { 
      name: 'Kegel Exercises', 
      duration: '10 min', 
      type: 'Strength', 
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400',
      content: "Kegels strengthen the pelvic floor muscles, which support the uterus, bladder, and bowels. Regularly performing Kegels can help reduce the risk of incontinence and make labor easier.",
      tips: [
        "Identify the right muscles by trying to stop urine flow mid-stream.",
        "Squeeze for 3-5 seconds, then relax for the same duration.",
        "Aim for 3 sets of 10-15 repetitions every day."
      ]
    },
    { 
      name: 'Trimester Walking', 
      duration: '30 min', 
      type: 'Cardio', 
      img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=400',
      content: "Walking is one of the safest and most effective forms of cardio during pregnancy. It keeps your heart healthy, builds endurance for labor, and can help manage weight gain and mood swings.",
      tips: [
        "Wear supportive, comfortable footwear with good arch support.",
        "Walk at a pace where you can still hold a conversation (the 'talk test').",
        "Stay hydrated and avoid walking in extreme heat or humidity."
      ]
    },
  ];

  const bondingActivities = [
    { 
      name: 'Talking with Baby', 
      desc: 'Bond through voice.', 
      icon: MessageSquare, 
      color: 'text-pink-500', 
      bg: 'bg-pink-50',
      content: "Babies can begin to recognize voices around Week 18. Talking, reading, or singing to your baby creates a powerful emotional connection and can even soothe them after they are born.",
      tips: [
        "Read a story or talk about your day for 10 minutes every evening.",
        "Encourage your partner to talk to the bump so the baby learns their voice too.",
        "Use a gentle, melodic tone—your baby responds best to soothing sounds."
      ]
    },
    { 
      name: 'Relaxation Music', 
      desc: 'Soothing baby sounds.', 
      icon: Music, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      content: "Melodic and low-tempo music can have a calming effect on both you and your baby. It helps regulate your stress hormones, which directly impacts the baby's environment.",
      tips: [
        "Choose classical music or soft nature sounds (under 65 decibels).",
        "Avoid placing headphones directly on your belly—the amniotic fluid amplifies sound.",
        "Use music as a signal for 'quiet time' to establish a routine."
      ]
    },
    { 
      name: 'Morning Affirmations', 
      desc: 'Positive maternal mindset.', 
      icon: Sparkles, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50',
      content: "Maintaining a positive mindset is vital for maternal health. Morning affirmations help reduce anxiety and build confidence as you prepare for motherhood.",
      tips: [
        "Repeat: 'My body is strong and capable of nourishing my baby.'",
        "Focus on one positive thought as you place your hands on your bump.",
        "Keep a gratitude journal for small wins during your pregnancy."
      ]
    },
    { 
      name: 'Guided Meditation', 
      desc: 'Mindful connection.', 
      icon: Brain, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50',
      content: "Guided meditation helps you navigate the hormonal and physical changes of pregnancy. It teaches you to stay present and connected to your baby's movements.",
      tips: [
        "Practice deep diaphragmatic breathing to oxygenate your blood.",
        "Visualize your baby in a peaceful, healthy environment.",
        "Start with just 5 minutes a day and gradually increase."
      ]
    },
  ];

  const guidanceArticles = [
    { 
      title: 'What to eat in Week 18', 
      type: 'Nutrition', 
      readTime: '3 min', 
      img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400',
      content: "As you reach Week 18, your baby's bones are beginning to harden. This is a critical window for calcium and Vitamin D intake. Your appetite might be increasing, so focusing on nutrient-dense snacks is key to maintaining stable energy levels.",
      tips: [
        "Increase calcium intake through dairy or fortified plant milks.",
        "Include lean proteins like lentils or chicken for tissue growth.",
        "Focus on healthy fats (Omega-3) for baby's brain development."
      ]
    },
    { 
      title: 'Safe Sleeping Positions', 
      type: 'Sleep', 
      readTime: '5 min', 
      img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=400',
      content: "As your bump grows, finding a comfortable position becomes harder. Experts recommend sleeping on your side (especially the left side) to optimize blood flow to the placenta and kidneys.",
      tips: [
        "Use a full-body pregnancy pillow for spinal alignment.",
        "Place a pillow between your knees to relieve hip pressure.",
        "Avoid sleeping on your back to prevent vena cava compression."
      ]
    },
    { 
      title: 'Bonding with your bump', 
      type: 'Bonding', 
      readTime: '4 min', 
      img: 'https://images.unsplash.com/photo-1555243896-c709bfa0b564?auto=format&fit=crop&q=80&w=400',
      content: "By Week 18, your baby can start to hear sounds. This is a wonderful time to start building a connection through voice, music, and gentle touch.",
      tips: [
        "Talk or sing to your baby daily—they will recognize your voice at birth.",
        "Play soft, melodic music to create a soothing environment.",
        "Practice mindful breathing while placing your hands on your belly."
      ]
    },
  ];

  return (
    <div className="flex flex-col gap-10 pt-10 px-6 md:px-10 pb-32 overflow-y-auto no-scrollbar h-full max-w-[1400px] mx-auto bg-[#FFF5F7]">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: accent }}>Holistic Wellness Ecosystem</h2>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter" style={{ color: textDark }}>
            Wellness Hub
          </h1>
        </div>
      </header>

      {/* SECTION A - VITALS */}
      <section className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {vitals.map((v, i) => (
            <GlassCard key={i} className="p-6 flex flex-col items-center justify-center gap-3 bg-white border-none shadow-sm hover:shadow-md transition-all">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", v.bg)} style={{ color: v.color }}>
                <v.icon size={22} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#2E2528]">{v.val}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">{v.label}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* DAILY PROTOCOL CHECKLIST (NEW) */}
      <section className="space-y-6">
        <div className="flex justify-between items-end px-2">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Daily Protocol Checklist</h3>
           <span className="text-[10px] font-bold text-[#FF8BA7] uppercase tracking-widest">{activeRoutine.length} Tasks Scheduled</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeRoutine.map((id) => {
            const allItems = [...prenatalExercises.map(e => ({...e, id: e.name})), ...bondingActivities.map(a => ({...a, id: a.name}))];
            const raw = allItems.find(i => i.id === id);
            const item =
              raw && 'icon' in raw && 'bg' in raw && 'color' in raw
                ? raw
                : {
                    id,
                    icon: CheckCircle2,
                    color: 'text-rose-500',
                    bg: 'bg-rose-50',
                    content: 'Detailed guidance for this ritual will be generated based on your trimester.',
                    tips: ['Stay consistent with your daily rituals.', 'Consult your clinician for personalized adjustments.'],
                  };

            const Icon = item.icon;

            return (
              <GlassCard 
                key={id}
                onClick={() => setSelectedItem(item)}
                className="p-5 bg-white border-none shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-md transition-all !rounded-[2rem]"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bg, item.color)}>
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-bold text-[#2E2528] group-hover:text-[#FF8BA7] transition-colors">{id}</span>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-rose-100 flex items-center justify-center text-rose-500 group-hover:bg-rose-50 transition-all">
                  <Check size={14} strokeWidth={3} />
                </div>
              </GlassCard>
            );
          })}
          {activeRoutine.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-rose-100">
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No Active Protocol</p>
               <button onClick={() => setIsEditingRoutine(true)} className="mt-4 text-xs font-black text-[#FF8BA7] uppercase tracking-widest hover:underline">Setup Daily Rituals</button>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* BABY BONDING (EMOTIONAL CARE) */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Emotional Bonding & Calm</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bondingActivities.map((act, i) => (
                <GlassCard 
                  key={i} 
                  onClick={() => setSelectedItem({ ...act, type: 'Bonding' })}
                  className="p-8 flex items-center gap-6 bg-white border-none shadow-sm hover:bg-[#FFF5F2] transition-colors cursor-pointer group !rounded-[2.5rem] hover:shadow-md active:scale-[0.98]"
                >
                  <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-sm", act.bg, act.color)}>
                    <act.icon size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#2E2528] tracking-tight group-hover:text-[#FF8BA7] transition-colors">{act.name}</h4>
                    <p className="text-xs font-medium text-gray-400 mt-1 leading-relaxed">{act.desc}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* PRENATAL EXERCISE */}
          <section className="space-y-6">
            <div className="flex justify-between items-end px-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Prenatal Wellness Activities</h3>
              <button 
                onClick={() => navigate('/workouts')}
                className="text-xs font-bold text-[#FF8BA7] hover:underline"
              >
                View Routines
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {prenatalExercises.map((ex, i) => (
                <GlassCard 
                  key={i} 
                  onClick={() => setSelectedItem(ex)}
                  className="group relative overflow-hidden !rounded-[2.5rem] bg-white border-none shadow-sm hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img src={ex.img} alt={ex.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{ex.type}</p>
                      <div className="flex items-center justify-between mt-1">
                        <h4 className="text-lg font-bold">{ex.name}</h4>
                        <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform" />
                      </div>
                      <p className="text-xs font-medium opacity-80 mt-1">{ex.duration}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* SYSTEMIC HEALTH SCAN (NEW) */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Systemic Health Scan</h3>
            <GlassCard className="p-8 bg-white border-none shadow-sm !rounded-[3rem] space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { label: 'Respiratory Rate', val: '14 rpm', status: 'Optimal', sub: 'Baseline: 12-16', color: '#06B6D4' },
                   { label: 'Glucose (Fasting)', val: '92 mg/dL', status: 'Stable', sub: 'Baseline: <95', color: '#FF8BA7' },
                   { label: 'SpO2 Level', val: '98%', status: 'Healthy', sub: 'Baseline: >95%', color: '#8B5CF6' }
                 ].map((v, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between items-center">
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{v.label}</p>
                         <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-gray-50" style={{ color: v.color }}>{v.status}</span>
                      </div>
                      <h4 className="text-2xl font-bold text-[#2E2528]">{v.val}</h4>
                      <p className="text-[9px] font-medium text-gray-300">{v.sub}</p>
                      <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                         <div className="h-full bg-current" style={{ width: '85%', color: v.color }} />
                      </div>
                   </div>
                 ))}
              </div>
            </GlassCard>
          </section>

          {/* HOLISTIC WELLNESS ACTIVITIES (ARTICLES + GUIDANCE) */}
          <section className="space-y-6">
            <div className="flex justify-between items-end px-2">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Holistic Wellness Articles</h3>
               <button 
                 onClick={() => navigate('/insights')}
                 className="text-xs font-bold text-[#FF8BA7] hover:underline"
               >
                 View Feed
               </button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {guidanceArticles.map((art, i) => (
                 <GlassCard 
                   key={i} 
                   onClick={() => setSelectedItem(art)}
                   className="p-4 bg-white border-none shadow-sm space-y-4 !rounded-[2rem] hover:shadow-lg transition-all cursor-pointer"
                 >
                   <div className="aspect-video rounded-2xl overflow-hidden">
                     <img src={art.img} alt={art.title} className="w-full h-full object-cover" />
                   </div>
                   <div className="px-2">
                     <span className="text-[9px] font-black uppercase tracking-widest text-[#FF8BA7]">{art.type}</span>
                     <h4 className="text-sm font-bold text-gray-800 mt-1 line-clamp-2">{art.title}</h4>
                     <p className="text-[9px] font-bold text-gray-400 uppercase mt-2">{art.readTime} read</p>
                   </div>
                 </GlassCard>
               ))}
             </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-10">
          

          {/* SYMPTOM TRACKER */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Maternal Symptoms</h3>
            <GlassCard className="p-8 bg-white border-none shadow-sm space-y-6 !rounded-[3rem]">
              <div className="flex flex-wrap gap-2">
                {['Nausea', 'Cravings', 'Swelling', 'Fatigue', 'Contractions', 'Mood'].map((sym, i) => {
                  const isActive = selectedSymptoms.includes(sym);
                  return (
                    <button 
                      key={i} 
                      onClick={() => setSelectedSymptoms(prev => 
                        isActive ? prev.filter(s => s !== sym) : [...prev, sym]
                      )}
                      className={cn(
                        "px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                        isActive ? "bg-[#FF8BA7] text-white shadow-md shadow-[#FF8BA7]/20" : "bg-[#FFF5F2] text-[#8A7B81] hover:bg-[#FF8BA7]/10"
                      )}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">
                  Daily Tip: Side sleeping with a pillow can reduce back pain and swelling.
                </p>
              </div>
            </GlassCard>
          </section>

          {/* ROUTINE PLANNER BUTTON */}
          <GlassCard className="p-8 bg-[#2E2528] text-white !rounded-[3rem] space-y-4">
             <div className="flex items-center gap-3">
                <BookOpen size={24} className="text-[#FF8BA7]" />
                <h4 className="text-lg font-bold">Maternal Routine</h4>
             </div>
             <p className="text-xs text-white/60 leading-relaxed">Plan your prenatal vitamins, yoga sessions, and bonding time.</p>
             <button 
               onClick={() => setIsEditingRoutine(true)}
               className="w-full py-4 bg-white text-[#2E2528] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF8BA7] hover:text-white transition-all active:scale-95"
             >
                Edit Routine
             </button>
          </GlassCard>

        </div>
      </div>

      {/* INFORMATION MODAL */}
      <AnimatePresence>
        {selectedItem && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-[10000]"
            >
              {selectedItem.img && (
                <div className="h-64 relative">
                  <img src={selectedItem.img} alt={selectedItem.title || selectedItem.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>
              )}
              
              <div className="p-10 pt-8 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", selectedItem.bg || 'bg-rose-50', selectedItem.color || 'text-[#FF8BA7]')}>
                      {selectedItem.icon ? <selectedItem.icon size={28} /> : <Info size={28} />}
                    </div>
                    <div>
                      <h3 className="text-3xl font-display font-bold text-[#2E2528] tracking-tight">{selectedItem.title || selectedItem.name || selectedItem.id}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#FF8BA7] mt-1">{selectedItem.type || 'Maternal Insight'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="w-12 h-12 bg-gray-50 hover:bg-rose-50 rounded-full flex items-center justify-center transition-all group"
                  >
                    <X size={20} className="text-gray-400 group-hover:text-[#FF8BA7] transition-colors" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300">Clinical Guidance</h4>
                    <p className="text-base text-[#2E2528] leading-relaxed font-medium">
                      {selectedItem.content || 'This daily ritual is optimized for your current trimester to ensure both maternal and fetal wellness. Consistently following this protocol supports hormonal balance and physiological adaptation.'}
                    </p>
                  </div>

                  {selectedItem.tips && (
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300">Aether Expert Tips</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedItem.tips.map((tip: string, i: number) => (
                          <div key={i} className="p-5 bg-rose-50/30 rounded-2xl border border-rose-100/50 flex items-start gap-4">
                            <div className="w-6 h-6 rounded-full bg-[#FF8BA7] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-sm font-bold text-[#2E2528] leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-gray-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified Protocol</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Safe for Trimester 2</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 pt-0">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-6 bg-[#2E2528] text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-[#FF8BA7] transition-all active:scale-95"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>

      {/* EDIT ROUTINE MODAL */}
      {isEditingRoutine && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditingRoutine(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-[10000]"
          >
             {/* Header */}
             <div className="p-10 pb-6 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#FF8BA7] flex items-center justify-center shadow-inner">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-[#2E2528] tracking-tight">Daily Protocol</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Week 18 Lifecycle</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditingRoutine(false)}
                  className="w-12 h-12 bg-gray-50 hover:bg-rose-50 rounded-full flex items-center justify-center transition-all group"
                >
                  <X className="text-gray-400 group-hover:text-[#FF8BA7]" size={24} />
                </button>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-12">
                
                {/* Movement Section */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF8BA7]">Active Movement</h4>
                      <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest">Select Daily Focus</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'Prenatal Yoga', icon: Wind, color: 'text-rose-500', bg: 'bg-rose-50' },
                        { id: 'Evening Walk', icon: Footprints, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { id: 'Pelvic Floor', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { id: 'Swim Session', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50' },
                      ].map(item => (
                        <button 
                          key={item.id}
                          onClick={() => setActiveRoutine(prev => 
                            prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
                          )}
                          className={cn(
                            "p-5 rounded-[2rem] border-2 transition-all text-left flex items-center justify-between group",
                            activeRoutine.includes(item.id) ? "border-[#FF8BA7] bg-rose-50/20" : "border-gray-50 bg-gray-50/30 hover:border-rose-100"
                          )}
                        >
                           <div className="flex items-center gap-4">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", item.bg, item.color)}>
                                 <item.icon size={20} />
                              </div>
                              <span className="text-sm font-bold text-[#2E2528] group-hover:text-[#FF8BA7] transition-colors">{item.id}</span>
                           </div>
                           <div className={cn("w-5 h-5 rounded-full flex items-center justify-center transition-all", activeRoutine.includes(item.id) ? "bg-[#FF8BA7] text-white" : "border-2 border-gray-100")}>
                              {activeRoutine.includes(item.id) && <Check size={12} strokeWidth={4} />}
                           </div>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Emotional Section */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF8BA7]">Emotional Connection</h4>
                      <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest">Identity Building</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'Talking with Baby', icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-50' },
                        { id: 'Belly Massage', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-50' },
                        { id: 'Gratitude Journal', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50' },
                        { id: 'Lullaby Session', icon: Music, color: 'text-blue-500', bg: 'bg-blue-50' },
                      ].map(item => (
                        <button 
                          key={item.id}
                          onClick={() => setActiveRoutine(prev => 
                            prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
                          )}
                          className={cn(
                            "p-5 rounded-[2rem] border-2 transition-all text-left flex items-center justify-between group",
                            activeRoutine.includes(item.id) ? "border-[#FF8BA7] bg-rose-50/20" : "border-gray-50 bg-gray-50/30 hover:border-rose-100"
                          )}
                        >
                           <div className="flex items-center gap-4">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", item.bg, item.color)}>
                                 <item.icon size={20} />
                              </div>
                              <span className="text-sm font-bold text-[#2E2528] group-hover:text-[#FF8BA7] transition-colors">{item.id}</span>
                           </div>
                           <div className={cn("w-5 h-5 rounded-full flex items-center justify-center transition-all", activeRoutine.includes(item.id) ? "bg-[#FF8BA7] text-white" : "border-2 border-gray-100")}>
                              {activeRoutine.includes(item.id) && <Check size={12} strokeWidth={4} />}
                           </div>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Clinical Section */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF8BA7]">Clinical Rituals</h4>
                      <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest">Nourishment</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'Vitamins', icon: Target, color: 'text-rose-500', bg: 'bg-rose-50' },
                        { id: 'Hydration 2L', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { id: 'Calorie Check', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { id: 'BP Monitor', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      ].map(item => (
                        <button 
                          key={item.id}
                          onClick={() => setActiveRoutine(prev => 
                            prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
                          )}
                          className={cn(
                            "p-5 rounded-[2rem] border-2 transition-all text-left flex items-center justify-between group",
                            activeRoutine.includes(item.id) ? "border-[#FF8BA7] bg-rose-50/20" : "border-gray-50 bg-gray-50/30 hover:border-rose-100"
                          )}
                        >
                           <div className="flex items-center gap-4">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", item.bg, item.color)}>
                                 <item.icon size={20} />
                              </div>
                              <span className="text-sm font-bold text-[#2E2528] group-hover:text-[#FF8BA7] transition-colors">{item.id}</span>
                           </div>
                           <div className={cn("w-5 h-5 rounded-full flex items-center justify-center transition-all", activeRoutine.includes(item.id) ? "bg-[#FF8BA7] text-white" : "border-2 border-gray-100")}>
                              {activeRoutine.includes(item.id) && <Check size={12} strokeWidth={4} />}
                           </div>
                        </button>
                      ))}
                   </div>
                </div>

             </div>

             {/* Footer */}
             <div className="p-10 pt-6 border-t border-gray-50 flex items-center gap-4">
                <button 
                  onClick={() => setIsEditingRoutine(false)}
                  className="flex-1 py-6 bg-[#2E2528] text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-[#FF8BA7] transition-all active:scale-95"
                >
                   Lock Protocol
                </button>
             </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
