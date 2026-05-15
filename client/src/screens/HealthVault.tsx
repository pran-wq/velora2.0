import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, Pill, Lock, ChevronRight, Activity, Watch, Heart, Download, KeyRound, Fingerprint, UploadCloud, Camera, ScanLine, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useHealthStore } from '../stores/healthStore';
import { cn } from '../lib/utils';
import { GlassCard } from '../components/Common';

export default function HealthVault() {
  const navigate = useNavigate();
  const { profile, records, meds } = useApp();
  const healthStore = useHealthStore();

  const isFemale = profile?.gender === 'Female';
  const isPregnant = isFemale && profile?.isPregnant;
  const accent = isPregnant ? '#FF8BA7' : isFemale ? '#FC7A8B' : '#6366F1';

  const recordCount = (records?.length || 0) + (healthStore.reports?.length || 0);
  const medCount = meds?.length || 0;

  const vaultSections = [
    { id: 'reports', label: 'Medical Records', count: `${recordCount || 5} Files`, icon: FileText, color: '#6366F1', path: '/reports?mode=timeline' },
    { id: 'rx', label: 'Prescriptions', count: `${medCount || 3} Active`, icon: Pill, color: '#10B981', path: '/reports?mode=prescriptions' },
    { id: 'cards', label: 'Insurance & ID', count: '2 Cards', icon: ShieldCheck, color: '#EC4899', path: '/vault/insurance' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans selection:bg-[#6366F1]/10 relative overflow-hidden">
       
       {/* Soft elegant glowing orbs mimicking dynamic accents */}
       <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-30" style={{ backgroundColor: accent }} />
       <div className="absolute bottom-[100px] left-[-100px] w-[300px] h-[300px] bg-sky-400 rounded-full blur-[120px] opacity-20" />

       <div className="px-6 pt-12 max-w-4xl mx-auto relative z-10">
          
          {/* Header Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
             <div>
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-lg shadow-gray-200" style={{ backgroundColor: accent }}>
                      <ShieldCheck size={14} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Protected Sanctuary</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-[#0F172A]">Digital Vault</h1>
             </div>
             
             <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-white px-4 py-2 rounded-2xl shadow-sm w-fit">
                <Fingerprint size={20} className="text-emerald-500" />
                <div className="text-left">
                   <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Status</p>
                   <p className="text-xs font-black text-[#0F172A]">Biometric Validated</p>
                </div>
             </div>
          </div>

          {/* Visual Centerpiece - The Large Glass Safe Tile */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }} 
             animate={{ opacity: 1, scale: 1 }}
             className="relative rounded-[3rem] p-1 bg-gradient-to-br from-white via-white/80 to-white/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-white mb-8 overflow-hidden"
          >
             <div className="bg-white/40 backdrop-blur-xl rounded-[2.8rem] p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                <div className="flex-1 space-y-6">
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{profile?.name}'s Encrypted Ledger</p>
                      <h2 className="text-2xl md:text-3xl font-black text-[#0F172A]">Your Health Legacy, Safeguarded.</h2>
                   </div>
                   
                   <div className="flex flex-wrap gap-6 text-sm pt-4 border-t border-gray-100">
                      <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Security Protocol</p>
                         <p className="font-bold text-[#0F172A] flex items-center gap-1"><KeyRound size={14} style={{ color: accent }} /> AES-256-GCM</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Cloud Volume</p>
                         <p className="font-bold text-[#0F172A]">0.4 GB / 10 GB</p>
                      </div>
                   </div>
                </div>

                <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center mx-auto shrink-0">
                   <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-full"
                   />
                   <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-4 border border-dashed opacity-50 rounded-full"
                      style={{ borderColor: accent }}
                   />
                   <div className="absolute inset-8 bg-white rounded-full shadow-xl shadow-gray-200/50 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg text-white" style={{ backgroundColor: accent }}>
                         <Lock size={32} />
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Artistic decor curve */}
             <div className="absolute top-[-50%] right-[-20%] w-[60%] h-[200%] bg-gray-50/50 -skew-x-12 rotate-12 pointer-events-none" />
          </motion.div>
           {/* Quick Actions Bar */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <motion.button
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 onClick={() => navigate('/reports?mode=upload')}
                 className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group relative overflow-hidden"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-violet-600 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
                 <div className="relative w-12 h-12 rounded-2xl bg-[#6366F1]/10 flex items-center justify-center shrink-0 text-[#6366F1] group-hover:scale-110 transition-transform">
                    <UploadCloud size={20} />
                 </div>
                 <div className="relative text-left">
                    <h3 className="text-base font-bold text-[#0F172A]">Upload New Report</h3>
                    <p className="text-xs font-medium text-[#64748B]">PDF, DICOM, or Image</p>
                 </div>
              </motion.button>

              <motion.button
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 onClick={() => navigate('/reports?mode=scan')}
                 className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                 <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0F172A] group-hover:bg-indigo-50 group-hover:text-[#6366F1] transition-colors shrink-0">
                    <Camera size={20} />
                 </div>
                 <div className="text-left">
                    <h3 className="text-base font-bold text-[#0F172A]">Scan Prescription</h3>
                    <p className="text-xs font-medium text-[#64748B]">Auto-extract data via AI</p>
                 </div>
              </motion.button>
           </div>

          {/* AI INTELLIGENCE NEXUS (NEW) */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="mb-10 space-y-4"
          >
             <div className="flex justify-between items-end px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Intelligence Nexus</h3>
                <button className="text-[10px] font-bold text-[#6366F1] flex items-center gap-1">Sync Intelligence <Activity size={12} /></button>
             </div>
             <GlassCard className="p-8 bg-[#0F172A] text-white border-none shadow-2xl !rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/10 rounded-full blur-[80px]" />
                
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#6366F1]">
                         <Sparkles size={22} />
                      </div>
                      <h4 className="text-lg font-bold">Cross-Document Synthesis</h4>
                   </div>
                   
                   <p className="text-sm text-white/70 leading-relaxed italic">
                      "Based on your last 3 blood panels and 5 prescriptions, we've identified a stable trend in your metabolic markers. Your systemic recovery has improved by 12% since February."
                   </p>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Key Finding', val: 'Iron levels optimized', status: 'Success' },
                        { label: 'Follow Up', val: 'Annual Echo (May 15)', status: 'Planned' }
                      ].map((f, i) => (
                        <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                           <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-white/40">{f.label}</p>
                              <p className="text-xs font-bold mt-0.5">{f.val}</p>
                           </div>
                           <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/60">{f.status}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </GlassCard>
          </motion.div>

          {/* GRID Layout for Repositories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             {vaultSections.map((sec, idx) => (
                <motion.button
                   key={sec.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   onClick={() => navigate(sec.path)}
                   className="group relative bg-white rounded-[2.5rem] p-8 text-left border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[180px]"
                >
                   <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-500" style={{ backgroundColor: sec.color }}>
                         <sec.icon size={24} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-[#0F172A] transition-colors">
                         <ChevronRight size={16} />
                      </div>
                   </div>
                   
                   <div>
                      <h3 className="text-lg font-black text-[#0F172A] mt-6 mb-1">{sec.label}</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{sec.count}</p>
                   </div>
                </motion.button>
             ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
             <button className="text-sm font-bold text-gray-500 flex items-center gap-2 hover:text-[#0F172A] transition-colors">
                <Download size={16} /> Request Backup Archive
             </button>
          </div>

       </div>
    </div>
  );
}
