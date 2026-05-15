import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, Shield, Activity, Bell, FileText, Settings, Heart, Lock, 
  Smartphone, Plus, ChevronRight, Moon, LogOut, Phone, ShieldAlert, Pill,
  Brain, Folder, FileSearch, Sparkles, Accessibility, Eye, Volume2,
  Fingerprint, Calendar, Share2, UploadCloud, Droplets, Smile, 
  Baby, Syringe, Footprints, Watch, CircleDot, Zap, CreditCard, ShieldCheck, QrCode, ArrowRight, ScanLine,
  CheckCircle2, Search, Trash2, Edit3, Image,
  Bluetooth, RefreshCw, Palette, Languages, HardDrive,
  HelpCircle, Info as AboutIcon, MessageSquare, ShieldAlert as AlertIcon, CheckCircle, X, Check, Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { DEFAULT_GUEST_PROFILE } from '../../lib/guestProfile';
import { disconnectSocket } from '../../lib/socket';

export default function PregnancyProfile() {
  const { profile, setProfile, records: contextRecords, stats } = useApp();
  const navigate = useNavigate();

  if (!profile) return null;

  const firstName = profile.name.split(' ')[0];
  const [notification, setNotification] = useState<{message: string, icon: any} | null>(null);
  const [personality, setPersonality] = useState('Reassuring');
  const [activeModal, setActiveModal] = useState<'personality' | 'theme' | 'account' | 'notifications' | 'language' | 'privacy' | 'data' | 'subscription' | 'help' | 'about' | 'qrcode' | null>(null);

  const showNotify = (message: string, icon: any = CheckCircle) => {
    setNotification({ message, icon });
    setTimeout(() => setNotification(null), 3000);
  };

  const switchPhase = (mode: string) => {
    let nextPhase: any = { ...profile };
    if (mode === 'Pregnancy') {
      nextPhase.isPregnant = true;
    } else {
      nextPhase.gender = mode;
      nextPhase.isPregnant = false;
    }
    
    setProfile(nextPhase);
    showNotify(`Switched to ${mode} Mode`, Sparkles);
    setActiveModal(null);
  };

  const updatePersonality = (p: string) => {
    setPersonality(p);
    showNotify(`Personality: ${p}`, MessageSquare);
    setActiveModal(null);
  };

  const settingsGroups = [
    {
      title: 'Personalization',
      items: [
        { label: 'Account Settings', icon: User, desc: 'Manage your profile & security', action: () => setActiveModal('account') },
        { label: 'Appearance & Theme', icon: Palette, desc: 'Customize your visual experience', action: () => setActiveModal('theme') },
        { label: 'Reminder Personality', icon: MessageSquare, desc: personality, action: () => setActiveModal('personality') },
      ]
    },
    {
      title: 'System & Connectivity',
      items: [
        { label: 'Notifications', icon: Bell, desc: 'Configure smart alerts', action: () => setActiveModal('notifications') },
        { label: 'Connected Devices', icon: Watch, desc: 'HeraBEAT Sync Active', action: () => navigate('/connect-devices') },
        { label: 'Language & Accessibility', icon: Languages, desc: 'English (US)', action: () => setActiveModal('language') },
        { label: 'Privacy & Security', icon: Shield, desc: 'Tier 1 Encrypted', action: () => setActiveModal('privacy') },
      ]
    },
    {
      title: 'Subscription & Data',
      items: [
        { label: 'Data & Storage', icon: HardDrive, desc: 'Cloud sync active', action: () => setActiveModal('data') },
        { label: 'Subscription', icon: CreditCard, desc: 'Aether Premium', action: () => setActiveModal('subscription') },
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Help & Support', icon: HelpCircle, desc: 'Get assistance', action: () => setActiveModal('help') },
        { label: 'About App', icon: AboutIcon, desc: 'Version 2.4.0', action: () => setActiveModal('about') },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-10 pt-10 sm:pt-16 px-4 md:px-8 pb-36 max-w-[1400px] mx-auto overflow-y-auto no-scrollbar h-full w-full bg-[#FFF5F2]">
      
      {createPortal(
        <AnimatePresence>
          {activeModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveModal(null)}
                className="absolute inset-0 bg-[#2D2D2D]/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-[10000]"
              >
                <div className="p-8 sm:p-12 overflow-y-auto no-scrollbar">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#FF8BA7] flex items-center justify-center shadow-inner">
                        {activeModal === 'personality' && <MessageSquare size={28} />}
                        {activeModal === 'theme' && <Palette size={28} />}
                        {activeModal === 'account' && <User size={28} />}
                        {activeModal === 'notifications' && <Bell size={28} />}
                        {activeModal === 'language' && <Languages size={28} />}
                        {activeModal === 'privacy' && <Shield size={28} />}
                        {activeModal === 'data' && <HardDrive size={28} />}
                        {activeModal === 'subscription' && <CreditCard size={28} />}
                        {activeModal === 'help' && <HelpCircle size={28} />}
                        {activeModal === 'about' && <AboutIcon size={28} />}
                        {activeModal === 'qrcode' && <QrCode size={28} className="text-emerald-600" />}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-display font-bold text-[#2D2D2D] tracking-tight">
                          {activeModal === 'personality' && 'AI Personality'}
                          {activeModal === 'theme' && 'Appearance'}
                          {activeModal === 'account' && 'Account Settings'}
                          {activeModal === 'notifications' && 'Notifications'}
                          {activeModal === 'language' && 'Language'}
                          {activeModal === 'privacy' && 'Privacy'}
                          {activeModal === 'data' && 'Data & Storage'}
                          {activeModal === 'subscription' && 'Subscription'}
                          {activeModal === 'help' && 'Help & Support'}
                          {activeModal === 'about' && 'About Aether'}
                          {activeModal === 'qrcode' && 'Universal QR Health Pass'}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#FF8BA7]">Identity Protocol</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveModal(null)} 
                      className="w-12 h-12 bg-gray-50 hover:bg-rose-50 rounded-full flex items-center justify-center transition-all group"
                    >
                      <X size={20} className="text-gray-400 group-hover:text-[#FF8BA7] transition-colors" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {activeModal === 'personality' && [
                      { id: 'Reassuring', label: 'The Reassuring', desc: 'Calm, steady & optimistic' },
                      { id: 'Analyst', label: 'The Analyst', desc: 'Data-driven & clinical precision' },
                      { id: 'Stoic', label: 'The Stoic', desc: 'Focused, direct & balanced' },
                      { id: 'Caretaker', label: 'The Caretaker', desc: 'Nurturing & attentive guidance' },
                    ].map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => updatePersonality(opt.id)}
                        className={cn(
                          "w-full p-6 rounded-[2rem] border-2 transition-all text-left flex items-center justify-between group",
                          personality === opt.id ? "border-[#FF8BA7] bg-rose-50/30" : "border-gray-50 hover:border-rose-100 bg-gray-50/50"
                        )}
                      >
                        <div>
                          <p className="text-base font-bold text-[#2D2D2D] group-hover:text-[#FF8BA7] transition-colors">{opt.label}</p>
                          <p className="text-xs text-gray-400 font-medium mt-1">{opt.desc}</p>
                        </div>
                        {personality === opt.id && (
                          <div className="w-8 h-8 rounded-full bg-[#FF8BA7] flex items-center justify-center text-white shadow-lg shadow-rose-200">
                            <Check size={16} />
                          </div>
                        )}
                      </button>
                    ))}

                    {activeModal === 'theme' && (
                      <div className="space-y-8 py-4">
                         <div className="grid grid-cols-2 gap-6">
                            <button onClick={() => showNotify('Light theme active')} className="aspect-square rounded-[2.5rem] bg-white border-2 border-[#FF8BA7] flex flex-col items-center justify-center gap-4 shadow-xl shadow-rose-100/50">
                               <div className="w-12 h-12 rounded-2xl bg-rose-50" />
                               <span className="text-xs font-black uppercase tracking-widest text-[#2D2D2D]">Light</span>
                            </button>
                            <button onClick={() => showNotify('Dark theme available in Premium')} className="aspect-square rounded-[2.5rem] bg-[#2D2D2D] border-2 border-transparent flex flex-col items-center justify-center gap-4 text-white hover:scale-105 transition-transform">
                               <div className="w-12 h-12 rounded-2xl bg-[#3D3D3D]" />
                               <span className="text-xs font-black uppercase tracking-widest">Dark</span>
                            </button>
                         </div>
                      </div>
                    )}

                    {activeModal === 'account' && (
                      <div className="space-y-8">
                         <div className="space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF8BA7] pl-1">Maternal Identity</h4>
                            <div className="space-y-5">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-gray-400 pl-4 tracking-widest">Full Name</label>
                                 <input type="text" defaultValue={profile.name} className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] p-5 outline-none font-bold text-[#2D2D2D] focus:border-[#FF8BA7]/30 focus:bg-white transition-all shadow-inner" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-gray-400 pl-4 tracking-widest">Email Address</label>
                                 <input type="email" defaultValue={profile.email || 'user@aether.health'} className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] p-5 outline-none font-bold text-[#2D2D2D] focus:border-[#FF8BA7]/30 focus:bg-white transition-all shadow-inner" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-gray-400 pl-4 tracking-widest">Phone Number</label>
                                 <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] p-5 outline-none font-bold text-[#2D2D2D] focus:border-[#FF8BA7]/30 focus:bg-white transition-all shadow-inner" />
                              </div>
                            </div>
                         </div>
                         <div className="space-y-4 pt-8 border-t border-gray-50">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF8BA7] pl-1">Security Key</h4>
                            <button onClick={() => showNotify('Password reset email sent')} className="w-full p-6 rounded-[1.5rem] bg-gray-50 border border-gray-100 text-left flex items-center justify-between group hover:bg-rose-50 transition-all">
                               <span className="font-bold text-[#2D2D2D] group-hover:text-[#FF8BA7]">Reset Access Password</span>
                               <ChevronRight size={18} className="text-gray-300 group-hover:text-[#FF8BA7] transition-all" />
                            </button>
                         </div>
                         <button onClick={() => { showNotify('Profile updated successfully'); setActiveModal(null); }} className="w-full py-6 bg-[#2D2D2D] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] mt-4 shadow-2xl shadow-black/10 hover:bg-[#FF8BA7] transition-all active:scale-95">
                            Commit Changes
                         </button>
                      </div>
                    )}

                    {activeModal === 'notifications' && (
                      <div className="space-y-4">
                         {[
                           { label: 'Fetal Health Alerts', enabled: true },
                           { label: 'Weekly Growth Updates', enabled: true },
                           { label: 'Appointment Reminders', enabled: true },
                           { label: 'Emergency Contact Sync', enabled: true },
                         ].map((opt, i) => (
                           <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50 border border-gray-100 hover:bg-rose-50 transition-colors group">
                              <span className="font-bold text-[#2D2D2D] group-hover:text-[#FF8BA7] transition-colors">{opt.label}</span>
                              <div className={cn("w-12 h-6 rounded-full p-1 transition-all shadow-inner", opt.enabled ? "bg-[#FF8BA7]" : "bg-gray-200")}>
                                 <div className={cn("w-4 h-4 bg-white rounded-full shadow-md transition-transform", opt.enabled ? "translate-x-6" : "translate-x-0")} />
                              </div>
                           </div>
                         ))}
                      </div>
                    )}

                    {activeModal === 'language' && (
                      <div className="space-y-4">
                         {['English (US)', 'Hindi (Beta)', 'Spanish', 'German'].map(lang => (
                           <button key={lang} onClick={() => showNotify(`Language set to ${lang}`)} className="w-full p-6 rounded-[2rem] border-2 border-gray-50 hover:border-rose-100 text-left font-bold text-[#2D2D2D] flex items-center justify-between group bg-gray-50/50">
                              <span className="group-hover:text-[#FF8BA7] transition-colors">{lang}</span>
                              {lang === 'English (US)' && <Check size={20} className="text-[#FF8BA7]" />}
                           </button>
                         ))}
                      </div>
                    )}

                    {activeModal === 'privacy' && (
                      <div className="space-y-10 text-center py-8">
                         <div className="w-24 h-24 bg-rose-50 text-[#FF8BA7] rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                            <Shield size={48} />
                         </div>
                         <div className="space-y-3">
                           <h4 className="text-2xl font-black text-[#2D2D2D] tracking-tight">Zero-Knowledge Privacy</h4>
                           <p className="text-sm text-gray-500 font-medium px-6 leading-relaxed">
                             Aether uses end-to-end encryption for all pregnancy records. Only you and your selected clinicians can access your health data.
                           </p>
                         </div>
                         <div className="pt-6 space-y-4">
                            <button className="w-full py-5 rounded-[1.5rem] bg-[#2D2D2D] text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/10">Export My Vault</button>
                            <button className="w-full py-5 rounded-[1.5rem] bg-red-50 text-red-600 font-black uppercase tracking-widest text-[10px]">Purge Identity</button>
                         </div>
                      </div>
                    )}

                    {activeModal === 'data' && (
                      <div className="space-y-8">
                         <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-inner">
                            <div className="flex justify-between mb-4">
                               <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Cloud Storage</span>
                               <span className="text-[11px] font-black text-[#FF8BA7]">1.2 GB / 5 GB</span>
                            </div>
                            <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-sm border border-gray-100">
                               <div className="w-[24%] h-full bg-[#FF8BA7] rounded-full shadow-lg" />
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium mt-6 text-center">Auto-syncing with Aether Health Vault</p>
                         </div>
                         <button onClick={() => showNotify('Cache cleared')} className="w-full py-6 rounded-[2rem] border-2 border-gray-50 hover:border-rose-100 font-black uppercase tracking-widest text-[10px] text-[#2D2D2D] transition-all">Optimize Storage</button>
                      </div>
                    )}

                    {activeModal === 'subscription' && (
                      <div className="space-y-8">
                         <div className="p-8 rounded-[3rem] bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                               <div className="flex justify-between items-start mb-10">
                                  <div>
                                     <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FF8BA7] mb-2">Member Tier</p>
                                     <h4 className="text-4xl font-black tracking-tight">Hera PRO</h4>
                                  </div>
                                  <div className="px-4 py-1.5 bg-[#FF8BA7]/20 rounded-full border border-[#FF8BA7]/30 backdrop-blur-md">
                                     <span className="text-[11px] font-black uppercase tracking-widest text-[#FF8BA7]">Premium</span>
                                  </div>
                               </div>
                               <div className="space-y-4 mb-10">
                                  {[
                                    'Unlimited Midwife Consultation',
                                    'Advanced Fetal Growth Mapping',
                                    'Hormonal Insight Dashboard',
                                    'Emergency SOS Connectivity'
                                  ].map(f => (
                                    <div key={f} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                                       <div className="w-5 h-5 rounded-full bg-[#FF8BA7]/20 flex items-center justify-center text-[#FF8BA7]">
                                          <Check size={12} strokeWidth={4} />
                                       </div>
                                       {f}
                                    </div>
                                  ))}
                                </div>
                               <div className="flex items-center justify-between pt-8 border-t border-white/10">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Subscription ID: ATH-7742</span>
                                  <span className="text-xl font-black text-white">ACTIVE</span>
                               </div>
                            </div>
                            <Sparkles className="absolute -bottom-10 -right-10 p-4 opacity-10 text-[#FF8BA7] scale-[2] rotate-12" size={150} />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <button className="py-5 rounded-[1.5rem] bg-gray-50 border border-gray-100 font-black uppercase tracking-widest text-[10px] text-[#2D2D2D] hover:bg-rose-50 hover:border-rose-100 transition-all">Invoices</button>
                            <button className="py-5 rounded-[1.5rem] bg-rose-50 border border-gray-100 font-black uppercase tracking-widest text-[10px] text-[#FF8BA7] hover:bg-rose-100 transition-all">Gift Membership</button>
                         </div>
                      </div>
                    )}

                    {activeModal === 'help' && (
                      <div className="space-y-8">
                         <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                            <input type="text" placeholder="Search Help Vault" className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 pl-16 pr-8 outline-none focus:border-[#FF8BA7]/30 focus:bg-white font-bold text-sm text-[#2D2D2D] shadow-inner" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            {[
                              { label: 'Pregnancy', icon: Baby, color: 'text-rose-500', bg: 'bg-rose-50' },
                              { label: 'Medical', icon: Syringe, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                              { label: 'Labor', icon: Footprints, color: 'text-amber-600', bg: 'bg-amber-50' },
                              { label: 'Technical', icon: Smartphone, color: 'text-slate-500', bg: 'bg-slate-100' },
                            ].map(item => (
                              <button key={item.label} className="p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all text-left group">
                                 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm", item.bg, item.color)}>
                                    <item.icon size={28} />
                                 </div>
                                 <p className="font-black text-[13px] text-[#2D2D2D] leading-tight group-hover:text-[#FF8BA7] transition-colors">{item.label}</p>
                              </button>
                            ))}
                         </div>
                         <button className="w-full py-6 bg-[#FF8BA7] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-rose-100 hover:scale-[1.02] active:scale-95 transition-all">
                            Connect with Support AI
                         </button>
                      </div>
                    )}

                    {activeModal === 'about' && (
                      <div className="space-y-12 py-8 text-center">
                         <div className="relative inline-block">
                           <div className="w-32 h-32 bg-gradient-to-tr from-[#FF8BA7] to-[#FFB7B2] rounded-[3.5rem] flex items-center justify-center shadow-2xl shadow-rose-100 relative z-10">
                              <Activity size={64} className="text-white" />
                           </div>
                           <div className="absolute inset-0 bg-rose-200 blur-3xl opacity-30 rounded-full" />
                         </div>
                         
                         <div className="space-y-2">
                           <h4 className="text-4xl font-black text-[#2D2D2D] tracking-tighter">Aether Health</h4>
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Intelligence for Life • v2.4.0</p>
                         </div>

                         <div className="space-y-3">
                            {[
                              { label: 'Security & Compliance', icon: ShieldCheck },
                              { label: 'Data Processing Addendum', icon: FileText },
                              { label: 'Connect with Community', icon: Image },
                            ].map(link => (
                              <button key={link.label} className="w-full p-6 rounded-[1.5rem] bg-gray-50 flex items-center justify-between group hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100">
                                 <div className="flex items-center gap-4">
                                    <link.icon size={22} className="text-gray-400 group-hover:text-[#FF8BA7] transition-colors" />
                                    <span className="font-bold text-sm text-[#2D2D2D] group-hover:text-[#FF8BA7]">{link.label}</span>
                                 </div>
                                 <ChevronRight size={18} className="text-gray-300" />
                              </button>
                            ))}
                         </div>
                         
                         <div className="pt-6 space-y-2">
                           <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.5em]">
                              Aether Technologies
                           </p>
                           <p className="text-[8px] font-bold text-gray-200">Built with intention in San Francisco</p>
                         </div>
                      </div>
                    )}

                    {activeModal === 'qrcode' && (
                      <div className="space-y-6 text-center py-4">
                         <p className="text-xs text-slate-500 font-medium px-4">
                           Scan this dynamic universal pass for instant emergency record matching and clinical telemetry access.
                         </p>
                         
                         {/* Massive beautifully framed QR code */}
                         <div className="w-64 h-64 bg-white rounded-3xl border-4 border-slate-900 p-6 shadow-2xl mx-auto flex flex-col items-center justify-center relative group overflow-hidden">
                            {/* Animated scanner overlay laser */}
                            <motion.div 
                              animate={{ y: [-10, 240, -10] }} 
                              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} 
                              className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.9)] z-10" 
                            />
                            
                            {/* Four corner targeting brackets */}
                            <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-emerald-600 rounded-tl" />
                            <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-emerald-600 rounded-tr" />
                            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-emerald-600 rounded-bl" />
                            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-emerald-600 rounded-br" />

                            <QrCode size={180} className="text-slate-950 scale-105" strokeWidth={1.2} />
                         </div>

                         <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100/60 max-w-xs mx-auto">
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block">Universal ID Key</span>
                           <span className="text-xs font-mono font-black text-slate-900 mt-0.5 block">ATH-PASS-{profile?.name?.toUpperCase().replace(/\s+/g, '') || 'GUEST'}-2026</span>
                         </div>

                         <div className="grid grid-cols-2 gap-3 pt-2">
                            <button 
                              onClick={() => showNotify('QR access link copied to clipboard', Share2)} 
                              className="py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-[11px] text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Share2 size={14} /> Share Pass
                            </button>
                            <button 
                              onClick={() => showNotify('Pass downloaded to secure key wallet', CheckCircle)} 
                              className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                            >
                              <ScanLine size={14} /> Download Pass
                            </button>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 bg-[#2D2D2D] text-white rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
              <notification.icon size={18} className="text-rose-400" />
            </div>
            <p className="text-sm font-black tracking-tight">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* TOP AREA */}
      <section className="space-y-10">
        {/* Greeting & Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-display font-black text-[#2D2D2D] tracking-tighter">
              Hello, <span className="text-[#FF8BA7]">{firstName}</span>.
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#FF8BA7] animate-pulse" />
              <p className="text-sm text-[#FF8BA7] font-bold uppercase tracking-widest opacity-80">
                Maternal Status: <span className="text-[#2D2D2D]">Week 24 • Due in 112d</span>
              </p>
            </div>
          </div>
          
          {/* Quick Stats Banner */}
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-rose-100 flex items-center justify-center text-[#FF8BA7]">
              <Heart size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#2D2D2D] tracking-tight">Health Card</h2>
              <p className="text-sm text-gray-500 font-medium">Your prenatal health identity</p>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* LEFT/TOP: Redesigned Health Card */}
          <div className="xl:col-span-12">
            {/* REDESIGNED CREDIT-CARD SIZED HEALTH ID */}
            <div onClick={() => setActiveModal('qrcode' as any)} className="w-full max-w-md mx-auto bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] rounded-[24px] shadow-xl p-6 text-white relative overflow-hidden border border-emerald-400/30 cursor-pointer group hover:shadow-2xl transition-all">
               {/* Decorative background glow / chips */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-300/10 rounded-full blur-xl pointer-events-none" />
               
               {/* Header / Brand */}
               <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center gap-2.5">
                     <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Heart size={16} className="text-white fill-white/20" />
                     </div>
                     <div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-white leading-none">Aether Identity</h4>
                        <span className="text-[8px] font-bold text-emerald-100/80 tracking-wider">MATERNAL HEALTH PASS</span>
                     </div>
                  </div>
                  <span className="text-[9px] font-black tracking-widest bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white uppercase">
                     Pregnancy
                  </span>
               </div>

               {/* Main User Details */}
               <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center shadow-inner shrink-0">
                     <User size={28} className="text-white" />
                  </div>
                  <div className="overflow-hidden">
                     <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black tracking-tight truncate text-white">{profile?.name}</h3>
                        <CheckCircle2 size={16} className="text-white fill-emerald-600 shrink-0" />
                     </div>
                     <p className="text-xs font-bold text-emerald-100 mt-0.5">24 Weeks Pregnant • Due Sep 12</p>
                  </div>
               </div>

               {/* Minimalist Vitals Grid */}
               <div className="grid grid-cols-4 gap-2 py-2.5 border-t border-b border-white/10 my-4 relative z-10 bg-black/10 rounded-xl px-3 backdrop-blur-sm">
                  <div>
                     <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-200 block">Blood</span>
                     <span className="text-xs font-black text-white">A+</span>
                  </div>
                  <div>
                     <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-200 block">Height</span>
                     <span className="text-xs font-black text-white">172 cm</span>
                  </div>
                  <div>
                     <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-200 block">Weight</span>
                     <span className="text-xs font-black text-white">74 kg</span>
                  </div>
                  <div className="text-right">
                     <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-200 block">Status</span>
                     <span className="text-xs font-black text-white">Active</span>
                  </div>
               </div>

               {/* Emergency Contact & Footer */}
               <div className="flex justify-between items-end pt-1 relative z-10">
                  <div className="overflow-hidden pr-2">
                     <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-200 block">Emergency Contact</span>
                     <span className="text-[11px] font-black text-white block truncate">Anita Gowda (Mother)</span>
                     <span className="text-[10px] font-bold text-emerald-100">+91 98765 43210</span>
                  </div>
                  
                  {/* Miniature integrated QR wrapper */}
                  <button type="button" onClick={(e) => { e.stopPropagation(); setActiveModal('qrcode' as any); }} className="bg-white p-1.5 rounded-xl shadow-md shrink-0 flex flex-col items-center group-hover:scale-110 active:scale-95 transition-transform cursor-pointer">
                     <QrCode size={36} className="text-emerald-950" />
                  </button>
               </div>
            </div>
          </div>

          {/* Safe Space Access */}
          <div className="xl:col-span-12 h-full mt-4">
            <button 
              onClick={() => navigate('/mental-wellness')}
              className="w-full bg-white rounded-[3rem] p-8 text-[#2D2D2D] relative overflow-hidden group shadow-sm border border-rose-100 hover:bg-rose-50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 group-hover:scale-110 transition-transform">
                  <Sparkles className="text-[#FF8BA7]" size={32} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black tracking-tight mb-1">Sanctuary Access</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Connect with your maternal AI companion for support.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#FF8BA7] font-black text-[12px] uppercase tracking-[0.2em] px-8 py-4 bg-rose-50 rounded-2xl group-hover:bg-[#FF8BA7] group-hover:text-white transition-all">
                Enter Sanctuary <ArrowRight size={16} />
              </div>
              <div className="absolute top-0 right-1/4 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                <Brain size={120} className="text-[#FF8BA7]" />
              </div>
            </button>
          </div>
        </section>

        {/* MAIN PROFILE - Settings Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 mt-10">
          {settingsGroups.map((group, i) => (
            <div key={i} className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF8BA7] pl-2">{group.title}</h3>
              <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm h-fit">
                {group.items.map((item, j) => (
                  <button 
                    key={j}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-6 hover:bg-rose-50 transition-all border-b border-gray-50 last:border-0 group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center group-hover:bg-rose-50 group-hover:text-[#FF8BA7] transition-colors">
                        <item.icon size={22} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-black text-[#2D2D2D]">{item.label}</h4>
                        <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-rose-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* BOTTOM AREA: SOS & LOGOUT */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <div className="p-8 sm:p-10 rounded-[3rem] bg-rose-50 border border-rose-100 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-200">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-red-600 tracking-tight">SOS Protocols</h3>
                  <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mt-0.5">Response Active</p>
                </div>
              </div>
              <button className="px-5 py-2.5 rounded-full bg-white text-red-600 font-black text-[9px] uppercase tracking-widest border border-red-100 shadow-sm hover:bg-red-600 hover:text-white transition-all">
                Setup SOS
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-white border border-red-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Sister (Primary)</p>
                    <p className="text-sm font-black text-slate-900">+91 98765 43210</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-red-100">
                {[
                  { label: 'Auto-Notify Guardian', desc: 'Alert contact on SOS' },
                  { label: 'Lockscreen ID', desc: 'Display medical info' },
                ].map((toggle, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-red-100/50">
                    <div>
                      <h4 className="text-[13px] font-bold text-red-700">{toggle.label}</h4>
                      <p className="text-[9px] text-red-400 font-medium">{toggle.desc}</p>
                    </div>
                    <button className="w-10 h-5 rounded-full bg-red-500 relative p-1 shadow-inner">
                      <motion.div animate={{ x: 20 }} className="w-3 h-3 bg-white rounded-full shadow-md" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <button 
              onClick={() => {
                try {
                  window.localStorage.removeItem('aether-profile');
                  window.localStorage.removeItem('aether-onboarding');
                  window.localStorage.removeItem('aether-disclaimer-agreed');
                  window.sessionStorage.removeItem('aether-disclaimer-skipped-session');
                } catch {}
                setProfile({ ...DEFAULT_GUEST_PROFILE });
                disconnectSocket();
                window.location.href = '/';
              }}
              className="w-full h-full p-10 rounded-[3rem] bg-white border border-slate-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex flex-col items-center justify-center gap-6 group"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
                <LogOut size={32} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-2">De-Authorize</h3>
                <p className="text-xs font-medium text-gray-400 group-hover:text-red-400">Sign out and purge local cache</p>
              </div>
            </button>
          </div>
        </section>
      </section>
    </div>
  );
}
