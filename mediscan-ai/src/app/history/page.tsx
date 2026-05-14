"use client";

import React, { useState, useEffect } from "next";
import { Sidebar } from "../../components/sidebar";
import { HistoryTable } from "../../components/history-table";
import { History, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function HistoryPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = () => {
    setIsLoading(true);
    fetch("/api/history")
      .then(r => r.json())
      .then(data => {
        if (data && data.records) {
          setRecords(data.records);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#09090E]">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-accent block">
              SQLite Storage Logs
            </span>
            <h2 className="text-xl font-bold text-foreground mt-0.5">Chronological Session History</h2>
          </div>

          <button
            type="button"
            onClick={() => {
              toast.info("Refreshing database indices...");
              fetchLogs();
            }}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground bg-card rounded-3xl border border-white/5 animate-pulse">
            Querying local device database entries...
          </div>
        ) : (
          <HistoryTable records={records} />
        )}

        <div className="p-4 text-center mt-12">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            AI-generated screening results — not a medical diagnosis.
          </p>
        </div>

      </main>
    </div>
  );
}
