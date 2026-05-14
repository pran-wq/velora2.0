import { BIOMARKER_RANGES } from '../data/biomarker-ranges';
import { ExtractedBiomarker } from '../types/medical';

export function parseBiomarkers(text: string): ExtractedBiomarker[] {
  const results: ExtractedBiomarker[] = [];

  for (const range of BIOMARKER_RANGES) {
    const match = text.match(range.regex);
    if (match && match[1]) {
      const val = parseFloat(match[1]);
      let status: 'Normal' | 'Borderline' | 'Abnormal' = 'Normal';

      // Evaluate logic
      if (val < range.min || val > range.max) {
        status = 'Abnormal';
      } else if (val - range.min < (range.max - range.min) * 0.1 || range.max - val < (range.max - range.min) * 0.1) {
        status = 'Borderline';
      }

      results.push({
        name: range.name,
        value: val,
        unit: range.unit,
        status,
        min: range.min,
        max: range.max
      });
    }
  }

  return results;
}

export function extractPatientMetadata(text: string): { patientName: string; age: number; gender: string } {
  const nameMatch = text.match(/Name\s*:?\s*([A-Za-z\s]+)/i);
  const ageMatch = text.match(/Age\s*:?\s*(\d+)/i);
  const genderMatch = text.match(/Gender\s*:?\s*(Male|Female|Other)/i);

  return {
    patientName: nameMatch && nameMatch[1] ? nameMatch[1].trim() : 'Anonymous Demo Patient',
    age: ageMatch && ageMatch[1] ? parseInt(ageMatch[1], 10) : 32,
    gender: genderMatch && genderMatch[1] ? genderMatch[1].trim() : 'Male'
  };
}
