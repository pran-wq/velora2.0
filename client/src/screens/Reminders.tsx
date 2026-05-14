import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronLeft, Clock, Calendar, Plus, Save, Pill, Droplets, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export default function Reminders() {
  const navigate = useNavigate();
  const { profile } = useApp();
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('Medicine');

  const isPregnant = profile?.isPregnant;
  const isFemale = profile?.gender === 'Female';
  const accent = isPregnant ? '#FF8BA7' : isFemale ? '#FC7A8B' : '#818CF8';
  const accentBg = isPregnant ? 'bg-[#FF8BA7]' : isFemale ? 'bg-[#FC7A8B]' : 'bg-[#818CF8]';

  const categories = [
    { id: 'Medicine', icon: Pill, color: 'text-red-500 bg-red-50' },
    { id: 'Hydration', icon: Droplets, color: 'text-blue-500 bg-blue-50' },
    { id: 'Activity', icon: Activity, color: 'text-green-500 bg-green-50' },
    { id: 'General', icon: Bell, color: 'text-purple-500 bg-purple-50' },
  ];

  const existing = [
    { id: 1, label: 'Morning Vitamin D', time: '08:00 AM', cat: 'Medicine' },
    { id: 2, label: 'Daily Walk', time: '06:30 PM', cat: 'Activity' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">Set Reminder</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personalized Alerts</p>
          </div>
        </div>

        {/* Creation Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 mb-8"
        >
           <div className="space-y-6">
              
              <div className="space-y-2">
                 <label className="text-xs font-black text-[#334155] uppercase tracking-widest pl-1">Reminder Name</label>
                 <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="e.g. Take Folate, Drink Water..."
                   className="w-full p-4 rounded-2xl bg-[#F8FAFC] border-2 border-transparent focus:border-indigo-100 outline-none font-medium transition-all"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-black text-[#334155] uppercase tracking-widest pl-1">Time</label>
                    <div className="relative">
                       <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                         type="time" 
                         value={time}
                         onChange={(e) => setTime(e.target.value)}
                         className="w-full p-4 pl-12 rounded-2xl bg-[#F8FAFC] border-2 border-transparent outline-none font-medium"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-[#334155] uppercase tracking-widest pl-1">Repeat</label>
                    <div className="relative">
                       <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                       <select className="w-full p-4 pl-12 appearance-none rounded-2xl bg-[#F8FAFC] border-2 border-transparent outline-none font-medium text-gray-600">
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Once</option>
                       </select>
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-xs font-black text-[#334155] uppercase tracking-widest pl-1">Category</label>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map(cat => (
                       <button
                         key={cat.id}
                         onClick={() => setCategory(cat.id)}
                         className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                            category === cat.id ? "border-indigo-200 bg-indigo-50/30" : "border-transparent bg-[#F8FAFC] opacity-60 hover:opacity-100"
                         )}
                       >
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", cat.color)}>
                             <cat.icon size={20} />
                          </div>
                          <span className="text-[11px] font-bold text-[#334155]">{cat.id}</span>
                       </button>
                    ))}
                 </div>
              </div>

              <button 
                style={{ backgroundColor: accent }}
                className="w-full py-4 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-4"
              >
                 <Save size={18} />
                 Save Reminder
              </button>

           </div>
        </motion.div>

        {/* Active List */}
        <div>
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 pl-2">Current Schedules</h3>
           <div className="space-y-3">
              {existing.map(item => (
                 <div key={item.id} className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50">
                    <div className="flex items-center gap-4">
                       <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", item.cat === 'Medicine' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500')}>
                          {item.cat === 'Medicine' ? <Pill size={20}/> : <Activity size={20}/>}
                       </div>
                       <div>
                          <h4 className="font-bold text-[#0F172A]">{item.label}</h4>
                          <p className="text-xs text-gray-400 font-medium">{item.time} • {item.cat}</p>
                       </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center text-gray-300">
                       <Plus className="rotate-45" size={16} />
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
