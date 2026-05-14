"use client";

import React from "next";
import { cn } from "../lib/utils";
import { ExtractedBiomarker } from "../types/medical";

export function BiomarkerCard({ biomarkers }: { biomarkers: ExtractedBiomarker[] }) {
  return (
    <div className="bg-card border border-white/5 rounded-3xl p-6 shadow-glass space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
            Extracted Clinical Tensors
          </span>
          <h3 className="text-sm font-bold text-foreground mt-0.5">Biomarker Level Readouts</h3>
        </div>
        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold text-muted-foreground">
          {biomarkers.length} Found
        </span>
      </div>

      {/* Tensors grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {biomarkers.map((b, i) => {
          const isAbnormal = b.status === 'Abnormal';
          const isBorderline = b.status === 'Borderline';
          
          return (
            <div 
              key={i} 
              className={cn(
                "p-3 rounded-xl border flex items-center justify-between transition-all",
                isAbnormal ? "bg-destructive/5 border-destructive/20" :
                isBorderline ? "bg-amber-500/5 border-amber-500/20" :
                "bg-white/[0.01] border-white/5"
              )}
            >
              <div>
                <span className="text-xs font-bold text-foreground block">{b.name}</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">
                  Range: {b.min} - {b.max} {b.unit}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className={cn(
                  "text-xs font-black block font-mono",
                  isAbnormal ? "text-destructive" :
                  isBorderline ? "text-amber-500" :
                  "text-emerald-500"
                )}>
                  {b.value} {b.unit}
                </span>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-wider block mt-0.5",
                  isAbnormal ? "text-destructive" :
                  isBorderline ? "text-amber-500" :
                  "text-emerald-500"
                )}>
                  {b.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
