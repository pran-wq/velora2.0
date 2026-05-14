import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Gender } from '../types';
import { AlertCircle, ChevronRight, Check, Sparkles } from 'lucide-react';
import { connectSocket } from '../lib/socket';
import { DEFAULT_GUEST_PROFILE } from '../lib/guestProfile';

const HEALTH_GOALS = [
  'Weight Loss', 'Muscle Gain', 'Better Sleep', 'Hormonal Wellness', 
  'Stress Reduction', 'Better Fitness', 'Mental Wellness', 'Productivity', 
  'Recovery', 'Longevity'
];

const CONDITIONS = [
  'Diabetes', 'Thyroid', 'PCOS', 'Hypertension', 'Allergies', 
  'Anxiety', 'Depression', 'Asthma', 'Injuries', 'None'
];

export default function LoginFlow() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  const { setProfile } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Other' as Gender,
    age: 28,
    weight: 70,
    height: 175,
    country: 'United States',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    bloodGroup: 'O+',
    healthGoals: [] as string[],
    lifestyle: {
      sleepHours: '7-8',
      workoutFreq: '3-4 times/week',
      waterIntake: '2-3 Liters',
      activityLevel: 'Moderately Active',
      dietType: 'Omnivore',
      screenTime: '4-6 hours',
      stressLevel: 'Moderate'
    },
    conditions: [] as string[],
    wearable: 'None',
    // Female Specific
    isPregnant: false,
    cycleLength: 28,
    lastPeriodDate: '',
    pmsSeverity: 'Mild',
    hormonalGoals: [] as string[],
    pregnancyMonth: 1,
  });

  const goDashboard = () => {
    setError('');
    setProfile({ ...DEFAULT_GUEST_PROFILE });
    connectSocket('guest');
    navigate('/home');
  };

  const toggleArrayItem = (key: 'healthGoals' | 'conditions' | 'hormonalGoals', value: string) => {
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
    setStep(7);
    try {
      connectSocket(`local-${formData.name || 'user'}`);

      setProfile({
        name: formData.name || DEFAULT_GUEST_PROFILE.name,
        gender: formData.gender,
        age: formData.age,
        weight: formData.weight,
        bloodGroup: formData.bloodGroup,
        isPregnant: formData.isPregnant,
        ...(formData.isPregnant ? { pregnancyMonth: formData.pregnancyMonth } : {}),
      });

      setTimeout(() => navigate('/home'), 2500);
    } catch (err: unknown) {
      console.warn('Profile save failed:', err);
      setProfile({
        name: formData.name || DEFAULT_GUEST_PROFILE.name,
        gender: formData.gender,
        age: formData.age,
        weight: formData.weight,
        bloodGroup: formData.bloodGroup,
        isPregnant: formData.isPregnant,
        ...(formData.isPregnant ? { pregnancyMonth: formData.pregnancyMonth } : {}),
      });
      setTimeout(() => navigate('/home'), 2500);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.name) return;
    if (step === 4 && formData.gender !== 'Female') {
      submitProfile();
      return;
    }
    if (step === 5 && formData.gender === 'Female') {
      submitProfile();
      return;
    }
    setStep(s => s + 1);
  };

  const renderSelect = (label: string, field: keyof typeof formData.lifestyle, options: string[]) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">{label}</label>
      <select 
        value={formData.lifestyle[field]}
        onChange={e => setFormData({...formData, lifestyle: {...formData.lifestyle, [field]: e.target.value}})}
        className="w-full bg-white border-2 border-transparent focus:border-[#818CF8] rounded-2xl px-4 py-3 text-[#0F172A] font-medium shadow-sm outline-none transition-all appearance-none"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 font-sans overflow-x-hidden">
       <AnimatePresence>
        
        {/* STEP 0: Start (no external auth — MVP) */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md space-y-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#0F172A] rounded-2xl mx-auto flex items-center justify-center mb-6">
                <Sparkles className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-display font-bold text-[#0F172A] tracking-tight">Aether Health</h1>
              <p className="text-[#64748B] text-lg font-medium">Your personalized AI healthcare ecosystem.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-3 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
                <button
                  type="button"
                  onClick={goDashboard}
                  className="w-full py-4 bg-[#0F172A] text-white rounded-xl font-bold text-lg hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-2"
                >
                  Continue to dashboard
                </button>
                <button
                  type="button"
                  onClick={() => { setError(''); setStep(1); }}
                  className="w-full py-4 bg-white border border-gray-200 rounded-xl font-bold text-lg text-[#0F172A] hover:bg-gray-50 transition-colors"
                >
                  Personalize profile first
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-lg space-y-8">
            <div className="space-y-3">
              <span className="text-[#818CF8] font-bold tracking-widest uppercase text-xs">Step 1 of {formData.gender === 'Female' ? '6' : '5'}</span>
              <h2 className="text-3xl font-display font-bold text-[#0F172A]">Let's build your profile.</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border-2 border-transparent focus:border-[#818CF8] rounded-2xl px-5 py-4 text-lg font-bold text-[#0F172A] shadow-sm outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Gender</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as Gender})} className="w-full bg-white border-2 border-transparent focus:border-[#818CF8] rounded-2xl px-5 py-4 text-lg font-bold text-[#0F172A] shadow-sm outline-none appearance-none">
                  {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Age</label>
                <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value) || 0})} className="w-full bg-white border-2 border-transparent focus:border-[#818CF8] rounded-2xl px-5 py-4 text-lg font-bold text-[#0F172A] shadow-sm outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Weight (kg)</label>
                <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: parseInt(e.target.value) || 0})} className="w-full bg-white border-2 border-transparent focus:border-[#818CF8] rounded-2xl px-5 py-4 text-lg font-bold text-[#0F172A] shadow-sm outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Height (cm)</label>
                <input type="number" value={formData.height} onChange={e => setFormData({...formData, height: parseInt(e.target.value) || 0})} className="w-full bg-white border-2 border-transparent focus:border-[#818CF8] rounded-2xl px-5 py-4 text-lg font-bold text-[#0F172A] shadow-sm outline-none" />
              </div>
            </div>

            <button onClick={nextStep} disabled={!formData.name} className="w-full py-5 bg-[#0F172A] text-white rounded-[24px] font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-[#1E293B] transition-colors">
              Continue <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {/* STEP 2: Health Goals */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-xl space-y-8">
            <div className="space-y-3 text-center">
              <span className="text-[#818CF8] font-bold tracking-widest uppercase text-xs">Step 2 of {formData.gender === 'Female' ? '6' : '5'}</span>
              <h2 className="text-3xl font-display font-bold text-[#0F172A]">What are your primary goals?</h2>
              <p className="text-[#64748B] font-medium text-lg">Select all that apply.</p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {HEALTH_GOALS.map(goal => {
                const isSelected = formData.healthGoals.includes(goal);
                return (
                  <button key={goal} onClick={() => toggleArrayItem('healthGoals', goal)} className={`px-5 py-3 rounded-full font-bold text-sm border-2 transition-all flex items-center gap-2 ${isSelected ? 'border-[#818CF8] bg-[#EEF2FF] text-[#818CF8]' : 'border-transparent bg-white text-[#64748B] hover:shadow-sm'}`}>
                    {isSelected && <Check size={16} />} {goal}
                  </button>
                );
              })}
            </div>

            <button onClick={nextStep} className="w-full max-w-md mx-auto py-5 bg-[#0F172A] text-white rounded-[24px] font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1E293B] transition-colors mt-8">
              Continue <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {/* STEP 3: Lifestyle */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-xl space-y-8">
            <div className="space-y-3">
              <span className="text-[#818CF8] font-bold tracking-widest uppercase text-xs">Step 3 of {formData.gender === 'Female' ? '6' : '5'}</span>
              <h2 className="text-3xl font-display font-bold text-[#0F172A]">Tell us about your lifestyle.</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {renderSelect('Sleep Hours', 'sleepHours', ['< 5 hours', '5-6 hours', '7-8 hours', '> 8 hours'])}
              {renderSelect('Workout Frequency', 'workoutFreq', ['Rarely', '1-2 times/week', '3-4 times/week', '5+ times/week'])}
              {renderSelect('Water Intake', 'waterIntake', ['< 1 Liter', '1-2 Liters', '2-3 Liters', '> 3 Liters'])}
              {renderSelect('Activity Level', 'activityLevel', ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'])}
              {renderSelect('Diet Type', 'dietType', ['Omnivore', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Other'])}
              {renderSelect('Screen Time', 'screenTime', ['< 2 hours', '2-4 hours', '4-6 hours', '8+ hours'])}
              {renderSelect('Stress Level', 'stressLevel', ['Low', 'Moderate', 'High', 'Severe'])}
            </div>

            <button onClick={nextStep} className="w-full py-5 bg-[#0F172A] text-white rounded-[24px] font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1E293B] transition-colors mt-8">
              Continue <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {/* STEP 4: Health Conditions & Wearables */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-xl space-y-8">
            <div className="space-y-3">
              <span className="text-[#818CF8] font-bold tracking-widest uppercase text-xs">Step 4 of {formData.gender === 'Female' ? '6' : '5'}</span>
              <h2 className="text-3xl font-display font-bold text-[#0F172A]">Medical & Wearables</h2>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-[#0F172A]">Any existing health conditions?</h3>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map(cond => {
                  const isSelected = formData.conditions.includes(cond);
                  return (
                    <button key={cond} onClick={() => toggleArrayItem('conditions', cond)} className={`px-4 py-2 rounded-full font-bold text-sm border transition-all ${isSelected ? 'border-[#818CF8] bg-[#EEF2FF] text-[#818CF8]' : 'border-gray-200 bg-white text-[#64748B] hover:shadow-sm'}`}>
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-bold text-[#0F172A]">Do you use a smartwatch or fitness band?</h3>
              <select 
                value={formData.wearable}
                onChange={e => setFormData({...formData, wearable: e.target.value})}
                className="w-full bg-white border-2 border-transparent focus:border-[#818CF8] rounded-2xl px-5 py-4 text-lg font-bold text-[#0F172A] shadow-sm outline-none appearance-none"
              >
                {['Apple Watch', 'Fitbit', 'Garmin', 'Samsung Galaxy', 'Oura Ring', 'Whoop', 'None'].map(w => <option key={w}>{w}</option>)}
              </select>
            </div>

            <button onClick={nextStep} className="w-full py-5 bg-[#0F172A] text-white rounded-[24px] font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1E293B] transition-colors mt-8">
              {formData.gender === 'Female' ? 'Continue' : 'Complete Setup'} <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {/* STEP 5: Female-Specific */}
        {step === 5 && formData.gender === 'Female' && (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md space-y-8">
            <div className="space-y-3">
              <span className="text-[#FF6B8B] font-bold tracking-widest uppercase text-xs">Step 5 of 5</span>
              <h2 className="text-3xl font-display font-bold text-[#0F172A]">Female Dynamics</h2>
              <p className="text-[#64748B] font-medium text-lg">Tailoring your hormonal dashboard.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Average Cycle Length (Days)</label>
                <input type="number" value={formData.cycleLength} onChange={e => setFormData({...formData, cycleLength: parseInt(e.target.value) || 28})} className="w-full bg-white border-2 border-transparent focus:border-[#FF6B8B] rounded-2xl px-5 py-4 text-lg font-bold text-[#0F172A] shadow-sm outline-none" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">PMS Severity</label>
                <select value={formData.pmsSeverity} onChange={e => setFormData({...formData, pmsSeverity: e.target.value})} className="w-full bg-white border-2 border-transparent focus:border-[#FF6B8B] rounded-2xl px-5 py-4 text-lg font-bold text-[#0F172A] shadow-sm outline-none appearance-none">
                  {['None', 'Mild', 'Moderate', 'Severe'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <label className="flex items-center justify-between cursor-pointer p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
                <span className="font-bold text-[#0F172A]">Are you currently pregnant?</span>
                <input type="checkbox" checked={formData.isPregnant} onChange={e => setFormData({...formData, isPregnant: e.target.checked})} className="w-6 h-6 rounded-md border-gray-300 text-[#FF6B8B] focus:ring-[#FF6B8B]" />
              </label>

              {formData.isPregnant && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-4">
                  <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Pregnancy Month</label>
                  <input type="range" min="1" max="9" value={formData.pregnancyMonth} onChange={e => setFormData({...formData, pregnancyMonth: parseInt(e.target.value)})} className="w-full accent-[#FF6B8B]" />
                  <div className="flex justify-between font-bold text-[#FF6B8B] text-lg"><span>Month {formData.pregnancyMonth}</span></div>
                </motion.div>
              )}
            </div>

            <button onClick={nextStep} className="w-full py-5 bg-[#FF6B8B] text-white rounded-[24px] font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#FA5A7D] transition-colors mt-8 shadow-lg shadow-pink-200">
              Complete Setup <Check size={20} />
            </button>
          </motion.div>
        )}

        {/* STEP 7: Loading */}
        {step === 7 && (
          <motion.div key="step7" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-[#EEF2FF] rounded-full" />
              <div className="absolute inset-0 border-4 border-[#818CF8] rounded-full border-t-transparent animate-spin" />
              <Sparkles className="text-[#818CF8]" size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold text-[#0F172A]">Building Profile...</h2>
            <p className="text-[#64748B] font-medium text-lg">Our AI is configuring your personalized health ecosystem based on your onboarding answers.</p>
          </motion.div>
        )}
        
       </AnimatePresence>
    </div>
  );
}
