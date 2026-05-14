"use client";

import React from "next";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { ExtractedBiomarker } from "../types/medical";

export function AnalysisChart({ biomarkers }: { biomarkers: ExtractedBiomarker[] }) {
  // Map parameters to normalized bar distributions so they all render clearly
  // Let's calculate percentage matching relative to the normal bounds
  const chartData = biomarkers.map(b => {
    const min = b.min || 0;
    const max = b.max || 100;
    const mid = (min + max) / 2;
    // deviation scalar
    const percentOfMax = Math.round((b.value / max) * 100);
    
    return {
      name: b.name,
      value: b.value,
      unit: b.unit,
      status: b.status,
      displayVal: percentOfMax,
      actualMin: min,
      actualMax: max
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#101018] p-3 rounded-xl border border-white/10 text-xs shadow-xl space-y-1">
          <p className="font-bold text-foreground">{data.name}</p>
          <p className="font-mono text-accent">Readout: {data.value} {data.unit}</p>
          <p className="text-[10px] text-muted-foreground">Standard Range: {data.actualMin} - {data.actualMax} {data.unit}</p>
          <p className="text-[9px] uppercase font-bold tracking-wider text-secondary mt-1">{data.status}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-white/5 rounded-3xl p-6 shadow-glass space-y-4">
      <div>
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
          Comparative Analytics
        </span>
        <h3 className="text-sm font-bold text-foreground mt-0.5">Normalized Parameter Deviations</h3>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 9, fill: '#94A3B8' }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 9, fill: '#94A3B8' }} 
              domain={[0, 150]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <ReferenceLine y={100} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            <Bar 
              dataKey="displayVal" 
              radius={[6, 6, 0, 0]}
              fill="#6366F1"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-white/5">
        <span>Dashed boundary indicates standardized upper ceiling parameter thresholds</span>
        <span className="text-accent font-bold">Local Rendering</span>
      </div>
    </div>
  );
}
