import { NextResponse } from "next/server";
import { executeCompareEngine } from "../../../lib/compare-engine";
import { parseBiomarkers } from "../../../lib/parser";

export async function POST(req: Request) {
  try {
    const { previousText, currentText } = await req.json();

    if (!previousText || !currentText) {
      return NextResponse.json({ error: "Missing required text comparisons arrays" }, { status: 400 });
    }

    const prevB = parseBiomarkers(previousText);
    const currB = parseBiomarkers(currentText);

    const result = executeCompareEngine(prevB, currB);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Compare route backend error:", error);
    return NextResponse.json({ error: error.message || "Comparison mapping exception" }, { status: 500 });
  }
}
