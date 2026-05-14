import { createContext, useContext } from 'react';
import { UserProfile, Medication, HealthRecord, HealthStats, Appointment, Vital } from '../types';

export interface AppContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  meds: Medication[];
  setMeds: (meds: Medication[]) => void;
  records: HealthRecord[];
  stats: HealthStats;
  appointments: Appointment[];
  vitals: Vital[];
  dashboard: any | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboard: (gender: string, isPregnant: boolean) => Promise<void>;
  fetchReports: () => Promise<void>;
  fetchMedicines: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  uploadReport: (file: File, title?: string, type?: string) => Promise<any>;
  addMedicine: (data: any) => Promise<any>;
  updateMedicineStatus: (id: string, status: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  addNotification: (notification: any) => void;
  logWorkout: (data: any) => Promise<any>;
  logSleep: (data: any) => Promise<any>;
  logVitals: (data: any) => Promise<any>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
