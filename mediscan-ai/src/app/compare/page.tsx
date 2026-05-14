"use client";

import React, { useState, useEffect } from "next";
import { Sidebar } from "../../components/sidebar";
import { CompareChart } from "../../components/compare-chart";
import { DEMO_REPORT_DATA } from "../../data/demo-report";
import { parseBiomarkers } from "../../lib/parser";
import { executeCompareEngine } from "../../lib/compare-engine";
import { GitCompare, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function ComparePage() {
  const [trends, setTrends] = useState<any[]>([]);
  const [riskEscalation, setRiskEscalation] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching previous and latest or compare sample data triggers
    setIsLoading(true);
    setTimeout(() => {
      // Create baseline parameters
      const baseText = "Hemoglobin: 11.2 g/dL, Ferritin: 18 ng/mL, Serum Iron: 50 ug/dL, Glucose: 90 mg/dL, TSH: 2.5 uIU/mL";
      const currentText = DEMO_REPORT_DATA.reportText;

      const prevB = parseBiomarkers(baseText);
      const currB = parseBiomarkers(currentText);

      const res = executeCompareEngine(prevB, currB);
      setTrends(res.trends);
      setRiskEscalation(res.riskEscalation);
      setIsLoading(false);
      toast.success("Longitudinal comparison generated.");
    }, 800);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#09090E]">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        
        <div className="pb-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-accent block">
              Multi-Session Trajectory Tracking
            </span>
            <h2 className="text-xl font-bold text-foreground mt-0.5">Compare Historical Reports</h2>
          </div>

          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-muted-foreground font-mono">
            Delta Engine
          </span>
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-2xl bg-card border border-white/5 text-xs text-muted-foreground leading-relaxed">
          The longitudinal comparison algorithm maps successive biomarker extractions to isolate directional progress. Systemic improvements or escalating risk arrays are calculated autonomously from local historical databases.
        </div>

        {isLoading ? (
          <div className="p-16 rounded-3xl bg-card border border-white/5 text-center text-xs text-muted-foreground animate-pulse space-y-3">
            <RefreshCw size={20} className="animate-spin text-accent mx-auto" />
            <p>Comparing historical reports progression arrays...</p>
          </div>
        ) : (
          <CompareChart trends={trends} riskEscalation={riskEscalation} />
        )}

        {/* Footer alert */}
        <div className="p-4 text-center mt-12">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            AI-generated screening results — not a medical diagnosis.
          </p>
        </div>

      </main>
    </div>
  );
}
