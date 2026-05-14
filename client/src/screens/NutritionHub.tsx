import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Utensils, Apple, Coffee, Plus, ChevronLeft, Camera, Check, 
  Sparkles, Zap, Heart, Droplets, Info, ArrowRight,
  Salad, Fish, Beef, Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const card = "bg-white/90 backdrop-blur-md rounded-[32px] border border-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6";
const sectionTitle = "text-[12px] font-black tracking-[0.2em] uppercase text-[#7A6B80] mb-6";

export default function NutritionHub() {
  const navigate = useNavigate();
  const { profile } = useApp();
  const [mealName, setMealName] = useState('');
  const [cals, setCals] = useState('');
  const [water, setWater] = useState(1400);
  const [showLogged, setShowLogged] = useState(false);

  const isFemale = profile?.gender?.toLowerCase() === 'female';
  const cyclePhase = 'Luteal'; // In a real app, this would come from state

  const handleLog = () => {
     setShowLogged(true);
     setTimeout(() => setShowLogged(false), 2000);
     setMealName('');
     setCals('');
  };

  const nutrientStatus = [
    { label: 'Protein', current: 62, target: 120, color: 'bg-indigo-400', unit: 'g' },
    { label: 'Fiber', current: 22, target: 28, color: 'bg-emerald-400', unit: 'g' },
    { label: 'Magnesium', current: 240, target: 400, color: 'bg-purple-400', unit: 'mg' },
    { label: 'Iron', current: 12, target: 18, color: 'bg-rose-400', unit: 'mg' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBEB] via-[#FFF5F8] to-[#F8F0FF] font-sans text-[#1E1428] p-4 md:p-8 pb-32">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#7A6B80] border border-white hover:shadow-md transition">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-[28px] font-black text-[#1E1428] tracking-tighter leading-tight">Nutrition Hub</h1>
              <p className="text-[13px] text-[#9E8EA6] font-semibold tracking-wide uppercase">Metabolic & Hormonal Fueling</p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-100">
            <Utensils size={24} />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div className="flex flex-col gap-8">
            
            {/* PROGRESS OVERVIEW */}
            <div className="relative bg-white rounded-[48px] p-10 shadow-xl shadow-orange-100/20 border border-white overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-50 rounded-full blur-[100px] -z-0" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="relative w-48 h-48 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#FFF7ED" strokeWidth="12" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="276" strokeDashoffset={276 - (276 * 0.72)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[42px] font-black text-[#1E1428] leading-none">1,542</span>
                    <span className="text-[11px] font-bold text-[#9E8EA6] uppercase tracking-widest mt-1">kcal left</span>
                  </div>
                </div>
                
                <div className="flex-1 w-full grid grid-cols-2 gap-6">
                  {nutrientStatus.map(n => (
                    <div key={n.label} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[13px] font-bold text-[#1E1428]">{n.label}</span>
                        <span className="text-[11px] font-black text-[#9E8EA6]">{n.current}<span className="text-[10px] text-gray-400">/{n.target}{n.unit}</span></span>
                      </div>
                      <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                        <div className={cn("h-full rounded-full transition-all duration-1000", n.color)} style={{ width: `${(n.current/n.target)*100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK LOG */}
            <section>
              <p className={sectionTitle}>Record Latest Intake</p>
              <div className={cn(card, "relative overflow-hidden")}>
                <AnimatePresence>
                  {showLogged && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-emerald-500 text-white flex items-center justify-center z-20 font-black text-lg tracking-tight"
                    >
                      <Check size={24} className="mr-3"/> Meal Logged Successfully
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Utensils size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      type="text" 
                      value={mealName}
                      onChange={e => setMealName(e.target.value)}
                      placeholder="What are you eating?" 
                      className="w-full p-5 pl-14 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-orange-100 outline-none font-bold text-[15px] text-[#1E1428] transition-all"
                    />
                  </div>
                  <button className="w-16 h-16 shrink-0 rounded-3xl bg-white border-2 border-gray-50 flex items-center justify-center text-[#9E8EA6] hover:text-orange-500 hover:border-orange-100 transition-all shadow-sm">
                    <Camera size={24} />
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-40 relative">
                    <input 
                      type="number" 
                      value={cals}
                      onChange={e => setCals(e.target.value)}
                      placeholder="Cals" 
                      className="w-full p-5 rounded-3xl bg-gray-50 border-2 border-transparent outline-none font-black text-center text-orange-600 text-[18px]"
                    />
                  </div>
                  <button 
                    onClick={handleLog}
                    disabled={!mealName}
                    className="flex-1 bg-[#1E1428] text-white rounded-3xl font-black text-[15px] tracking-wide flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-black/10"
                  >
                    <Plus size={20} /> Add to Health Journal
                  </button>
                </div>
              </div>
            </section>

            {/* JOURNAL TIMELINE */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <p className={`${sectionTitle} mb-0`}>Today's Journal</p>
                <button className="text-[11px] font-black text-orange-500 uppercase tracking-widest hover:underline">View History</button>
              </div>
              <div className="space-y-4">
                {[
                  { time: '08:30 AM', name: 'Spinach & Berry Smoothie Bowl', cal: 340, icon: Salad, tag: 'High Iron' },
                  { time: '12:45 PM', name: 'Quinoa Bowl with Salmon', cal: 520, icon: Fish, tag: 'Omega-3' },
                  { time: '04:15 PM', name: 'Almonds & Dark Chocolate', cal: 180, icon: Coffee, tag: 'Magnesium' },
                ].map((meal, i) => (
                  <div key={i} className={cn(card, "flex items-center justify-between py-4 group hover:border-orange-200 transition-all")}>
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center transition-transform group-hover:scale-110">
                        <meal.icon size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-black text-[#1E1428] text-[15px]">{meal.name}</h4>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-full border border-emerald-100">{meal.tag}</span>
                        </div>
                        <p className="text-[11px] font-bold text-[#9E8EA6] uppercase tracking-widest">{meal.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-orange-500 text-[18px]">+{meal.cal}</span>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Cals</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* SIDEBAR */}
          <div className="flex flex-col gap-6">
            
            {/* PHASE SYNCED NUTRITION */}
            <div className={cn(card, "bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-2xl shadow-indigo-200")}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Sparkles size={22} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="text-[17px] font-black leading-tight uppercase tracking-tighter">Luteal Phase<br/>Optimization</h3>
                </div>
              </div>
              <p className="text-white/70 text-[13px] font-medium leading-relaxed mb-6">
                Your metabolism increases during the **Luteal Phase**. Focus on complex carbohydrates and magnesium-rich foods to stabilize mood and energy.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Recommended', val: 'Slow Carbs & Fiber', icon: Salad },
                  { label: 'Avoid', val: 'Caffeine & High Sodium', icon: Flame },
                  { label: 'Metabolic Shift', val: '+200-300 kcal/day', icon: Zap },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl border border-white/10">
                    <item.icon size={16} className="text-amber-300" />
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.label}</p>
                      <p className="text-[12px] font-bold">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HYDRATION TRACKER */}
            <div className={card}>
              <div className="flex items-center justify-between mb-6">
                <p className={`${sectionTitle} mb-0`}>Hydration</p>
                <div className="text-right">
                  <p className="text-[24px] font-black text-sky-500 leading-none">{(water / 1000).toFixed(1)}L</p>
                  <p className="text-[10px] font-black text-gray-300 uppercase">/ 2.5L Goal</p>
                </div>
              </div>
              <div className="flex justify-between gap-2 mb-6">
                {[1,2,3,4,5,6,7,8].map((i) => {
                  const filled = water >= i * 312.5;
                  return (
                    <div key={i} className={cn(
                      "flex-1 h-12 rounded-xl transition-all relative overflow-hidden",
                      filled ? "bg-sky-100" : "bg-gray-50 border border-gray-100"
                    )}>
                      {filled && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: '100%' }}
                          className="absolute inset-0 bg-sky-500 rounded-xl" 
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={() => setWater(prev => Math.min(prev + 250, 2500))}
                className="w-full py-4 bg-sky-50 text-sky-600 font-black text-[13px] rounded-2xl flex items-center justify-center gap-2 hover:bg-sky-100 transition shadow-sm shadow-sky-100 active:scale-95"
              >
                <Droplets size={16} /> Log 250ml Water
              </button>
            </div>

            {/* CRAVING ANALYSIS */}
            <div className={card}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Info size={20} />
                </div>
                <h3 className="text-[15px] font-bold text-[#1E1428]">Craving Insights</h3>
              </div>
              <p className="text-[12px] text-[#7A6B80] font-medium leading-relaxed mb-4">
                Cravings for chocolate often indicate a need for **Magnesium** during this phase. Try cocoa nibs or pumpkin seeds instead.
              </p>
              <button className="text-[11px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Learn Phase Nutrition <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
