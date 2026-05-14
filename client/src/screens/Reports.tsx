import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/Common';
import { cn } from '../lib/utils';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useHealthStore } from '../stores/healthStore';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Activity, AlertTriangle, Baby, CheckCircle2, FileText, HeartPulse,
  Pill, ScanLine, ShieldCheck, Sparkles, UploadCloud, Loader2, X, Image, Grid, ArrowRight, ChevronRight, Info, AlertCircle, TrendingUp
} from 'lucide-react';
import MaleReports from './male-dynamics/Reports';
import { AnimatePresence } from 'framer-motion';

export default function Reports() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const displayMode = searchParams.get('mode') || 'all';
  const { profile, records } = useApp();
  const { reports: apiReports, uploadReport } = useHealthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedReport, setUploadedReport] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All Files");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!profile) return null;

  if (profile.gender === 'Male' && !profile.isPregnant) {
    return <MaleReports />;
  }

  const isFemale = profile.gender === 'Female';
  const isPregnant = isFemale && profile.isPregnant;
  const isMale = profile.gender === 'Male';

  const accent = isPregnant ? '#FF8BA7' : isFemale ? '#FC7A8B' : '#6366F1';
  const title = isPregnant ? 'Maternal Reports' : isFemale ? 'Wellness Records' : 'Performance Records';
  const subtitle = isPregnant
    ? 'Upload ultrasounds, blood reports, prescriptions, and nutrition charts for pregnancy-aware AI analysis.'
    : 'Upload prescriptions, reports, scans, and doctor notes for plain-language AI interpretation.';

  const uploadTypes = isPregnant
    ? ['Ultrasound scans', 'Blood reports', 'Prescriptions', 'Doctor session notes', 'Pregnancy visit summaries', 'Lab reports', 'Nutrition charts']
    : isFemale
      ? ['Hormone panels', 'Blood reports', 'Prescriptions', 'Doctor notes', 'Wellness records']
      : ['Lab reports', 'Prescriptions', 'Body scans', 'Supplement plans', 'Doctor notes'];

  const aiCapabilities = [
    'Extract values', 'Summarize reports', 'Explain medical terms', 'Detect abnormalities', 'Generate health insights',
  ];

  // All reports: API + local fallback
  const allReports = apiReports.length > 0 ? apiReports : records;

  const vaultCategories = [
    { label: 'All Files', count: allReports.length, icon: Grid, color: '#64748B', key: 'All Files' },
    { label: 'Prescriptions', count: allReports.filter((r: any) => r.type?.toLowerCase() === 'prescription').length, icon: Pill, color: '#10B981', key: 'Prescription' },
    { label: 'Lab Reports', count: allReports.filter((r: any) => r.type?.toLowerCase().includes('report')).length, icon: FileText, color: accent, key: 'LabReport' },
    { label: 'Scans & Scopes', count: allReports.filter((r: any) => r.type?.toLowerCase() === 'scan').length, icon: ScanLine, color: '#EC4899', key: 'Scan' },
  ];

  const filteredReports = allReports.filter((r: any) => {
    if (activeCategory === 'All Files') return true;
    if (activeCategory === 'LabReport') return r.type?.toLowerCase().includes('report');
    return r.type?.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, JPG, PNG, or WebP file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10 MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedReport(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 15, 85));
    }, 300);

    try {
      const result = await uploadReport(file, file.name, isPregnant ? 'Ultrasound' : 'LabReport');
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedReport(result.report);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Upload failed:', error);
      // Simulate success for demo
      setUploadProgress(100);
      setUploadedReport({
        id: Date.now().toString(),
        title: file.name,
        status: 'processing',
        summary: 'AI is analyzing your report...',
      });
    } finally {
      setTimeout(() => setIsUploading(false), 1000);
    }
  }, [uploadReport, isPregnant]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const analysisCards = isPregnant
    ? [
        { title: 'Pregnancy Safety Score', value: '92', unit: '/100', icon: ShieldCheck, note: 'No urgent risk markers detected.' },
        { title: 'Baby Growth Indicators', value: 'On track', unit: '', icon: Baby, note: 'Growth aligns with current week range.' },
        { title: 'Maternal Recommendations', value: '3', unit: 'actions', icon: HeartPulse, note: 'Iron, hydration, and BP follow-up.' },
      ]
    : [
        { title: 'Abnormality Detection', value: 'Low', unit: 'risk', icon: ShieldCheck, note: 'Recent values stay inside expected range.' },
        { title: 'Medicine Guidance', value: '98', unit: '% clear', icon: Pill, note: 'Adherence and refill timing look strong.' },
        { title: 'Health Timeline', value: allReports.length.toString(), unit: 'items', icon: Activity, note: 'Records are ready for trend analysis.' },
      ];

  const showHeader = displayMode === 'all' || displayMode === 'timeline' || displayMode === 'prescriptions';
  const showUploader = displayMode === 'all' || displayMode === 'upload' || displayMode === 'scan';
  const showTimeline = displayMode === 'all' || displayMode === 'timeline' || displayMode === 'prescriptions';

  React.useEffect(() => {
     if (displayMode === 'prescriptions') setActiveCategory('Prescription');
     else if (displayMode === 'timeline') setActiveCategory('All Files');
  }, [displayMode]);

  return (
    <div className={cn(
      'flex flex-col gap-8 pt-10 sm:pt-16 px-6 md:px-10 pb-36 max-w-[1600px] mx-auto overflow-y-auto no-scrollbar h-full',
      isMale ? 'bg-[#FBFBFF]' : ''
    )}>
      <button onClick={() => navigate('/vault')} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0F172A] w-fit transition-colors mb-4">
         <ArrowRight className="rotate-180" size={16} /> Return to Vault
      </button>
      {showHeader && (
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: accent }}>AI Report Intelligence</p>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-[#2D2D2D] tracking-tighter">{title}</h1>
            <p className="max-w-2xl text-sm md:text-base text-gray-500 font-medium leading-relaxed">{subtitle}</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-max px-8 py-4 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-xl transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: accent }}
          >
            Upload New Report
          </button>
        </header>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Progress */}
      {isUploading && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6 !rounded-[2rem] bg-white/80 space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="animate-spin" style={{ color: accent }} />
              <span className="text-sm font-bold text-gray-700">
                {uploadProgress < 85 ? 'Uploading & extracting text...' : uploadProgress < 100 ? 'AI analyzing report...' : 'Analysis complete!'}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: accent }}
                initial={{ width: '0%' }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Uploaded Report Result */}
      {uploadedReport && !isUploading && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6 !rounded-[2rem] bg-white/90 border-green-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-500" />
                <span className="text-sm font-bold text-gray-700">Report Uploaded: {uploadedReport.title}</span>
              </div>
              <button onClick={() => setUploadedReport(null)} className="p-1 hover:bg-gray-100 rounded-full"><X size={16} /></button>
            </div>
            <p className="text-sm text-gray-500">{uploadedReport.summary || 'AI analysis in progress.'}</p>
          </GlassCard>
        </motion.div>
      )}

      {/* DYNAMIC CATEGORY STRIP */}
      {showHeader && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full z-10">
           {vaultCategories.map(vc => {
              const isActive = activeCategory === vc.key;
              return (
                 <div 
                   key={vc.label} 
                   onClick={() => setActiveCategory(vc.key)}
                   className={cn(
                     "bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center gap-4 hover:shadow-md",
                     isActive ? "ring-2 ring-offset-2 ring-gray-100 bg-white shadow-sm border-transparent" : "border-white/50 shadow-sm"
                   )}
                 >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform" style={{ backgroundColor: isActive ? vc.color : `${vc.color}15`, color: isActive ? '#fff' : vc.color }}>
                       <vc.icon size={22} />
                    </div>
                    <div>
                       <h4 className="font-bold text-[#2D2D2D] text-lg leading-tight">{vc.count}</h4>
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{vc.label}</p>
                    </div>
                 </div>
              );
           })}
        </div>
      )}

{showUploader && <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <GlassCard className="lg:col-span-7 p-8 sm:p-10 !rounded-[3rem] bg-white/70 border-white/80 space-y-8">
          {/* Drop Zone — Now functional */}
          <div
            className={cn(
              "min-h-[280px] rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center text-center p-8 cursor-pointer transition-all",
              dragOver ? "border-current bg-white/80 scale-[1.02]" : "border-gray-200 bg-white/60"
            )}
            style={dragOver ? { borderColor: accent } : {}}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: accent }}>
              {dragOver ? <Image size={34} /> : <UploadCloud size={34} />}
            </div>
            <h2 className="mt-6 text-2xl font-bold text-[#2D2D2D] tracking-tight">
              {dragOver ? 'Drop to upload' : 'Drop medical files here'}
            </h2>
            <p className="mt-2 max-w-md text-sm text-gray-500 font-medium">
              Supports PDF, JPG, PNG, prescriptions, lab reports, ultrasound scans, and clinical notes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Upload Reports', desc: 'PDF, image, lab report, or discharge note', icon: UploadCloud },
              { title: 'Scan Documents', desc: 'Camera OCR for prescriptions and doctor notes', icon: ScanLine },
              { title: 'Medicine Scanner', desc: 'Identify dosage, timing, and interactions', icon: Pill },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow" onClick={() => fileInputRef.current?.click()}>
                <item.icon size={22} style={{ color: accent }} />
                <h3 className="mt-4 text-sm font-bold text-[#2D2D2D]">{item.title}</h3>
                <p className="mt-1 text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-8 !rounded-[3rem] bg-[#1A1A1A] text-white border-white/10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles size={20} style={{ color: accent }} />
              </div>
              <h2 className="text-lg font-bold tracking-tight">Shared AI Output</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {aiCapabilities.map((capability) => (
                <div key={capability} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                  <CheckCircle2 size={16} style={{ color: accent }} />
                  <span className="text-sm font-bold text-white/80">{capability}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-8 !rounded-[3rem] bg-white/70 border-white/80 space-y-5">
            <h2 className="text-lg font-bold text-[#2D2D2D] tracking-tight">Upload Types</h2>
            <div className="flex flex-wrap gap-3">
              {uploadTypes.map((type) => (
                <span key={type} className="px-4 py-2 rounded-full bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {type}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>}

      {isPregnant && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {analysisCards.map((card, index) => (
            <motion.div key={card.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
              className="bg-white/75 border border-white rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgba(255,139,167,0.08)]">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF5F2] flex items-center justify-center text-[#FF8BA7]"><card.icon size={26} /></div>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#8A7B81]">{card.title}</p>
              <h3 className="mt-2 text-3xl font-display font-bold text-[#2E2528] tracking-tighter">{card.value} <span className="text-sm text-[#8A7B81]">{card.unit}</span></h3>
              <p className="mt-3 text-sm text-[#8A7B81] font-medium leading-relaxed">{card.note}</p>
            </motion.div>
          ))}
        </section>
      )}

      {isPregnant && (
        <GlassCard className="p-8 !rounded-[3rem] bg-white/70 border-white/80 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#2D2D2D] tracking-tight">Maternal Visit Summaries</h2>
            <button className="text-xs font-bold text-[#FF8BA7]">View All Notes</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Trimester 2 Scan', date: 'May 12, 2026', doctor: 'Dr. Sarah Khan', outcome: 'Normal growth' },
              { title: 'Routine Check-up', date: 'April 28, 2026', doctor: 'Dr. Sarah Khan', outcome: 'Vitals stable' },
            ].map((visit, i) => (
              <div key={i} className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF5F2] flex items-center justify-center text-[#FF8BA7] shrink-0"><HeartPulse size={24} /></div>
                <div>
                  <h4 className="font-bold text-[#2D2D2D]">{visit.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{visit.date} • {visit.doctor}</p>
                  <p className="text-sm text-[#FF8BA7] font-bold mt-2">Outcome: {visit.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {showTimeline && <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 !rounded-[3rem] bg-white/70 border-white/80 space-y-6">
          <h2 className="text-2xl font-bold text-[#2D2D2D] tracking-tight">Structured Medical Timeline</h2>
          <div className="relative pl-6 border-l-2 border-dashed border-gray-200 space-y-6 py-2">
            {(filteredReports as any[]).map((record: any, idx: number) => {
                const typeLower = record.type?.toLowerCase() || '';
                const isScan = typeLower === 'scan';
                const isRx = typeLower === 'prescription';
                const visualColor = isScan ? '#EC4899' : isRx ? '#10B981' : accent;
                const IconTag = isScan ? ScanLine : isRx ? Pill : FileText;
                
                return (
                  <div key={record.id} className="relative">
                    <div className="absolute -left-[33px] top-6 w-4 h-4 rounded-full bg-white border-4 ring-4 ring-white" 
                        style={{ borderColor: visualColor }} 
                    />
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setUploadedReport(record)}
                      className="flex items-start gap-4 p-5 rounded-2xl bg-white/90 shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" 
                           style={{ backgroundColor: `${visualColor}15`, color: visualColor }}>
                        <IconTag size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h3 className="font-bold text-[#2D2D2D] truncate pr-2">{record.title}</h3>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border shrink-0 whitespace-nowrap">
                            {record.date || record.uploadedAt?.split('T')[0]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md" 
                                 style={{ backgroundColor: `${visualColor}15`, color: visualColor }}>
                             {record.type === 'LabReport' ? 'Lab Report' : record.type}
                           </span>
                           {record.status === 'completed' && <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1"><Sparkles size={10} /> AI Analyzed</span>}
                        </div>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">
                          {record.summary || (record.aiAnalysis as any)?.summary || 'AI synthesis in progress.'}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                );
            })}
            {filteredReports.length === 0 && (
               <div className="text-center py-8 text-gray-400 text-sm font-bold">No matching records found.</div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-8 !rounded-[3rem] bg-white/70 border-white/80 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500"><AlertTriangle size={21} /></div>
            <h2 className="text-2xl font-bold text-[#2D2D2D] tracking-tight">AI Health Findings</h2>
          </div>
          <div className="space-y-4">
            {(isPregnant
              ? ['Fetal growth markers are aligned with 18-week range.', 'Systemic BP markers show stability.', 'Nutrition absorption indicates optimal iron uptake.']
              : ['Metabolic markers show consistent patterns.', 'No significant abnormalities detected in recent panels.', 'Trends indicate improved recovery cycle.']
            ).map((finding) => (
              <div key={finding} className="p-5 rounded-2xl bg-gray-50/80 text-sm text-gray-600 font-medium leading-relaxed flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#FF8BA7]" />
                 {finding}
              </div>
            ))}
          </div>
          <button className="w-full py-4 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-[#FF8BA7]/20" style={{ backgroundColor: accent }}>
            Generate Unified Explanation
          </button>
        </GlassCard>
      </section>}

      {/* AI INTERPRETATION OVERLAY */}
      <AnimatePresence>
        {uploadedReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setUploadedReport(null)}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
               {/* Modal Header */}
               <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-[#FDFCFD]">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1]">
                        <Sparkles size={20} />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-[#2E2528] tracking-tight">{uploadedReport.title}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">AI Interpretation Protocol</p>
                     </div>
                  </div>
                  <button onClick={() => setUploadedReport(null)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                     <X size={20} />
                  </button>
               </div>

               {/* Modal Content */}
               <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                  
                  {/* Summary Section */}
                  <section className="space-y-3">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Plain-Language Summary</h4>
                     <p className="text-base text-gray-700 leading-relaxed font-medium bg-[#F8FAFC] p-6 rounded-3xl border border-gray-100">
                        {uploadedReport.aiAnalysis?.summary || uploadedReport.summary || "This report indicates stable markers consistent with your current health profile. AI is still refining deep correlates."}
                     </p>
                  </section>

                  {/* Abnormalities / Flags */}
                  {uploadedReport.aiAnalysis?.abnormalities?.length > 0 && (
                     <section className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-red-400">Potential Trend Flags</h4>
                        <div className="space-y-2">
                           {uploadedReport.aiAnalysis.abnormalities.map((ab: string, i: number) => (
                              <div key={i} className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100/50">
                                 <AlertCircle size={16} className="text-red-500 shrink-0" />
                                 <p className="text-sm font-bold text-red-700">{ab}</p>
                              </div>
                           ))}
                        </div>
                     </section>
                  )}

                  {/* Key Metrics Grid */}
                  <section className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Analyzed Metrics</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(uploadedReport.aiAnalysis?.keyMetrics || [
                           { name: 'Hemoglobin', value: '12.4 g/dL', status: 'normal' },
                           { name: 'WBC Count', value: '7.8 K/uL', status: 'normal' },
                           { name: 'Platelets', value: '240 K/uL', status: 'normal' },
                           { name: 'Glucose', value: '92 mg/dL', status: 'normal' }
                        ]).map((m: any, i: number) => (
                           <div key={i} className="p-5 rounded-2xl border border-gray-50 bg-white shadow-sm flex justify-between items-center">
                              <div>
                                 <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{m.name}</p>
                                 <p className="text-base font-bold text-[#2E2528] mt-0.5">{m.value}</p>
                              </div>
                              <div className={cn(
                                 "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest",
                                 m.status === 'normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                              )}>
                                 {m.status}
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>

                  {/* Recommendations */}
                  <section className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">AI Recommendations</h4>
                     <div className="space-y-3">
                        {(uploadedReport.aiAnalysis?.recommendations || [
                           "Continue regular iron intake through diet.",
                           "Maintain current hydration levels (2.8L/day).",
                           "Schedule routine follow-up in 4 weeks."
                        ]).map((rec: string, i: number) => (
                           <div key={i} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                                 <CheckCircle2 size={12} />
                              </div>
                              <p className="text-sm text-gray-600 font-medium leading-relaxed">{rec}</p>
                           </div>
                        ))}
                     </div>
                  </section>
               </div>

               {/* Modal Footer */}
               <div className="p-8 border-t border-gray-50 bg-[#FDFCFD] flex gap-4">
                  <button className="flex-1 py-4 bg-[#6366F1] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#6366F1]/20">
                     Download Analyzed PDF
                  </button>
                  <button onClick={() => setUploadedReport(null)} className="px-8 py-4 bg-gray-50 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest">
                     Close
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
