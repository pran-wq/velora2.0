export interface RuleEvaluation {
  disease: string;
  condition: (biomarkers: Record<string, number>) => boolean;
  baseConfidence: number;
}

export const DISEASE_RULES: RuleEvaluation[] = [
  {
    disease: 'Iron Deficiency Anemia',
    condition: (b) => (b['Hemoglobin'] !== undefined && b['Hemoglobin'] < 12) && 
                      (b['Ferritin'] !== undefined && b['Ferritin'] < 20),
    baseConfidence: 92
  },
  {
    disease: 'Possible Type 2 Diabetes',
    condition: (b) => (b['Glucose'] !== undefined && b['Glucose'] > 200) || 
                      (b['HbA1c'] !== undefined && b['HbA1c'] > 6.5),
    baseConfidence: 88
  },
  {
    disease: 'Possible Hypothyroidism',
    condition: (b) => (b['TSH'] !== undefined && b['TSH'] > 4.5),
    baseConfidence: 85
  },
  {
    disease: 'Possible Kidney Dysfunction',
    condition: (b) => (b['Creatinine'] !== undefined && b['Creatinine'] > 1.3),
    baseConfidence: 89
  },
  {
    disease: 'Possible Liver Disorder',
    condition: (b) => (b['ALT'] !== undefined && b['ALT'] > 45) && 
                      (b['AST'] !== undefined && b['AST'] > 40),
    baseConfidence: 86
  }
];
