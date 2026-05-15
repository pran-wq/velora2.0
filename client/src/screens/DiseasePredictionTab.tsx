import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Radar, ScanLine, Sparkles } from 'lucide-react';

export default function DiseasePredictionTab() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-[#EBF1F8] to-[#F9FBFC] p-4 md:p-8 pb-36 font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-[960px] mx-auto space-y-6 md:space-y-8">
        <header className="text-center md:text-left space-y-3 px-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 text-[10px] font-black uppercase tracking-widest mx-auto md:mx-0">
            <Sparkles size={12} className="animate-pulse" />
            AI diagnostics & outbreak prediction
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-slate-900">Predictive health hub</h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium max-w-xl mx-auto md:mx-0">
            National-scale syndromic fusion and imaging intelligence — demo-ready, minimal, clinically framed storytelling.
          </p>
        </header>

        <section className="space-y-5 md:space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Link
              to="/outbreak-intelligence"
              className="group relative block overflow-hidden rounded-[32px] border border-indigo-100/80 bg-gradient-to-br from-white/90 via-indigo-50/40 to-white/80 backdrop-blur-xl p-8 md:p-12 shadow-[0_24px_60px_-20px_rgba(99,102,241,0.25)] hover:shadow-[0_28px_70px_-18px_rgba(99,102,241,0.35)] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/10 pointer-events-none" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 md:h-24 md:w-24">
                  <Radar className="h-9 w-9 md:h-11 md:w-11" />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-indigo-600">Primary module</p>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">Outbreak Intelligence</h2>
                  <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed max-w-2xl">
                    City risk signals, syndromic spikes, wearable anomalies, environment, and early-warning alerts in one premium
                    dashboard.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-sm font-black uppercase tracking-widest text-indigo-600 md:flex-col md:items-end">
                  <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-5 py-3 shadow-sm group-hover:gap-3 transition-all">
                    Open
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
          >
            <Link
              to="/medical-imaging"
              className="group relative block overflow-hidden rounded-[32px] border border-cyan-100/80 bg-gradient-to-br from-white/90 via-cyan-50/35 to-white/80 backdrop-blur-xl p-8 md:p-12 shadow-[0_24px_60px_-20px_rgba(14,165,233,0.2)] hover:shadow-[0_28px_70px_-18px_rgba(14,165,233,0.28)] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-indigo-500/10 pointer-events-none" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 md:h-24 md:w-24">
                  <ScanLine className="h-9 w-9 md:h-11 md:w-11" />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-700">Diagnostics</p>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">AI Medical Report Analyzer</h2>
                  <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed max-w-2xl">
                    Upload labs, PDFs, or imaging screenshots for live AI analysis powered by Gemini on your dev server.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-sm font-black uppercase tracking-widest text-cyan-700 md:flex-col md:items-end">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/80 px-5 py-3 shadow-sm group-hover:gap-3 transition-all">
                    Open
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>

        <footer className="pt-4 pb-2 text-center">
          <div className="inline-block py-2.5 px-6 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              AI-generated guidance — not a medical diagnosis. Demonstration data only.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
