// ─── Medora Backend API Client ───

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'aether-dev-token';

let authToken: string | null = localStorage.getItem(TOKEN_KEY);

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

interface ApiOptions extends RequestInit {
  body?: any;
  raw?: boolean;
}

async function api<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { body, headers = {}, raw, ...rest } = options;

  const isFormData = body instanceof FormData;
  const config: RequestInit = {
    ...rest,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const json = await response.json().catch(() => ({} as any));

  if (!response.ok || json.success === false) {
    if (response.status === 401) setAuthToken(null);
    throw new Error(json.message || `API Error: ${response.status}`);
  }

  // Backend envelope: { success, message, data }. Auto-unwrap `data` unless raw=true.
  return (raw ? json : (json.data ?? json)) as T;
}

export const apiClient = {
  get: <T>(endpoint: string) => api<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) => api<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body?: any) => api<T>(endpoint, { method: 'PUT', body }),
  patch: <T>(endpoint: string, body?: any) => api<T>(endpoint, { method: 'PATCH', body }),
  delete: <T>(endpoint: string) => api<T>(endpoint, { method: 'DELETE' }),
};

// ─── Auth ───
export const authApi = {
  register: (data: { name: string; email: string; password: string; age?: number; gender?: string; bloodGroup?: string }) =>
    apiClient.post<{ token: string; user: any }>('/api/auth/register', data).then((r) => {
      setAuthToken(r.token);
      return r;
    }),
  login: (data: { email: string; password: string }) =>
    apiClient.post<{ token: string; user: any }>('/api/auth/login', data).then((r) => {
      setAuthToken(r.token);
      return r;
    }),
  me: () => apiClient.get<{ user: any }>('/api/auth/me'),
  logout: () => setAuthToken(null),
};

// ─── Profile ───
export const profileApi = {
  get: () => apiClient.get<{ user: any }>('/api/profile'),
  update: (patch: any) => apiClient.put<{ user: any }>('/api/profile', patch),
};

// ─── Medications (mapped to legacy `medicineApi` name used by stores) ───
// Backend uses: medicineName, reminderTime, status:lowercase, adherenceCount
// Frontend UI expects: name, time, status:Capitalized, refillCount
// → adapt at this boundary so existing UI works without changes.
const capStatus = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : 'Pending';

const toUiMed = (m: any) => ({
  ...m,
  name: m?.medicineName,
  time: m?.reminderTime,
  status: capStatus(m?.status),
  refillCount: typeof m?.adherenceCount === 'number' ? m.adherenceCount : 0,
});

const toApiMed = (d: any = {}) => ({
  medicineName: d.medicineName ?? d.name,
  dosage: d.dosage,
  frequency: d.frequency,
  reminderTime: d.reminderTime ?? d.time,
  refillDate: d.refillDate,
});

export const medicationApi = {
  list: async () => {
    const { medications } = await apiClient.get<{ medications: any[] }>('/api/medications');
    const ui = (medications || []).map(toUiMed);
    // Existing healthStore reads `result?.medicines` — return both keys for safety.
    return { medicines: ui, medications: ui };
  },
  add: async (data: any) => {
    const { medication } = await apiClient.post<{ medication: any }>('/api/medications', toApiMed(data));
    return { medication: toUiMed(medication), medicine: toUiMed(medication) };
  },
  update: async (id: string, patch: any) => {
    const body = patch?.status
      ? { ...toApiMed(patch), status: String(patch.status).toLowerCase() }
      : toApiMed(patch);
    const { medication } = await apiClient.put<{ medication: any }>(`/api/medications/${id}`, body);
    return { medication: toUiMed(medication) };
  },
  delete: (id: string) => apiClient.delete<{ id: string }>(`/api/medications/${id}`),
  markTaken: async (id: string) => {
    const { medication } = await apiClient.patch<{ medication: any }>(`/api/medications/${id}/taken`);
    return { medication: toUiMed(medication) };
  },
};
export const medicineApi = medicationApi; // legacy alias

// ─── Recovery ───
export const recoveryApi = {
  list: () => apiClient.get<{ entries: any[] }>('/api/recovery'),
  add: (data: { sleepHours: number; hydrationLevel: number; steps: number; mood: string; notes?: string }) =>
    apiClient.post<{ entry: any }>('/api/recovery', data),
  update: (id: string, patch: any) => apiClient.put<{ entry: any }>(`/api/recovery/${id}`, patch),
  delete: (id: string) => apiClient.delete<{ id: string }>(`/api/recovery/${id}`),
};

// ─── Analytics ───
export const analyticsApi = {
  dashboard: () => apiClient.get<any>('/api/analytics/dashboard'),
  recoveryTrends: () => apiClient.get<{ trends: any[] }>('/api/analytics/recovery-trends'),
  adherence: () => apiClient.get<any>('/api/analytics/adherence'),
  mood: () => apiClient.get<any>('/api/analytics/mood'),
};

// ─── AI (existing) ───
export const aiApi = {
  motivation: (data: { mood: string; recoveryScore: number }) =>
    apiClient.post<{ message: string; disclaimer: string }>('/api/ai/motivation', data),
  wellnessSummary: (data: any) =>
    apiClient.post<{ insight: string; disclaimer: string }>('/api/ai/wellness-summary', data),
  recoveryInsight: (data: any) =>
    apiClient.post<{ insight: string; disclaimer: string }>('/api/ai/recovery-insight', data),
  chat: (message: string, userId?: string) => apiClient.post('/api/ai/chat', { message, userId }), // legacy
};

// ─── Records (file uploads) — exposed as `reportApi` to match existing store/UI ───
export const reportApi = {
  list: async () => {
    const { records } = await apiClient.get<{ records: any[] }>('/api/records');
    // Existing healthStore + Reports UI read `result.reports` and `record.uploadedAt`.
    return { reports: records || [] };
  },
  upload: async (file: File, title?: string, type?: string) => {
    const fd = new FormData();
    fd.append('file', file);
    if (title) fd.append('title', title); // ignored by backend, kept for legacy callers
    if (type) fd.append('type', type);
    const { record } = await apiClient.post<{ record: any }>('/api/records/upload', fd);
    return {
      record,
      // Convenience aliases so the existing Reports UI can render without changes:
      title: title || record?.originalName,
      type: type || null,
      uploadedAt: record?.uploadedAt,
      url: record?.filePath ? `${API_BASE}/${record.filePath}` : null,
    };
  },
  delete: (id: string) => apiClient.delete<{ id: string }>(`/api/records/${id}`),
  fileUrl: (record: { filePath?: string }) =>
    record?.filePath ? `${API_BASE}/${record.filePath}` : null,
};

// ─── Legacy stub exports (kept so existing imports compile) ───
export const userApi = profileApi;
export const maleApi = analyticsApi;
export const femaleApi = analyticsApi;
export const pregnancyApi = analyticsApi;
export const notificationApi = {} as any;
export const insightApi = {} as any;
export const searchApi = {} as any;

export default apiClient;
