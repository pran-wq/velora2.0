"use client";

import React from "next";
import { format } from "date-fns";
import { ArrowRight, FileText, Calendar, ShieldCheck, PlusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";

interface HistoryRecordItem {
  id: string;
  patientName: string;
  diseases: string;
  severity: string;
  confidence: number;
  createdAt: string;
}

export function HistoryTable({ records, onSelectReport }: { records: HistoryRecordItem[]; onSelectReport?: (id: string) => void }) {
  if (!records || records.length === 0) {
    return (
      <div className="p-12 border border-white/5 bg-card rounded-3xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-muted-foreground">
          <FileText size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">No reports analyzed yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Upload files or inject sample vectors to generate historical telemetry.</p>
        </div>
        <Link 
          href="/reports" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-neon text-white rounded-xl text-xs font-bold shadow-neon hover:opacity-90 transition-opacity"
        >
          <PlusCircle size={14} /> Upload your first report
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card border border-white/5 rounded-3xl overflow-hidden shadow-glass">
      <div className="p-5 border-b border-white/5 flex justify-between items-center">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
            SQLite Database Query
          </span>
          <h3 className="text-sm font-bold text-foreground mt-0.5">Persistent Analysis Logs</h3>
        </div>
        <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-muted-foreground font-mono">
          {records.length} Sessions
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] text-muted-foreground uppercase tracking-wider bg-white/[0.01]">
              <th className="p-4 font-bold">Patient / Timeline</th>
              <th className="p-4 font-bold">Suspected Condition</th>
              <th className="p-4 font-bold">Confidence</th>
              <th className="p-4 font-bold">Severity</th>
              <th className="p-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {records.map((r) => {
              const isSevere = r.severity.toLowerCase() === 'severe';
              const isMod = r.severity.toLowerCase() === 'moderate';

              return (
                <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-foreground block">{r.patientName}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar size={10} /> {format(new Date(r.createdAt), 'MMM dd, yyyy • HH:mm')}
                    </span>
                  </td>

                  <td className="p-4 font-medium text-foreground/90">
                    {r.diseases}
                  </td>

                  <td className="p-4 font-mono font-bold text-accent">
                    {r.confidence}%
                  </td>

                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                      isSevere ? "bg-destructive/10 text-destructive border-destructive/20" :
                      isMod ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    )}>
                      {r.severity}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    {onSelectReport ? (
                      <button
                        type="button"
                        onClick={() => onSelectReport(r.id)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-foreground transition-all inline-flex items-center gap-1 text-[10px] font-bold"
                      >
                        Inspect <ArrowRight size={12} />
                      </button>
                    ) : (
                      <Link
                        href={`/dashboard?id=${r.id}`}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-foreground transition-all inline-flex items-center gap-1 text-[10px] font-bold"
                      >
                        Inspect <ArrowRight size={12} />
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
