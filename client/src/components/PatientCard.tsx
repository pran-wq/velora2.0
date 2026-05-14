import { motion } from 'framer-motion';
import { User, Activity, ShieldCheck, Heart, Sparkles, Navigation, QrCode } from 'lucide-react';
import { cn } from '../lib/utils';
import { GlassCard } from './Common';

interface PatientCardProps {
  profile: any;
  variant: 'male' | 'female' | 'pregnancy';
}

export default function PatientCard({ profile, variant }: PatientCardProps) {
  if (!profile) return null;

  const config = {
    male: {
      gradient: "from-[#1A1A1A] via-[#2D2D2D] to-[#0A0A0A]",
      accent: "text-[#6366F1]",
      bgAccent: "bg-[#6366F1]/10",
      border: "border-white/5",
      icon: Navigation,
      label: "Active Intelligence",
      status: "Optimized",
      statusColor: "text-blue-400",
      shadow: "shadow-2xl shadow-indigo-500/10",
      tagline: "Performance & Longevity",
      details: [
        { label: 'Blood Type', val: 'O+' },
        { label: 'Biometric Sync', val: '98%' },
      ]
    },
    female: {
      gradient: "from-[#FC7A8B] to-[#FFB5C5]",
      accent: "text-white",
      bgAccent: "bg-white/20",
      border: "border-white/20",
      icon: Sparkles,
      label: "Hormonal Intel",
      status: "Synchronized",
      statusColor: "text-white",
      shadow: "shadow-2xl shadow-[#FC7A8B]/20",
      tagline: "Wellness & Balance",
      details: [
        { label: 'Phase', val: 'Follicular' },
        { label: 'Hormonal Index', val: 'Optimal' },
      ]
    },
    pregnancy: {
      gradient: "from-[#FFF5F2] via-[#FFF0F4] to-[#FFE4E1]",
      accent: "text-[#FF8BA7]",
      bgAccent: "bg-white",
      border: "border-[#FF8BA7]/10",
      icon: Heart,
      label: "Maternal Ecosystem",
      status: "Development",
      statusColor: "text-[#FF8BA7]",
      shadow: "shadow-2xl shadow-[#FF8BA7]/5",
      tagline: "Nurturing Growth",
      details: [
        { label: 'Trimester', val: 'Second' },
        { label: 'Health Score', val: 'Excellent' },
      ]
    }
  };

  const c = config[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-xl group relative"
    >
      {/* Dynamic Glow Layer */}
      <div className={cn(
        "absolute -inset-4 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none",
        variant === 'male' ? "bg-indigo-500" : variant === 'female' ? "bg-[#FC7A8B]" : "bg-[#FF8BA7]"
      )} />

      <GlassCard className={cn(
        "p-12 !rounded-[3.5rem] relative overflow-hidden border-2 transition-all duration-700 shadow-[0_30px_100px_rgba(0,0,0,0.1)]",
        variant === 'male' ? "bg-[#121212] border-white/10" :
        variant === 'female' ? "bg-gradient-to-br from-[#FC7A8B] to-[#FF9AA8] border-white/30" :
        "bg-white/90 backdrop-blur-3xl border-white/80"
      )}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/5 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className={cn("absolute -inset-1 rounded-3xl blur opacity-30", variant === 'male' ? "bg-indigo-400" : "bg-white")} />
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt="pfp" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={cn("text-3xl font-display font-bold tracking-tight", variant === 'pregnancy' ? "text-[#2E2528]" : "text-white")}>
                    {profile.name}
                  </h3>
                  <ShieldCheck size={20} className={variant === 'male' ? "text-blue-400" : "text-white"} />
                </div>
                <p className={cn("text-xs font-bold uppercase tracking-[0.3em] opacity-70", variant === 'pregnancy' ? "text-[#FF8BA7]" : "text-white")}>
                  Patient ID: <span className="font-mono">AE-2026-X842</span>
                </p>
              </div>
            </div>
            <div className={cn(
              "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg",
              variant === 'male' ? "bg-indigo-500 text-white shadow-indigo-500/20" : 
              variant === 'female' ? "bg-white text-[#FC7A8B] shadow-white/20" : 
              "bg-[#FF8BA7] text-white shadow-[#FF8BA7]/20"
            )}>
              {c.status}
            </div>
          </div>

          {/* BASIC DETAILS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {[
              { label: 'Age', val: '28' },
              { label: 'Gender', val: profile.gender },
              { label: 'Height', val: '168 cm' },
              { label: 'Weight', val: '58 kg' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1.5">
                <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-50", variant === 'pregnancy' ? "text-[#8A7B81]" : "text-white")}>{stat.label}</p>
                <p className={cn("text-xl font-display font-bold tracking-tight", variant === 'pregnancy' ? "text-[#2E2528]" : "text-white")}>{stat.val}</p>
              </div>
            ))}
          </div>

          {/* DYNAMIC DETAILS GRID */}
          <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/10">
            {c.details.map((detail, i) => (
              <div key={i} className="space-y-2">
                <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-50", variant === 'pregnancy' ? "text-[#8A7B81]" : "text-white")}>{detail.label}</p>
                <div className="flex items-center gap-3">
                  <div className={cn("w-1.5 h-1.5 rounded-full", variant === 'male' ? "bg-blue-400" : variant === 'female' ? "bg-white" : "bg-[#FF8BA7]")} />
                  <p className={cn("text-xl font-bold tracking-tight", variant === 'pregnancy' ? "text-[#2E2528]" : "text-white")}>{detail.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={cn(
            "mt-12 p-6 rounded-[2rem] flex items-center justify-between border relative overflow-hidden group/footer",
            variant === 'male' ? "bg-white/5 border-white/5" : 
            variant === 'female' ? "bg-white/10 border-white/10" : 
            "bg-[#FFF5F2] border-[#FF8BA7]/10"
          )}>
            <div className="flex items-center gap-4 relative z-10">
              <div className={cn("p-2 rounded-lg", variant === 'pregnancy' ? "bg-white text-[#FF8BA7]" : "bg-white/10 text-white")}>
                <Sparkles size={18} />
              </div>
              <div>
                <p className={cn("text-sm font-bold italic tracking-tight", variant === 'pregnancy' ? "text-[#8A7B81]" : "text-white/80")}>
                  "{c.tagline}"
                </p>
                <div className="flex items-center gap-2 mt-1">
                   <ShieldCheck size={12} className={variant === 'pregnancy' ? "text-[#FF8BA7]" : "text-white/40"} />
                   <span className={cn("text-[9px] font-bold uppercase tracking-widest opacity-40", variant === 'pregnancy' ? "text-[#8A7B81]" : "text-white")}>Aether Verified ID</span>
                </div>
              </div>
            </div>

            {/* QR CODE SECTION */}
            <div className="flex items-center gap-4 relative z-10">
               <div className="text-right hidden sm:block">
                  <p className={cn("text-[8px] font-black uppercase tracking-[0.2em] opacity-40", variant === 'pregnancy' ? "text-[#8A7B81]" : "text-white")}>Scan to Verify</p>
                  <p className={cn("text-[10px] font-mono mt-0.5", variant === 'pregnancy' ? "text-[#FF8BA7]" : "text-white/60")}>v2.0.42</p>
               </div>
               <div className={cn(
                 "w-16 h-16 rounded-xl p-2.5 flex items-center justify-center transition-all duration-500 group-hover/footer:scale-110 group-hover/footer:rotate-3",
                 variant === 'male' ? "bg-white text-black shadow-xl shadow-white/10" : 
                 variant === 'female' ? "bg-white text-[#FC7A8B] shadow-xl shadow-white/20" : 
                 "bg-white text-[#FF8BA7] shadow-xl shadow-[#FF8BA7]/10"
               )}>
                 <div className="w-full h-full relative border-[2.5px] border-current p-1 rounded-sm flex items-center justify-center">
                    <QrCode size={40} strokeWidth={2.5} />
                    {/* Tiny decorative corners for QR vibe */}
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-current" />
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-current" />
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-current" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-current" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
