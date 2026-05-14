import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CreditCard, Fingerprint, Calendar, User, QrCode } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function InsuranceVault() {
  const navigate = useNavigate();
  const { profile } = useApp();

  const cardStyles = {
    insurance: "relative w-full max-w-md aspect-[1.586/1] bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-6 md:p-8 text-white shadow-2xl overflow-hidden flex flex-col justify-between group",
    id: "relative w-full max-w-md aspect-[1.586/1] bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#4338CA] rounded-3xl p-6 md:p-8 text-white shadow-2xl overflow-hidden flex flex-col justify-between group"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 selection:bg-indigo-100 relative">
      
      {/* Abstract bg decor */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#EEF2FF] to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 pt-12 relative z-10">
        
        <button onClick={() => navigate('/vault')} className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-500 hover:text-[#0F172A] transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Vault
        </button>

        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A]">Identity & Insurance</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Encrypted biometric credentials</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start justify-items-center">
          
          {/* Insurance Card Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full flex flex-col items-center gap-6"
          >
             <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Primary Coverage</p>
             <div className={cardStyles.insurance}>
                {/* Glass decoration */}
                <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[80%] bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-[-30%] left-[-20%] w-[50%] h-[80%] bg-indigo-500/10 rounded-full blur-3xl" />
                
                <div className="flex justify-between items-start relative z-10">
                   <div>
                      <h3 className="text-lg font-black tracking-wider flex items-center gap-2">
                         <ShieldCheck size={20} className="text-sky-400" /> AETNA PREMIER
                      </h3>
                      <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Global Medical Plan</p>
                   </div>
                   <CreditCard size={24} className="text-gray-500" />
                </div>

                <div className="space-y-4 relative z-10">
                   <p className="text-xl md:text-2xl font-mono tracking-[0.15em] text-white/90">8291 3321 9900 4452</p>
                   <div className="flex gap-8">
                      <div>
                         <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">MEMBER NAME</p>
                         <p className="text-sm font-bold tracking-wide">{profile?.name?.toUpperCase() || 'DEMO USER'}</p>
                      </div>
                      <div>
                         <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">VALID THRU</p>
                         <p className="text-sm font-bold">12/28</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="flex gap-3 mt-2">
                <button className="px-6 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm text-xs font-bold text-[#0F172A] hover:shadow-md transition-all flex items-center gap-2">
                   <Fingerprint size={14} /> Copy ID
                </button>
             </div>
          </motion.div>

          {/* Digital Health ID Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full flex flex-col items-center gap-6"
          >
             <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Aether Digital ID</p>
             <div className={cardStyles.id}>
                <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[80%] bg-pink-400/20 rounded-full blur-2xl" />
                <div className="absolute bottom-[-30%] left-[-20%] w-[50%] h-[80%] bg-white/10 rounded-full blur-2xl" />

                <div className="flex justify-between items-start relative z-10">
                   <div>
                      <h3 className="text-lg font-black tracking-wider flex items-center gap-2">
                         AETHER <span className="text-white/60">HEALTH</span>
                      </h3>
                      <p className="text-[9px] text-indigo-200 uppercase font-bold tracking-widest">Verified Digital Identity</p>
                   </div>
                   <div className="bg-white p-1 rounded-lg shadow-lg">
                      <QrCode size={20} className="text-indigo-600" />
                   </div>
                </div>

                <div className="space-y-4 relative z-10">
                   <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/20 text-white font-bold">
                         {profile?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                         <p className="text-base font-bold tracking-wide">{profile?.name || 'Aether User'}</p>
                         <p className="text-[10px] text-indigo-200 font-bold">AHM-932-X8</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                      <div>
                         <p className="text-[8px] text-indigo-200 font-bold uppercase tracking-widest">Blood</p>
                         <p className="text-xs font-bold">O+ Positive</p>
                      </div>
                      <div>
                         <p className="text-[8px] text-indigo-200 font-bold uppercase tracking-widest">Status</p>
                         <p className="text-xs font-bold flex items-center gap-1"><ShieldCheck size={10} /> Active</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="flex gap-3 mt-2">
                <button className="px-6 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm text-xs font-bold text-[#0F172A] hover:shadow-md transition-all flex items-center gap-2">
                   <Fingerprint size={14} /> Authorize NFC
                </button>
             </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
