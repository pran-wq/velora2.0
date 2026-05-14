import { HistoricalTrend, ExtractedBiomarker } from '../types/medical';

export function executeCompareEngine(
  previousBiomarkers: ExtractedBiomarker[],
  currentBiomarkers: ExtractedBiomarker[]
): {
  trends: HistoricalTrend[];
  riskEscalation: string;
} {
  const trends: HistoricalTrend[] = [];
  const prevDict: Record<string, number> = {};

  for (const pb of previousBiomarkers) {
    prevDict[pb.name] = pb.value;
  }

  let worseningCount = 0;
  let improvementCount = 0;

  for (const cb of currentBiomarkers) {
    if (prevDict[cb.name] !== undefined) {
      const prevVal = prevDict[cb.name];
      const currVal = cb.value;

      let trend: 'increasing' | 'declining' | 'stable' = 'stable';
      let status: 'improved' | 'worsened' | 'neutral' = 'neutral';

      if (currVal > prevVal) {
        trend = 'increasing';
      } else if (currVal < prevVal) {
        trend = 'declining';
      }

      // Determine progression status depending on the normal range intent
      // E.g. Hemoglobin declining is bad, TSH rising is bad
      if (cb.name === 'Hemoglobin' || cb.name === 'Ferritin' || cb.name === 'Serum Iron') {
        if (trend === 'declining') { status = 'worsened'; worseningCount++; }
        else if (trend === 'increasing') { status = 'improved'; improvementCount++; }
      } else if (cb.name === 'Glucose' || cb.name === 'HbA1c' || cb.name === 'Creatinine' || cb.name === 'TSH' || cb.name === 'TIBC') {
        if (trend === 'increasing') { status = 'worsened'; worseningCount++; }
        else if (trend === 'declining') { status = 'improved'; improvementCount++; }
      }

      trends.push({
        biomarker: cb.name,
        previous: prevVal,
        current: currVal,
        trend,
        status
      });
    }
  }

  let riskEscalation = 'Biochemical indicators remained highly stable between chronological sessions.';
  if (worseningCount > improvementCount && worseningCount >= 2) {
    riskEscalation = 'Multiple critical biomarker metrics reflect systemic baseline deterioration.';
  } else if (improvementCount > worseningCount) {
    riskEscalation = 'Positive biochemical trend markers observed. Therapy adaptations showing continuous improvement.';
  }

  return { trends, riskEscalation };
}
