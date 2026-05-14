import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Wind, Moon, Brain, Play, X, Music, 
  Sparkles, Heart, Zap, Smile, MessageSquare, 
  CloudRain, Sun, Stars, Mic
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const card = "bg-white/90 backdrop-blur-md rounded-[32px] border border-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6";
const sectionTitle = "text-[12px] font-black tracking-[0.2em] uppercase text-[#7A6B80] mb-6";

export default function MentalWellness() {
  const navigate = useNavigate();
  const { profile } = useApp();
  const [sessionActive, setSessionActive] = useState<'breathing' | 'meditation' | 'chat' | null>(null);
  const [breatheText, setBreatheText] = useState('Inhale');
  const [mood, setMood] = useState<number | null>(null);

  const isFemale = profile?.gender?.toLowerCase() === 'female';
  const isPregnant = isFemale && profile?.isPregnant;
  const accent = isPregnant ? '#FF8BA7' : isFemale ? '#FC7A8B' : '#6366F1';

  useEffect(() => {
    if (sessionActive === 'breathing') {
      let tick = 0;
      const cycle = setInterval(() => {
         tick = (tick + 1) % 3;
         if (tick === 0) setBreatheText('Inhale');
         if (tick === 1) setBreatheText('Hold');
         if (tick === 2) setBreatheText('Exhale');
      }, 4000);
      return () => clearInterval(cycle);
    }
  }, [sessionActive]);

  const meditationTracks = [
    { title: 'Morning Clarity', duration: '10 min', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50', category: 'Energy' },
    { title: 'Cycle Syncing Calm', duration: '15 min', icon: Sparkles, color: 'text-rose-500', bg: 'bg-rose-50', category: 'Hormonal' },
    { title: 'Anxiety Release', duration: '12 min', icon: Wind, color: 'text-indigo-500', bg: 'bg-indigo-50', category: 'Relief' },
    { title: 'Deep Rest Journey', duration: '25 min', icon: Moon, color: 'text-purple-500', bg: 'bg-purple-50', category: 'Sleep' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#FFF5F8] to-[#FDF8FF] font-sans text-[#1E1428] p-4 md:p-8 pb-32">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#7A6B80] border border-white hover:shadow-md transition">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-[28px] font-black text-[#1E1428] tracking-tighter leading-tight">Mind & Clarity</h1>
              <p className="text-[13px] text-[#9E8EA6] font-semibold tracking-wide uppercase">Restore Emotional Equilibrium</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-2xl bg-white border border-white flex items-center justify-center text-purple-500 shadow-sm">
              <Mic size={20} />
            </button>
            <button onClick={() => setSessionActive('chat')} className="px-5 py-3 bg-[#1E1428] text-white rounded-2xl text-[13px] font-bold shadow-lg flex items-center gap-2">
              <MessageSquare size={16} /> AI Chat
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="flex flex-col gap-8">
            
            {/* BREATHING HERO */}
            <div className="relative bg-gradient-to-br from-[#1E1428] to-[#3B2A50] rounded-[48px] p-10 text-white overflow-hidden shadow-2xl shadow-purple-200 group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl -ml-10 -mb-10" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-[11px] font-black tracking-widest uppercase mb-4 border border-white/10">Nervous System Reset</span>
                  <h2 className="text-4xl font-black mb-4 tracking-tight">Coherent Breathing</h2>
                  <p className="text-white/60 text-[15px] font-medium leading-relaxed max-w-sm mb-8">
                    Guided rhythmic pacing (4-4-4) to lower cortisol levels and harmonize your heart rate variability.
                  </p>
                  <button 
                    onClick={() => setSessionActive('breathing')}
                    className="px-10 py-5 bg-white text-[#1E1428] font-black rounded-3xl text-[15px] shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                  >
                    <Play size={20} fill="currentColor" /> Start 5-Min Session
                  </button>
                </div>
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse" />
                  <div className="absolute inset-4 bg-white/5 rounded-full animate-pulse delay-75" />
                  <Wind size={64} className="text-white/20" />
                </div>
              </div>
            </div>

            {/* MEDITATION GRID */}
            <section>
              <p className={sectionTitle}>Curated Meditations</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meditationTracks.map((track, i) => (
                  <button 
                    key={i}
                    onClick={() => setSessionActive('meditation')}
                    className={cn(card, "flex items-center justify-between group hover:border-purple-200 transition-all text-left")}
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", track.bg, track.color)}>
                        <track.icon size={28} />
                      </div>
                      <div>
                        <p className={cn("text-[10px] font-black uppercase tracking-widest mb-0.5", track.color)}>{track.category}</p>
                        <h4 className="text-[17px] font-bold text-[#1E1428]">{track.title}</h4>
                        <p className="text-[12px] text-[#9E8EA6] font-semibold">{track.duration}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#C4BAC9] group-hover:bg-purple-500 group-hover:text-white transition-all">
                      <Play size={14} fill="currentColor" className="ml-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* SIDEBAR */}
          <div className="flex flex-col gap-6">
            
            {/* MOOD TRACKER */}
            <div className={card}>
              <p className={sectionTitle}>How are you feeling?</p>
              <div className="flex justify-between mb-8">
                {['😔','😐','🙂','😊','🤩'].map((m, i) => (
                  <button key={i} onClick={() => setMood(i)}
                    className={cn("text-3xl transition-all", mood === i ? "scale-150 filter drop-shadow-lg" : "opacity-40 hover:opacity-100 hover:scale-110")}>
                    {m}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-[13px] font-bold text-[#1E1428]">Current Resilience Score: 78</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-400" style={{ width: '78%' }} />
                </div>
                <p className="text-[11px] text-[#7A6B80] font-medium leading-relaxed">
                  Your mood has been consistent this week. Luteal phase sensitivity is well-managed.
                </p>
              </div>
            </div>

            {/* CYCLE SYNCING INSIGHT */}
            <div className={cn(card, "bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100")}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-sm">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-[15px] font-bold text-[#1E1428]">Cycle Mindset</h3>
              </div>
              <p className="text-[12px] text-[#7A6B80] font-medium leading-relaxed mb-4">
                During your **Luteal Phase**, your brain shifts towards reflection and introspection. It's the perfect time for deep work, finishing tasks, and nesting.
              </p>
              <div className="p-3 bg-white/60 rounded-xl border border-rose-100/50">
                <p className="text-[11px] font-bold text-rose-600 uppercase tracking-widest mb-1">Today's Focus</p>
                <p className="text-[12px] font-bold text-[#1E1428]">Introspective Journaling</p>
              </div>
            </div>

            {/* AI COMPANION */}
            <div className={cn(card, "bg-[#1E1428] text-white overflow-hidden border-none")}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Brain size={18} className="text-purple-400" />
                </div>
                <h3 className="text-[15px] font-bold">Emotional Support AI</h3>
              </div>
              <p className="text-[12px] text-white/60 font-medium leading-relaxed mb-6 relative z-10">
                "I noticed your stress levels were slightly elevated last night. Would you like to try a calming session together?"
              </p>
              <button className="w-full py-3.5 bg-purple-600 text-white font-bold text-[13px] rounded-2xl hover:bg-purple-700 transition relative z-10">
                Talk to Aether
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* IMMERSIVE SESSION OVERLAY */}
      <AnimatePresence>
        {sessionActive && sessionActive !== 'chat' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0F172A] flex flex-col items-center justify-center"
          >
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
               <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[150px]" />
               <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[150px]" />
            </div>

            <button onClick={() => setSessionActive(null)} className="absolute top-10 right-10 text-white/40 hover:text-white w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 transition-all">
              <X size={24} />
            </button>

            {sessionActive === 'breathing' ? (
              <div className="text-center flex flex-col items-center relative z-10">
                <motion.div 
                  animate={{ scale: breatheText === 'Inhale' ? 1.6 : breatheText === 'Hold' ? 1.6 : 0.8 }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="w-56 h-56 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_100px_rgba(124,58,237,0.4)]"
                >
                  <Wind className="text-white" size={64} />
                </motion.div>
                <motion.h2 
                  key={breatheText}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-[64px] font-black text-white mt-16 tracking-tighter"
                >
                  {breatheText}
                </motion.h2>
                <p className="text-white/40 font-bold uppercase tracking-[0.4em] mt-4">5 Minutes Remaining</p>
              </div>
            ) : (
              <div className="text-center relative z-10 px-6 max-w-md">
                <div className="w-40 h-40 mx-auto bg-white/5 rounded-[48px] flex items-center justify-center mb-12 border border-white/10 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 animate-pulse" />
                   <Moon size={64} className="text-purple-300 relative z-10" />
                </div>
                <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Immersive Meditation</h2>
                <p className="text-white/60 text-lg font-medium leading-relaxed mb-12">Close your eyes. Let your body dissolve into the soundscape. Breathe as one with the rhythm.</p>
                <div className="flex justify-center gap-6">
                   <button className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition"><Zap size={24}/></button>
                   <button className="w-20 h-20 rounded-full bg-white text-[#1E1428] flex items-center justify-center shadow-2xl hover:scale-105 transition"><Play size={28} fill="currentColor" /></button>
                   <button className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition"><Stars size={24}/></button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
