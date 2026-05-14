import { NextResponse } from "next/server";
import { parseBiomarkers, extractPatientMetadata } from "../../../lib/parser";
import { executeDiseaseEngine } from "../../../lib/disease-engine";
import { generateAISummary } from "../../../lib/ai-summary";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: "Input text context missing or unreadable" }, { status: 400 });
    }

    // Step 1: Extract patient metadata
    const meta = extractPatientMetadata(text);

    // Step 2: Parse biomarkers using regex engine mapping
    const extractedBiomarkers = parseBiomarkers(text);

    // Step 3: Run Disease Detection rule engine
    const engineOutput = executeDiseaseEngine(extractedBiomarkers);

    // Step 4: Generate AI Formatter summary blocks
    const aiSummary = await generateAISummary(
      extractedBiomarkers, 
      engineOutput.diseasesString, 
      engineOutput.severity, 
      engineOutput.confidence
    );

    // Step 5: Save directly to SQLite mapping Report and nested Biomarkers array
    let savedReportId = `local-transient-${Date.now()}`;
    try {
      const record = await prisma.report.create({
        data: {
          patientName: meta.patientName,
          age: meta.age,
          gender: meta.gender,
          reportText: text,
          diseases: engineOutput.diseasesString,
          severity: engineOutput.severity,
          confidence: engineOutput.confidence,
          summary: JSON.stringify(aiSummary),
          biomarkers: {
            create: extractedBiomarkers.map(b => ({
              name: b.name,
              value: b.value,
              unit: b.unit,
              status: b.status
            }))
          }
        }
      });
      savedReportId = record.id;
    } catch (dbError) {
      console.error("Prisma write transaction exception, returning static transient memory ID:", dbError);
    }

    // Step 6: Return structured dashboard layout results
    return NextResponse.json({
      id: savedReportId,
      patientName: meta.patientName,
      age: meta.age,
      gender: meta.gender,
      biomarkers: extractedBiomarkers,
      diseases: engineOutput.diseasesString,
      severity: engineOutput.severity,
      confidence: engineOutput.confidence,
      summary: aiSummary,
      reportText: text
    });

  } catch (error: any) {
    console.error("Inference processing runtime route exception:", error);
    return NextResponse.json({ error: error.message || "Internal server failure" }, { status: 500 });
  }
}
