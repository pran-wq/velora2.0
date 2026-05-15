# Aether Health - Emergent Upload Build

This repository has been cleaned for an Emergent rebuild. It now contains only the current Vite React client and a lightweight Express AI server. Local Prisma, SQLite/Postgres config, Supabase wiring, generated builds, logs, env files, and dependency folders were removed.

## What to Upload

Upload the whole folder except `.git` if Emergent does not need Git history. The important source folders are:

- `client/` - React/Vite healthcare app UI
- `server/` - Express API with `/api/ai/chat`
- `package.json` - root scripts for running both apps

## Current App Shape

- Frontend: React 19, Vite, Tailwind, Framer Motion, Recharts, Lucide
- Backend: Express, CORS, Helmet, Gemini chat endpoint
- Persistence: intentionally removed; ask Emergent to create the database fresh
- AI: Gemini-compatible prompt flow currently exists, but ask Emergent to wire AI using its preferred secure backend environment

## Emergent Prompt Sequence

Use these prompts step by step to keep credit usage low.

### Prompt 1 - Import and Run

Import this project as a full-stack app. Keep the existing React/Vite UI in `client` and Express API in `server`. Install dependencies, run the app, and fix only build/runtime errors needed to get the current UI loading. Do not redesign the app yet. Do not add a database in this step.

### Prompt 2 - Database Schema

Add a managed database for this healthcare app. Create tables/collections for users, profiles, health records, vitals, medications, appointments, reports, AI chat messages, reminders, device connections, and insurance/health-vault files. Use secure user ownership fields and timestamps. Do not use the removed Prisma/Supabase files; build the database integration using Emergent's recommended stack.

### Prompt 3 - Auth and Profile Persistence

Connect login/profile onboarding to the new database. Persist gender mode, pregnancy status/month, age, weight, blood group, health goals, accessibility settings, and profile changes. Keep the existing guest/demo flow working as fallback.

### Prompt 4 - Core Feature Persistence

Persist health logs, symptoms, medications, reminders, appointments, uploaded report metadata, and health-vault records. Replace the current in-memory/mock store behavior with backend API calls while keeping the current UI layout.

### Prompt 5 - AI Integration

Move all AI calls to secure backend routes. Add chat history persistence per user. Use the health profile, recent vitals, symptoms, reports, and medications as context for AI responses. Keep medical disclaimers and avoid diagnosis claims.

### Prompt 6 - Report Upload and Analysis

Implement report upload for PDF/images, extract text, parse biomarkers, store the result, show history, and generate AI summaries. Reuse the existing report screens in the client, but build the backend and storage cleanly with Emergent services.

### Prompt 7 - Polish and Deploy

Run type checks and production builds. Fix broken routes, missing API states, mobile layout issues, and empty states. Add only minimal UI polish needed for a deployable healthcare MVP. Then deploy.

## Required Environment Variables

Set these in Emergent or the deployment environment, not in committed files:

- `GEMINI_API_KEY` or Emergent's chosen AI provider key
- `GEMINI_MODEL` optional, default can be `gemini-2.0-flash`
- Any database/auth/storage variables Emergent creates
