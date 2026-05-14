import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Wind, Play, Pause, X, Stars } from 'lucide-react';

export default function GuidedMeditation() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [breatheText, setBreatheText] = useState('Inhale');

  useEffect(() => {
    if (isPlaying) {
      let tick = 0;
      const cycle = setInterval(() => {
         tick = (tick + 1) % 3;
         if (tick === 0) setBreatheText('Inhale');
         if (tick === 1) setBreatheText('Hold');
         if (tick === 2) setBreatheText('Exhale');
      }, 4000);
      return () => clearInterval(cycle);
    }
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans text-white p-6 md:p-10 flex flex-col items-center justify-center overflow-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.2, 0.4, 0.2]
           }}
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[150px]" 
         />
         <motion.div 
           animate={{ 
             scale: [1.2, 1, 1.2],
             opacity: [0.3, 0.5, 0.3]
           }}
           transition={{ duration: 12, repeat: Infinity }}
           className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[150px]" 
         />
      </div>

      <button 
        onClick={() => navigate(-1)}
        className="absolute top-10 right-10 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all z-50"
      >
        <X size={24} />
      </button>

      <div className="relative z-10 text-center space-y-20 max-w-lg">
        
        {!isPlaying ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
             <div className="w-32 h-32 mx-auto bg-white/5 rounded-[40px] flex items-center justify-center border border-white/10">
                <Wind size={56} className="text-purple-400" />
             </div>
             <div>
                <h1 className="text-4xl font-black tracking-tight mb-4">Mindful Connection</h1>
                <p className="text-white/40 text-lg font-medium leading-relaxed">
                  A 10-minute guided session to synchronize your breath with your baby's rhythm.
                </p>
             </div>
             <button 
               onClick={() => setIsPlaying(true)}
               className="px-12 py-6 bg-white text-[#0F172A] font-black rounded-[2rem] text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-4 mx-auto"
             >
               <Play size={24} fill="currentColor" /> Start Session
             </button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
             <motion.div 
               animate={{ 
                 scale: breatheText === 'Inhale' ? 1.8 : breatheText === 'Hold' ? 1.8 : 0.8,
                 rotate: 360
               }}
               transition={{ 
                 scale: { duration: 4, ease: "easeInOut" },
                 rotate: { duration: 20, repeat: Infinity, ease: "linear" }
               }}
               className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_120px_rgba(124,58,237,0.5)] relative"
             >
                <div className="absolute inset-2 border-2 border-white/20 rounded-full border-dashed" />
                <Stars size={40} className="text-white" />
             </motion.div>

             <AnimatePresence mode="wait">
               <motion.h2 
                 key={breatheText}
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 1.2 }}
                 className="text-[80px] font-black mt-24 tracking-tighter"
               >
                 {breatheText}
               </motion.h2>
             </AnimatePresence>

             <div className="mt-10 flex items-center gap-4 text-white/40 uppercase tracking-[0.5em] text-[10px] font-black">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                <span>Deep Beta Waves Active</span>
             </div>

             <button 
               onClick={() => setIsPlaying(false)}
               className="mt-20 text-white/20 hover:text-white/60 transition-colors uppercase tracking-[0.3em] text-[10px] font-bold"
             >
               End Session
             </button>
          </div>
        )}

      </div>
    </div>
  );
}
