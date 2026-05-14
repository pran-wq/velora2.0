export interface BiomarkerRange {
  name: string;
  regex: RegExp;
  unit: string;
  min: number;
  max: number;
}

export const BIOMARKER_RANGES: BiomarkerRange[] = [
  { name: 'Hemoglobin', regex: /Hemoglobin\s*:?\s*(\d+\.?\d*)/i, unit: 'g/dL', min: 12.0, max: 17.5 },
  { name: 'RBC', regex: /RBC\s*:?\s*(\d+\.?\d*)/i, unit: 'M/uL', min: 4.0, max: 6.0 },
  { name: 'WBC', regex: /WBC\s*:?\s*(\d+\.?\d*)/i, unit: '/uL', min: 4000, max: 11000 },
  { name: 'Platelets', regex: /Platelets\s*:?\s*(\d+\.?\d*)/i, unit: '/uL', min: 150000, max: 450000 },
  { name: 'Ferritin', regex: /Ferritin\s*:?\s*(\d+\.?\d*)/i, unit: 'ng/mL', min: 20, max: 250 },
  { name: 'Serum Iron', regex: /Serum\s*Iron\s*:?\s*(\d+\.?\d*)/i, unit: 'ug/dL', min: 60, max: 170 },
  { name: 'TIBC', regex: /TIBC\s*:?\s*(\d+\.?\d*)/i, unit: 'ug/dL', min: 240, max: 450 },
  { name: 'Creatinine', regex: /Creatinine\s*:?\s*(\d+\.?\d*)/i, unit: 'mg/dL', min: 0.5, max: 1.2 },
  { name: 'TSH', regex: /TSH\s*:?\s*(\d+\.?\d*)/i, unit: 'uIU/mL', min: 0.4, max: 4.0 },
  { name: 'ALT', regex: /ALT\s*:?\s*(\d+\.?\d*)/i, unit: 'U/L', min: 7, max: 56 },
  { name: 'AST', regex: /AST\s*:?\s*(\d+\.?\d*)/i, unit: 'U/L', min: 8, max: 48 },
  { name: 'Glucose', regex: /Glucose\s*:?\s*(\d+\.?\d*)/i, unit: 'mg/dL', min: 70, max: 140 },
  { name: 'HbA1c', regex: /HbA1c\s*:?\s*(\d+\.?\d*)/i, unit: '%', min: 4.0, max: 5.7 },
  { name: 'MCV', regex: /MCV\s*:?\s*(\d+\.?\d*)/i, unit: 'fL', min: 80, max: 100 },
  { name: 'Hematocrit', regex: /Hematocrit\s*:?\s*(\d+\.?\d*)/i, unit: '%', min: 36, max: 50 },
];
