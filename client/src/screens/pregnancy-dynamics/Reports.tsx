import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/Common';
import { useApp } from '../../context/AppContext';
import { 
  UploadCloud, FileText, Activity, AlertTriangle, ShieldCheck, 
  Search, Pill, Sparkles, X, ScanLine, Info
} from 'lucide-react';
import { useHealthStore } from '../../stores/healthStore';
import { cn } from '../../lib/utils';

export default function PregnancyReports() {
  const { profile, records: fallbackRecords } = useApp();
  const { reports, fetchReports, uploadReport } = useHealthStore();
  const [activeView, setActiveView] = useState<'Analysis' | 'Meds'>('Analysis');
  const [isUploading, setIsUploading] = useState(false);
  const [scanQuery, setScanQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const allReports = reports && reports.length > 0 ? reports : fallbackRecords;

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      await uploadReport(files[0], files[0].name, 'Ultrasound');
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  if (!profile || !profile.isPregnant) return null;

  return (
    <div className="flex flex-col gap-8 pt-12 pb-32 px-6 md:px-10 max-w-[1600px] mx-auto overflow-y-auto no-scrollbar h-full relative">
      
      {/* Background Soft Glows */}
      <div className="fixed top-[10%] left-[20%] w-[400px] h-[400px] bg-[#E2F0CB]/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[#FF8BA7]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* HEADER */}
      <header className="space-y-4 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[10px] font-bold text-[#FF8BA7] uppercase tracking-[0.3em] mb-2">Biometric Intelligence</h2>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-[#2E2528] tracking-tighter">
            Health <span className="text-[#FF8BA7] font-normal italic">Security</span>
          </h1>
          <p className="text-[#8A7B81] font-medium max-w-md mt-4 leading-relaxed">"Natalie, upload your medical records for AI analysis or verify medication safety for you and your baby."</p>
        </div>
        
        <div className="flex gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-white/60 shadow-sm">
          <button
            onClick={() => setActiveView('Analysis')}
            className={cn("px-8 py-3 rounded-2xl font-bold text-sm transition-all", activeView === 'Analysis' ? "bg-white text-[#2E2528] shadow-md" : "text-[#8A7B81] hover:bg-white/40")}
          >
            Report Analysis
          </button>
          <button
            onClick={() => setActiveView('Meds')}
            className={cn("px-8 py-3 rounded-2xl font-bold text-sm transition-all", activeView === 'Meds' ? "bg-[#FF8BA7] text-white shadow-lg shadow-[#FF8BA7]/30" : "text-[#8A7B81] hover:bg-white/40")}
          >
            Medicine Engine
          </button>
        </div>
      </header>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {/* ─── REPORT ANALYSIS VIEW ─── */}
          {activeView === 'Analysis' && (
            <motion.div key="analysis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              
              <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileSelect(e.target.files)} />
              {/* UPLOAD ZONE */}
              <GlassCard className="p-10 !rounded-[3rem] border-2 border-dashed border-[#FF8BA7]/40 bg-white/40 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FFF5F2]/50 transition-colors group relative overflow-hidden" onClick={() => fileInputRef.current?.click()}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF8BA7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#FF8BA7] shadow-lg mb-6 group-hover:scale-110 transition-transform">
                  {isUploading ? <Activity size={32} className="animate-spin" /> : <UploadCloud size={32} />}
                </div>
                <h3 className="text-2xl font-bold text-[#2E2528]">{isUploading ? 'Analyzing...' : 'Upload Medical Reports'}</h3>
                <p className="text-[#8A7B81] font-medium mt-2 max-w-sm">We support PDF, JPG, and PNG (Max 10MB). Upload your ultrasound scans, blood work, or prescriptions.</p>
                <button className="mt-8 px-8 py-3 bg-[#FF8BA7] text-white font-bold rounded-full shadow-lg shadow-[#FF8BA7]/30 hover:scale-105 active:scale-95 transition-all">
                  {isUploading ? 'Processing...' : 'Choose Files'}
                </button>
              </GlassCard>

              {/* RECENT UPLOADS & AI SUMMARY */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#2E2528] tracking-tight">Recent Maternal Records</h3>
                  {allReports.map((file: any, i: number) => (
                    <GlassCard key={i} className="p-5 flex items-center justify-between group hover:bg-white/80 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#FFF5F2] text-[#FF8BA7] rounded-xl group-hover:bg-[#FF8BA7] group-hover:text-white transition-colors">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-[#2E2528] text-sm">{file.title || file.name}</p>
                          <p className="text-xs text-[#8A7B81] mt-0.5">
                            {file.date || (file.uploadedAt ? file.uploadedAt.split('T')[0] : 'Just now')}
                          </p>
                        </div>
                      </div>
                      <span className="text-[#FF8BA7] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                    </GlassCard>
                  ))}
                </div>

                <GlassCard className="p-8 !rounded-[2.5rem] space-y-6 relative overflow-hidden bg-gradient-to-br from-[#FFF5F2] to-[#FFE4E1]/30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8BA7]/10 rounded-full blur-2xl" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#FF8BA7] shadow-sm">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="font-bold text-xl text-[#2E2528]">AI Analysis Summary</h3>
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    <p className="text-2xl font-bold text-[#2E2528] tracking-tight">Your reports look good! 🌸</p>
                    <p className="text-[#8A7B81] font-medium leading-relaxed">
                      Your recent blood work shows Hemoglobin is well within the normal range for the second trimester. Vitamin D is slightly low, while Calcium levels are optimal. The ultrasound indicates healthy fetal growth consistent with 18 weeks.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#FF8BA7]/20 flex gap-4">
                    <div className="flex-1 bg-white/60 p-4 rounded-2xl">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-[#8A7B81]">Action Required</p>
                      <p className="font-bold text-[#2E2528] text-sm mt-1">Discuss Vitamin D supplement with Dr. Sarah.</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {/* ─── MEDICINE SAFETY ENGINE ─── */}
          {activeView === 'Meds' && (
            <motion.div key="meds" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              
              {/* SEARCH BAR */}
              <GlassCard className="p-4 flex items-center gap-4 bg-white/80 !rounded-full sticky top-4 z-20 shadow-lg shadow-[#FF8BA7]/5">
                <div className="w-12 h-12 bg-[#FF8BA7]/10 rounded-full flex items-center justify-center text-[#FF8BA7]">
                  <ScanLine size={24} />
                </div>
                <input 
                  type="text" 
                  placeholder="Scan or type medication name to check safety..." 
                  value={scanQuery}
                  onChange={(e) => setScanQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none text-lg text-[#2E2528] font-medium placeholder:text-[#8A7B81]/60"
                />
                {scanQuery && (
                  <button onClick={() => setScanQuery('')} className="p-2 text-[#8A7B81] hover:text-[#2E2528]">
                    <X size={20} />
                  </button>
                )}
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SAFE EXAMPLE */}
                <GlassCard className="p-8 !rounded-[2.5rem] border-2 border-transparent hover:border-[#B5EAD7] transition-colors group bg-white/60">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#B5EAD7]/20 rounded-full flex items-center justify-center text-[#2D8C63]">
                        <Pill size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-[#2E2528]">Paracetamol</h3>
                        <p className="text-[#8A7B81] font-medium">Analgesic & Antipyretic</p>
                      </div>
                    </div>
                    <div className="bg-[#B5EAD7] text-[#1B5E20] px-4 py-1.5 rounded-full flex items-center gap-1">
                      <ShieldCheck size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Safe</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-white/60 rounded-2xl border border-[#B5EAD7]/50 space-y-2">
                    <p className="text-sm font-bold text-[#2D8C63] flex items-center gap-2"><Info size={16} /> Medical AI Insight</p>
                    <p className="text-sm text-[#8A7B81] leading-relaxed">Considered the painkiller of choice during all stages of pregnancy. However, use the lowest effective dose for the shortest possible time.</p>
                  </div>
                </GlassCard>

                {/* DANGER EXAMPLE */}
                <GlassCard className="p-8 !rounded-[2.5rem] border-2 border-red-100 bg-red-50/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                        <Pill size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-[#2E2528]">Ibuprofen</h3>
                        <p className="text-[#8A7B81] font-medium">NSAID</p>
                      </div>
                    </div>
                    <div className="bg-red-500 text-white px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md shadow-red-500/20">
                      <AlertTriangle size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Unsafe</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-white/80 rounded-2xl border border-red-200 space-y-3">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-red-600 flex items-center gap-2"><Info size={16} /> Critical Risk</p>
                      <p className="text-sm text-[#8A7B81] leading-relaxed">Not recommended, especially in the third trimester as it can cause premature closure of the baby's heart duct and reduce amniotic fluid.</p>
                    </div>
                    <div className="pt-3 border-t border-red-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A7B81] mb-2">Safer Alternatives</p>
                      <button className="text-sm font-bold text-[#2D8C63] bg-[#B5EAD7]/30 px-3 py-1.5 rounded-lg flex items-center gap-2 w-max">
                        <ShieldCheck size={14} /> Paracetamol
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
