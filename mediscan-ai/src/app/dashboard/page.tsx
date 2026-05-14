"use client";

import React, { useState, useEffect, Suspense } from "next";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "../../components/sidebar";
import { BiomarkerCard } from "../../components/biomarker-card";
import { DiseaseCard } from "../../components/disease-card";
import { AnalysisChart } from "../../components/analysis-chart";
import { AISummary } from "../../components/ai-summary";
import { exportReportAsPDF } from "../../lib/pdf-export";
import { DEMO_REPORT_DATA } from "../../data/demo-report";
import { AnalysisPayload } from "../../types/medical";
import { Sparkles, Download, RefreshCw, AlertTriangle, FileText, Activity } from "lucide-react";
import { toast } from "sonner";

function DashboardContent() {
  const searchParams = useSearchParams();
  const demoTrigger = searchParams.get("demo");
  const reportIdParam = searchParams.get("id");

  const [analysisResult, setAnalysisResult] = useState<AnalysisPayload | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Extracting report text…");

  // Load demo record if URL param specifies
  useEffect(() => {
    if (demoTrigger === "true") {
      setIsAnalyzing(true);
      setLoadingStatus("Injecting pre-loaded demo telemetry data...");
      
      // Inject standard demo payload
      setTimeout(() => {
        fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: DEMO_REPORT_DATA.reportText })
        })
        .then(r => r.json())
        .then(data => {
          setAnalysisResult(data);
          toast.success("Demo dataset injected successfully.");
        })
        .catch(err => console.error(err))
        .finally(() => setIsAnalyzing(false));
      }, 1000);
    } else if (reportIdParam) {
      // Query historical storage if ID specified
      setIsAnalyzing(true);
      setLoadingStatus("Retrieving database report log...");
      fetch("/api/history")
        .then(r => r.json())
        .then(data => {
          if (data && data.records) {
            const found = data.records.find((rec: any) => rec.id === reportIdParam);
            if (found) {
              // Parse back out
              setAnalysisResult({
                patientName: found.patientName,
                age: found.age,
                gender: found.gender,
                biomarkers: found.biomarkers || [],
                diseases: found.diseases,
                severity: found.severity,
                confidence: found.confidence,
                summary: typeof found.summary === 'string' ? {
                  detectedAbnormalities: found.biomarkers?.filter((b:any)=>b.status==='Abnormal').map((b:any)=>b.name) || [],
                  simplifiedExplanation: found.summary,
                  possibleDisease: found.diseases,
                  severity: found.severity,
                  recommendations: ['Maintain strict clinical supervision', 'Review secondary blood panel metrics'],
                  disclaimer: 'AI-generated screening results — not a medical diagnosis.'
                } : found.summary,
                reportText: found.reportText
              });
              toast.success("Historical report restored.");
            }
          }
        })
        .catch(err => console.error(err))
        .finally(() => setIsAnalyzing(false));
    }
  }, [demoTrigger, reportIdParam]);

  const handleExportTrigger = () => {
    toast.info("Generating high-resolution printable document...");
    exportReportAsPDF("printable-analysis-canvas", `MediScan_AI_Screening_${Date.now()}.pdf`);
  };

  return (
    <div className="flex min-h-screen bg-[#09090E]">
      {/* Sidebar fixed nav */}
      <Sidebar />

      {/* Primary Dashboard UI */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1400px] mx-auto space-y-6">
        
        {/* Top interactive Action Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-accent block">
              Screening Dashboard Matrix
            </span>
            <h2 className="text-xl font-bold text-foreground mt-0.5">Automated Inference Hub</h2>
          </div>

          <div className="flex items-center gap-2.5">
            {analysisResult && (
              <button
                type="button"
                onClick={handleExportTrigger}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-foreground border border-white/10 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 shadow-sm shrink-0"
              >
                <Download size={14} className="text-secondary" /> Download PDF Report
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                // inject quick query
                setIsAnalyzing(true);
                fetch("/api/analyze", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ text: DEMO_REPORT_DATA.reportText })
                })
                .then(r => r.json())
                .then(data => setAnalysisResult(data))
                .finally(() => setIsAnalyzing(false));
              }}
              className="px-4 py-2 bg-gradient-neon text-white rounded-xl text-xs font-bold shadow-neon hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 shrink-0"
            >
              <Sparkles size={12} /> Inject Sample Data
            </button>
          </div>
        </div>

        {/* Loading overlay layer */}
        {isAnalyzing && (
          <div className="p-16 rounded-3xl bg-card border border-white/5 shadow-glass text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto animate-pulse">
              <RefreshCw size={24} className="text-accent animate-spin" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground animate-pulse">{loadingStatus}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Executing standard Tesseract engine mapping algorithms...</p>
            </div>
          </div>
        )}

        {/* Analysis Results view rendered into custom container ID for PDF target */}
        {!isAnalyzing && analysisResult && (
          <div id="printable-analysis-canvas" className="space-y-6 pt-2">
            
            {/* Patient Header tag */}
            <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-sm text-primary">
                  {analysisResult.patientName.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">{analysisResult.patientName}</span>
                  <span className="text-[10px] text-muted-foreground block">
                    Age {analysisResult.age} • {analysisResult.gender}
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-[10px] font-bold text-secondary">
                Rule Target Status Active
              </span>
            </div>

            {/* Disease logic card mapping */}
            <DiseaseCard 
              diseases={analysisResult.diseases}
              confidence={analysisResult.confidence}
              severity={analysisResult.severity}
            />

            {/* Biomarker levels card */}
            <BiomarkerCard biomarkers={analysisResult.biomarkers} />

            {/* Charts view */}
            <AnalysisChart biomarkers={analysisResult.biomarkers} />

            {/* AI formatting overview explanation */}
            {analysisResult.summary && (
              <AISummary summary={analysisResult.summary} />
            )}

            {/* Mandatory String included inline inside exported area */}
            <div className="p-4 rounded-xl bg-card text-center border border-white/5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                AI-generated screening results — not a medical diagnosis.
              </p>
            </div>

          </div>
        )}

        {/* Empty placeholder view */}
        {!isAnalyzing && !analysisResult && (
          <div className="p-16 rounded-3xl bg-card border border-white/5 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-muted-foreground">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">No screening data initialized</p>
              <p className="text-xs text-muted-foreground mt-1">
                Trigger the sample injector button above or visit the Upload Report tab to append source inputs.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090E] p-12 text-center text-xs text-muted-foreground">Loading interactive matrix client...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
