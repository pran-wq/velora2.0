import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { cn } from '../lib/utils';

const recoveryData7Days = [
  { day: 'Mon', recovery: 76 },
  { day: 'Tue', recovery: 82 },
  { day: 'Wed', recovery: 78 },
  { day: 'Thu', recovery: 85 },
  { day: 'Fri', recovery: 83 },
  { day: 'Sat', recovery: 91 },
  { day: 'Sun', recovery: 88 },
];

const recoveryData30Days = [
  { day: 'D1', recovery: 70 },
  { day: 'D5', recovery: 74 },
  { day: 'D10', recovery: 80 },
  { day: 'D15', recovery: 78 },
  { day: 'D20', recovery: 85 },
  { day: 'D25', recovery: 91 },
  { day: 'D30', recovery: 89 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1E293B] text-white p-3 rounded-2xl shadow-xl border border-white/10 text-xs space-y-1">
        <p className="font-bold text-gray-400">{label}</p>
        <p className="font-black text-emerald-400 text-sm">
          Recovery: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function DiseasePredictionAndRecovery() {
  const [timeframe, setTimeframe] = useState<'7D' | '30D'>('7D');

  const graphData = timeframe === '7D' ? recoveryData7Days : recoveryData30Days;
  const currentRecovery = graphData[graphData.length - 1].recovery;
  const avgRecovery = Math.round(graphData.reduce((acc, curr) => acc + curr.recovery, 0) / graphData.length);

  return (
    <div className="w-full mt-6">
      <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between relative overflow-hidden">
        
        {/* Top bar info */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shadow-sm">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">Systemic Recovery Trajectory</h3>
            </div>
            
            {/* Viewport switch */}
            <div className="flex p-1 bg-[#F8FAFC] rounded-xl border border-gray-100">
              {(['7D', '30D'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black transition-all",
                    timeframe === t ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-[#64748B] mb-6">
            Autonomic nervous adaptation mapped against systemic recovery status over time.
          </p>

          {/* Quick inline metric readout */}
          <div className="grid grid-cols-3 gap-3 mb-6 max-w-md">
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-gray-100">
              <span className="text-[9px] font-bold text-[#64748B] uppercase block">Latest Readout</span>
              <span className="text-xl font-black text-[#0F172A]">{currentRecovery}%</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-gray-100">
              <span className="text-[9px] font-bold text-[#64748B] uppercase block">Period Avg</span>
              <span className="text-xl font-black text-[#10B981]">{avgRecovery}%</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-gray-100">
              <span className="text-[9px] font-bold text-[#64748B] uppercase block">Status</span>
              <span className="text-sm font-black text-[#818CF8] block mt-1">Synchronized</span>
            </div>
          </div>
        </div>

        {/* Real Area Chart */}
        <div className="w-full h-64 my-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="recoveryGradMain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} 
              />
              <YAxis 
                domain={[50, 100]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="recovery" 
                stroke="#10B981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#recoveryGradMain)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Insight bar */}
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-[#475569] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Optimal baseline established above 75% threshold.</span>
          </div>
          <span className="text-[10px] font-bold text-[#818CF8] hover:underline cursor-pointer">
            Export JSON
          </span>
        </div>

      </div>
    </div>
  );
}
