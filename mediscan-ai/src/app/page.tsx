"use client";

import React from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, ShieldCheck, FileText, Sparkles, Database } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Dynamic background lighting elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/10 via-secondary/10 to-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/5 relative z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-neon p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#09090E] rounded-[10px] flex items-center justify-center">
              <Activity size={16} className="text-accent" />
            </div>
          </div>
          <span className="font-bold text-sm tracking-widest uppercase bg-gradient-neon bg-clip-text text-transparent font-mono">
            MediScan AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-muted-foreground font-mono">
            <Database size={10} className="text-secondary" /> Local SQLite Hub
          </span>
          <Link 
            href="/dashboard"
            className="text-xs font-bold text-foreground hover:text-accent transition-colors"
          >
            Enter Workspace
          </Link>
        </div>
      </header>

      {/* Hero section main block */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto relative z-10 py-12">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Badge string */}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-accent shadow-glass">
            <Sparkles size={12} /> Local-First Hackathon Application Blueprint
          </span>

          {/* Mandated Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
            MediScan AI — Smart Medical Report Screening
          </h1>

          {/* Mandated Subtext */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Upload reports and receive AI-powered biomarker analysis.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* Upload Report link */}
            <Link
              href="/reports"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-neon text-white font-bold text-xs uppercase tracking-widest shadow-neon hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              Upload Report <ArrowRight size={14} />
            </Link>

            {/* Use Demo Report link */}
            <Link
              href="/dashboard?demo=true"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-card border border-white/10 text-foreground font-bold text-xs uppercase tracking-widest hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2"
            >
              <FileText size={14} className="text-secondary" /> Use Demo Report
            </Link>
          </div>

          {/* Feature readouts strip */}
          <div className="grid grid-cols-3 gap-4 pt-12 max-w-lg mx-auto text-center border-t border-white/5">
            <div>
              <span className="text-lg font-black block text-foreground font-mono">100%</span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block mt-0.5">Local SQLite</span>
            </div>
            <div>
              <span className="text-lg font-black block text-accent font-mono">Regex</span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block mt-0.5">Biomarker OCR</span>
            </div>
            <div>
              <span className="text-lg font-black block text-secondary font-mono">Deterministic</span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block mt-0.5">Rule Builder</span>
            </div>
          </div>
        </motion.div>

      </main>

      {/* Footer Banner containing Mandated Text */}
      <footer className="p-4 border-t border-white/5 text-center relative z-10 bg-black/40 backdrop-blur-md">
        <p className="text-[11px] font-bold text-secondary uppercase tracking-widest flex items-center justify-center gap-2">
          <ShieldCheck size={12} /> AI-generated screening results — not a medical diagnosis.
        </p>
      </footer>

    </div>
  );
}
