import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { DEMO_REPORT_DATA } from "../../../data/demo-report";

export async function GET() {
  try {
    const records = await prisma.report.findMany({
      include: {
        biomarkers: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // If table returned empty array, append a simulated fallback entry mapping the anemia payload to keep screens filled
    if (!records || records.length === 0) {
      return NextResponse.json({
        records: [
          {
            id: 'demo-sample-static-record',
            patientName: DEMO_REPORT_DATA.patientName,
            age: DEMO_REPORT_DATA.age,
            gender: DEMO_REPORT_DATA.gender,
            diseases: 'Iron Deficiency Anemia',
            severity: 'Moderate',
            confidence: 92.0,
            createdAt: new Date().toISOString(),
            reportText: DEMO_REPORT_DATA.reportText,
            summary: {
              detectedAbnormalities: ['Hemoglobin (9.1 g/dL)', 'Ferritin (10 ng/mL)', 'Serum Iron (32 ug/dL)'],
              simplifiedExplanation: 'Analysis shows multiple key parameters falling below critical thresholds, indicative of Iron Deficiency Anemia.',
              possibleDisease: 'Iron Deficiency Anemia',
              severity: 'Moderate',
              recommendations: ['Consult a licensed physician for targeted micronutrient loading recommendations.'],
              disclaimer: 'AI-generated screening results — not a medical diagnosis.'
            },
            biomarkers: [
              { name: 'Hemoglobin', value: 9.1, unit: 'g/dL', status: 'Abnormal' },
              { name: 'Ferritin', value: 10, unit: 'ng/mL', status: 'Abnormal' },
              { name: 'Serum Iron', value: 32, unit: 'ug/dL', status: 'Abnormal' }
            ]
          }
        ]
      });
    }

    return NextResponse.json({ records });

  } catch (error: any) {
    console.error("Database query route error:", error);
    return NextResponse.json({ error: error.message || "SQLite transaction exception" }, { status: 500 });
  }
}
