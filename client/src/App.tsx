import { Component, ErrorInfo, ReactNode, createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, Medication, HealthRecord, HealthStats, Appointment, Vital } from './types';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BottomNav, PregnancyDock } from './components/Navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from './lib/utils';
import AICompanion from './components/AICompanion';
import { useHealthStore } from './stores/healthStore';
import { onNotification } from './lib/socket';
import { DEFAULT_GUEST_PROFILE } from './lib/guestProfile';

import { AppContext, useApp } from './context/AppContext';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginFlow from './screens/LoginFlow';
import Home from './screens/Home';
import Health from './screens/Health';
import Profile from './screens/Profile';
import Reports from './screens/Reports';
import Reminders from './screens/Reminders';
import Appointments from './screens/Appointments';
import WorkoutHub from './screens/WorkoutHub';
import NutritionHub from './screens/NutritionHub';
import InsuranceVault from './screens/InsuranceVault';
import MentalWellness from './screens/MentalWellness';
import HealthVault from './screens/HealthVault';
import ConnectDevices from './screens/ConnectDevices';
import DiseasePredictionTab from './screens/DiseasePredictionTab';
import OutbreakIntelligence from './screens/OutbreakIntelligence';
import MedicalImagingAI from './screens/MedicalImagingAI';

// Bonding Screens
import TalkingWithBaby from './screens/bonding/TalkingWithBaby';
import RelaxationMusic from './screens/bonding/RelaxationMusic';
import MorningAffirmations from './screens/bonding/MorningAffirmations';
import GuidedMeditation from './screens/bonding/GuidedMeditation';


class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  declare props: Readonly<{ children: ReactNode }>;

  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Aether Health render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-bg-soft to-cream">
          <div className="glass-card max-w-sm w-full text-center space-y-4">
            <h1 className="text-2xl font-light tracking-tight text-primary-dark">Aether Health</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Something interrupted this screen. Refresh to continue.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full bg-primary-dark text-white shadow-lg shadow-primary-dark/20"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const showNav = !['/', '/splash', '/login'].includes(location.pathname);
  const { profile } = useApp();
  const isFemale = profile?.gender?.toLowerCase() === 'female';
  const isPregnant = isFemale && profile?.isPregnant;

  if (!showNav) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-bg-soft overflow-hidden justify-center relative w-full">
      <main className="flex-1 w-full relative overflow-hidden flex flex-col bg-white/30 backdrop-blur-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 overflow-y-auto no-scrollbar h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      {isPregnant ? <PregnancyDock /> : <BottomNav />}
      <AICompanion />
    </div>
  );
}

export default function App() {
  const { 
    dashboard, 
    isLoading, 
    error,
    fetchDashboard, 
    fetchReports, 
    fetchMedicines, 
    fetchNotifications, 
    uploadReport, 
    addMedicine, 
    updateMedicineStatus, 
    markNotificationRead, 
    addNotification, 
    logWorkout, 
    logSleep, 
    logVitals,
    medicines: storeMeds
  } = useHealthStore();

  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    try {
      const storedProfile = window.localStorage.getItem('aether-profile');
      if (storedProfile) return JSON.parse(storedProfile) as UserProfile;
    } catch (error) {
      console.error('Failed to restore Aether profile:', error);
    }
    return { ...DEFAULT_GUEST_PROFILE };
  });

  const setProfile = useCallback((nextProfile: UserProfile | null) => {
    setProfileState(nextProfile);
    try {
      if (nextProfile) {
        window.localStorage.setItem('aether-profile', JSON.stringify(nextProfile));
      } else {
        window.localStorage.removeItem('aether-profile');
      }
    } catch (error) {
      console.error('Failed to save Aether profile:', error);
    }
  }, []);

  // ─── Fetch data when profile is set ───
  useEffect(() => {
    if (profile) {
      fetchDashboard(profile.gender, profile.isPregnant).catch(() => {});
      fetchMedicines().catch(() => {});
      fetchNotifications().catch(() => {});
    }
  }, [profile, fetchDashboard, fetchMedicines, fetchNotifications]);

  // ─── Listen for realtime notifications ───
  useEffect(() => {
    const unsub = onNotification((notification: any) => {
      addNotification(notification);
    });
    return unsub;
  }, [addNotification]);

  // ─── Build meds from store or fallback ───
  const [meds, setMeds] = useState<Medication[]>([
    { id: '1', name: 'Aspirin', dosage: '81mg', time: '10:00 AM', frequency: 'Daily', status: 'Pending', refillCount: 5 },
    { id: '2', name: 'Vitamin D3', dosage: '2000IU', time: '08:00 AM', frequency: 'Daily', status: 'Taken', refillCount: 12 },
    { id: '3', name: 'Omega-3', dosage: '1000mg', time: '12:00 PM', frequency: 'Daily', status: 'Pending', refillCount: 8 },
  ]);

  // Sync store medicines into local state when available
  useEffect(() => {
    if (storeMeds.length > 0) {
      setMeds(storeMeds.map((m: any) => ({
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        time: m.time,
        frequency: m.frequency,
        status: m.status,
        refillCount: m.refillCount || 0,
      })));
    }
  }, [storeMeds]);

  const [records] = useState<HealthRecord[]>([
    { 
      id: '1', type: 'LabReport', date: '2026-05-10', title: 'Comprehensive Blood Panel', description: 'Full quarterly metabolic & hormonal biochemistry profile.', 
      aiInsight: 'All primary biomarkers optimized. Remarkable improvements in lipid ratios.',
      aiAnalysis: {
        summary: 'Blood panel analysis reveals perfect lipid profile adaptation and stable endocrine levels.',
        abnormalities: [],
        recommendations: ['Maintain current supplement dosage.', 'Excellent glycemic control stable.'],
        deficiencies: [],
        riskLevel: 'low',
        keyMetrics: [
          { name: 'LDL-C', value: '82 mg/dL', status: 'normal' },
          { name: 'HbA1c', value: '5.1 %', status: 'normal' }
        ],
        followUpActions: []
      }
    },
    { 
      id: 'x1', type: 'Scan', date: '2026-05-05', title: 'Chest X-Ray (Frontal)', description: 'Routine occupational safety pulmonary scanning.', 
      aiInsight: 'Lungs are clear. No active disease or osseous abnormalities identified.',
      aiAnalysis: {
        summary: 'Radiological interpretation detects normal cardiomediastinal silhouette and clear lung fields.',
        abnormalities: [],
        recommendations: ['No follow-up imaging needed.'],
        deficiencies: [],
        riskLevel: 'low',
        keyMetrics: [
          { name: 'Lung Integrity', value: '100%', status: 'normal' }
        ],
        followUpActions: []
      }
    },
    { 
      id: '2', type: 'Prescription', date: '2026-04-28', title: 'Vitamin D3 & Omega Complex', description: 'Prescribed preventative micronutrient synthesis plan.', 
      aiInsight: 'Assigned by Dr. Sarah Aris. Refills: 5 remaining.',
      aiAnalysis: {
        summary: 'Prescription initialized to sustain optimal cellular function and cardiovascular recovery.',
        abnormalities: [],
        recommendations: ['Take once daily with heaviest meal for absorption.'],
        deficiencies: [],
        riskLevel: 'low',
        keyMetrics: [
          { name: 'Dosage', value: '5000 IU', status: 'normal' }
        ],
        followUpActions: []
      }
    },
    { 
      id: '3', type: 'Report', date: '2026-04-20', title: 'Cardiology Evaluation', description: 'Advanced echocardiogram for athletic performance load assessment.', 
      aiInsight: 'Left Ventricular thickness adaptation consistent with high fitness level.',
      aiAnalysis: {
        summary: 'Echo reveals athletic adaptive hypertrophy without structural pathology.',
        abnormalities: [],
        recommendations: ['Safe to sustain Zone 5 threshold output.'],
        deficiencies: [],
        riskLevel: 'low',
        keyMetrics: [
          { name: 'Ejection Fraction', value: '68%', status: 'normal' }
        ],
        followUpActions: []
      }
    },
    { id: '4', type: 'Scan', date: '2026-03-15', title: 'Lower Lumbar MRI', description: 'Minor sports impact analysis.', aiInsight: 'No disc bulge detected. Minor inflammation resolved.' },
  ]);

  const [appointments] = useState<Appointment[]>([
    { id: '1', doctor: 'Dr. Sarah Aris', specialty: 'Cardiology', date: '2026-05-15', time: '10:30 AM', location: 'Aether Medical Center', status: 'Upcoming' },
    { id: '2', doctor: 'Dr. James Chen', specialty: 'General Practice', date: '2026-05-22', time: '02:00 PM', location: 'Central Clinic', status: 'Upcoming' },
  ]);

  const [vitals] = useState<Vital[]>([
    { id: '1', type: 'Heart Rate', value: '72', unit: 'bpm', timestamp: '2026-05-07T08:30:00', trend: 'stable' },
    { id: '2', type: 'Blood Pressure', value: '120/78', unit: 'mmHg', timestamp: '2026-05-07T08:30:00', trend: 'stable' },
    { id: '3', type: 'SpO2', value: '98', unit: '%', timestamp: '2026-05-07T08:30:00', trend: 'up' },
    { id: '4', type: 'Glucose', value: '95', unit: 'mg/dL', timestamp: '2026-05-07T06:00:00', trend: 'stable' },
  ]);

  // Build stats from dashboard data or fallback
  const stats: HealthStats = dashboard ? {
    recoveryScore: dashboard.health?.recoveryScore || 88,
    steps: dashboard.health?.steps || 5432,
    sleepHours: dashboard.health?.sleepHours || 7.5,
    hydrationMl: dashboard.health?.hydrationMl || 1800,
    adherenceRate: dashboard.health?.adherenceRate || 98.5,
    cycleDay: dashboard.health?.cycleDay || 2,
    daysUntilPeriod: dashboard.health?.daysUntilPeriod || 26,
    predictedPeriodDate: dashboard.health?.predictedPeriodDate || 'June 5',
    cyclePhase: dashboard.health?.cyclePhase || 'Menstrual',
    symptomsLogged: dashboard.health?.symptomsLogged || ['Cramps', 'Fatigue'],
  } : {
    recoveryScore: 88,
    steps: 5432,
    sleepHours: 7.5,
    hydrationMl: 1800,
    adherenceRate: 98.5,
    cycleDay: 2,
    daysUntilPeriod: 26,
    predictedPeriodDate: 'June 5',
    cyclePhase: 'Menstrual',
    symptomsLogged: ['Cramps', 'Fatigue']
  };

  const isFemale = profile?.gender?.toLowerCase() === 'female';
  const isPregnant = isFemale && profile?.isPregnant;

  return (
    <AppErrorBoundary>
      <AppContext.Provider value={{ 
        profile, setProfile, meds, setMeds, records, stats, appointments, vitals,
        dashboard, isLoading, error,
        fetchDashboard, fetchReports, fetchMedicines, fetchNotifications,
        uploadReport, addMedicine, updateMedicineStatus, markNotificationRead,
        addNotification, logWorkout, logSleep, logVitals
      }}>
        <BrowserRouter>
          <div className={cn("min-h-screen", isPregnant ? "theme-pregnancy" : isFemale ? "theme-female" : "theme-aura")}>
            <Layout>
              <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/login" element={<LoginFlow />} />
                <Route path="/home" element={<Home />} />
                <Route path="/health" element={<Health />} />
                <Route path="/predict" element={<DiseasePredictionTab />} />
                <Route path="/outbreak-intelligence" element={<OutbreakIntelligence />} />
                <Route path="/medical-imaging" element={<MedicalImagingAI />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/insights" element={<Navigate to="/predict" replace />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/workouts" element={<WorkoutHub />} />
                <Route path="/nutrition" element={<NutritionHub />} />
                <Route path="/mental-wellness" element={<MentalWellness />} />
                <Route path="/vault" element={<HealthVault />} />
                <Route path="/vault/insurance" element={<InsuranceVault />} />
                <Route path="/connect-devices" element={<ConnectDevices />} />
                
                {/* Bonding Routes */}
                <Route path="/bonding/talking" element={<TalkingWithBaby />} />
                <Route path="/bonding/music" element={<RelaxationMusic />} />
                <Route path="/bonding/affirmations" element={<MorningAffirmations />} />
                <Route path="/bonding/meditation" element={<GuidedMeditation />} />
              </Routes>
            </Layout>
          </div>
        </BrowserRouter>
      </AppContext.Provider>
    </AppErrorBoundary>
  );
}
