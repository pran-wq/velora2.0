import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Gender } from '../types';
import {
  AlertCircle, ChevronRight, Check, Stethoscope, User, Phone, Mail,
  HeartPulse, Dna, Ruler, Weight, Calendar, Pill, Watch, Activity,
  Moon, Zap, Target, UploadCloud
} from 'lucide-react';
import { connectSocket } from '../lib/socket';
import { DEFAULT_GUEST_PROFILE } from '../lib/guestProfile';

const HEALTH_GOALS = [
  'Weight Management', 'Muscle Gain', 'Better Sleep', 'Hormonal Balance',
  'Stress Reduction', 'Cardiovascular Health', 'Mental Wellness', 'Longevity',
  'Recovery', 'General Fitness'
];

const CONDITIONS = [
  'Diabetes', 'Thyroid', 'PCOS', 'Hypertension', 'Allergies',
  'Anxiety', 'Depression', 'Asthma', 'Heart Disease', 'None'
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ACTIVITY_LEVELS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Athlete'];
const SLEEP_DURATIONS = ['< 5 hours', '5-6 hours', '7-8 hours', '> 8 hours'];
const WEARABLES = ['None', 'Apple Watch', 'Fitbit', 'Garmin', 'Samsung Galaxy Watch', 'Oura Ring', 'Whoop'];

const TOTAL_STEPS = 4;

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function LoginFlow() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { setProfile } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Other' as Gender,
    age: 28,
    weight: 70,
    height: 175,
    bloodGroup: 'O+',
    phone: '',
    email: '',
    emergencyContact: '',
    allergies: '',
    medications: '',
    healthGoals: [] as string[],
    conditions: [] as string[],
    wearable: 'None',
    activityLevel: 'Moderately Active',
    sleepDuration: '7-8 hours',
    isPregnant: false,
    pregnancyMonth: 1,
  });

  const toggleArrayItem = (key: 'healthGoals' | 'conditions', value: string) => {
    setFormData(prev => {
      const arr = prev[key] as string[];
      if (value === 'None') return { ...prev, [key]: ['None'] };
      if (arr.includes('None')) return { ...prev, [key]: [value] };
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter(i => i !== value) };
      } else {
        return { ...prev, [key]: [...arr, value] };
      }
    });
  };

  const submitProfile = async () => {
    setStep(5);
    const fullProfile = {
      name: formData.name || DEFAULT_GUEST_PROFILE.name,
      gender: formData.gender,
      age: formData.age,
      weight: formData.weight,
      height: formData.height,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      email: formData.email,
      emergencyContact: formData.emergencyContact,
      allergies: formData.allergies,
      medications: formData.medications,
      healthGoals: formData.healthGoals,
      conditions: formData.conditions,
      wearable: formData.wearable,
      activityLevel: formData.activityLevel,
      sleepDuration: formData.sleepDuration,
      isPregnant: formData.isPregnant,
      ...(formData.isPregnant ? { pregnancyMonth: formData.pregnancyMonth } : {}),
      profileImage,
    };
    try {
      connectSocket(`local-${formData.name || 'user'}`);
      setProfile(fullProfile as any);
      localStorage.setItem('aether-onboarding', JSON.stringify(fullProfile));
    } catch {
      setProfile(fullProfile as any);
    }
    setTimeout(() => navigate('/home'), 2000);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.name.trim()) { setError('Please enter your full name'); return; }
    if (step === 1 && !formData.email.trim()) { setError('Please enter your email'); return; }
    if (step === 1 && !formData.phone.trim()) { setError('Please enter your phone number'); return; }
    if (step === 3) { submitProfile(); return; }
    setError('');
    setStep(s => s + 1);
  };

  const prevStep = () => { setError(''); setStep(s => s - 1); };

  const progressPercent = ((step) / TOTAL_STEPS) * 100;

  const inputBase = "w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/60 focus:border-indigo-400 focus:bg-white rounded-xl text-sm font-medium text-slate-800 outline-none transition-all shadow-sm";
  const labelBase = "text-[10px] font-bold uppercase tracking-widest text-slate-400";
  const cardBase = "bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 space-y-5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col font-sans text-slate-800 relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="fixed top-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Top bar */}
      <div className="w-full border-b border-white/60 bg-white/70 backdrop-blur-xl relative z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10">
              <Stethoscope size={18} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900">Aether Health</span>
          </div>
          {step > 0 && step < 5 && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step {step} of {TOTAL_STEPS}</span>
              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.4 }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 overflow-x-hidden relative z-10">
        <AnimatePresence mode="wait">

          {/* STEP 0: Welcome */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-lg space-y-10">
              <div className="text-center space-y-5">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/20"
                >
                  <Stethoscope size={40} className="text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome to Aether Health</h1>
                  <p className="text-slate-500 text-base font-medium max-w-sm mx-auto leading-relaxed mt-3">
                    Your AI-powered healthcare companion. Securely manage records, analyze reports, and receive personalized medical insights.
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="space-y-3 max-w-sm mx-auto">
                <button onClick={() => { setError(''); setStep(1); }} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                  Create Health Profile <ChevronRight size={18} />
                </button>
              </div>

              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Trusted by 10,000+ patients worldwide
              </p>
            </motion.div>
          )}

          {/* STEP 1: Personal Information */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full max-w-lg space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Information</h2>
                <p className="text-slate-500 text-sm font-medium">Required for secure health record management.</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className={cardBase}>
                {/* Profile Photo Upload */}
                <div className="flex justify-center">
                  <label className="relative cursor-pointer group">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <div className={cn(
                      "w-20 h-20 rounded-2xl flex items-center justify-center transition-all border-2 border-dashed",
                      profileImage
                        ? "border-indigo-400 bg-indigo-50 overflow-hidden"
                        : "border-slate-300 bg-slate-50 group-hover:border-indigo-400 group-hover:bg-indigo-50/50"
                    )}>
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UploadCloud size={24} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                      <UploadCloud size={12} className="text-white" />
                    </div>
                  </label>
                </div>
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Photo (Optional)</p>

                <div className="space-y-1.5">
                  <label className={labelBase}>Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputBase} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelBase}>Age</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value) || 0})} className={inputBase} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelBase}>Gender</label>
                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as Gender})} className={cn(inputBase, "pl-4")}>
                      {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelBase}>Height (cm)</label>
                    <div className="relative">
                      <Ruler size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="number" value={formData.height} onChange={e => setFormData({...formData, height: parseInt(e.target.value) || 0})} className={inputBase} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelBase}>Weight (kg)</label>
                    <div className="relative">
                      <Weight size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: parseInt(e.target.value) || 0})} className={inputBase} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelBase}>Blood Group</label>
                  <div className="relative">
                    <Dna size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className={cn(inputBase, "pl-10")}>
                      {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelBase}>Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputBase} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelBase}>Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputBase} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelBase}>Emergency Contact</label>
                  <div className="relative">
                    <HeartPulse size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Name and phone number" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} className={inputBase} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={prevStep} className="flex-1 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl font-bold text-sm text-slate-600 hover:bg-white transition-all backdrop-blur-sm">
                  Back
                </button>
                <button onClick={nextStep} className="flex-[2] py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10">
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Medical History & Lifestyle */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full max-w-lg space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Medical History & Lifestyle</h2>
                <p className="text-slate-500 text-sm font-medium">This helps our AI provide safer, more accurate insights.</p>
              </div>

              <div className={cardBase}>
                <div className="space-y-3">
                  <label className={labelBase}>Existing Medical Conditions</label>
                  <div className="flex flex-wrap gap-2">
                    {CONDITIONS.map(cond => {
                      const isSelected = formData.conditions.includes(cond);
                      return (
                        <button key={cond} onClick={() => toggleArrayItem('conditions', cond)} className={cn(
                          "px-4 py-2 rounded-lg font-medium text-xs border transition-all",
                          isSelected
                            ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50/50 text-indigo-700 shadow-sm"
                            : "border-slate-200/60 bg-slate-50/50 text-slate-500 hover:border-indigo-300/60"
                        )}>
                          {isSelected && <Check size={12} className="inline mr-1" />} {cond}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelBase}>Known Allergies</label>
                  <textarea placeholder="e.g. Penicillin, peanuts, latex..." value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} rows={3} className={cn(inputBase, "pl-4")} />
                </div>

                <div className="space-y-1.5">
                  <label className={labelBase}>Current Medications</label>
                  <textarea placeholder="e.g. Metformin 500mg, Lisinopril 10mg..." value={formData.medications} onChange={e => setFormData({...formData, medications: e.target.value})} rows={3} className={cn(inputBase, "pl-4")} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelBase}>Activity Level</label>
                    <div className="relative">
                      <Zap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select value={formData.activityLevel} onChange={e => setFormData({...formData, activityLevel: e.target.value})} className={cn(inputBase, "pl-10")}>
                        {ACTIVITY_LEVELS.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelBase}>Sleep Duration</label>
                    <div className="relative">
                      <Moon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select value={formData.sleepDuration} onChange={e => setFormData({...formData, sleepDuration: e.target.value})} className={cn(inputBase, "pl-10")}>
                        {SLEEP_DURATIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelBase}>Connected Wearable</label>
                  <div className="relative">
                    <Watch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select value={formData.wearable} onChange={e => setFormData({...formData, wearable: e.target.value})} className={cn(inputBase, "pl-10")}>
                      {WEARABLES.map(w => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={prevStep} className="flex-1 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl font-bold text-sm text-slate-600 hover:bg-white transition-all backdrop-blur-sm">
                  Back
                </button>
                <button onClick={nextStep} className="flex-[2] py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10">
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Health Goals */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full max-w-lg space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Health Goals</h2>
                <p className="text-slate-500 text-sm font-medium">Select the areas you want to focus on.</p>
              </div>

              <div className={cn(cardBase, "space-y-4")}>
                <div className="flex flex-wrap gap-2">
                  {HEALTH_GOALS.map(goal => {
                    const isSelected = formData.healthGoals.includes(goal);
                    return (
                      <button key={goal} onClick={() => toggleArrayItem('healthGoals', goal)} className={cn(
                        "px-4 py-2.5 rounded-lg font-medium text-xs border transition-all",
                        isSelected
                          ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50/50 text-indigo-700 shadow-sm"
                          : "border-slate-200/60 bg-slate-50/50 text-slate-500 hover:border-indigo-300/60"
                      )}>
                        {isSelected && <Target size={12} className="inline mr-1" />} {goal}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={prevStep} className="flex-1 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl font-bold text-sm text-slate-600 hover:bg-white transition-all backdrop-blur-sm">
                  Back
                </button>
                <button onClick={nextStep} className="flex-[2] py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                  Complete Setup <Check size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Loading */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-blue-500 border-b-slate-100 border-l-slate-100 rounded-full animate-spin" />
                <Activity size={32} className="text-slate-700" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Building your health profile...</h2>
                <p className="text-slate-500 text-sm font-medium">Configuring AI models and personalizing your dashboard.</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
