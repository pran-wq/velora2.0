import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DisclaimerModal, { useDisclaimer } from '../components/DisclaimerModal';

export default function SplashScreen() {
  const navigate = useNavigate();
  const { show, dismiss, checked, setChecked } = useDisclaimer();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashDone(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (splashDone && !show) {
      const hasOnboarding = window.localStorage.getItem('aether-onboarding');
      if (!hasOnboarding) {
        navigate('/login');
      } else {
        navigate('/home');
      }
    }
  }, [splashDone, show, navigate]);

  const handleDismiss = () => {
    dismiss();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 overflow-hidden">
      {/* Deep ambient glows */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] right-[-15%] w-[70%] h-[70%] bg-indigo-500/20 rounded-full blur-[120px] -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] bg-blue-500/15 rounded-full blur-[100px] -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[80px] -z-10"
      />

      <div className="relative flex flex-col items-center z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-28 h-28"
        >
          {/* Logo shape — glassmorphic on dark */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl shadow-2xl shadow-indigo-500/20 border border-white/10 flex items-center justify-center">
             <span className="text-white text-4xl font-bold tracking-tighter">A</span>
          </div>

          {/* Breathing rings — indigo/blue */}
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 border border-indigo-400/30 rounded-2xl"
          />
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            className="absolute inset-0 border border-blue-400/20 rounded-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-white">Aether Health</h1>
          <p className="mt-2 text-xs font-semibold tracking-[0.25em] uppercase text-indigo-200/60">AI-Powered Healthcare OS</p>
          <p className="mt-10 text-[10px] italic text-white/20">"Your personal health memory"</p>
        </motion.div>

        {/* Subtle loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex gap-2"
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-300/50"
            />
          ))}
        </motion.div>
      </div>

      {/* Disclaimer Modal */}
      {show && splashDone && <DisclaimerModal onDismiss={handleDismiss} checked={checked} setChecked={setChecked} />}
    </div>
  );
}
