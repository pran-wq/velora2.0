import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface SubTabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  layoutId: string;
  isFemale?: boolean;
}

export function SubTabBar({ tabs, activeTab, onTabChange, layoutId, isFemale }: SubTabBarProps) {
  return (
    <div className="relative h-48 w-full overflow-visible z-[100]">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-16 -mx-6 px-6 overflow-y-visible">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "relative px-10 h-12 rounded-full text-[10px] font-black whitespace-nowrap transition-all duration-300 tracking-[0.25em] uppercase flex items-center justify-center min-w-[150px] group border-2",
              activeTab === tab
                ? "text-white border-transparent"
                : isFemale 
                  ? "text-[#FC7A8B] bg-white/90 backdrop-blur-md border-[#FC7A8B]/10 hover:bg-[#FC7A8B]/10"
                : "text-gray-500 bg-white border-gray-100 shadow-sm hover:text-[#2D2D2D] hover:bg-gray-50"
            )}
          >
            {activeTab === tab && (
              <motion.div
                layoutId={layoutId}
                className={cn(
                  "absolute -inset-[2px] rounded-full z-0 shadow-2xl shadow-indigo-500/50",
                  isFemale ? "bg-[#FC7A8B]" : "bg-[#6366F1]"
                )}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
