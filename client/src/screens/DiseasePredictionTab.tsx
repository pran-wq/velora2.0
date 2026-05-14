import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, 
  Sparkles, Stethoscope, UploadCloud, User, Calendar, ChevronRight, 
  ShieldAlert, FileText, Layers, Heart, ArrowRight, RefreshCw, Check
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip 
} from 'recharts';
import { cn } from '../lib/utils';

// ==================================================
// DEMO DATA SPECIFIED IN USER REQUEST
// ==================================================
const patientData = {
  patient: "Rahul Sharma",
  age: 32,
  gender: "Male",

  previousReports: [
    {
      month: "January",
      hemoglobin: 13.2,
      glucose: 96,
      tsh: 2.1
    },
    {
      month: "March",
      hemoglobin: 11.4,
      glucose: 118,
      tsh: 3.8
    },
    {
      month: "May",
      hemoglobin: 9.1,
      glucose: 142,
      tsh: 5.2
    }
  ],

  symptoms: [
    "fatigue",
    "dizziness",
    "weight gain"
  ]
};

// Formatted chart datasets for pristine Recharts rendering
const hbChartData = patientData.previousReports.map(r => ({
  month: r.month.slice(0, 3),
  value: r.hemoglobin,
  label: `${r.hemoglobin} g/dL`
}));

const glucoseChartData = patientData.previousReports.map(r => ({
  month: r.month.slice(0, 3),
  value: r.glucose,
  label: `${r.glucose} mg/dL`
}));

const tshChartData = patientData.previousReports.map(r => ({
  month: r.month.slice(0, 3),
  value: r.tsh,
  label: `${r.tsh} uIU/mL`
}));

export default function DiseasePredictionTab() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showLogicDetails, setShowLogicDetails] = useState(false);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadSuccess(false);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    }, 1500);
  };

  // Custom standard tooltip for Recharts to maintain minimal crisp aesthetic
  const CustomChartTooltip = ({ active, payload, unit }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-blue-100 text-xs font-bold text-slate-800">
          <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-medium">Recorded Value</span>
          <span className="text-blue-600 font-mono text-sm">{payload[0].value}</span> {unit}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-[#EBF1F8] to-[#F9FBFC] p-4 md:p-8 pb-36 font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Toast Notification for simulated actions */}
      <AnimatePresence>
        {uploadSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check size={14} />
            </div>
            <p className="text-xs font-bold tracking-wide">New medical records processed successfully.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1240px] mx-auto space-y-8">
        
        {/* ================================================== */}
        {/* TOP SECTION HEADER & SUBTITLE                      */}
        {/* ================================================== */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-[32px] border border-blue-50/60 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.03)]">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} className="animate-pulse" /> Personal Preventive Health Intelligence
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-slate-900">
              Personal Health Prediction
            </h1>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
              AI-powered early risk detection using biomarker trends and historical health analysis.
            </p>
          </div>

          {/* Patient Card Block */}
          <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-5 rounded-2xl border border-blue-100/60 shrink-0 self-start lg:self-auto w-full lg:w-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-bold border border-blue-50 shrink-0">
                <User size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">{patientData.patient}</h4>
                <p className="text-xs text-slate-500 font-medium">{patientData.age} Years • {patientData.gender} Profile</p>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-100/40">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Active Symptom Markers</span>
              <div className="flex flex-wrap gap-1.5">
                {patientData.symptoms.map((symptom, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-md bg-white text-slate-700 border border-blue-100/40 text-[10px] font-bold capitalize shadow-2xs">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ================================================== */}
        {/* SUMMARY CARDS (4 METRICS)                          */}
        {/* ================================================== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          
          {/* Card 1: Overall Health Score */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-white p-6 rounded-[24px] border border-blue-50 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)] relative overflow-hidden group hover:border-blue-100 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 block">Overall Health Score</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">78%</span>
              <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                <TrendingDown size={12} /> Sub-optimal
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-2">Declining stability detected</p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* Card 2: Predicted Risk Level */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white p-6 rounded-[24px] border border-blue-50 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)] relative overflow-hidden group hover:border-blue-100 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 block">Predicted Risk Level</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-500 tracking-tight">Moderate</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-2">Requires proactive adjustments</p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 opacity-20 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* Card 3: Biomarkers at Risk */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-white p-6 rounded-[24px] border border-blue-50 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)] relative overflow-hidden group hover:border-blue-100 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 block">Biomarkers at Risk</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Layers size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-600 tracking-tight">3</span>
              <span className="text-xs font-bold text-slate-700">Parameters</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-2">Hemoglobin, Glucose, TSH</p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 opacity-20 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* Card 4: Prediction Confidence */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white p-6 rounded-[24px] border border-blue-50 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)] relative overflow-hidden group hover:border-blue-100 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 block">Prediction Confidence</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-indigo-600 tracking-tight">89%</span>
              <span className="text-[10px] font-bold text-emerald-600">High Trust</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-2">Deterministic logic index</p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity" />
          </motion.div>

        </section>

        {/* ================================================== */}
        {/* EARLY WARNING BANNER                               */}
        {/* ================================================== */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50/60 border border-amber-200/80 rounded-[24px] p-5 md:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0 mt-0.5 sm:mt-0">
              <ShieldAlert size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 block">Early Warning Flag</span>
              <p className="text-sm md:text-base font-bold text-slate-900 mt-0.5 leading-snug">
                “Biomarker trends indicate declining health patterns over the last 3 reports.”
              </p>
              <span className="text-xs text-amber-700/80 font-medium block mt-1">
                Monitored trajectory intervals: January → March → May
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={simulateUpload}
            disabled={isUploading}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs shadow-xs border border-amber-200 inline-flex items-center gap-2 shrink-0 transition-all active:scale-95 disabled:opacity-50 w-full sm:w-auto justify-center"
          >
            {isUploading ? (
              <>
                <RefreshCw size={14} className="animate-spin text-amber-600" /> Updating Data…
              </>
            ) : (
              <>
                <UploadCloud size={14} className="text-amber-600" /> Refresh Telemetry
              </>
            )}
          </button>
        </motion.div>

        {/* ================================================== */}
        {/* DISPLAY RESULTS & RISK INDICATOR ROW               */}
        {/* ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Predicted Risks List */}
          <div className="lg:col-span-7 bg-white rounded-[28px] p-6 md:p-8 border border-blue-50 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">Inference Deductions</span>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Predicted Early Risks</h3>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  Confidence: <strong className="text-indigo-600">89%</strong>
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Iron Deficiency Anemia", severity: "High Warning", trigger: "Hemoglobin drops + low storage", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
                  { name: "Early Thyroid Dysfunction", severity: "Monitored", trigger: "TSH elevation observed", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
                  { name: "Pre-diabetic Trend", severity: "Emerging Risk", trigger: "Continuous glycemic drift", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" }
                ].map((risk, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gradient-to-r from-slate-50/50 to-white border border-slate-100 hover:border-blue-100 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full shrink-0", risk.bg === 'bg-rose-50' ? 'bg-rose-500' : risk.bg === 'bg-amber-50' ? 'bg-amber-500' : 'bg-orange-500')} />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{risk.name}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">Trigger condition: {risk.trigger}</p>
                      </div>
                    </div>

                    <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider self-start sm:self-auto border text-center shrink-0", risk.bg, risk.color, risk.border)}>
                      {risk.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prediction Logic Switcher/Expander inside card */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setShowLogicDetails(!showLogicDetails)} 
                className="w-full text-left flex items-center justify-between py-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <span className="flex items-center gap-1.5">
                  <FileText size={14} /> View Evaluated Prediction Rules Engine Logic
                </span>
                <ChevronRight size={14} className={cn("transition-transform duration-300", showLogicDetails ? "rotate-90" : "")} />
              </button>

              <AnimatePresence>
                {showLogicDetails && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-3 space-y-2 font-mono text-[11px] text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60"
                  >
                    <div>
                      <span className="text-slate-400 font-bold block">RULE 01:</span>
                      <span className="text-slate-800">IF</span> hemoglobin continuously decreases <span className="text-slate-800">AND</span> ferritin low <span className="text-slate-800">THEN</span> Predict: <strong className="text-rose-600">“Iron Deficiency Anemia Risk”</strong>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200/40">
                      <span className="text-slate-400 font-bold block">RULE 02:</span>
                      <span className="text-slate-800">IF</span> glucose rising consistently <span className="text-slate-800">THEN</span> Predict: <strong className="text-orange-600">“Pre-diabetic Risk”</strong>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200/40">
                      <span className="text-slate-400 font-bold block">RULE 03:</span>
                      <span className="text-slate-800">IF</span> TSH increasing above normal <span className="text-slate-800">THEN</span> Predict: <strong className="text-amber-600">“Possible Thyroid Dysfunction”</strong>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Risk Indicator Map */}
          <div className="lg:col-span-5 bg-white rounded-[28px] p-6 md:p-8 border border-blue-50 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Status Protocol</span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4">Risk Indicator Map</h3>

              {/* Graphical Scale representation */}
              <div className="space-y-4">
                
                {/* Visual Level Bars */}
                <div className="space-y-3">
                  
                  {/* Low Risk */}
                  <div className="p-3 rounded-xl border border-slate-100 flex items-center justify-between opacity-50 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-600">Low Risk</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Optimal</span>
                  </div>

                  {/* Moderate Risk - ACTIVE */}
                  <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50/30 flex items-center justify-between relative shadow-sm">
                    <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest">
                      Active Status
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-pulse shadow-sm shadow-amber-500/50" />
                      <div>
                        <span className="text-xs font-black text-slate-900 block">Moderate Risk</span>
                        <span className="text-[10px] text-slate-500 block">Early interventions warranted</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-600">Elevated</span>
                  </div>

                  {/* High Risk */}
                  <div className="p-3 rounded-xl border border-slate-100 flex items-center justify-between opacity-50 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="text-xs font-bold text-slate-600">High Risk</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical</span>
                  </div>

                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/60 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-1">Preventive Philosophy</span>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Addressing biomarker drift inside the <strong className="text-amber-600">Moderate</strong> corridor avoids chronic pathology progression.
              </p>
            </div>
          </div>

        </div>

        {/* ================================================== */}
        {/* TREND ANALYSIS CHART (3 LINE CHARTS GRID)          */}
        {/* ================================================== */}
        <section className="space-y-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">Longitudinal Trajectory Visualization</span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Biomarker Trend Analysis</h3>
            <p className="text-xs text-slate-500 font-medium">Sequential reading progression from January to May checkups</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Chart 1: Hemoglobin Trend */}
            <div className="bg-white p-5 rounded-[24px] border border-blue-50 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-black text-slate-900">1. Hemoglobin Trend</span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 text-[10px] font-black font-mono">
                    13.2 → 11.4 → 9.1
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Continuous trajectory drop</p>
              </div>

              {/* Line graph wrapper */}
              <div className="w-full h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hbChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradHb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[8, 15]} />
                    <Tooltip content={<CustomChartTooltip unit="g/dL" />} cursor={{ strokeDasharray: '3 3', stroke: '#E2E8F0' }} />
                    <Area type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2.5} fill="url(#gradHb)" activeDot={{ r: 5, fill: '#EF4444' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-50 text-center mt-2">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Anemia Depletion Threshold</span>
              </div>
            </div>

            {/* Chart 2: Glucose Trend */}
            <div className="bg-white p-5 rounded-[24px] border border-blue-50 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-black text-slate-900">2. Glucose Trend</span>
                  <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-[10px] font-black font-mono">
                    96 → 118 → 142
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Consistent elevation tracking</p>
              </div>

              {/* Line graph wrapper */}
              <div className="w-full h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={glucoseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradGlucose" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[80, 160]} />
                    <Tooltip content={<CustomChartTooltip unit="mg/dL" />} cursor={{ strokeDasharray: '3 3', stroke: '#E2E8F0' }} />
                    <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2.5} fill="url(#gradGlucose)" activeDot={{ r: 5, fill: '#F97316' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-50 text-center mt-2">
                <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Glycemic Escalation Trend</span>
              </div>
            </div>

            {/* Chart 3: TSH Trend */}
            <div className="bg-white p-5 rounded-[24px] border border-blue-50 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-black text-slate-900">3. TSH Trend</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-black font-mono">
                    2.1 → 3.8 → 5.2
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Trending above standard range</p>
              </div>

              {/* Line graph wrapper */}
              <div className="w-full h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tshChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradTsh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D97706" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[1.0, 6.0]} />
                    <Tooltip content={<CustomChartTooltip unit="uIU/mL" />} cursor={{ strokeDasharray: '3 3', stroke: '#E2E8F0' }} />
                    <Area type="monotone" dataKey="value" stroke="#D97706" strokeWidth={2.5} fill="url(#gradTsh)" activeDot={{ r: 5, fill: '#D97706' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-50 text-center mt-2">
                <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Endocrine Output Shift</span>
              </div>
            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* AI INSIGHTS SECTION                                */}
        {/* ================================================== */}
        <section className="bg-white rounded-[28px] p-6 md:p-8 border border-blue-50 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">AI Insights Section</h3>
              <p className="text-xs text-slate-400 font-medium">Concise preventive trajectory inferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { text: "“Hemoglobin levels have declined consistently over time.”", focus: "Iron Depletion", badgeClass: "bg-rose-50 text-rose-700 border-rose-100" },
              { text: "“Glucose levels show increasing metabolic risk.”", focus: "Insulin Resistance", badgeClass: "bg-orange-50 text-orange-700 border-orange-100" },
              { text: "“TSH values are trending above healthy range.”", focus: "Thyroid Strain", badgeClass: "bg-amber-50 text-amber-700 border-amber-100" }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 flex flex-col justify-between gap-3">
                <p className="text-xs font-bold text-slate-800 leading-relaxed">{item.text}</p>
                <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded self-start border", item.badgeClass)}>
                  {item.focus}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================== */}
        {/* HEALTH RECOMMENDATIONS                             */}
        {/* ================================================== */}
        <section className="space-y-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">Proactive Interventions</span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Health Recommendations</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Consult a healthcare professional", desc: "Share these sequential marker progressions for direct clinical validation.", icon: Stethoscope },
              { title: "Improve iron intake", desc: "Incorporate organic trace elements and vitamin C dense boosters.", icon: Heart },
              { title: "Monitor blood sugar regularly", desc: "Track fasting parameters over the coming month to confirm stability.", icon: Activity },
              { title: "Maintain healthy sleep and exercise", desc: "Support overall metabolic restoration and baseline hormonal balance.", icon: Calendar }
            ].map((rec, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[20px] border border-blue-50 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.03)] hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50/60 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <rec.icon size={18} />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mb-1 leading-snug">{rec.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{rec.desc}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-50 flex items-center justify-between text-[9px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Actionable priority</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================== */}
        {/* IMPORTANT DISCLAIMER                               */}
        {/* ================================================== */}
        <footer className="pt-6 pb-4 text-center">
          <div className="inline-block py-2.5 px-6 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-2xs">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              “AI-generated preventive health insights — not a medical diagnosis.”
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
