import { NextResponse } from "next/server";
import { performOCR } from "../../../lib/ocr";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Binary upload payload object undefined" }, { status: 400 });
    }

    // Convert file buffer object
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If standard clear text, bypass OCR engine
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const decoded = buffer.toString('utf-8');
      return NextResponse.json({ extractedText: decoded });
    }

    // Execute Tesseract Engine Wrapper
    const extractedText = await performOCR(buffer);

    return NextResponse.json({ extractedText });

  } catch (error: any) {
    console.error("Binary OCR parse backend exception:", error);
    return NextResponse.json({ error: error.message || "OCR backend streaming exception" }, { status: 500 });
  }
}
