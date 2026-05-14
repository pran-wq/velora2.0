// ─── Auth Store (Zustand) ───
import { create } from '../lib/zustand-shim';
import { setAuthToken } from '../lib/api';
import { connectSocket, disconnectSocket } from '../lib/socket';

interface AuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  weight: number;
  bloodGroup: string;
  isPregnant: boolean;
  pregnancyMonth?: number;
  healthGoals: string[];
  accessibilityMode: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  login: (user, token) => {
    setAuthToken(token);
    localStorage.setItem('aether-dev-token', token);
    connectSocket(user.id);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    setAuthToken(null);
    localStorage.removeItem('aether-dev-token');
    localStorage.removeItem('aether-profile');
    disconnectSocket();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  updateProfile: (updates) => {
    const current = get().user;
    if (current) {
      set({ user: { ...current, ...updates } });
    }
  },
}));
