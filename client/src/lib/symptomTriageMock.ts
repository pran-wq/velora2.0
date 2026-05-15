/**
 * Demo-only keyword triage for floating assistant. Not clinical logic.
 */

export interface SymptomTriageResult {
  possibleConditions: string[];
  riskLevel: 'Low' | 'Moderate' | 'High';
  preventiveAdvice: string[];
  triageRecommendation: string;
  outbreakContext: string;
}

function tokens(text: string) {
  return text
    .toLowerCase()
    .split(/[\s,;.]+/)
    .map((t) => t.replace(/[^a-z0-9]/g, ''))
    .filter(Boolean);
}

export function triageUserMessage(text: string): SymptomTriageResult | null {
  const t = tokens(text);
  const has = (...words: string[]) => words.some((w) => t.includes(w) || text.toLowerCase().includes(w));

  const respiratory =
    (has('fever') || has('temperature') || has('chills')) &&
    (has('cough') || has('coughing')) &&
    (has('fatigue') || has('tired') || has('weakness'));

  if (respiratory) {
    return {
      possibleConditions: ['Viral upper respiratory infection (e.g., influenza-like illness)', 'COVID-19 (cannot rule out without testing)', 'Early atypical pneumonia — clinical correlation required'],
      riskLevel: 'Moderate',
      preventiveAdvice: [
        'Rest, fluids, and monitor temperature twice daily for 48 hours.',
        'Mask in crowded indoor spaces to reduce onward transmission.',
        'Isolate from high-risk household members when febrile.',
      ],
      triageRecommendation:
        'Seek same-day telehealth or urgent care if breathing becomes labored, SpO₂ falls below your normal, fever exceeds 39.4 °C for 48h, or you develop chest pain.',
      outbreakContext:
        'Regional syndromic sensors show elevated flu-like signals in South Zone — consider testing per local protocol.',
    };
  }

  if (has('dengue') || (has('fever') && has('rash') && has('pain'))) {
    return {
      possibleConditions: ['Dengue fever (differential)', 'Other arboviral illness', 'Drug reaction — clinician review'],
      riskLevel: 'High',
      preventiveAdvice: ['Hydrate with oral rehydration; avoid NSAIDs until platelet status known.', 'Eliminate stagnant water around residence.', 'Use EPA-registered repellent during daylight biting hours.'],
      triageRecommendation: 'Seek emergency evaluation for bleeding, severe abdominal pain, persistent vomiting, or sudden weakness.',
      outbreakContext: 'Environmental + entomology proxies show dengue pressure trending upward in South Zone.',
    };
  }

  if (has('headache') && has('nausea') && !has('fever')) {
    return {
      possibleConditions: ['Migraine pattern', 'Tension headache', 'Dehydration'],
      riskLevel: 'Low',
      preventiveAdvice: ['Gradual hydration, screen breaks, consistent sleep window.', 'Track triggers (caffeine, sleep debt).'],
      triageRecommendation: 'Book routine primary care if headaches are new, thunderclap, or worsening over days.',
      outbreakContext: 'No active outbreak correlation for isolated headache-nausea in your mock catchment.',
    };
  }

  return null;
}
