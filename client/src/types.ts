export type Gender = 'Male' | 'Female' | 'Other';

export interface UserProfile {
  name: string;
  gender: Gender;
  age: number;
  weight: number;
  bloodGroup: string;
  isPregnant: boolean;
  pregnancyMonth?: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  status: 'Taken' | 'Missed' | 'Pending';
  refillCount: number;
}

export interface HealthRecord {
  id: string;
  type: 'Prescription' | 'Report' | 'Visit' | 'Symptom' | 'Wellness';
  date: string;
  title: string;
  description: string;
  fileUrl?: string;
  aiInsight?: string;
  aiAnalysis?: {
    summary: string;
    abnormalities: string[];
    recommendations: string[];
    deficiencies: string[];
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    keyMetrics: Array<{ name: string; value: string; status: 'normal' | 'abnormal' | 'borderline' }>;
    followUpActions: string[];
  };
}

export interface HealthStats {
  recoveryScore: number;
  steps: number;
  sleepHours: number;
  hydrationMl: number;
  adherenceRate: number;
  cycleDay?: number;
  daysUntilPeriod?: number;
  predictedPeriodDate?: string;
  cyclePhase?: 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';
  symptomsLogged?: string[];
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface Vital {
  id: string;
  type: 'Heart Rate' | 'Blood Pressure' | 'SpO2' | 'Glucose' | 'Temperature';
  value: string;
  unit: string;
  timestamp: string;
  trend: 'up' | 'down' | 'stable';
}

export interface WearableDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  lastSync: string;
  battery: number;
}

export interface InsightMetric {
  id: string;
  category: 'Sleep' | 'Stress' | 'Recovery' | 'Nutrition' | 'Activity';
  label: string;
  value: number;
  unit: string;
  trend: 'improving' | 'declining' | 'stable';
  aiNote?: string;
}

export interface PredictionCard {
  id: string;
  title: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  category: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  avatarSeed: string;
  healthStatus: 'Good' | 'Needs Attention' | 'Critical';
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}
