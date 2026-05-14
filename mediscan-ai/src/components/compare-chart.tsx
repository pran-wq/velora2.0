"use client";

import React from "next";
import { ArrowUpRight, ArrowDownRight, ArrowRight, ShieldAlert } from "lucide-react";
import { HistoricalTrend } from "../types/medical";
import { cn } from "../lib/utils";

interface CompareChartProps {
  trends: HistoricalTrend[];
  riskEscalation: string;
}

export function CompareChart({ trends, riskEscalation }: CompareChartProps) {
  return (
    <div className="bg-card border border-white/5 rounded-3xl p-6 shadow-glass space-y-5">
      <div>
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
          Longitudinal Tracking
        </span>
        <h3 className="text-sm font-bold text-foreground mt-0.5">Progression Analysis Matrix</h3>
      </div>

      {/* Trajectory mapping indicators */}
      <div className="space-y-2.5">
        {trends.map((t, i) => {
          const isImproved = t.status === 'improved';
          const isWorsened = t.status === 'worsened';
          const isIncreasing = t.trend === 'increasing';
          const isDeclining = t.trend === 'declining';

          return (
            <div key={i} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-foreground block">{t.biomarker}</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">
                  Previous: <strong className="text-foreground/80 font-mono">{t.previous}</strong> → Current: <strong className="text-foreground font-mono">{t.current}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Trend state string */}
                <span className={cn(
                  "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                  isImproved ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                  isWorsened ? "bg-destructive/10 text-destructive border-destructive/20" :
                  "bg-white/5 text-muted-foreground border-white/10"
                )}>
                  {t.status}
                </span>

                {/* Arrow icon */}
                <span className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                  isIncreasing ? "bg-rose-500/10 text-rose-500" :
                  isDeclining ? "bg-emerald-500/10 text-emerald-500" :
                  "bg-white/5 text-muted-foreground"
                )}>
                  {isIncreasing ? <ArrowUpRight size={14} /> :
                   isDeclining ? <ArrowDownRight size={14} /> :
                   <ArrowRight size={14} />}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk escalation summary */}
      <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
          <ShieldAlert size={12} /> Systemic Risk Escalation Status
        </div>
        <p className="text-xs text-foreground/90 font-medium leading-relaxed">
          {riskEscalation}
        </p>
      </div>

      <div className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground text-center">
        AI-generated screening results — not a medical diagnosis.
      </div>
    </div>
  );
}
