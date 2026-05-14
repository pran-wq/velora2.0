import { Home, HeartPulse, Brain, User, ShieldCheck, Stethoscope } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: HeartPulse, label: 'Health', path: '/health' },
  { icon: Stethoscope, label: 'Predict', path: '/predict' },
  { icon: ShieldCheck, label: 'Vault', path: '/vault' },
  { icon: Brain, label: 'Insights', path: '/insights' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  const { profile } = useApp();
  const isFemale = profile?.gender?.toLowerCase() === 'female';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-8 pt-4 pointer-events-none">
      <div className={cn(
        "mx-auto max-w-lg flex items-center justify-between p-2 sm:p-3 backdrop-blur-3xl shadow-2xl pointer-events-auto border border-white/40",
        isFemale 
          ? "bg-white/60 rounded-[3rem] shadow-[#FC7A8B]/20" 
          : "bg-white/40 rounded-[4rem] border-white/60 shadow-indigo-500/5"
      )}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="relative flex-1 flex justify-center"
          >
            {({ isActive }) => (
              <div className={cn(
                "flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-4 rounded-full transition-all duration-700 relative overflow-hidden group",
                isActive 
                  ? (isFemale ? "bg-[#FC7A8B] text-white shadow-xl shadow-[#FC7A8B]/30" : "bg-[#6366F1] text-white shadow-2xl shadow-indigo-500/40") 
                  : (isFemale ? "text-[#FC7A8B]/60 hover:text-[#FC7A8B]" : "text-[#2D2D2D]/40 hover:text-[#2D2D2D]")
              )}
              >
                <item.icon size={22} className={cn("transition-transform duration-500", isActive && "scale-110")} />
                {isActive && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    className="text-[10px] font-black overflow-hidden whitespace-nowrap tracking-[0.1em] uppercase"
                  >
                    {item.label}
                  </motion.span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function PregnancyDock() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-8 pt-4 pointer-events-none flex justify-center">
      <div className="mx-auto max-w-lg w-full flex items-center justify-between p-2 sm:p-3 bg-white/80 backdrop-blur-3xl border border-white/60 rounded-[3rem] shadow-[0_20px_40px_rgba(255,139,167,0.15)] pointer-events-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="relative flex-1 flex justify-center"
          >
            {({ isActive }) => (
               <div className={cn(
                "flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-4 rounded-full transition-all duration-700 relative overflow-hidden",
                isActive 
                  ? "bg-[#FF8BA7] text-white shadow-xl shadow-[#FF8BA7]/30" 
                  : "text-[#8A7B81] hover:text-[#FF8BA7]"
              )}>
                <item.icon size={22} className={cn("transition-transform duration-500", isActive && "scale-110")} />
                {isActive && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    className="text-[10px] font-black overflow-hidden whitespace-nowrap tracking-[0.1em] uppercase"
                  >
                    {item.label}
                  </motion.span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
