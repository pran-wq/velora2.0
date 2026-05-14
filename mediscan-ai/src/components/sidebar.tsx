"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { LayoutDashboard, FileUp, History, GitCompare, Download, Activity } from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload Report", href: "/reports", icon: FileUp },
  { name: "History", href: "/history", icon: History },
  { name: "Compare Reports", href: "/compare", icon: GitCompare },
  { name: "Export Results", href: "/dashboard?export=true", icon: Download },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#09090E]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand App header */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent p-0.5 flex items-center justify-center shadow-neon">
          <div className="w-full h-full bg-[#09090E] rounded-[10px] flex items-center justify-center">
            <Activity size={18} className="text-accent" />
          </div>
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-wide bg-gradient-neon bg-clip-text text-transparent">MediScan AI</h1>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black block">Hackathon Core</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href.includes('?') && pathname.startsWith('/dashboard'));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all group relative overflow-hidden",
                isActive 
                  ? "bg-white/5 text-foreground border border-white/10 shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-neon rounded-r-full" />
              )}
              <item.icon 
                size={16} 
                className={cn(
                  "transition-colors", 
                  isActive ? "text-accent" : "group-hover:text-foreground"
                )} 
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Mandatory Alert */}
      <div className="p-4 border-t border-white/5">
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-[10px] text-destructive/90 leading-tight space-y-1">
          <span className="font-bold block uppercase tracking-wider text-destructive">Demo Disclaimer</span>
          <p>AI-generated screening results — not a medical diagnosis.</p>
        </div>
      </div>
    </aside>
  );
}
