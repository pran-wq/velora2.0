import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Pill, Clock, AlertCircle, 
  Check, Plus, Trash2, Calendar,
  MoreVertical, Bell, Info
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { GlassCard } from '../../components/Common';

const initialMeds = [
  { id: '1', name: 'Magnesium Glycinate', dose: '400mg', time: '9:00 PM', status: 'Taken', type: 'Supplement', refill: '12 days left' },
  { id: '2', name: 'Omega-3', dose: '1000mg', time: '8:00 AM', status: 'Taken', type: 'Supplement', refill: '24 days left' },
  { id: '3', name: 'Vitamin D3 + K2', dose: '2000IU', time: '8:00 AM', status: 'Pending', type: 'Supplement', refill: '8 days left' },
  { id: '4', name: 'Iron Bisglycinate', dose: '25mg', time: '10:00 AM', status: 'Pending', type: 'Medicine', refill: '4 days left' },
];

export default function MedicationHub() {
  const navigate = useNavigate();
  const [meds, setMeds] = useState(initialMeds);
  const [isAdding, setIsAdding] = useState(false);

  const toggleStatus = (id: string) => {
    setMeds(prev => prev.map(m => 
      m.id === id ? { ...m, status: m.status === 'Taken' ? 'Pending' : 'Taken' } : m
    ));
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] pb-32">
      <header className="px-6 py-8 flex items-center justify-between sticky top-0 bg-[#F8FBFF]/80 backdrop-blur-md z-50">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-full shadow-sm hover:scale-105 transition-transform">
          <ArrowLeft size={20} className="text-[#1F111F]" />
        </button>
        <h1 className="text-xl font-black text-[#1F111F] uppercase tracking-widest">Medication Hub</h1>
        <button className="p-3 bg-[#10B981] text-white rounded-full shadow-lg shadow-emerald-200 hover:scale-110 transition-transform">
          <Plus size={20} />
        </button>
      </header>

      <main className="max-w-xl mx-auto px-6 space-y-8">
        {/* SUMMARY CARD */}
        <div className="bg-[#1F111F] rounded-[40px] p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Pill size={120} />
           </div>
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-2">Today's Progress</p>
              <div className="flex items-baseline gap-2 mb-6">
                 <span className="text-5xl font-black italic">2<span className="text-2xl opacity-40 italic">/4</span></span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-[#10B981] w-1/2 transition-all duration-1000" />
              </div>
              <p className="text-[10px] font-bold text-white/70 mt-4 leading-relaxed">
                 You're on track! Adherence is critical for hormonal balance optimization.
              </p>
           </div>
        </div>

        {/* MEDICATION LIST */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8E7E8E] pl-2">Schedule</h3>
           {meds.map((m) => (
             <div 
               key={m.id}
               className={cn(
                 "bg-white rounded-[32px] p-6 border transition-all flex items-center justify-between group",
                 m.status === 'Taken' ? "border-emerald-100 opacity-80" : "border-[#FDEFF2] hover:border-[#10B981]/30 shadow-sm"
               )}
             >
               <div className="flex items-center gap-5">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                    m.status === 'Taken' ? "bg-emerald-50 text-[#10B981]" : "bg-gray-50 text-gray-400 group-hover:scale-110"
                  )}>
                    <Pill size={24} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-[#1F111F]">{m.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                       <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                          <Clock size={10} />
                          <span>{m.time}</span>
                       </div>
                       <div className="flex items-center gap-1 text-[9px] font-bold text-[#10B981]">
                          <AlertCircle size={10} />
                          <span>{m.refill}</span>
                       </div>
                    </div>
                  </div>
               </div>

               <button 
                 onClick={() => toggleStatus(m.id)}
                 className={cn(
                   "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm",
                   m.status === 'Taken' ? "bg-[#10B981] text-white" : "bg-white border-2 border-gray-100 text-gray-300 hover:border-[#10B981] hover:text-[#10B981]"
                 )}
               >
                 {m.status === 'Taken' ? <Check size={20} strokeWidth={3} /> : <Clock size={20} />}
               </button>
             </div>
           ))}
        </div>

        {/* INSIGHT CARD */}
        <div className="bg-emerald-50 rounded-[32px] p-6 border border-emerald-100 flex gap-4">
           <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#10B981] shrink-0">
              <Info size={24} />
           </div>
           <div>
              <h4 className="text-[11px] font-black text-[#1F111F] uppercase tracking-wider mb-1">Pharmacist Tip</h4>
              <p className="text-[10px] text-gray-600 font-bold leading-relaxed">
                 Magnesium is best taken in the evening to support restorative sleep and muscle recovery.
              </p>
           </div>
        </div>
      </main>
    </div>
  );
}
