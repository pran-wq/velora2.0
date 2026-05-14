"use client";

import React, { useState } from "next";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../components/sidebar";
import { UploadZone } from "../../components/upload-zone";
import { FileUp, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function ReportsUploadPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Extracting report text…");

  const handleUploadComplete = (payload: any) => {
    if (payload && payload.id) {
      toast.success("Document analyzed and saved locally.");
      router.push(`/dashboard?id=${payload.id}`);
    } else if (payload && payload.diseases) {
      toast.success("Inference processing complete.");
      // route with generic payload trigger or demo
      router.push(`/dashboard?demo=true`);
    } else {
      toast.error("Extraction framework reported fallback structures.");
      router.push(`/dashboard?demo=true`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090E]">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="pb-4 border-b border-white/5">
          <span className="text-[9px] font-black uppercase tracking-widest text-accent block">
            Data Upload Interface
          </span>
          <h2 className="text-xl font-bold text-foreground mt-0.5">Diagnostic Report Reader</h2>
        </div>

        {/* Info strip */}
        <div className="p-4 rounded-2xl bg-card border border-white/5 text-xs text-muted-foreground leading-relaxed">
          Upload multi-page laboratory PDF readouts, standard biochemical analysis snapshot images, or clear text buffers. Our custom Regex pipeline extracts vital parameter signatures for instant deterministic logic comparisons.
        </div>

        {/* Upload Zone container */}
        <div className="pt-2">
          <UploadZone 
            onUploadComplete={handleUploadComplete}
            setIsAnalyzing={setIsAnalyzing}
            setLoadingStatus={setLoadingStatus}
          />
        </div>

        {/* Persistent Warning footer alert */}
        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center mt-12">
          <p className="text-[11px] font-bold text-secondary uppercase tracking-widest flex items-center justify-center gap-1.5">
            <ShieldCheck size={12} /> AI-generated screening results — not a medical diagnosis.
          </p>
        </div>

      </main>
    </div>
  );
}
