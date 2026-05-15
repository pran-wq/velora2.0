/**
 * Lightweight, frontend-friendly API documentation.
 * Exposed at GET /api/docs.
 *
 * Not Swagger/OpenAPI — just a static JSON catalogue that the frontend
 * (or curl) can read to discover endpoints, expected fields and auth needs.
 */

const AUTH_HEADER = "Authorization: Bearer <token>";

export const API_DOCS = {
  name: "Medora Backend API",
  version: "1.0.0",
  baseUrl: "/api",
  responseFormat: {
    success: {
      success: true,
      message: "Descriptive message",
      data: "object | array | null",
    },
    error: {
      success: false,
      message: "Error message",
      details: "object | null (optional)",
    },
  },
  groups: {
    auth: {
      basePath: "/api/auth",
      rateLimit: "20 req / 15 min / IP",
      routes: [
        {
          method: "POST",
          path: "/register",
          auth: false,
          body: {
            name: "string (required)",
            email: "string (required)",
            password: "string (required, min 6 chars)",
            age: "number (optional)",
            gender: "male|female|other|prefer_not_to_say (optional)",
            bloodGroup: "string (optional)",
          },
          response: "{ token, user }",
        },
        {
          method: "POST",
          path: "/login",
          auth: false,
          body: { email: "string", password: "string" },
          response: "{ token, user }",
        },
        {
          method: "GET",
          path: "/me",
          auth: AUTH_HEADER,
          response: "{ user }",
        },
      ],
    },

    profile: {
      basePath: "/api/profile",
      routes: [
        { method: "GET", path: "/", auth: AUTH_HEADER, response: "{ user }" },
        {
          method: "PUT",
          path: "/",
          auth: AUTH_HEADER,
          body: {
            name: "string (optional)",
            age: "number 0–130 (optional)",
            gender: "male|female|other|prefer_not_to_say (optional)",
            bloodGroup: "string (optional)",
            preferences: "object (optional)",
          },
          response: "{ user }",
        },
      ],
    },

    medications: {
      basePath: "/api/medications",
      routes: [
        {
          method: "POST",
          path: "/",
          auth: AUTH_HEADER,
          body: {
            medicineName: "string (required)",
            dosage: "string (required, e.g. '500mg')",
            frequency:
              "once_daily|twice_daily|thrice_daily|four_times_daily|weekly|as_needed",
            reminderTime: "HH:MM 24h (required)",
            refillDate: "ISO date (optional)",
          },
          response: "{ medication }",
        },
        { method: "GET", path: "/", auth: AUTH_HEADER, response: "{ medications: [] }" },
        {
          method: "PUT",
          path: "/:id",
          auth: AUTH_HEADER,
          body: "partial fields from POST",
          response: "{ medication }",
        },
        {
          method: "DELETE",
          path: "/:id",
          auth: AUTH_HEADER,
          response: "{ id }",
        },
        {
          method: "PATCH",
          path: "/:id/taken",
          auth: AUTH_HEADER,
          response: "{ medication }  // status=taken, adherenceCount++",
        },
      ],
    },

    recovery: {
      basePath: "/api/recovery",
      routes: [
        {
          method: "POST",
          path: "/",
          auth: AUTH_HEADER,
          body: {
            sleepHours: "number 0–24",
            hydrationLevel: "number 0–10",
            steps: "integer ≥ 0",
            mood: "great|good|tired|stressed|low",
            notes: "string (optional)",
          },
          response: "{ entry }  // wellnessScore auto-computed",
        },
        { method: "GET", path: "/", auth: AUTH_HEADER, response: "{ entries: [] }" },
        {
          method: "PUT",
          path: "/:id",
          auth: AUTH_HEADER,
          body: "partial fields from POST",
          response: "{ entry }  // wellnessScore recomputed",
        },
        { method: "DELETE", path: "/:id", auth: AUTH_HEADER, response: "{ id }" },
      ],
    },

    ai: {
      basePath: "/api/ai",
      rateLimit: "10 req / min / IP",
      note: "All responses include an `AI_DISCLAIMER` field.",
      routes: [
        {
          method: "POST",
          path: "/wellness-summary",
          auth: AUTH_HEADER,
          body: {
            sleepHours: "number 0–24",
            hydrationLevel: "number 0–10",
            mood: "great|good|tired|stressed|low",
            steps: "integer 0–100000",
            wellnessScore: "number 0–100",
          },
          response: "{ insight, disclaimer }",
        },
        {
          method: "POST",
          path: "/recovery-insight",
          auth: AUTH_HEADER,
          body: {
            sleepHours: "number 0–24",
            hydrationLevel: "number 0–10",
            steps: "integer 0–100000",
            wellnessScore: "number 0–100",
            mood: "great|good|tired|stressed|low",
            adherenceRate: "number 0–100",
          },
          response: "{ insight, disclaimer }",
        },
        {
          method: "POST",
          path: "/motivation",
          auth: AUTH_HEADER,
          body: { mood: "great|good|tired|stressed|low", recoveryScore: "number 0–100" },
          response: "{ message, disclaimer }",
        },
      ],
    },

    records: {
      basePath: "/api/records",
      note: "Files served read-only at /uploads/<fileName>. Max 5MB. Allowed: pdf, jpg, jpeg, png.",
      routes: [
        {
          method: "POST",
          path: "/upload",
          auth: AUTH_HEADER,
          contentType: "multipart/form-data",
          body: { file: "binary (required, field name 'file')" },
          response: "{ record }",
        },
        { method: "GET", path: "/", auth: AUTH_HEADER, response: "{ records: [] }" },
        { method: "DELETE", path: "/:id", auth: AUTH_HEADER, response: "{ id }" },
      ],
    },

    analytics: {
      basePath: "/api/analytics",
      routes: [
        {
          method: "GET",
          path: "/dashboard",
          auth: AUTH_HEADER,
          response:
            "{ totalMedications, medicationsTaken, adherencePercentage, averageWellnessScore, latestMood, latestRecoveryScore }",
        },
        {
          method: "GET",
          path: "/recovery-trends",
          auth: AUTH_HEADER,
          response:
            "{ trends: [{ date, wellnessScore, sleepHours, hydrationLevel, steps }] }  // chart-ready, chronological",
        },
        {
          method: "GET",
          path: "/adherence",
          auth: AUTH_HEADER,
          response: "{ total, taken, missed, pending, adherencePercentage }",
        },
        {
          method: "GET",
          path: "/mood",
          auth: AUTH_HEADER,
          response: "{ moodCounts, recentTrend: [{ date, mood }], latestMood }",
        },
      ],
    },

    meta: {
      basePath: "/",
      routes: [
        { method: "GET", path: "/", auth: false, response: "'Medora Backend Running'" },
        { method: "GET", path: "/health", auth: false, response: "{ status: 'ok' }" },
        { method: "GET", path: "/api/docs", auth: false, response: "This document" },
      ],
    },
  },
};

export default API_DOCS;
