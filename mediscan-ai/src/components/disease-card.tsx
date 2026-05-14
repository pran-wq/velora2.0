"use client";

import React from "next";
import { cn } from "../lib/utils";
import { AlertTriangle, ShieldCheck } from "lucide-react";

interface DiseaseCardProps {
  diseases: string;
  confidence: number;
  severity: string;
}

export function DiseaseCard({ diseases, confidence, severity }: DiseaseCardProps) {
  const isHighSeverity = severity.toLowerCase() === 'severe';
  const isModSeverity = severity.toLowerCase() === 'moderate';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* Primary Suspected Diagnosis */}
      <div className="bg-card border border-white/5 rounded-3xl p-5 shadow-glass relative overflow-hidden md:col-span-1">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
          Rule Inference Output
        </span>
        <h3 className="text-base font-black text-foreground tracking-tight leading-snug">
          {diseases}
        </h3>
        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <ShieldCheck size={12} className="text-accent" /> Deterministic decision matrix
        </div>
      </div>

      {/* Confidence Score Gauge */}
      <div className="bg-card border border-white/5 rounded-3xl p-5 shadow-glass flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
              Inference Likelihood
            </span>
            <span className="text-sm font-black text-accent">{confidence}%</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Confidence adjusted by composite logic mapping</p>
        </div>

        {/* Confidence bar visual component */}
        <div className="mt-3">
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-neon rounded-full transition-all duration-1000" 
              style={{ width: `${confidence}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Severity Tiers */}
      <div className="bg-card border border-white/5 rounded-3xl p-5 shadow-glass flex flex-col justify-between">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
            Severity Evaluation Tier
          </span>
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border",
              isHighSeverity ? "bg-destructive/10 text-destructive border-destructive/20" :
              isModSeverity ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
              "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            )}>
              {severity} Tier
            </span>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground mt-3">
          Determined by volume of out-of-range clinical parameters
        </p>
      </div>

    </div>
  );
}
