export interface ExtractedBiomarker {
  name: string;
  value: number;
  unit: string;
  status: 'Normal' | 'Borderline' | 'Abnormal';
  min?: number;
  max?: number;
}

export interface DiseaseRuleResult {
  disease: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  matchedRules: string[];
}

export interface AISummaryPayload {
  detectedAbnormalities: string[];
  simplifiedExplanation: string;
  possibleDisease: string;
  severity: string;
  recommendations: string[];
  disclaimer: string;
}

export interface AnalysisPayload {
  patientName: string;
  age: number;
  gender: string;
  biomarkers: ExtractedBiomarker[];
  diseases: string;
  severity: string;
  confidence: number;
  summary: AISummaryPayload;
  reportText: string;
}

export interface HistoricalTrend {
  biomarker: string;
  previous: number;
  current: number;
  trend: 'increasing' | 'declining' | 'stable';
  status: 'improved' | 'worsened' | 'neutral';
}
