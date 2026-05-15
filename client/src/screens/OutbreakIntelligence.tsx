import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bell,
  Cloud,
  Globe2,
  Radar,
  Sparkles,
  Watch,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { cn } from '../lib/utils';
import {
  cityHeatmap,
  earlyWarningAlerts,
  environmentalFactors,
  globalOutbreakRisk,
  infectionTrend,
  outbreakForecastCards,
  regionalRiskDistribution,
  symptomSpikeTrend,
  wearableAggregate,
  wearableAnomalySeries,
} from '../data/outbreakIntelligenceMock';

const ChartTip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-blue-100 text-xs font-bold text-slate-800">
        <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-medium">{label}</span>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="text-blue-600 font-mono text-sm">
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function riskBg(risk: number) {
  if (risk >= 70) return 'bg-orange-500/85 text-white';
  if (risk >= 50) return 'bg-amber-400/90 text-slate-900';
  if (risk >= 40) return 'bg-amber-200/90 text-slate-800';
  return 'bg-emerald-400/75 text-white';
}

export default function OutbreakIntelligence() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-[#EBF1F8] to-[#F9FBFC] p-4 md:p-8 pb-36 font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-[1240px] mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to prediction hub
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-xl border border-blue-100/80 text-blue-600 text-[10px] font-black uppercase tracking-widest">
            <Radar size={12} className="animate-pulse" /> National syndromic fusion (demo)
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-[32px] border border-blue-50/60 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.06)]"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-slate-900">Outbreak Intelligence</h1>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
                Wearable telemetry + symptoms + imaging cues + biomarker drift + environment → synthetic outbreak nowcast
                for hackathon storytelling.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-white/80 bg-gradient-to-br from-indigo-500/10 via-white/50 to-cyan-500/10 p-8 min-w-[220px] shadow-[0_20px_50px_rgba(99,102,241,0.12)]">
              <Globe2 className="text-indigo-500 mb-2" size={28} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global outbreak risk</span>
              <span className="text-5xl font-black text-slate-900 tracking-tight mt-1">{globalOutbreakRisk.score}</span>
              <span className="text-xs font-bold text-amber-600 mt-1">+{globalOutbreakRisk.deltaWeek}% vs prior week (mock)</span>
              <p className="text-[11px] text-slate-500 text-center mt-3 leading-relaxed max-w-[200px]">{globalOutbreakRisk.label}</p>
            </div>
          </div>
        </motion.section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {outbreakForecastCards.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="bg-white/70 backdrop-blur-xl p-6 rounded-[24px] border border-blue-50 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.05)]"
            >
              <div className="flex justify-between items-start mb-3">
                <Sparkles className="text-indigo-500" size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                  {Math.round(c.confidence * 100)}% conf.
                </span>
              </div>
              <h3 className="font-black text-slate-900 text-sm leading-snug">{c.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{c.window}</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed font-medium">{c.detail}</p>
            </motion.div>
          ))}
        </section>

        <section className="bg-white/60 backdrop-blur-xl rounded-[28px] p-6 md:p-8 border border-blue-50/60 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-orange-500" size={20} />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">City-wise risk heatmap</span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Regional heat (mock incidence blend)</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {cityHeatmap.map((c) => (
              <div
                key={c.city}
                className={cn(
                  'rounded-2xl p-4 text-center border border-white/60 shadow-sm transition-transform hover:scale-[1.02]',
                  riskBg(c.risk)
                )}
              >
                <p className="text-[10px] font-black uppercase tracking-wider opacity-90">{c.city}</p>
                <p className="text-2xl font-black mt-1">{c.risk}</p>
                <p className="text-[9px] font-bold opacity-80 mt-1">{c.casesPer100k} /100k</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white/60 backdrop-blur-xl rounded-[28px] p-6 border border-blue-50/60 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)]">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-rose-500" size={20} />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Early warning alerts</h2>
            </div>
            <div className="space-y-3">
              {earlyWarningAlerts.map((a) => (
                <div
                  key={a.id}
                  className={cn(
                    'p-4 rounded-2xl border flex flex-col gap-1',
                    a.severity === 'high' && 'bg-rose-50/80 border-rose-100',
                    a.severity === 'medium' && 'bg-amber-50/80 border-amber-100',
                    a.severity === 'low' && 'bg-slate-50 border-slate-100'
                  )}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{a.title}</span>
                    <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">{a.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{a.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white/60 backdrop-blur-xl rounded-[28px] p-6 border border-blue-50/60 shadow-[0_4px_20px_-4px_rgba(30,58,138,0.04)]">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="text-sky-500" size={20} />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Environmental factors</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {environmentalFactors.map((e) => (
                <div key={e.label} className="p-4 rounded-2xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{e.label}</p>
                  <p className="text-xl font-black text-slate-900 mt-1">{e.value}</p>
                  <p className="text-[10px] font-bold text-indigo-600 mt-1">{e.status}</p>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{e.hint}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white/60 backdrop-blur-xl rounded-[28px] p-6 md:p-8 border border-blue-50/60">
          <div className="flex items-center gap-2 mb-2">
            <Watch className="text-indigo-500" size={20} />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Wearable anomaly aggregation</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mb-4">
            Cohort {wearableAggregate.cohortSize.toLocaleString()} devices (synthetic) · anomaly rate{' '}
            {wearableAggregate.anomalyRatePct}%
          </p>
          <ul className="text-xs text-slate-700 space-y-2 mb-6 font-medium">
            {wearableAggregate.topSignals.map((s) => (
              <li key={s} className="flex gap-2">
                <AlertTriangle className="text-amber-500 shrink-0" size={14} />
                {s}
              </li>
            ))}
          </ul>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wearableAnomalySeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="hrRestingDelta" name="Δ Resting HR" fill="#6366F1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="hrvDrop" name="HRV drop index" fill="#F97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white/70 backdrop-blur-xl rounded-[28px] p-6 border border-blue-50/60">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">Infection trend (syndromic index)</h2>
            <p className="text-xs text-slate-500 mb-4 font-medium">7-day blended mock curve</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={infectionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="infGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="index" stroke="#6366F1" strokeWidth={2.5} fill="url(#infGrad)" name="Index" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-white/70 backdrop-blur-xl rounded-[28px] p-6 border border-blue-50/60">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">Symptom frequency trends</h2>
            <p className="text-xs text-slate-500 mb-4 font-medium">Triage keyword spikes (mock)</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={symptomSpikeTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <Tooltip content={<ChartTip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="fever" stroke="#EF4444" strokeWidth={2} dot={false} name="Fever" />
                  <Line type="monotone" dataKey="cough" stroke="#6366F1" strokeWidth={2} dot={false} name="Cough" />
                  <Line type="monotone" dataKey="fatigue" stroke="#14B8A6" strokeWidth={2} dot={false} name="Fatigue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <section className="bg-white/70 backdrop-blur-xl rounded-[28px] p-6 md:p-8 border border-blue-50/60">
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">Regional risk distribution</h2>
          <p className="text-xs text-slate-500 mb-4 font-medium">Share of national risk budget (illustrative)</p>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={regionalRiskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={56} outerRadius={88} paddingAngle={3}>
                  {regionalRiskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTip />} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <footer className="text-center pb-4">
          <div className="inline-block py-2.5 px-6 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Demonstration analytics only — not official public health surveillance.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
