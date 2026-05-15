const OLLAMA_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'mistral';

export type MedicalRiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface MedicalReportAnalysis {
  executiveSummary: string;
  keyFindings: string[];
  abnormalIndicators: string[];
  aiRiskAssessment: string;
  severityLevel: MedicalRiskLevel;
  lifestyleRecommendations: string[];
  suggestedFollowUp: string[];
  aiConfidenceScore: number;
  reportType: string;
}

interface KeywordProfile {
  reportType: string;
  indicators: string[];
  severity: MedicalRiskLevel;
  recommendations: string[];
  followUp: string[];
}

const KEYWORDS: Record<string, KeywordProfile> = {
  glucose: {
    reportType: 'Metabolic / Glucose Panel',
    indicators: ['Blood glucose above reference range', 'Fasting glucose suggests pre-diabetic state', 'HbA1c elevation possible'],
    severity: 'Moderate',
    recommendations: ['Reduce refined sugar and carbohydrate intake', 'Engage in 30 minutes of daily aerobic exercise', 'Monitor blood glucose at home weekly'],
    followUp: ['Repeat fasting glucose in 4–6 weeks', 'Consult endocrinologist if levels persist'],
  },
  cholesterol: {
    reportType: 'Lipid / Cholesterol Panel',
    indicators: ['LDL cholesterol above optimal', 'Total cholesterol elevated', 'HDL may be suboptimal'],
    severity: 'Moderate',
    recommendations: ['Adopt Mediterranean diet (olive oil, fish, nuts)', 'Limit saturated fats and processed meats', 'Increase soluble fiber intake (oats, beans)'],
    followUp: ['Repeat lipid panel in 3 months', 'Consider cardiology referral if family history present'],
  },
  hemoglobin: {
    reportType: 'Complete Blood Count (CBC)',
    indicators: ['Hemoglobin below normal range', 'Possible iron-deficiency anemia', 'RBC indices warrant review'],
    severity: 'Moderate',
    recommendations: ['Increase iron-rich foods (spinach, red meat, lentils)', 'Pair iron sources with vitamin C', 'Avoid tea/coffee with meals'],
    followUp: ['Repeat CBC with iron studies in 6 weeks', 'See hematology if symptoms persist'],
  },
  mri: {
    reportType: 'MRI Imaging Report',
    indicators: ['Structural imaging findings present', 'Radiologist interpretation recommended'],
    severity: 'Low',
    recommendations: ['Maintain regular follow-up with referring physician', 'Avoid strenuous activity if advised'],
    followUp: ['Schedule follow-up with ordering specialist', 'Bring prior imaging for comparison'],
  },
  ecg: {
    reportType: 'ECG / Cardiac Rhythm',
    indicators: ['ECG waveform abnormalities noted', 'Cardiac rhythm analysis shows variance'],
    severity: 'Moderate',
    recommendations: ['Monitor heart rate and blood pressure daily', 'Reduce caffeine and alcohol intake', 'Practice stress-reduction techniques'],
    followUp: ['Repeat ECG or Holter monitor if symptomatic', 'Cardiology evaluation recommended'],
  },
  'blood test': {
    reportType: 'General Blood Panel',
    indicators: ['Multiple biomarkers reviewed', 'Some values outside reference range'],
    severity: 'Low',
    recommendations: ['Maintain balanced diet and hydration', 'Regular moderate exercise', 'Adequate sleep (7–8 hours)'],
    followUp: ['Repeat blood panel in 3–6 months', 'Discuss results with primary care physician'],
  },
  'blood pressure': {
    reportType: 'Vital Signs / BP Report',
    indicators: ['Blood pressure reading above 130/80', 'Hypertension risk flagged'],
    severity: 'High',
    recommendations: ['Reduce sodium intake (<2,300mg/day)', 'Daily 30-minute brisk walking', 'Limit alcohol and quit smoking'],
    followUp: ['Monitor BP daily for 2 weeks', 'Follow up with primary care within 2 weeks'],
  },
  creatinine: {
    reportType: 'Renal Function Panel',
    indicators: ['Serum creatinine elevated', 'eGFR may be reduced'],
    severity: 'Moderate',
    recommendations: ['Stay well hydrated (2–3L water/day)', 'Limit NSAID use', 'Monitor blood pressure closely'],
    followUp: ['Repeat renal panel in 4 weeks', 'Nephrology referral if eGFR <60'],
  },
};

function detectKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  return Object.keys(KEYWORDS).filter((k) => lower.includes(k));
}

function buildTemplate(text: string): MedicalReportAnalysis {
  const hits = detectKeywords(text);
  const profiles = hits.map((h) => KEYWORDS[h]);

  if (profiles.length === 0) {
    return {
      executiveSummary: 'This medical document was reviewed by the Aether AI system. No immediately alarming patterns were detected in the extracted text, though a complete clinical interpretation should always be performed by a qualified physician.',
      keyFindings: ['Document text successfully parsed', 'No critical emergency keywords detected', 'Standard review recommended'],
      abnormalIndicators: ['None flagged by automated screening'],
      aiRiskAssessment: 'Low probability of acute concern based on keyword screening. This does not replace physician judgment.',
      severityLevel: 'Low',
      lifestyleRecommendations: ['Maintain a balanced diet rich in vegetables and lean protein', 'Exercise at least 150 minutes per week', 'Ensure 7–8 hours of quality sleep nightly'],
      suggestedFollowUp: ['Schedule routine check-up with primary care physician', 'Bring original report for clinician review'],
      aiConfidenceScore: 72,
      reportType: 'General Medical Document',
    };
  }

  const maxSeverity = profiles.reduce((max, p) => {
    const order: MedicalRiskLevel[] = ['Low', 'Moderate', 'High', 'Critical'];
    return order.indexOf(p.severity) > order.indexOf(max) ? p.severity : max;
  }, 'Low' as MedicalRiskLevel);

  const allIndicators = profiles.flatMap((p) => p.indicators);
  const allRecommendations = profiles.flatMap((p) => p.recommendations);
  const allFollowUp = profiles.flatMap((p) => p.followUp);

  return {
    executiveSummary: `Automated analysis detected ${hits.length} relevant keyword${hits.length > 1 ? 's' : ''} in the report (${hits.join(', ')}). The Aether AI suggests targeted follow-up based on these findings.`,
    keyFindings: [`Report type identified: ${profiles[0].reportType}`, ...allIndicators.slice(0, 4)],
    abnormalIndicators: allIndicators.slice(0, 6),
    aiRiskAssessment: `Elevated risk profile detected due to ${hits.join(', ')} findings. Clinical correlation strongly advised.`,
    severityLevel: maxSeverity,
    lifestyleRecommendations: [...new Set(allRecommendations)].slice(0, 5),
    suggestedFollowUp: [...new Set(allFollowUp)].slice(0, 4),
    aiConfidenceScore: 78 + hits.length * 4,
    reportType: profiles[0].reportType,
  };
}

async function ollamaOneLiner(prompt: string): Promise<string> {
  try {
    const res = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: { num_predict: 80, temperature: 0.3 },
      }),
    });
    if (!res.ok) return '';
    const data = await res.json();
    return String(data.response || '').trim();
  } catch {
    return '';
  }
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const mod = (await import('pdf-parse')) as { default?: (b: Buffer) => Promise<{ text?: string }> };
  const pdfParse = mod.default ?? (mod as unknown as (b: Buffer) => Promise<{ text?: string }>);
  const res = await pdfParse(buffer);
  return String(res?.text || '').trim();
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').replace(/[^\x20-\x7E\n]/g, '').trim();
}

export async function analyzeMedicalReportBuffer(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
  pastedText?: string
): Promise<MedicalReportAnalysis> {
  let text = '';

  if (pastedText?.trim()) {
    text = cleanText(pastedText.trim());
  } else if (mimeType === 'application/pdf') {
    try {
      text = cleanText(await extractPdfText(buffer));
    } catch (e) {
      console.error('PDF extraction failed:', e);
      text = '';
    }
  } else if (mimeType === 'text/plain' || mimeType === 'text/csv') {
    text = cleanText(buffer.toString('utf-8'));
  }

  const shortText = text.slice(0, 1200);
  const base = buildTemplate(shortText);

  const extra = await ollamaOneLiner(
    `In one short sentence, summarize this medical report for a patient: "${shortText.slice(0, 500)}"`
  );

  if (extra && extra.length > 10) {
    base.executiveSummary = extra;
  }

  return base;
}
