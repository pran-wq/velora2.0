import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-cream via-bg-soft to-primary/30 overflow-hidden">
      {/* Background ambient light */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-primary/40 rounded-full blur-[120px] -z-10"
      />
      
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-32 h-32"
        >
          {/* Logo shape */}
          <div className="absolute inset-0 bg-primary-dark rounded-full glow-pulse shadow-[0_0_40px_rgba(94,156,137,0.3)] flex items-center justify-center">
             <span className="text-white text-5xl font-light tracking-tighter">A</span>
          </div>
          
          {/* Breathing rings */}
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 border-2 border-primary-dark rounded-full"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-8 text-center"
        >
          <h1 className="text-3xl font-light tracking-widest text-gray-800">AETHER</h1>
          <p className="mt-2 text-sm font-medium tracking-[0.3em] uppercase text-primary-dark/60">Health Memory</p>
          <p className="mt-12 text-xs italic text-gray-400">"Your personal health memory"</p>
        </motion.div>
      </div>
    </div>
  );
}
