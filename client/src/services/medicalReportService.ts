function apiBase(): string {
  if (import.meta.env.DEV) return '';
  const u = import.meta.env.VITE_API_URL;
  if (u && String(u).trim()) return String(u).replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

const API_BASE = apiBase();

export type MedicalRiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface MedicalReportAnalysisResult {
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

export async function analyzeMedicalReportRemote(
  file: File | null,
  extractedText: string | undefined,
  signal?: AbortSignal
): Promise<MedicalReportAnalysisResult> {
  const fd = new FormData();
  if (file) fd.append('file', file);
  const trimmed = extractedText?.trim();
  if (trimmed) fd.append('extractedText', trimmed);

  if (!file && !trimmed) {
    throw new Error('Add a file or paste report text.');
  }

  const url = API_BASE ? `${API_BASE}/api/ai/medical-report` : '/api/ai/medical-report';
  const res = await fetch(url, {
    method: 'POST',
    body: fd,
    signal,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as MedicalReportAnalysisResult;
}

export function buildMedicalReportDownloadText(r: MedicalReportAnalysisResult, fileLabel: string): string {
  const lines = [
    'AETHER — AI MEDICAL REPORT ANALYZER SUMMARY',
    `Source: ${fileLabel}`,
    `Report Type: ${r.reportType}`,
    `AI Confidence: ${r.aiConfidenceScore}%`,
    '',
    '--- Executive Summary ---',
    r.executiveSummary,
    '',
    `--- Severity Level ---\n${r.severityLevel}`,
    '',
    '--- Key Findings ---',
    ...(r.keyFindings?.length ? r.keyFindings.map((x) => `• ${x}`) : ['• None listed']),
    '',
    '--- Abnormal Indicators ---',
    ...(r.abnormalIndicators?.length ? r.abnormalIndicators.map((x) => `• ${x}`) : ['• None flagged']),
    '',
    '--- AI Risk Assessment ---',
    r.aiRiskAssessment,
    '',
    '--- Lifestyle Recommendations ---',
    ...(r.lifestyleRecommendations?.length ? r.lifestyleRecommendations.map((x) => `• ${x}`) : ['• Maintain healthy lifestyle.']),
    '',
    '--- Suggested Follow-Up ---',
    ...(r.suggestedFollowUp?.length ? r.suggestedFollowUp.map((x) => `• ${x}`) : ['• Consult your clinician.']),
    '',
    'AI assistance only. Not a substitute for professional medical advice.',
  ];
  return lines.filter(Boolean).join('\n');
}
