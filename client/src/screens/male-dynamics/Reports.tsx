import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useHealthStore } from '../../stores/healthStore';
import { 
  UploadCloud, ScanLine, Pill, FileText, 
  Activity, ShieldCheck, CheckCircle2,
  Sparkles, AlertTriangle, Play, Search, ShieldAlert, X, ArrowRight, ExternalLink,
  Loader2, File, Grid, Archive
} from 'lucide-react';
import { cn } from '../../lib/utils';

const commonUploads = [
  { title: 'Upload Reports', desc: 'PDF, image, lab report, or discharge note', icon: UploadCloud, color: '#818CF8' },
  { title: 'Scan Documents', desc: 'Camera OCR for prescriptions and doctor notes', icon: ScanLine, color: '#F472B6' },
];

const aiCapabilities = [
  'Extract values & biomarkers',
  'Summarize clinical reports',
  'Explain medical terminology',
  'Detect out-of-range metrics',
  'Generate actionable insights',
];

export default function MaleReports() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const displayMode = searchParams.get('mode') || 'all'; // all, upload, scan, timeline, prescriptions
  const { profile, records: localFallback } = useApp();
  const { reports, fetchReports, uploadReport, isLoading } = useHealthStore();
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All Files");
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploading(true);
    try {
      await uploadReport(file, file.name, 'LabReport');
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  }, [uploadReport]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  if (!profile) return null;

  const allReports = reports && reports.length > 0 ? reports : localFallback;

  const vaultCategories = [
    { label: 'All Files', count: allReports.length, icon: Grid, color: '#64748B', key: 'All Files' },
    { label: 'Prescriptions', count: allReports.filter((r: any) => r.type?.toLowerCase() === 'prescription').length, icon: Pill, color: '#10B981', key: 'Prescription' },
    { label: 'Lab Reports', count: allReports.filter((r: any) => r.type?.toLowerCase().includes('report')).length, icon: FileText, color: '#6366F1', key: 'LabReport' },
    { label: 'Scans & X-Rays', count: allReports.filter((r: any) => r.type?.toLowerCase() === 'scan').length, icon: ScanLine, color: '#EC4899', key: 'Scan' },
  ];

  const filteredReports = allReports.filter((r: any) => {
    if (activeCategory === 'All Files') return true;
    if (activeCategory === 'LabReport') return r.type?.toLowerCase().includes('report');
    return r.type?.toLowerCase() === activeCategory.toLowerCase();
  });


  // Enforce strict filtering for special isolated modes
  useEffect(() => {
    if (displayMode === 'prescriptions') {
      setActiveCategory('Prescription');
    } else if (displayMode === 'timeline') {
      setActiveCategory('All Files');
    }
  }, [displayMode]);

  const showHeader = displayMode === 'all' || displayMode === 'timeline' || displayMode === 'prescriptions';
  const showCategories = displayMode === 'all' || displayMode === 'timeline';
  const showUploader = displayMode === 'all' || displayMode === 'upload';
  const showMedicine = displayMode === 'all' || displayMode === 'scan';
  const showTimeline = displayMode === 'all' || displayMode === 'timeline' || displayMode === 'prescriptions';

  return (
    <div className="flex flex-col gap-8 pt-10 sm:pt-16 px-6 md:px-10 pb-36 max-w-[1400px] mx-auto overflow-y-auto no-scrollbar h-full bg-[#F8FAFC]">
      
      {/* Universal Enhanced Back Navigation */}
      <button onClick={() => navigate('/vault')} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0F172A] w-fit transition-colors">
         <ArrowRight className="rotate-180" size={16} /> Return to Vault
      </button>

      {showHeader && (
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10 w-full mx-auto mt-2">
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#818CF8]">AI Report Intelligence</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[#0F172A] tracking-tighter">
               {displayMode === 'prescriptions' ? 'Prescription Manager' : 'Medical Records'}
            </h1>
            <p className="max-w-2xl text-sm text-[#64748B] font-medium">
              {displayMode === 'prescriptions' ? 'Manage pharmaceutical loadouts and active clinical directions.' : 'Plain-language AI interpretation and performance tracking.'}
            </p>
          </div>
        </header>
      )}

      {showCategories && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 w-full">
           {vaultCategories.map(vc => {
              const isActive = activeCategory === vc.key;
              return (
                 <div 
                   key={vc.label} 
                   onClick={() => setActiveCategory(vc.key)}
                   className={cn(
                     "bg-white p-6 rounded-[2.5rem] border transition-all cursor-pointer flex items-center gap-4 shadow-sm hover:shadow-md",
                     isActive ? "ring-2 ring-offset-2 ring-gray-100 border-gray-200 bg-white" : "border-gray-50"
                   )}
                 >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform shadow-sm" style={{ backgroundColor: isActive ? vc.color : `${vc.color}15`, color: isActive ? '#fff' : vc.color }}>
                       <vc.icon size={22} />
                    </div>
                    <div>
                       <h4 className="font-bold text-[#0F172A] text-lg leading-tight">{vc.count}</h4>
                       <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mt-0.5">{vc.label}</p>
                    </div>
                 </div>
              );
           })}
        </div>
      )}

      <div className="w-full mx-auto space-y-12">
        {showUploader && (
          <section className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#64748B] pl-2 border-l-4 border-[#818CF8]">Diagnostic Capture</h3>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col sm:flex-row gap-6">
                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "flex-1 min-h-[220px] rounded-[24px] border-2 border-dashed transition-all flex flex-col items-center justify-center text-center p-8 cursor-pointer group",
                    dragOver ? "border-[#818CF8] bg-[#EEF2FF] scale-[1.02]" : "border-[#818CF8]/30 bg-[#EEF2FF]/50 hover:bg-[#EEF2FF]"
                  )}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-[#818CF8] bg-white shadow-sm group-hover:scale-105 transition-transform mb-4">
                    {isUploading ? <Loader2 className="animate-spin" size={28} /> : <UploadCloud size={28} />}
                  </div>
                  <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
                    {isUploading ? 'Uploading...' : dragOver ? 'Drop here!' : 'Drop medical files here'}
                  </h2>
                  <p className="mt-2 text-xs text-[#64748B] font-medium max-w-[250px]">PDF, JPG, PNG, and clinical notes.</p>
                </div>
                <div className="flex flex-col gap-4 justify-center">
                  {commonUploads.map((item) => (
                    <div key={item.title} className="p-5 rounded-[24px] bg-[#F8FAFC] border border-gray-100 hover:border-[#818CF8]/30 transition-colors cursor-pointer w-64">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                          <item.icon size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#0F172A]">{item.title}</h3>
                          <p className="text-[10px] text-[#64748B] font-medium mt-0.5">{item.desc.split(',')[0]}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-gradient-to-br from-[#1E1B4B] to-[#312E81] rounded-[32px] p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#818CF8]/30 rounded-full blur-[40px]" />
                 <div className="flex items-center gap-3 mb-4 relative z-10">
                   <Sparkles size={20} className="text-[#A78BFA]" />
                   <h2 className="text-lg font-bold tracking-tight">AI Protocol Active</h2>
                 </div>
                 <ul className="space-y-2 relative z-10">
                   {['Biomarker Extraction', 'Clarity Summary', 'Explanation Mode'].map(i => (
                     <li key={i} className="flex items-center gap-2 text-xs font-bold text-white/80"><CheckCircle2 size={14} className="text-[#A78BFA]" /> {i}</li>
                   ))}
                 </ul>
              </div>
            </div>
          </section>
        )}

        {showMedicine && (
          <section className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#64748B] pl-2 border-l-4 border-[#10B981]">Smart Medicine Extractor</h3>
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
               <div className="flex flex-col lg:flex-row gap-8 items-center">
                 <div className="flex-1 space-y-6">
                   <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-[#10B981]/10 rounded-2xl flex items-center justify-center text-[#10B981]">
                       <ScanLine size={28} />
                     </div>
                     <div>
                       <h4 className="text-2xl font-bold text-[#0F172A]">Prescription OCR Engine</h4>
                       <p className="text-sm font-medium text-[#64748B]">Instantly log interactions, side effects, and cycle guidance.</p>
                     </div>
                   </div>
                 </div>
                 
                 <div className="w-full lg:w-80 h-48 rounded-[24px] border-2 border-dashed border-[#10B981]/40 bg-[#ECFDF5]/50 flex flex-col items-center justify-center text-center p-6 hover:bg-[#ECFDF5] transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                    <Pill size={32} className="text-[#10B981] mb-4 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[#0F172A]">Scan to Vault</span>
                    <p className="text-[10px] text-[#64748B] uppercase tracking-widest mt-2">Extracting Data...</p>
                 </div>
               </div>
            </div>
          </section>
        )}

        {showTimeline && (
          <section className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#64748B] pl-2 border-l-4 border-[#6366F1]">
               {displayMode === 'prescriptions' ? 'Active Prescriptions' : 'Diagnostic Ledger'}
            </h3>
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 space-y-6">
              <div className="relative pl-6 border-l-2 border-dashed border-gray-200 space-y-6 py-2">
                {filteredReports.map((record: any, idx: number) => {
                  const typeLower = record.type?.toLowerCase() || '';
                  let typeConfig = { icon: FileText, color: '#6366F1', bg: 'bg-indigo-50', txtColor: 'text-indigo-600' };
                  if (typeLower === 'scan') typeConfig = { icon: ScanLine, color: '#EC4899', bg: 'bg-pink-50', txtColor: 'text-pink-600' };
                  if (typeLower === 'prescription') typeConfig = { icon: Pill, color: '#10B981', bg: 'bg-emerald-50', txtColor: 'text-emerald-600' };
                  if (typeLower.includes('report')) typeConfig = { icon: FileText, color: '#8B5CF6', bg: 'bg-violet-50', txtColor: 'text-violet-600' };

                  return (
                    <div key={record.id} className="relative group">
                      <div className={cn("absolute -left-[33px] top-6 w-4 h-4 rounded-full bg-white border-4 ring-4 ring-white", 
                          typeLower === 'scan' ? "border-pink-500" : typeLower === 'prescription' ? "border-emerald-500" : "border-violet-500")} 
                      />
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedRecord(record)}
                        className="flex items-start gap-5 p-6 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform", typeConfig.bg, typeConfig.txtColor)}>
                          <typeConfig.icon size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-[#0F172A] text-lg leading-tight">{record.title}</h3>
                              <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-black uppercase border", typeConfig.bg, typeConfig.txtColor, "border-transparent")}>
                                {record.type === 'LabReport' ? 'Lab Report' : record.type}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest whitespace-nowrap">
                              {record.date || (record.uploadedAt ? new Date(record.uploadedAt).toLocaleDateString() : 'Today')}
                            </span>
                          </div>
                          <p className="text-sm text-[#64748B] font-medium leading-relaxed">{record.aiInsight || record.summary || 'Ready for review.'}</p>
                        </div>
                        <div className="self-center text-[#64748B] opacity-0 group-hover:opacity-100 transition-all shrink-0 hidden sm:block">
                          <ArrowRight size={20} />
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
                {filteredReports.length === 0 && (
                  <div className="text-center py-10 text-gray-400 font-medium">No matching items currently stored in vault.</div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Hidden Inputs */}
      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileSelect(e.target.files)} />

      {/* Modal Details Display */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-[200] flex items-center justify-end p-0 sm:p-6 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedRecord(null)}>
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              onClick={e => e.stopPropagation()}
              className="h-full w-full max-w-xl bg-white sm:rounded-[32px] shadow-2xl flex flex-col relative overflow-hidden"
            >
               {/* Header */}
               <div className="p-8 pb-6 border-b border-gray-100 shrink-0">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-12 h-12 bg-[#F8FAFC] rounded-2xl flex items-center justify-center text-[#818CF8]">
                        <FileText size={24} />
                     </div>
                     <button onClick={() => setSelectedRecord(null)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100">
                        <X size={20} />
                     </button>
                  </div>
                  <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">{selectedRecord.title}</h2>
                  <p className="text-sm text-[#64748B] font-medium mt-1">{selectedRecord.date}</p>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8FAFC]/50">
                  <div className="bg-gradient-to-br from-[#1E1B4B] to-[#312E81] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                     <p className="text-base font-medium relative z-10">
                        {selectedRecord.aiAnalysis?.summary || selectedRecord.aiInsight}
                     </p>
                  </div>
                  {selectedRecord.aiAnalysis?.keyMetrics && (
                     <div className="space-y-3">
                        <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest">Extracted Metrics</h4>
                        {selectedRecord.aiAnalysis.keyMetrics.map((m: any, i: number) => (
                           <div key={i} className="p-4 bg-white rounded-xl border flex justify-between">
                              <span className="font-bold text-gray-600">{m.name}</span>
                              <span className="font-black text-[#0F172A]">{m.value}</span>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
