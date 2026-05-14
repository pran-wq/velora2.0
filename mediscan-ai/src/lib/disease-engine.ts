import { DISEASE_RULES } from '../data/disease-rules';
import { ExtractedBiomarker, DiseaseRuleResult } from '../types/medical';

export function executeDiseaseEngine(biomarkers: ExtractedBiomarker[]): {
  diseasesString: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  matchedRules: string[];
} {
  // Map extracted array to standard dictionary
  const valuesDict: Record<string, number> = {};
  let abnormalCount = 0;

  for (const b of biomarkers) {
    valuesDict[b.name] = b.value;
    if (b.status === 'Abnormal') {
      abnormalCount++;
    }
  }

  // Calculate severity logic exactly matching requirements
  let severity: 'Mild' | 'Moderate' | 'Severe' = 'Mild';
  if (abnormalCount >= 5) {
    severity = 'Severe';
  } else if (abnormalCount >= 2) {
    severity = 'Moderate';
  }

  // Run rules
  const matchedRules: string[] = [];
  let highestBaseConfidence = 75;

  for (const rule of DISEASE_RULES) {
    if (rule.condition(valuesDict)) {
      matchedRules.push(rule.disease);
      if (rule.baseConfidence > highestBaseConfidence) {
        highestBaseConfidence = rule.baseConfidence;
      }
    }
  }

  // If no strict rules matched but there are abnormal parameters, flag systemic strain
  if (matchedRules.length === 0 && abnormalCount > 0) {
    matchedRules.push('Biochemical Parameter Aberrations');
  } else if (matchedRules.length === 0) {
    matchedRules.push('No acute critical conditions detected');
  }

  // Base confidence calculation adjusted by matching parameters
  // Ensure maximum cap at 98%
  const finalConfidence = Math.min(98, highestBaseConfidence + (abnormalCount * 1.5));

  return {
    diseasesString: matchedRules.join(', '),
    confidence: Math.round(finalConfidence * 10) / 10,
    severity,
    matchedRules
  };
}
