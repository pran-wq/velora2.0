import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  FileText,
  UploadCloud,
  AlertCircle,
  Download,
  Sparkles,
  Shield,
  Stethoscope,
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  analyzeMedicalReportRemote,
  buildMedicalReportDownloadText,
  type MedicalReportAnalysisResult,
} from '../services/medicalReportService';

function riskBadge(r: MedicalReportAnalysisResult['severityLevel']) {
  if (r === 'Critical') return 'bg-red-100 text-red-800 border-red-200';
  if (r === 'High') return 'bg-rose-50 text-rose-700 border-rose-100';
  if (r === 'Moderate') return 'bg-amber-50 text-amber-800 border-amber-100';
  return 'bg-emerald-50 text-emerald-800 border-emerald-100';
}

export default function MedicalImagingAI() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [progressIdx, setProgressIdx] = useState(0);
  const progressMessages = [
    'Analyzing biomarkers…',
    'Generating AI insights…',
    'Building health profile…',
    'Cross-referencing indicators…',
  ];
  const [result, setResult] = useState<MedicalReportAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const assignFile = (f: File | null) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) assignFile(f);
  }, []);

  const runAnalysis = async () => {
    if (!file && !pastedText.trim()) {
      setError('Upload a PDF or paste report text.');
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    setProgressIdx(0);
    setProgress(progressMessages[0]);
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % progressMessages.length;
      setProgressIdx(idx);
      setProgress(progressMessages[idx]);
    }, 900);
    try {
      const data = await analyzeMedicalReportRemote(file, pastedText || undefined);
      setResult(data);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Analysis failed');
      setResult(null);
    } finally {
      clearInterval(interval);
      setProgress(null);
      setBusy(false);
    }
  };

  const downloadSummary = () => {
    if (!result) return;
    const label = file?.name || (pastedText.trim() ? 'pasted-report.txt' : 'report');
    const blob = new Blob([buildMedicalReportDownloadText(result, label)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-report-summary-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-[#EBF1F8] to-[#F9FBFC] p-4 md:p-8 pb-36 font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-[920px] mx-auto space-y-8">
        <Link
          to="/predict"
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to prediction hub
        </Link>

        <header className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-[32px] border border-blue-50/60 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.06)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-3">
            <Sparkles size={12} /> AI-Powered · Local
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-slate-900">AI Medical Report Analyzer</h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium mt-2">
            Upload a readable PDF or paste report text. The Aether AI engine extracts key biomarkers and generates a professional clinical summary instantly.
          </p>
        </header>

        <section
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            'bg-white/70 backdrop-blur-xl rounded-[28px] p-6 md:p-8 border shadow-[0_4px_20px_-4px_rgba(30,58,138,0.05)] transition-colors',
            dragOver ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-blue-50'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/*,.csv,text/plain,.dcm,application/dicom"
            className="hidden"
            onChange={(e) => assignFile(e.target.files?.[0] ?? null)}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center border-2 border-dashed border-blue-100 rounded-[24px] p-10 cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/20 transition-colors"
          >
            <UploadCloud className="text-indigo-500 mb-3" size={36} />
            <span className="text-sm font-black text-slate-900">Drag & drop or tap to upload</span>
            <span className="text-xs text-slate-500 mt-1 font-medium text-center max-w-md">
              PDF medical reports · lab text · blood panels · imaging summaries
            </span>
          </button>

          {file && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="text-indigo-500 shrink-0" size={18} />
                <p className="text-xs font-bold text-slate-700 truncate">
                  Selected: <span className="text-slate-900">{file.name}</span>
                </p>
              </div>
              <button type="button" onClick={() => assignFile(null)} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-700">
                Clear file
              </button>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Optional: paste extracted text / OCR</label>
            <textarea
              value={pastedText}
              onChange={(e) => {
                setPastedText(e.target.value);
                setError(null);
              }}
              rows={4}
              placeholder="Paste lab values or OCR output here if PDF upload is not available…"
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-200 outline-none resize-y"
            />
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs font-medium text-amber-900">{error}</div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={runAnalysis}
              disabled={busy || (!file && !pastedText.trim())}
              className="px-8 py-3.5 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-widest shadow-lg disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {busy ? <Loader2 className="animate-spin" size={16} /> : <Stethoscope size={16} />}
              Run AI analysis
            </button>
            {result && (
              <button
                type="button"
                onClick={downloadSummary}
                className="px-6 py-3.5 rounded-full border border-slate-200 bg-white text-xs font-black uppercase tracking-widest text-slate-700 inline-flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <Download size={16} />
                Download summary
              </button>
            )}
          </div>

          <AnimatePresence>
            {busy && progress && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 flex items-center gap-3 text-sm font-bold text-indigo-600"
              >
                <Loader2 className="animate-spin shrink-0" size={18} />
                <span>{progress}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/75 backdrop-blur-xl rounded-[28px] p-6 border border-blue-50 shadow-sm flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Report type</p>
                  <p className="text-lg font-black mt-2 text-slate-900">{result.reportType}</p>
                </div>
                <div className={cn('rounded-[28px] p-6 border flex flex-col justify-center', riskBadge(result.severityLevel))}>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Severity</p>
                  <p className="text-3xl font-black mt-2">{result.severityLevel}</p>
                </div>
                <div className="bg-white/75 backdrop-blur-xl rounded-[28px] p-6 border border-blue-50 shadow-sm flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Confidence</p>
                  <p className="text-3xl font-black mt-2 text-indigo-700">{result.aiConfidenceScore}%</p>
                </div>
                <div className="bg-white/75 backdrop-blur-xl rounded-[28px] p-6 border border-blue-50 shadow-sm flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Indicators</p>
                  <p className="text-3xl font-black mt-2 text-slate-900">{result.abnormalIndicators.length}</p>
                </div>
              </div>

              <div className="bg-white/75 backdrop-blur-xl rounded-[28px] p-6 border border-blue-50 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Shield size={14} className="text-indigo-500" />
                  Executive Summary
                </div>
                <p className="text-sm md:text-base text-slate-800 font-medium leading-relaxed">{result.executiveSummary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/75 backdrop-blur-xl rounded-[24px] p-5 border border-blue-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
                    <AlertCircle size={12} /> Key Findings
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    {result.keyFindings.map((a) => (
                      <li key={a} className="flex gap-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/75 backdrop-blur-xl rounded-[24px] p-5 border border-blue-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
                    <AlertCircle size={12} /> Abnormal Indicators
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    {result.abnormalIndicators.length ? result.abnormalIndicators.map((a) => (
                      <li key={a} className="flex gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        {a}
                      </li>
                    )) : <li className="text-slate-500 italic">None flagged</li>}
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50/80 to-white rounded-[24px] p-6 border border-indigo-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3">AI Risk Assessment</p>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">{result.aiRiskAssessment}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/75 backdrop-blur-xl rounded-[24px] p-5 border border-blue-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Lifestyle Recommendations</p>
                  <ol className="space-y-2 list-decimal pl-4 text-sm text-slate-800 font-medium">
                    {result.lifestyleRecommendations.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                </div>
                <div className="bg-white/75 backdrop-blur-xl rounded-[24px] p-5 border border-blue-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Suggested Follow-Up</p>
                  <ol className="space-y-2 list-decimal pl-4 text-sm text-slate-800 font-medium">
                    {result.suggestedFollowUp.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="text-center">
          <div className="inline-block py-2.5 px-6 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              AI assistance only. Not a substitute for professional medical advice.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
