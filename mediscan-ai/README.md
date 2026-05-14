# MediScan AI — Production-Style Hackathon Demo

MediScan AI is a local-first, AI-powered medical screening application designed to showcase automated biomarker extraction via OCR, predictive rule engine inference, and continuous tracking pipelines.

> **CRITICAL DISCLAIMER**  
> AI-generated screening results — not a medical diagnosis.

---

## Architecture Overview

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS (Custom Dark Futuristic Token Themes), Recharts, Framer Motion
- **Database & State**: SQLite mapped dynamically via Prisma ORM (`dev.db` store engine)
- **OCR Pipeline**: Server-side extraction bindings optimized for multi-page laboratory PDFs and standard biochemical snapshots using `tesseract.js`
- **Inference Models**: Deterministic multi-tier rule matching logic outputting targeted screening profiles combined with OpenAI payload formatters

---

## Complete Standalone Setup

Run the entire application stack fully locally using standard Node commands without needing external configuration dependencies:

```bash
# 1. Install required library configurations
npm install

# 2. Push SQLite local migration metadata schemas
npx prisma migrate dev --name init

# 3. Launch live developer matrix workspace
npm run dev
```

Open your browser directly to:
[http://localhost:3000](http://localhost:3000)

---

## Core Operational Actions

1. **File Drop Uploads**: Supports binary document streams parsing text readouts via regular expression matching.
2. **Instant Demo Automation**: Pre-loaded mock trigger buttons pre-populate standard inputs isolating *Iron Deficiency Anemia* metrics for rapid presentation setup.
3. **Downloadable Canvas Reports**: Embedded client rendering scripts (`jspdf` + `html2canvas`) extract pixel-perfect document matrices directly to hard drives.
