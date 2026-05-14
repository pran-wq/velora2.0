import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Dumbbell, ChevronLeft, Flame, Zap, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export default function WorkoutHub() {
  const navigate = useNavigate();
  const { profile, stats } = useApp();

  const isPregnant = profile?.isPregnant;
  const isFemale = profile?.gender === 'Female';
  const accent = isPregnant ? '#FF8BA7' : isFemale ? '#FC7A8B' : '#818CF8';

  const plan = isPregnant ? [
     { id: 1, name: 'Prenatal Yoga Flow', duration: '15 min', level: 'Beginner', cals: 80, img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=300' },
     { id: 2, name: 'Pelvic Floor Strengthening', duration: '10 min', level: 'Easy', cals: 40, img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=300' },
  ] : [
     { id: 1, name: 'Full Body Conditioning', duration: '45 min', level: 'Intermediate', cals: 320, img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=300' },
     { id: 2, name: 'Core Ignition', duration: '20 min', level: 'Advanced', cals: 150, img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=300' },
     { id: 3, name: 'HIIT Mastery', duration: '30 min', level: 'Intermediate', cals: 280, img: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=300' },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans pb-20">
      
      {/* Dark Themed Premium Header */}
      <div className="px-6 pt-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -mr-20 -mt-20" />
         
         <div className="flex justify-between items-center mb-8 relative z-10">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
               <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md text-xs font-bold tracking-wide">
               <Trophy size={14} className="text-yellow-400" /> Ready for Action
            </div>
         </div>

         <div className="relative z-10 mb-10">
            <h1 className="text-4xl font-black tracking-tight leading-tight">Personalized <br/><span style={{ color: accent }}>Workout Plan</span></h1>
            <p className="text-gray-400 text-sm mt-2 font-medium">Based on your recovery score of {stats?.recoveryScore || 88}%</p>
         </div>

         {/* Stats Strip */}
         <div className="grid grid-cols-3 gap-4 relative z-10 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
               <Flame className="mx-auto text-orange-500 mb-2" size={20} />
               <p className="text-xl font-bold">450</p>
               <p className="text-[10px] text-gray-400 font-bold uppercase">kcal burn</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
               <Clock className="mx-auto text-blue-400 mb-2" size={20} />
               <p className="text-xl font-bold">65</p>
               <p className="text-[10px] text-gray-400 font-bold uppercase">min total</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
               <Zap className="mx-auto text-yellow-400 mb-2" size={20} />
               <p className="text-xl font-bold">High</p>
               <p className="text-[10px] text-gray-400 font-bold uppercase">intensity</p>
            </div>
         </div>
      </div>

      {/* Routine Content */}
      <div className="px-6">
         <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 px-2">Today's Routine</h3>
         <div className="space-y-4">
            {plan.map((item, idx) => (
               <motion.div
                 key={item.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className="group relative bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-[2rem] p-3 flex items-center gap-4 overflow-hidden hover:bg-white/10 transition-all cursor-pointer"
               >
                  <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden relative">
                     <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                     <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#0F172A]">
                           <Play size={12} fill="currentColor" className="ml-0.5"/>
                        </div>
                     </div>
                  </div>
                  <div className="flex-1 pr-2">
                     <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 inline-block">{item.level}</span>
                     <h4 className="font-bold text-[15px] leading-tight mb-2">{item.name}</h4>
                     <div className="flex items-center gap-4 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1"><Clock size={12} /> {item.duration}</span>
                        <span className="flex items-center gap-1"><Flame size={12} /> {item.cals} kcal</span>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>

         <button 
           style={{ backgroundColor: accent }}
           className="w-full mt-10 py-5 rounded-[2rem] text-[#0F172A] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all"
         >
            <Play size={16} fill="currentColor"/> Begin Session
         </button>
      </div>

    </div>
  );
}
