"use client";

import React from "next";
import { Sparkles, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { AISummaryPayload } from "../types/medical";

export function AISummary({ summary }: { summary: AISummaryPayload }) {
  return (
    <div className="bg-card border border-white/5 rounded-3xl p-6 shadow-glass space-y-5 relative overflow-hidden">
      {/* Glow backdrop */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-secondary" />
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">AI Screening Synthesis</h3>
      </div>

      {/* Summary simplified block */}
      <div className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
          Automated Context Explanation
        </span>
        <p className="text-xs text-foreground/90 leading-relaxed font-medium">
          {summary.simplifiedExplanation}
        </p>
      </div>

      {/* Detected Abnormalities array */}
      <div className="space-y-2">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
          Flagged Parameter Irregularities
        </span>
        <div className="flex flex-wrap gap-1.5">
          {summary.detectedAbnormalities.map((item, i) => (
            <span 
              key={i} 
              className="px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-bold"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Recommendations array */}
      <div className="space-y-2">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
          Clinical Guidance & Preventative Steps
        </span>
        <div className="space-y-1.5">
          {summary.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.01] border border-white/5">
              <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-[8px] font-black mt-0.5">
                {i + 1}
              </span>
              <p className="text-xs text-muted-foreground font-medium leading-tight">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Disclaimer footer alert */}
      <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/20 flex gap-2 items-start text-[10px] text-secondary/90 leading-tight">
        <Info size={14} className="shrink-0 mt-0.5 text-secondary" />
        <p className="font-bold">{summary.disclaimer}</p>
      </div>
    </div>
  );
}
