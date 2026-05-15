# Medora — AI Powered Healthcare & Recovery Platform

> Lightweight, modular Node.js backend for the **Medora** hackathon MVP.
> Tracks medications, recovery, wellness, health records, and generates AI-powered insights — all with zero database overhead.

---

## 1. Project Overview

**Medora** is an AI-powered healthcare & recovery platform that helps patients:

- track daily wellness (sleep, hydration, steps, mood)
- manage medications with adherence tracking
- upload medical reports
- receive AI-generated wellness summaries, recovery insights, and motivational guidance
- visualize progress on a personal dashboard

The backend is intentionally **lightweight** — no databases, no queues, no containers. Just Node + Express + local JSON storage, designed for speed, clarity, and easy evaluation.

---

## 2. Features

| Area | Capability |
|---|---|
| **Authentication** | Register, login, JWT (Bearer), bcrypt-hashed passwords, protected routes |
| **Profile** | View / update profile, blood group, age, preferences |
| **Medications** | CRUD, mark as taken, adherence counter, frequency + reminder time |
| **Recovery** | Daily entries with auto-computed wellness score (0–100) |
| **AI Insights** | Wellness summary, recovery insight, motivational message via Gemini |
| **Health Records** | Secure file upload (PDF/JPG/PNG, 5MB cap), static preview, delete |
| **Analytics** | Dashboard summary, chart-ready trends, adherence stats, mood analytics |
| **Security** | Helmet, CORS, rate limiting, input validation, prompt sanitization |
| **Demo Mode** | Optional sample data via `GET /api/demo` for empty-state previews |
| **Diagnostics** | `/health/details` reports uptime + service availability |

---

## 3. Tech Stack

- **Runtime** — Node.js (ES Modules)
- **Framework** — Express.js
- **Storage** — Local JSON files (`fs/promises`) + local `uploads/` for files
- **AI** — Google Gemini (`@google/generative-ai`)
- **Auth** — `jsonwebtoken` + `bcrypt`
- **Uploads** — `multer`
- **Security** — `helmet`, `cors`, in-memory rate limiter
- **Dev** — `nodemon`, `dotenv`

> No database. No ORM. No queue. No Docker. Pure JS files on disk.

---

## 4. Backend Architecture

```
backend/
├── src/
│   ├── routes/          → thin route mounts (auth, profile, medications, recovery, ai, records, analytics)
│   ├── controllers/     → business logic per resource
│   ├── middleware/      → authMiddleware, errorHandler, rateLimiter, validateRequest, uploadMiddleware
│   ├── services/        → geminiService (centralized AI client)
│   ├── utils/           → storage, helpers, constants, response, logger, asyncHandler,
│   │                      promptTemplates, sanitizeAiInput
│   ├── config/          → security, apiDocs, frontendIntegration, demoConfig
│   ├── data/            → JSON files (users, medications, recovery, records) — auto-created
│   ├── uploads/         → user-uploaded files — auto-created
│   └── server.js        → app bootstrap, middleware mounting, route wiring, diagnostics
├── .env
├── package.json
└── README.md
```

### Request flow

```
Client
  ↓
Helmet + CORS                   (security headers)
  ↓
JSON / urlencoded parser        (1MB cap)
  ↓
Request logger                  (method, path, status, duration)
  ↓
Global rate limit               (120/min/IP)
  ↓
Route-specific rate limits      (auth: 20/15min, ai: 10/min)
  ↓
authMiddleware (if protected)   (verifies Bearer, attaches req.user)
  ↓
Controller                      (validates → uses helpers + storage)
  ↓
Storage utility                 (readJSON / writeJSON with safe fallback)
  ↓
Response helper                 ({ success, message, data })
```

### AI flow (centralized)

```
Controller
  ↓
sanitizeAiInput()              (strips injection patterns, control chars)
  ↓
promptTemplates.*Prompt()      (structured, token-efficient, safety preamble)
  ↓
geminiService.generateContent  (one-shot, maxOutputTokens=200, temp=0.6)
  ↓
{ insight | message, disclaimer }
```

---

## 5. Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Steps

```bash
# 1. Install dependencies
cd backend
npm install      # or: yarn install

# 2. Configure environment
cp .env .env          # ensure values below are set
# (edit .env — set JWT_SECRET, GEMINI_API_KEY)

# 3. Run dev server (auto-reload)
npm run dev

# Or run production-style
npm start
```

Server runs at: **http://localhost:5000**

Hit `http://localhost:5000/health` to confirm it's up.

---

## 6. Environment Variables

`backend/.env`:

```bash
# Required
PORT=5000
JWT_SECRET=<random 32+ char string>
GEMINI_API_KEY=<your Gemini API key>

# Optional
GEMINI_MODEL=gemini-1.5-flash
CORS_ORIGIN=http://localhost:5173            # comma-separate for multiple
DEMO_MODE=false                              # true → enable sample data hints
NODE_ENV=development
```

- Get a Gemini key: https://aistudio.google.com/apikey
- Never commit `.env`. The provided defaults are placeholders only.

---

## 7. API Summary

All endpoints respond with the standard envelope:

```json
{ "success": true, "message": "...", "data": { ... } }
```

| Group | Method & Path | Auth |
|---|---|---|
| **Auth** | `POST /api/auth/register` | ❌ |
|   | `POST /api/auth/login` | ❌ |
|   | `GET /api/auth/me` | ✅ |
| **Profile** | `GET /api/profile` | ✅ |
|   | `PUT /api/profile` | ✅ |
| **Medications** | `POST /api/medications` | ✅ |
|   | `GET /api/medications` | ✅ |
|   | `PUT /api/medications/:id` | ✅ |
|   | `DELETE /api/medications/:id` | ✅ |
|   | `PATCH /api/medications/:id/taken` | ✅ |
| **Recovery** | `POST /api/recovery` | ✅ |
|   | `GET /api/recovery` | ✅ |
|   | `PUT /api/recovery/:id` | ✅ |
|   | `DELETE /api/recovery/:id` | ✅ |
| **AI** | `POST /api/ai/wellness-summary` | ✅ |
|   | `POST /api/ai/recovery-insight` | ✅ |
|   | `POST /api/ai/motivation` | ✅ |
| **Records** | `POST /api/records/upload` (multipart, field `file`) | ✅ |
|   | `GET /api/records` | ✅ |
|   | `DELETE /api/records/:id` | ✅ |
|   | `GET /uploads/<fileName>` (static) | ❌ |
| **Analytics** | `GET /api/analytics/dashboard` | ✅ |
|   | `GET /api/analytics/recovery-trends` | ✅ |
|   | `GET /api/analytics/adherence` | ✅ |
|   | `GET /api/analytics/mood` | ✅ |
| **Meta** | `GET /` | ❌ |
|   | `GET /health` | ❌ |
|   | `GET /health/details` | ❌ |
|   | `GET /api/docs` (full catalogue) | ❌ |
|   | `GET /api/integration` (frontend cookbook) | ❌ |
|   | `GET /api/demo` (sample data) | ❌ |

> Full per-route request/response shapes are available at runtime via `GET /api/docs`.

---

## 8. Security Features

- **JWT auth** — `Authorization: Bearer <token>`, 7-day TTL, signed with `JWT_SECRET`
- **Password hashing** — bcrypt with 10 salt rounds
- **Protected routes** — `authMiddleware` rejects missing / invalid / expired tokens
- **Ownership enforcement** — every CRUD route filters by `req.user.id`
- **Helmet** — secure HTTP headers (XCTO, HSTS, X-Frame-Options, COOP, CORP)
- **CORS** — configurable per-origin via `CORS_ORIGIN` env (comma-separated)
- **Rate limiting** — global 120/min, auth 20/15min, AI 10/min (in-memory, per-IP)
- **Request validation** — lightweight inline + reusable `validateRequest()` middleware
- **Upload security** — MIME + extension whitelist, 5MB cap, randomized server filenames, sanitized originals
- **Prompt sanitization** — strips 10+ prompt-injection patterns before AI calls
- **Body size cap** — 1MB on JSON / urlencoded bodies
- **Centralized error handler** — never leaks stack traces; consistent envelope

---

## 9. AI Architecture

Medora uses **Google Gemini** for structured healthcare insights (NOT a chatbot).

### Design principles

1. **Centralized service** — single `geminiService.generateContent(prompt)` entry point. Client initialized once, lazily.
2. **Structured prompts** — three reusable templates in `utils/promptTemplates.js`:
   - `wellnessSummaryPrompt`
   - `recoveryInsightPrompt`
   - `motivationPrompt`
3. **Safety preamble** — every prompt prefixes a strict instruction set:
   > "do NOT diagnose, do NOT prescribe, use soft language, encourage clinician consultation, plain text only."
4. **Token efficiency** — `maxOutputTokens: 200`, `temperature: 0.6`. Prompts cap each output line in words.
5. **Sanitization** — all user-provided string inputs pass through `sanitizeAiInput()` which neutralizes injection patterns (`ignore previous instructions`, `system:`, `<|im_start|>`, code fences, etc.).
6. **Disclaimer** — every AI response is wrapped with a backend-attached disclaimer (guaranteed even if the model omits it):
   > _"This information is AI-generated and not a replacement for professional medical advice."_

---

## 10. Future Scope

Architected for these natural next steps (NOT implemented in MVP):

- **Database migration** — swap `storage.js` for MongoDB / PostgreSQL with the same `readJSON`/`writeJSON` API surface.
- **OCR for health records** — pipe uploaded PDFs/images through Tesseract / Gemini Vision, then auto-summarize via existing `geminiService`.
- **ML prediction models** — extend `analyticsController` to forecast adherence drop-off or recovery setbacks.
- **Wearable integration** — Apple Health / Google Fit / Fitbit webhook ingestion into `data/recovery.json` shape.
- **Blockchain verification** — anchor health record hashes on-chain for tamper-evidence.
- **Predictive healthcare analytics** — time-series modeling on `recovery-trends` data.
- **Telemedicine bridge** — share dashboard snapshots with clinicians via signed URLs.

---

## Hackathon Presentation Notes

### Why local JSON storage?

- **Demo speed** — judges can run the project in 30 seconds with `npm install && npm run dev`. No database setup, no migrations, no Docker.
- **Inspectable** — `src/data/*.json` is human-readable; evaluators can verify data integrity by opening a file.
- **Production-pathway intact** — `storage.js` exposes a tiny CRUD interface (`readJSON`, `writeJSON`, `appendItem`, `updateItem`, `removeItem`). Swapping in MongoDB only touches **one file**.

### MVP-first architecture

- **15 backend phases** built incrementally — each phase is a single, testable, reviewable concern (auth → profile → meds → recovery → AI → records → analytics → security → safety → optimization → docs → polish).
- **Strict module boundaries** — routes don't touch storage; controllers don't touch HTTP framing; AI is single-entry.
- **No premature abstractions** — every utility is used by at least 2 callers.

### Scalability readiness

| Concern | Today | Production path |
|---|---|---|
| Storage | JSON files | Swap `storage.js` → MongoDB/Postgres |
| Auth | JWT in memory | Same JWT, add refresh tokens + Redis blocklist |
| Rate limit | In-memory Map | Swap to `rate-limiter-flexible` + Redis |
| Uploads | Local `uploads/` | Swap multer storage → S3 |
| AI key mgmt | `.env` file | AWS Secrets Manager / GCP Secret Manager |
| Logging | stdout | Pipe to Datadog / CloudWatch |

### Lightweight design choices

- **Zero clientside state libraries forced on FE** — backend returns predictable `{ success, message, data }` envelope, works with any FE state lib.
- **Static API docs at `/api/docs`** — no Swagger UI bloat.
- **Frontend cookbook at `/api/integration`** — runnable axios/fetch snippets served from the API itself.
- **In-memory rate limiter** — single-process, zero-cost. Switch to Redis only when scaling horizontally.
- **No build step** — backend runs Node directly on ES Modules. Frontend (Vite) handles its own build.

---

## Quick Demo Flow (60 seconds)

```bash
# 1. Boot
npm run dev

# 2. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@medora.test","password":"secret123"}'
# → grab the token

# 3. Add a medication
TOKEN=...
curl -X POST http://localhost:5000/api/medications \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"medicineName":"Aspirin","dosage":"500mg","frequency":"twice_daily","reminderTime":"08:00"}'

# 4. Log a recovery entry
curl -X POST http://localhost:5000/api/recovery \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"sleepHours":8,"hydrationLevel":10,"steps":10000,"mood":"great"}'

# 5. View dashboard
curl http://localhost:5000/api/analytics/dashboard -H "Authorization: Bearer $TOKEN"

# 6. Generate AI motivation
curl -X POST http://localhost:5000/api/ai/motivation \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"mood":"tired","recoveryScore":55}'
```

---

## License

MIT — hackathon use, demos, and educational projects encouraged.

---

**Built for the Medora hackathon. ❤️ Stay healthy.**
