import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Moon, Activity, Loader2, CheckCircle2 } from 'lucide-react';
import { useHealthStore } from '../stores/healthStore';

interface QuickActionModalProps {
  isOpen: boolean;
  actionType: 'workout' | 'sleep' | 'vitals' | null;
  onClose: () => void;
}

export default function QuickActionModal({ isOpen, actionType, onClose }: QuickActionModalProps) {
  const { logWorkout, logSleep, logVitals } = useHealthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [workoutData, setWorkoutData] = useState({ type: 'Gym Workout', duration: 45, intensity: 'High', calories: 400 });
  const [sleepData, setSleepData] = useState({ duration: 7.5, quality: 'Good', interruptions: 1 });
  const [vitalData, setVitalData] = useState({ type: 'Heart Rate', value: '72', unit: 'bpm' });

  if (!isOpen || !actionType) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (actionType === 'workout') {
        await logWorkout({ ...workoutData, date: new Date().toISOString() });
      } else if (actionType === 'sleep') {
        await logSleep({ ...sleepData, date: new Date().toISOString() });
      } else if (actionType === 'vitals') {
        await logVitals({ ...vitalData, timestamp: new Date().toISOString() });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to log data', error);
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    if (actionType === 'workout') {
      return (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Workout Type</label>
            <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none" value={workoutData.type} onChange={e => setWorkoutData({...workoutData, type: e.target.value})}>
              <option>Gym Workout</option>
              <option>Running</option>
              <option>Cycling</option>
              <option>Yoga</option>
              <option>HIIT</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration (min)</label>
              <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none" value={workoutData.duration} onChange={e => setWorkoutData({...workoutData, duration: Number(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Calories</label>
              <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none" value={workoutData.calories} onChange={e => setWorkoutData({...workoutData, calories: Number(e.target.value)})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Intensity</label>
            <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none" value={workoutData.intensity} onChange={e => setWorkoutData({...workoutData, intensity: e.target.value})}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Extreme</option>
            </select>
          </div>
        </div>
      );
    }

    if (actionType === 'sleep') {
      return (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration (Hours)</label>
            <input type="number" step="0.5" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none" value={sleepData.duration} onChange={e => setSleepData({...sleepData, duration: Number(e.target.value)})} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quality</label>
            <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none" value={sleepData.quality} onChange={e => setSleepData({...sleepData, quality: e.target.value})}>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Poor</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Interruptions</label>
            <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none" value={sleepData.interruptions} onChange={e => setSleepData({...sleepData, interruptions: Number(e.target.value)})} />
          </div>
        </div>
      );
    }

    if (actionType === 'vitals') {
      return (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vital Type</label>
            <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none" value={vitalData.type} onChange={e => setVitalData({...vitalData, type: e.target.value})}>
              <option>Heart Rate</option>
              <option>Blood Pressure</option>
              <option>SpO2</option>
              <option>Glucose</option>
              <option>Weight</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Value</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none" value={vitalData.value} onChange={e => setVitalData({...vitalData, value: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unit</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none" value={vitalData.unit} onChange={e => setVitalData({...vitalData, unit: e.target.value})} />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getHeaderInfo = () => {
    switch (actionType) {
      case 'workout': return { icon: Dumbbell, title: 'Log Workout', color: 'text-orange-500', bg: 'bg-orange-50' };
      case 'sleep': return { icon: Moon, title: 'Log Sleep', color: 'text-indigo-500', bg: 'bg-indigo-50' };
      case 'vitals': return { icon: Activity, title: 'Log Vitals', color: 'text-emerald-500', bg: 'bg-emerald-50' };
      default: return { icon: Activity, title: 'Log Data', color: 'text-blue-500', bg: 'bg-blue-50' };
    }
  };

  const header = getHeaderInfo();
  const HeaderIcon = header.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[32px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
        >
          {success ? (
            <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={40} />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-800">Saved Successfully!</h3>
              <p className="text-slate-500">Your health dashboard is updating...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${header.bg} ${header.color}`}>
                    <HeaderIcon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{header.title}</h3>
                </div>
                <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {renderForm()}
              </div>

              <div className="p-6 pt-0 mt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-[#818CF8] hover:bg-[#6366F1] text-white font-bold rounded-2xl transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Save Entry'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
