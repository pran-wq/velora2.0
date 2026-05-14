import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Flame, Waves, Sparkles, 
  Battery, Brain, Smile, Plus, 
  Check, Info, X, Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { GlassCard } from '../../components/Common';

const symptoms = [
  { id: 'cramps', label: 'Cramps', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'bloating', label: 'Bloating', icon: Waves, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'acne', label: 'Acne', icon: Sparkles, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'fatigue', label: 'Fatigue', icon: Battery, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'headache', label: 'Headache', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'mood', label: 'Mood', icon: Smile, color: 'text-pink-500', bg: 'bg-pink-50' },
];

export default function SymptomLog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSymptom = searchParams.get('type')?.toLowerCase();
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(initialSymptom ? [initialSymptom] : []);
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsSuccess(true);
    setTimeout(() => navigate(-1), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] pb-32">
      <header className="px-6 py-8 flex items-center justify-between sticky top-0 bg-[#FFF5F7]/80 backdrop-blur-md z-50">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-full shadow-sm hover:scale-105 transition-transform">
          <ArrowLeft size={20} className="text-[#1F111F]" />
        </button>
        <h1 className="text-xl font-black text-[#1F111F] uppercase tracking-widest">Symptom Log</h1>
        <div className="w-12" />
      </header>

      <main className="max-w-xl mx-auto px-6 space-y-10">
        {/* SYMPTOM SELECTION */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8E7E8E]">Select Symptoms</h3>
             <span className="text-[10px] font-black text-[#FB7185]">{selectedSymptoms.length} Selected</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {symptoms.map((s) => {
              const isActive = selectedSymptoms.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSymptom(s.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-5 rounded-[32px] border-2 transition-all group",
                    isActive ? "bg-white border-[#FB7185] shadow-lg scale-105" : "bg-white/50 border-transparent hover:border-[#FDEFF2]"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                    isActive ? cn(s.bg, s.color) : "bg-white text-gray-400 group-hover:scale-110"
                  )}>
                    <s.icon size={24} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-tighter",
                    isActive ? "text-[#1F111F]" : "text-gray-400"
                  )}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* INTENSITY SLIDER */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8E7E8E]">Intensity Level</h3>
             <span className="text-2xl font-black text-[#FB7185]">{intensity}<span className="text-xs text-gray-400 font-bold">/10</span></span>
          </div>
          <div className="relative h-12 flex items-center">
             <input 
               type="range" 
               min="1" 
               max="10" 
               value={intensity} 
               onChange={(e) => setIntensity(parseInt(e.target.value))}
               className="w-full h-2 bg-white rounded-full appearance-none cursor-pointer accent-[#FB7185]"
             />
             <div className="absolute top-8 left-0 right-0 flex justify-between px-1">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Mild</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Severe</span>
             </div>
          </div>
        </section>

        {/* NOTES SECTION */}
        <section className="space-y-6">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8E7E8E]">Notes & Observation</h3>
           <textarea 
             placeholder="How are you feeling overall?"
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             className="w-full h-32 p-6 bg-white rounded-[32px] border-none shadow-sm outline-none text-sm font-bold text-[#1F111F] placeholder:text-gray-300 resize-none focus:ring-2 focus:ring-[#FB7185]/20"
           />
        </section>

        {/* ACTION BUTTON */}
        <div className="fixed bottom-10 left-6 right-6 max-w-xl mx-auto">
          <button 
            onClick={handleSave}
            disabled={selectedSymptoms.length === 0 || isSaving || isSuccess}
            className={cn(
              "w-full py-6 rounded-[32px] font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3",
              isSuccess ? "bg-emerald-500 text-white shadow-emerald-200" :
              selectedSymptoms.length > 0 ? "bg-[#1F111F] text-white hover:scale-[1.02] active:scale-[0.98]" : 
              "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {isSaving ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSuccess ? (
              <>
                <Check size={20} strokeWidth={3} />
                <span>Log Saved Successfully</span>
              </>
            ) : (
              <span>Save Symptom Log</span>
            )}
          </button>
        </div>
      </main>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#FB7185] z-[100] flex flex-col items-center justify-center text-white"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8"
            >
               <Check size={48} strokeWidth={3} />
            </motion.div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Logged!</h2>
            <p className="text-white/80 font-bold uppercase text-xs tracking-widest">Optimizing your insights...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
