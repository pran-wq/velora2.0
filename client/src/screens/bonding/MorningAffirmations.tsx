import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, Heart, Share2, RefreshCcw } from 'lucide-react';

export default function MorningAffirmations() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const affirmations = [
    { text: "My body is a powerful vessel of creation, adapting perfectly to every change.", color: "from-pink-100 to-rose-50" },
    { text: "I am connected to my baby through love, calm, and strength.", color: "from-amber-50 to-orange-50" },
    { text: "Every breath I take nourishes me and my little one with peace.", color: "from-blue-50 to-cyan-50" },
    { text: "I trust my intuition and the natural rhythm of my journey.", color: "from-purple-50 to-indigo-50" },
    { text: "I am surrounded by support, wisdom, and infinite love.", color: "from-emerald-50 to-teal-50" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#2E2528] p-6 md:p-10 pb-32 flex flex-col items-center">
      
      <div className="w-full max-w-2xl flex items-center justify-between mb-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-amber-500 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
           <h1 className="text-2xl font-display font-bold">Daily Affirmations</h1>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Mindset for two</p>
        </div>
        <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
          <Share2 size={20} />
        </button>
      </div>

      <div className="relative w-full max-w-md aspect-[3/4] flex items-center justify-center">
         <AnimatePresence mode="wait">
           <motion.div
             key={index}
             initial={{ opacity: 0, scale: 0.9, y: 20, rotate: -2 }}
             animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
             exit={{ opacity: 0, scale: 1.1, y: -20, rotate: 2 }}
             transition={{ type: 'spring', damping: 20, stiffness: 100 }}
             className={`absolute inset-0 bg-gradient-to-br ${affirmations[index].color} rounded-[3rem] p-12 flex flex-col items-center justify-center text-center shadow-xl border border-white/50`}
           >
              <div className="w-20 h-20 bg-white/40 rounded-full flex items-center justify-center mb-10">
                 <Sparkles size={40} className="text-amber-500" />
              </div>
              <p className="text-2xl md:text-3xl font-display font-medium leading-tight text-gray-800 italic">
                "{affirmations[index].text}"
              </p>
              <div className="mt-12">
                 <Heart size={24} className="text-rose-400 opacity-30" />
              </div>
           </motion.div>
         </AnimatePresence>
      </div>

      <div className="mt-20 flex gap-6">
         <button 
           onClick={() => setIndex(prev => (prev + 1) % affirmations.length)}
           className="px-10 py-5 bg-[#2E2528] text-white font-black rounded-3xl text-[13px] shadow-xl hover:scale-105 transition-all flex items-center gap-3"
         >
           <RefreshCcw size={18} /> Next Affirmation
         </button>
      </div>

      <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Take a deep breath</p>

    </div>
  );
}
