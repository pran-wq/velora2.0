import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Stethoscope, AlertTriangle, Lock, ChevronRight } from 'lucide-react';

const SESSION_KEY = 'aether-disclaimer-skipped-session';

export function useDisclaimer() {
  const [show, setShow] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const skipped = window.sessionStorage.getItem(SESSION_KEY);
      if (skipped === 'true') setShow(false);
    } catch {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    try {
      if (checked) {
        window.sessionStorage.setItem(SESSION_KEY, 'true');
      }
    } catch {}
    setShow(false);
  };

  return { show, dismiss, checked, setChecked };
}

export default function DisclaimerModal({ onDismiss, checked, setChecked }: { onDismiss: () => void; checked: boolean; setChecked: (v: boolean) => void }) {
  const [step, setStep] = useState(0);

  const disclaimers = [
    {
      icon: Stethoscope,
      title: 'AI-Assisted Healthcare Platform',
      text: 'Aether Health uses artificial intelligence to analyze health data, provide insights, and assist with wellness tracking. Our AI models are designed to support — not replace — professional medical judgment.',
      accent: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: AlertTriangle,
      title: 'Not a Replacement for Medical Care',
      text: 'This platform does not provide medical diagnosis, treatment recommendations, or emergency services. Always consult a licensed healthcare professional for medical advice, diagnosis, or treatment.',
      accent: 'bg-amber-50 text-amber-600',
    },
    {
      icon: ShieldAlert,
      title: 'Emergency Disclaimer',
      text: 'If you are experiencing a medical emergency — chest pain, difficulty breathing, severe bleeding, or signs of stroke — call your local emergency number immediately. Do not rely on this platform for urgent care.',
      accent: 'bg-rose-50 text-rose-600',
    },
    {
      icon: Lock,
      title: 'Data Privacy & Security',
      text: 'Your health data is processed securely and stored with encryption standards. We do not sell your personal information. By continuing, you consent to our privacy practices and data handling policies.',
      accent: 'bg-indigo-50 text-indigo-600',
    },
  ];

  const current = disclaimers[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header — dark blue-purple premium */}
          <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <Stethoscope size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Aether Health</h2>
                <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Safety & Compliance</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5 px-8 pt-6">
            {disclaimers.map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: i <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="p-8 pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", current.accent)}>
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{current.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{current.text}</p>
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex gap-3">
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="flex-1 py-3.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
                  >
                    Back
                  </button>
                )}
                {step < disclaimers.length - 1 ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    className="flex-[2] py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={onDismiss}
                    className="flex-[2] py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    Agree & Continue <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {step === disclaimers.length - 1 && (
                <label className="flex items-center gap-2.5 cursor-pointer select-none mx-auto">
                  <div className={cn(
                    "w-4 h-4 rounded border transition-all flex items-center justify-center",
                    checked ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300"
                  )}>
                    {checked && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5.5L3.5 7.5L8 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={e => setChecked(e.target.checked)}
                  />
                  <span className="text-xs font-medium text-slate-500">Don't show again this session</span>
                </label>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
