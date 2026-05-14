/**
 * Demo / mock data support for hackathon presentations.
 * Enabled by setting DEMO_MODE=true in backend/.env.
 *
 * Frontend can fetch GET /api/demo to render rich empty states
 * without touching real user data.
 */

export const DEMO_MODE = (process.env.DEMO_MODE || "false").toLowerCase() === "true";

const today = () => new Date();
const daysAgo = (n) => new Date(today().getTime() - n * 86_400_000).toISOString();

// Sample, frontend-friendly data shapes.
export const DEMO_SAMPLES = {
  user: {
    id: "demo-user",
    name: "Demo User",
    email: "demo@medora.test",
    age: 29,
    gender: "female",
    bloodGroup: "O+",
    preferences: { theme: "light", notifications: true },
  },

  medications: [
    {
      id: "demo-med-1",
      medicineName: "Aspirin",
      dosage: "500mg",
      frequency: "twice_daily",
      reminderTime: "08:00",
      status: "taken",
      adherenceCount: 6,
    },
    {
      id: "demo-med-2",
      medicineName: "Vitamin D",
      dosage: "1000 IU",
      frequency: "once_daily",
      reminderTime: "09:00",
      status: "pending",
      adherenceCount: 2,
    },
    {
      id: "demo-med-3",
      medicineName: "Iron",
      dosage: "65mg",
      frequency: "once_daily",
      reminderTime: "20:00",
      status: "missed",
      adherenceCount: 1,
    },
  ],

  recoveryTrend: [
    { date: daysAgo(6), wellnessScore: 78, sleepHours: 7, hydrationLevel: 8, steps: 7200 },
    { date: daysAgo(5), wellnessScore: 65, sleepHours: 6, hydrationLevel: 6, steps: 5100 },
    { date: daysAgo(4), wellnessScore: 82, sleepHours: 8, hydrationLevel: 9, steps: 9200 },
    { date: daysAgo(3), wellnessScore: 71, sleepHours: 7, hydrationLevel: 7, steps: 6800 },
    { date: daysAgo(2), wellnessScore: 88, sleepHours: 8, hydrationLevel: 10, steps: 10100 },
    { date: daysAgo(1), wellnessScore: 74, sleepHours: 7, hydrationLevel: 8, steps: 7400 },
    { date: daysAgo(0), wellnessScore: 90, sleepHours: 8, hydrationLevel: 10, steps: 10500 },
  ],

  dashboard: {
    totalMedications: 3,
    medicationsTaken: 1,
    adherencePercentage: 33,
    averageWellnessScore: 78,
    latestMood: "great",
    latestRecoveryScore: 90,
  },

  moodCounts: { great: 2, good: 3, tired: 1, stressed: 0, low: 1 },

  aiSamples: {
    wellnessSummary: {
      insight:
        "Your sleep and hydration are on track. Mood is positive. " +
        "Keep current routine. Consider a 15-min walk this afternoon.",
      disclaimer:
        "This information is AI-generated and not a replacement for professional medical advice.",
    },
    motivation: {
      message:
        "Steady progress beats perfection. Your recovery score is trending up — keep going.",
      disclaimer:
        "This information is AI-generated and not a replacement for professional medical advice.",
    },
  },
};

export default DEMO_SAMPLES;
