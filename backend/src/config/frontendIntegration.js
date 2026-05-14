/**
 * Frontend ↔ Backend integration cookbook for Medora.
 * Exposed at GET /api/integration so the frontend (or curl) can fetch
 * runnable snippets without leaving the running server.
 *
 * NOT a generator — these are reference examples only.
 */

export const FRONTEND_INTEGRATION = {
  name: "Medora — Frontend Integration Guide",
  baseUrlPattern: "import.meta.env.VITE_API_URL || 'http://localhost:5000'",

  // ---------- environment ----------
  env: {
    file: "client/.env",
    vars: {
      VITE_API_URL: "http://localhost:5000",
    },
    note: "Restart Vite after editing .env. Vars must start with VITE_.",
  },

  // ---------- cors ----------
  cors: {
    default: "*",
    custom:
      "Set CORS_ORIGIN in backend/.env. Comma-separate multiple origins, e.g. " +
      "CORS_ORIGIN=http://localhost:5173,http://localhost:3000",
    credentials: false,
    note: "Backend uses Bearer-token auth (no cookies), so credentials are not needed.",
  },

  // ---------- response envelope ----------
  responseEnvelope: {
    success: '{ "success": true, "message": "...", "data": { ... } }',
    error: '{ "success": false, "message": "...", "details": null | object }',
    statusCodes: {
      200: "OK",
      201: "Created (register, add medication, etc.)",
      400: "Validation error",
      401: "Missing/invalid Bearer token",
      404: "Resource not found / not owned by user",
      409: "Conflict (e.g. duplicate email)",
      429: "Rate-limited",
      500: "Server / config error",
      502: "Upstream AI failure",
    },
  },

  // ---------- auth ----------
  authFlow: {
    register: {
      method: "POST",
      url: "/api/auth/register",
      body: {
        name: "Alice",
        email: "alice@medora.test",
        password: "secret123",
        age: 29,
        gender: "female",
        bloodGroup: "O+",
      },
      response: "{ token, user }",
      tokenStorage: "Persist token via localStorage.setItem('medora_token', token)",
    },
    login: {
      method: "POST",
      url: "/api/auth/login",
      body: { email: "alice@medora.test", password: "secret123" },
      response: "{ token, user }",
    },
    authedHeader: { Authorization: "Bearer <token>" },
    me: { method: "GET", url: "/api/auth/me", response: "{ user }" },
    tokenTtl: "7 days",
  },

  // ---------- code snippets ----------
  examples: {
    axiosClient: `// client/src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("medora_token");
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

// unwrap { success, message, data } envelope
api.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  (err) => {
    const msg = err.response?.data?.message || err.message || "Network error";
    if (err.response?.status === 401) localStorage.removeItem("medora_token");
    return Promise.reject(new Error(msg));
  }
);

export default api;`,

    fetchHelper: `// client/src/api/fetcher.js
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function request(path, { method = "GET", body, headers = {} } = {}) {
  const token = localStorage.getItem("medora_token");
  const res = await fetch(\`\${BASE}\${path}\`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok || json.success === false)
    throw new Error(json.message || \`HTTP \${res.status}\`);
  return json.data;
}`,

    register: `const { token, user } = await api.post("/api/auth/register", {
  name, email, password, age, gender, bloodGroup,
});
localStorage.setItem("medora_token", token);`,

    login: `const { token, user } = await api.post("/api/auth/login", { email, password });
localStorage.setItem("medora_token", token);`,

    profileUpdate: `const { user } = await api.put("/api/profile", { name, age, preferences });`,

    medicationAdd: `const { medication } = await api.post("/api/medications", {
  medicineName: "Aspirin",
  dosage: "500mg",
  frequency: "twice_daily",     // once_daily | twice_daily | thrice_daily | four_times_daily | weekly | as_needed
  reminderTime: "08:00",        // HH:MM (24h)
  refillDate: "2026-06-01",     // optional
});`,

    medicationTaken: `await api.patch(\`/api/medications/\${id}/taken\`);`,

    recoveryAdd: `const { entry } = await api.post("/api/recovery", {
  sleepHours: 8,
  hydrationLevel: 10,           // 0–10
  steps: 10000,
  mood: "great",                // great | good | tired | stressed | low
  notes: "feeling good",        // optional
});
// entry.wellnessScore is auto-computed (0–100)`,

    aiMotivation: `const { message, disclaimer } = await api.post("/api/ai/motivation", {
  mood: "tired",
  recoveryScore: 55,
});
// Render \`message\` prominently and \`disclaimer\` as a footer note.`,

    aiWellnessSummary: `const { insight, disclaimer } = await api.post("/api/ai/wellness-summary", {
  sleepHours, hydrationLevel, mood, steps, wellnessScore,
});`,

    uploadFile: `// client/src/api/upload.js
export async function uploadRecord(file) {
  const fd = new FormData();
  fd.append("file", file);                    // field name MUST be "file"
  const token = localStorage.getItem("medora_token");
  const res = await fetch(\`\${import.meta.env.VITE_API_URL}/api/records/upload\`, {
    method: "POST",
    headers: { Authorization: \`Bearer \${token}\` },   // NO Content-Type — browser sets boundary
    body: fd,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.record;
}
// Allowed: pdf, jpg, jpeg, png — max 5MB.`,

    uploadPreview: `// Display uploaded file
<img src={\`\${VITE_API_URL}/\${record.filePath}\`} />          // for images
<a href={\`\${VITE_API_URL}/\${record.filePath}\`} target="_blank">{record.originalName}</a>`,

    dashboard: `const summary = await api.get("/api/analytics/dashboard");
// summary = { totalMedications, medicationsTaken, adherencePercentage,
//             averageWellnessScore, latestMood, latestRecoveryScore }`,

    recoveryChart: `const { trends } = await api.get("/api/analytics/recovery-trends");
// trends: Array<{ date, wellnessScore, sleepHours, hydrationLevel, steps }> — chronological
// Plug directly into Recharts/Chart.js as the data array.`,

    moodChart: `const { moodCounts, recentTrend, latestMood } = await api.get("/api/analytics/mood");
// moodCounts: { great: 2, good: 5, tired: 1, ... } — pie/bar chart
// recentTrend: last 7 entries (oldest → newest) — line chart`,

    protectedRoute: `// React route guard
function PrivateRoute({ children }) {
  const token = localStorage.getItem("medora_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}`,

    runtimeApiDiscovery: `// Optional: discover the API surface at boot
const docs = await api.get("/api/docs");
// docs.groups.<resource>.routes — full catalogue`,
  },

  // ---------- common pitfalls ----------
  pitfalls: [
    "Do NOT set Content-Type when uploading FormData — browser must set the multipart boundary.",
    "Bearer header MUST include the literal word 'Bearer ' before the token.",
    "VITE_API_URL must NOT have a trailing slash.",
    "On 401, clear the stored token and redirect to /login.",
    "On 429 (rate limit), back off and retry after Retry-After header seconds.",
    "Always check `success: false` in the response body — HTTP 200 isn't enough alone.",
  ],
};

export default FRONTEND_INTEGRATION;
