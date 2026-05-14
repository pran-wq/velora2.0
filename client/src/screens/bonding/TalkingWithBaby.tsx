import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mic, Heart, StopCircle, Play, Sparkles } from 'lucide-react';
import { GlassCard } from '../../components/Common';

export default function TalkingWithBaby() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([
    { id: 1, date: 'Today', duration: '1:24', title: 'Reading a story' },
    { id: 2, date: 'Yesterday', duration: '0:45', title: 'Morning greeting' },
  ]);

  return (
    <div className="min-h-screen bg-[#FFF5F7] font-sans text-[#2E2528] p-6 md:p-10 pb-32">
      <div className="max-w-2xl mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#FF8BA7] transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Talking with Baby</h1>
            <p className="text-xs font-black uppercase tracking-widest text-[#FF8BA7] mt-1">Bonding through resonance</p>
          </div>
        </header>

        {/* MAIN VISUALIZER */}
        <div className="relative aspect-square max-w-sm mx-auto flex items-center justify-center">
          <AnimatePresence>
            {isRecording && (
              <>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-[#FF8BA7] rounded-full"
                />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 0.2 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute inset-0 bg-[#FF8BA7] rounded-full"
                />
              </>
            )}
          </AnimatePresence>
          
          <div className="relative z-10 w-48 h-48 rounded-full bg-white shadow-2xl flex items-center justify-center border-8 border-[#FFF5F7]">
             <motion.div
               animate={{ scale: isRecording ? [1, 1.1, 1] : 1 }}
               transition={{ duration: 0.8, repeat: Infinity }}
             >
               <Heart size={64} className={isRecording ? "text-[#FF8BA7]" : "text-gray-200"} fill={isRecording ? "currentColor" : "none"} />
             </motion.div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="text-center space-y-6">
           <button 
             onClick={() => setIsRecording(!isRecording)}
             className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl shadow-[#FF8BA7]/20 mx-auto ${isRecording ? 'bg-[#2E2528] text-white scale-90' : 'bg-[#FF8BA7] text-white hover:scale-105'}`}
           >
             {isRecording ? <StopCircle size={40} /> : <Mic size={40} />}
           </button>
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
             {isRecording ? 'Recording your voice...' : 'Tap to start bonding'}
           </p>
        </div>

        {/* PREVIOUS SESSIONS */}
        <section className="space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-2">Bonding History</h3>
           <div className="space-y-3">
             {recordings.map(rec => (
               <GlassCard key={rec.id} className="p-6 bg-white border-none shadow-sm flex items-center justify-between !rounded-3xl hover:shadow-md transition-shadow">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF8BA7]">
                       <Play size={18} fill="currentColor" />
                    </div>
                    <div>
                       <h4 className="text-sm font-bold">{rec.title}</h4>
                       <p className="text-[10px] text-gray-400 font-medium">{rec.date} • {rec.duration}</p>
                    </div>
                 </div>
                 <Sparkles size={16} className="text-[#FF8BA7] opacity-40" />
               </GlassCard>
             ))}
           </div>
        </section>

      </div>
    </div>
  );
}
