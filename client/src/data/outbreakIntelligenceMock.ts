/** Placeholder datasets for hackathon demo — not live epidemiology. */

export const globalOutbreakRisk = {
  score: 67,
  label: 'Elevated watch',
  deltaWeek: +4.2,
  narrative:
    'Synthetic fusion index from syndromic triage, wearable drift, labs, imaging cues, and environmental stressors.',
};

export const cityHeatmap = [
  { city: 'North Metro', risk: 42, casesPer100k: 18 },
  { city: 'South Zone', risk: 78, casesPer100k: 41 },
  { city: 'East Corridor', risk: 55, casesPer100k: 26 },
  { city: 'West Lake', risk: 33, casesPer100k: 12 },
  { city: 'Central CBD', risk: 61, casesPer100k: 31 },
  { city: 'Harbor District', risk: 49, casesPer100k: 22 },
];

export const outbreakForecastCards = [
  {
    id: '1',
    title: 'Dengue pressure window',
    window: 'Next 14 days',
    confidence: 0.82,
    detail: 'Vector density proxies + humidity uptick suggest localized transmission risk in South Zone.',
  },
  {
    id: '2',
    title: 'Respiratory syndromic lift',
    window: '7–10 days',
    confidence: 0.76,
    detail: 'Clinic triage keywords and SpO₂ dips in connected cohorts align with seasonal flu baselines +12%.',
  },
  {
    id: '3',
    title: 'Pediatric GI cluster',
    window: 'Monitoring',
    confidence: 0.71,
    detail: 'School absenteeism tick + pharmacy antidiarrheal fills — early sentinel, not confirmed outbreak.',
  },
];

export const symptomSpikeTrend = [
  { week: 'W1', fever: 12, cough: 18, fatigue: 9 },
  { week: 'W2', fever: 15, cough: 22, fatigue: 11 },
  { week: 'W3', fever: 21, cough: 28, fatigue: 16 },
  { week: 'W4', fever: 27, cough: 35, fatigue: 19 },
  { week: 'W5', fever: 31, cough: 41, fatigue: 24 },
  { week: 'W6', fever: 36, cough: 48, fatigue: 29 },
];

export const infectionTrend = [
  { day: 'Mon', index: 42 },
  { day: 'Tue', index: 45 },
  { day: 'Wed', index: 51 },
  { day: 'Thu', index: 58 },
  { day: 'Fri', index: 62 },
  { day: 'Sat', index: 59 },
  { day: 'Sun', index: 64 },
];

export const wearableAnomalySeries = [
  { day: 'Mon', hrRestingDelta: 2, hrvDrop: 4 },
  { day: 'Tue', hrRestingDelta: 5, hrvDrop: 8 },
  { day: 'Wed', hrRestingDelta: 3, hrvDrop: 6 },
  { day: 'Thu', hrRestingDelta: 11, hrvDrop: 14 },
  { day: 'Fri', hrRestingDelta: 9, hrvDrop: 12 },
  { day: 'Sat', hrRestingDelta: 15, hrvDrop: 18 },
  { day: 'Sun', hrRestingDelta: 12, hrvDrop: 15 },
];

export const regionalRiskDistribution = [
  { name: 'South Zone', value: 34, color: '#F97316' },
  { name: 'Central CBD', value: 24, color: '#6366F1' },
  { name: 'East Corridor', value: 18, color: '#3B82F6' },
  { name: 'North Metro', value: 14, color: '#10B981' },
  { name: 'Other', value: 10, color: '#94A3B8' },
];

export const environmentalFactors = [
  { label: 'PM2.5 (µg/m³)', value: '38', status: 'Moderate', hint: 'Respiratory symptom coupling risk' },
  { label: 'Heat index', value: '34 °C', status: 'High', hint: 'Heat + dehydration amplify fatigue signals' },
  { label: 'Relative humidity', value: '72%', status: 'Elevated', hint: 'Vector-borne environmental proxy' },
  { label: 'Pollen index', value: 'Medium', status: 'Stable', hint: 'Allergic cough noise in syndromic mix' },
];

export const earlyWarningAlerts = [
  {
    id: 'a1',
    severity: 'high' as const,
    title: 'Dengue risk elevated',
    body: 'South Zone humidity + historical case curve crossed soft threshold T+0.18.',
    time: '12m ago',
  },
  {
    id: 'a2',
    severity: 'high' as const,
    title: 'Respiratory anomaly cluster detected',
    body: 'Wearable nocturnal SpO₂ dips + cough keyword spike in 6 km radius.',
    time: '28m ago',
  },
  {
    id: 'a3',
    severity: 'medium' as const,
    title: 'Flu probability increasing in South Zone',
    body: 'Nowcast model + school absenteeism blend → +9% vs 7-day trailing baseline.',
    time: '1h ago',
  },
  {
    id: 'a4',
    severity: 'low' as const,
    title: 'Biomarker drift corroboration',
    body: 'Population-level ferritin / CRP cohort drift mild — monitor, no action flag.',
    time: '3h ago',
  },
];

export const wearableAggregate = {
  cohortSize: 128_400,
  anomalyRatePct: 3.8,
  topSignals: ['Resting HR +6–12 bpm vs baseline', 'Sleep fragmentation +18%', 'Nocturnal SpO₂ −1.2% median'],
};
