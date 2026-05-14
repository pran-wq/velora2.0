import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronLeft, Star, Search, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export default function Appointments() {
  const navigate = useNavigate();
  const { profile } = useApp();
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [step, setStep] = useState(1); // 1: List, 2: Booked

  const isPregnant = profile?.isPregnant;
  const isFemale = profile?.gender === 'Female';
  const accent = isPregnant ? '#FF8BA7' : isFemale ? '#FC7A8B' : '#6366F1';

  const doctors = [
    { id: 1, name: 'Dr. Sarah Khan', role: 'Senior OB-GYN', rating: 4.9, img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'Dr. James Chen', role: 'Cardiologist', rating: 4.8, img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200' },
    { id: 3, name: 'Dr. Elena Scott', role: 'Nutrition Specialist', rating: 5.0, img: 'https://images.unsplash.com/photo-1594824476967-48c879f1145f?auto=format&fit=crop&q=80&w=200' },
  ];

  if (step === 2) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
         <motion.div 
           initial={{ scale: 0 }}
           animate={{ scale: 1, rotate: 360 }}
           className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-6"
         >
            <Check size={40} strokeWidth={3} />
         </motion.div>
         <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Appointment Booked!</h2>
         <p className="text-gray-500 max-w-xs mb-8">Your visit is confirmed for tomorrow at 10:30 AM. We've sent the details to your email.</p>
         <button onClick={() => navigate('/home')} className="px-8 py-4 bg-[#0F172A] text-white font-bold rounded-2xl shadow-lg">
            Back to Dashboard
         </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
       
       {/* Premium Cover Header */}
       <div style={{ background: `linear-gradient(135deg, ${accent}, #4F46E5)` }} className="h-48 relative px-6 pt-10 text-white">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
             <ChevronLeft size={20} />
          </button>
          <div className="mt-6">
             <h1 className="text-3xl font-bold tracking-tight">Book Appointment</h1>
             <p className="text-white/80 text-sm font-medium mt-1">Schedule time with top-tier specialists</p>
          </div>
       </div>

       <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-10">
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-2 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-3 mb-8">
             <div className="p-3 text-gray-400"><Search size={20} /></div>
             <input type="text" placeholder="Search specialty or doctor name..." className="flex-1 outline-none font-medium text-sm text-gray-700" />
             <button className="px-6 py-3 bg-[#0F172A] text-white text-xs font-bold rounded-xl">Search</button>
          </div>

          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 pl-2">Available Doctors</h3>
          
          <div className="space-y-4">
             {doctors.map(doc => (
               <motion.div 
                 key={doc.id}
                 whileHover={{ scale: 1.01 }}
                 className={cn(
                   "bg-white rounded-3xl p-5 flex flex-col md:flex-row gap-6 shadow-sm border transition-all",
                   selectedDoctor === doc.id ? "border-indigo-200 ring-4 ring-indigo-50" : "border-gray-100"
                 )}
               >
                  <div className="flex gap-5 items-center flex-1">
                     <img src={doc.img} className="w-20 h-20 rounded-2xl object-cover shadow-inner border-2 border-white" alt={doc.name} />
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <h4 className="font-bold text-[#0F172A] text-lg">{doc.name}</h4>
                           <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-bold">
                              <Star size={10} fill="currentColor" /> {doc.rating}
                           </div>
                        </div>
                        <p className="text-indigo-500 font-bold text-xs tracking-wide uppercase mb-2">{doc.role}</p>
                        <div className="flex items-center gap-3 text-gray-400 text-[11px] font-medium">
                           <span className="flex items-center gap-1"><MapPin size={12} /> Aether Medical Hub</span>
                           <span className="flex items-center gap-1"><Clock size={12} /> 15m Away</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex md:flex-col justify-center gap-2 min-w-[140px]">
                     <button 
                       onClick={() => setSelectedDoctor(doc.id)}
                       className={cn(
                         "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all",
                         selectedDoctor === doc.id ? "bg-indigo-50 text-indigo-600" : "bg-[#F8FAFC] text-gray-600 hover:bg-gray-100"
                       )}
                     >
                        Select Slots
                     </button>
                     <button 
                       onClick={() => { setSelectedDoctor(doc.id); setStep(2); }}
                       style={{ backgroundColor: accent }}
                       className="flex-1 py-3 px-4 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 hover:brightness-95 transition-all"
                     >
                        Instant Book
                     </button>
                  </div>
               </motion.div>
             ))}
          </div>

       </div>
    </div>
  );
}
