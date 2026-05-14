import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Watch, CircleDot, Smartphone, Activity, Zap, Heart, 
  Check, Search, Bluetooth, RefreshCw, Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GlassCard } from '../components/Common';

export default function ConnectDevices() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 1, name: 'Apple Watch Series 9', type: 'Watch', status: 'Connected', icon: Watch, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 2, name: 'Oura Ring Gen 3', type: 'Ring', status: 'Connected', icon: CircleDot, color: 'text-gray-900', bg: 'bg-gray-100' }
  ]);

  const availableDevices = [
    { id: 3, name: 'Whoop 4.0', type: 'Band', battery: '82%', icon: Zap },
    { id: 4, name: 'Fitbit Sense 2', type: 'Watch', battery: '40%', icon: Watch },
    { id: 5, name: 'Dexcom G7', type: 'CGM', battery: '99%', icon: Activity },
    { id: 6, name: 'Withings Body Scale', type: 'Scale', battery: 'New', icon: WeightIcon },
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-36 pt-12 px-4 sm:px-8 max-w-4xl mx-auto overflow-y-auto no-scrollbar relative">
      
      {/* Header */}
      <header className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors text-[#64748B]">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#0F172A]">Connect Devices</h1>
          <p className="text-sm text-[#64748B] font-medium">Manage hardware telemetry sync sources.</p>
        </div>
      </header>

      <div className="space-y-8">

        {/* Active Links */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#64748B]">Active Bridges</h3>
          <div className="grid gap-4">
            {connectedDevices.map(dev => (
              <GlassCard key={dev.id} className="p-5 flex items-center justify-between bg-white border-white shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border border-transparent", dev.bg, dev.color)}>
                    <dev.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">{dev.name}</h4>
                    <p className="text-[10px] font-black uppercase text-[#10B981] flex items-center gap-1 mt-0.5">
                      <Check size={10} /> Operational Syncing
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-50 text-[#64748B] rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">Manage</button>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Discovery Scanner */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
             <h3 className="text-xs font-black uppercase tracking-widest text-[#64748B]">Nearby Terminals</h3>
             <button onClick={handleScan} disabled={isScanning} className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-wider disabled:opacity-50">
                {isScanning ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                {isScanning ? 'Scanning...' : 'Re-Scan'}
             </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
             {availableDevices.map((dev, i) => (
               <div key={dev.id} className={cn("p-5 flex items-center justify-between border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors group cursor-pointer")}>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-gray-100 flex items-center justify-center text-[#64748B] group-hover:text-indigo-600 transition-colors">
                        <dev.icon size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-[#0F172A] text-sm">{dev.name}</h4>
                        <div className="flex items-center gap-3 mt-0.5">
                           <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest flex items-center gap-1">
                              <Bluetooth size={10} /> Discoverable
                           </span>
                           <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">• Bat: {dev.battery}</span>
                        </div>
                     </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-[#F8FAFC] text-indigo-600 border border-gray-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                     <Plus size={16} />
                  </button>
               </div>
             ))}
          </div>
        </section>

        {/* Manual Integration */}
        <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-900/10">
           <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 text-indigo-300">
                 <Smartphone size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h3 className="text-xl font-black tracking-tight">OS Health Direct</h3>
                 <p className="text-sm text-indigo-100/80 font-medium mt-1">Sync seamlessly via system-level Apple HealthKit or Google Fit pipelines.</p>
              </div>
              <button className="px-6 py-3 bg-white text-[#0F172A] font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform">
                 Authorize OS Sync
              </button>
           </div>
        </section>

      </div>
    </div>
  );
}

function WeightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="M6 20v2" />
      <path d="M18 20v2" />
      <circle cx="12" cy="11" r="3" />
    </svg>
  );
}
