import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Zap, Brain, Moon, Sun,
  Smile, Coffee, Droplets, Sparkles,
  Flower2, Activity, Flame, TrendingUp,
  Accessibility, Frown, Ghost, Waves,
  Utensils, Cloud
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CycleRingDetailedProps { currentDay: number; phase: string; }

const Petal = ({ delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: -20, x: Math.random() * 400 - 200, rotate: 0 }}
    animate={{
      opacity: [0, 0.4, 0],
      y: [null, 600],
      x: [null, Math.random() * 400 - 200],
      rotate: 360
    }}
    transition={{ duration: 12 + Math.random() * 5, repeat: Infinity, delay, ease: "linear" }}
    className="absolute pointer-events-none"
  >
    <div className="w-4 h-6 bg-rose-200/20 rounded-full blur-[2px]" style={{ borderRadius: '50% 50% 50% 50% / 100% 100% 0% 0%' }} />
  </motion.div>
);

export default function CycleRingDetailed({ currentDay, phase }: CycleRingDetailedProps) {
  const totalDays = 28;

  const phaseData = useMemo(() => [
    {
      name: 'Menstrual', label: 'MENSTRUAL PHASE', start: 1, end: 5, color: '#FB7185', secondary: '#F43F5E',
      icons: [Droplets, Coffee, Frown],
      advice: [
        "Your body needs rest and gentle",
        "care. Focus on hydration",
        "and nourishing foods."
      ],
      status: 'LOW ENERGY'
    },
    {
      name: 'Follicular', label: 'FOLLICULAR PHASE', start: 6, end: 13, color: '#EC4899', secondary: '#DB2777',
      icons: [TrendingUp, Sparkles, Accessibility, Sun],
      advice: [
        "Energy levels are rising.",
        "Great time for social",
        "and creative planning."
      ],
      status: 'HIGH ENERGY'
    },
    {
      name: 'Ovulation', label: 'OVULATION PHASE', start: 14, end: 16, color: '#F97316', secondary: '#EA580C',
      icons: [Flame, Zap, Heart, Utensils, Smile],
      advice: [
        "Peak fertility today.",
        "You may feel more",
        "social and confident."
      ],
      status: 'PEAK VITALITY'
    },
    {
      name: 'Luteal', label: 'LUTEAL PHASE', start: 17, end: 28, color: '#A855F7', secondary: '#8B5CF6',
      icons: [Cloud, Brain, Frown, Heart, Waves, Moon, Ghost],
      advice: [
        "Focus on mindfulness.",
        "Emotional sensitivity",
        "may increase today."
      ],
      status: 'MINDFUL CALM'
    },
  ], []);

  const currentPhase = useMemo(() =>
    phaseData.find(p => currentDay >= p.start && currentDay <= p.end) || phaseData[0]
    , [currentDay, phaseData]);

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number, reverse: boolean = false) => {
    const start = polarToCartesian(x, y, radius, reverse ? endAngle : startAngle);
    const end = polarToCartesian(x, y, radius, reverse ? startAngle : endAngle);
    const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
    const sweepFlag = reverse ? "0" : "1";
    return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y].join(" ");
  };

  return (
    <div className="relative w-full aspect-square flex items-center justify-center select-none bg-transparent group overflow-visible">
      {Array.from({ length: 8 }).map((_, i) => <Petal key={i} delay={i * 2} />)}
      <div className="absolute inset-0 rounded-full blur-[140px] opacity-20 transition-all duration-1000 scale-125" style={{ backgroundColor: currentPhase.color }} />

      <div className="relative w-full h-full flex items-center justify-center overflow-visible">
        <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible drop-shadow-2xl">
          <defs>
            {phaseData.map((p, i) => (
              <linearGradient key={i} id={`grad-${p.name}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={p.color} /><stop offset="100%" stopColor={p.secondary} />
              </linearGradient>
            ))}
            <filter id="glow"><feGaussianBlur stdDeviation="0.8" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
          </defs>

          {/* 1. OUTER RING */}
          {phaseData.map((p, i) => {
            const startAngle = ((p.start - 1) / totalDays) * 360;
            const endAngle = (p.end / totalDays) * 360;
            const ringRadius = 72;
            const isTopPhase = p.name === 'Menstrual' || p.name === 'Luteal';
            const textRadius = isTopPhase ? 81 : 85;

            const midAngle = (startAngle + endAngle) / 2;
            const isBottom = midAngle > 90 && midAngle < 270;
            const textPathId = `path-${p.name}`;
            const segmentPath = describeArc(80, 80, ringRadius, startAngle, endAngle, false);
            const textPath = describeArc(80, 80, textRadius, startAngle, endAngle, isBottom);

            return (
              <g key={p.name}>
                <path d={segmentPath} fill="none" stroke={`url(#grad-${p.name})`} strokeWidth="10" className={cn("transition-all duration-1000", currentPhase.name === p.name ? "opacity-100" : "opacity-35")} />
                <path id={textPathId} d={textPath} fill="none" />
                <text className="text-[3.8px] font-black fill-[#8E7E8E] uppercase tracking-[0.2em] pointer-events-none">
                  <textPath xlinkHref={`#${textPathId}`} startOffset="50%" textAnchor="middle">{p.label}</textPath>
                </text>
                {p.icons.map((Icon, idx) => {
                  const iconAngle = startAngle + (endAngle - startAngle) * ((idx + 1) / (p.icons.length + 1));
                  const iconPos = polarToCartesian(80, 80, ringRadius, iconAngle);
                  return (
                    <g key={idx} transform={`translate(${iconPos.x - 1.5}, ${iconPos.y - 1.5})`}>
                      <Icon size={3} className="text-white opacity-95" strokeWidth={2.5} />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* 2. UNIFIED WHITE HUB & DAY RING */}
          <circle cx="80" cy="80" r="67" fill="white" className="shadow-sm" />
          <circle cx="80" cy="80" r="65.5" fill="none" stroke="#FDEFF2" strokeWidth="0.4" strokeDasharray="1 1.5" />
          
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1;
            const angle = (i / totalDays) * 360;
            const pos = polarToCartesian(80, 80, 60, angle);
            const isCurrent = day === currentDay;
            return (
              <g key={day}>
                {isCurrent && <circle cx={pos.x} cy={pos.y} r="3.5" fill={currentPhase.color} filter="url(#glow)" />}
                <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" className={cn("text-[3.2px] font-black transition-all", isCurrent ? "fill-white" : "fill-[#8E7E8E]")}>
                  {day}
                </text>
              </g>
            );
          })}

          {/* 3. CENTER HUB CONTENT */}
          <g className="pointer-events-none select-none">
            <text x="80" y="55" textAnchor="middle" className="fill-[#FB7185] font-black uppercase tracking-[0.5em]" style={{ fontSize: '5px', opacity: 0.8 }}>Day</text>
            <text x="80" y="78" textAnchor="middle" className="fill-[#1F111F] font-black tracking-tighter" style={{ fontSize: '26px' }}>{currentDay}</text>
            <text x="80" y="94" textAnchor="middle" className="fill-[#FB7185] font-black uppercase tracking-[0.3em]" style={{ fontSize: '6.5px' }}>{currentPhase.label}</text>

            <text x="80" y="105" textAnchor="middle" className="fill-[#8E7E8E] font-bold" style={{ fontSize: '3.8px' }}>
              {currentPhase.advice.map((line, i) => (
                <tspan key={i} x="80" dy={i === 0 ? 0 : 4.5}>{line}</tspan>
              ))}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
