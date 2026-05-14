import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Pause, SkipForward, SkipBack, Music, ListMusic, Volume2 } from 'lucide-react';
import { GlassCard } from '../../components/Common';

export default function RelaxationMusic() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const playlist = [
    { title: 'Subtle Heartbeat', artist: 'Womb Resonance', duration: '5:40', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=400' },
    { title: 'Deep Ocean Calm', artist: 'Aether Sounds', duration: '12:00', img: 'https://images.unsplash.com/photo-1505118380757-91f5f45d8de4?auto=format&fit=crop&q=80&w=400' },
    { title: 'Forest Dawn', artist: 'Nature Sync', duration: '8:25', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400' },
  ];

  const track = playlist[currentTrack];

  return (
    <div className="min-h-screen bg-[#FDF8FF] font-sans text-[#2E2528] p-6 md:p-10 pb-32">
      <div className="max-w-2xl mx-auto space-y-12">
        
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-purple-500 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400">
            <ListMusic size={24} />
          </button>
        </header>

        {/* ALBUM ART */}
        <div className="relative group">
           <div className="absolute inset-10 bg-purple-500/20 rounded-full blur-[80px] group-hover:bg-purple-500/30 transition-all duration-700" />
           <motion.div 
             key={currentTrack}
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="relative aspect-square max-w-[320px] mx-auto rounded-[3rem] overflow-hidden shadow-2xl"
           >
             <img src={track.img} alt={track.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
           </motion.div>
        </div>

        {/* TRACK INFO */}
        <div className="text-center space-y-2">
           <h2 className="text-3xl font-display font-bold tracking-tight">{track.title}</h2>
           <p className="text-sm font-bold text-purple-400 uppercase tracking-widest">{track.artist}</p>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-3 px-4">
           <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: isPlaying ? '100%' : '35%' }}
                transition={{ duration: isPlaying ? 340 : 0.5, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
              />
           </div>
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-300">
              <span>2:15</span>
              <span>{track.duration}</span>
           </div>
        </div>

        {/* PLAYER CONTROLS */}
        <div className="flex items-center justify-center gap-10">
           <button onClick={() => setCurrentTrack(prev => (prev - 1 + playlist.length) % playlist.length)} className="text-gray-300 hover:text-purple-500 transition-colors">
              <SkipBack size={32} fill="currentColor" />
           </button>
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className="w-24 h-24 rounded-full bg-[#2E2528] text-white flex items-center justify-center shadow-2xl shadow-purple-200 hover:scale-105 transition-all"
           >
             {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
           </button>
           <button onClick={() => setCurrentTrack(prev => (prev + 1) % playlist.length)} className="text-gray-300 hover:text-purple-500 transition-colors">
              <SkipForward size={32} fill="currentColor" />
           </button>
        </div>

        {/* VOLUME & EXTRA */}
        <div className="flex justify-center items-center gap-6 text-gray-300">
           <Volume2 size={20} />
           <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-gray-200" />
           </div>
        </div>

      </div>
    </div>
  );
}
