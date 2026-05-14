// ─── Aether API Client ───

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

interface ApiOptions extends RequestInit {
  body?: any;
}

async function api<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { body, headers = {}, ...rest } = options;

  const config: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string) => api<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: any) => api<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body: any) => api<T>(endpoint, { method: 'PUT', body }),
  delete: <T>(endpoint: string) => api<T>(endpoint, { method: 'DELETE' }),
};

// Sub-APIs
export const aiApi = {
  chat: (message: string, userId?: string) => apiClient.post('/api/ai/chat', { message, userId }),
};

// Empty mocks for stores to prevent build errors
export const authApi = {} as any;
export const userApi = {} as any;
export const reportApi = {} as any;
export const medicineApi = {} as any;
export const maleApi = {} as any;
export const femaleApi = {} as any;
export const pregnancyApi = {} as any;
export const profileApi = {} as any;
export const notificationApi = {} as any;
export const insightApi = {} as any;
export const searchApi = {} as any;

export default apiClient;
