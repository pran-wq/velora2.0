// ─── Firebase Client (Offline-Safe) ───
// Works without firebase npm package — all auth goes through dev mode
// When firebase is installed, real auth will work

export const isFirebaseConfigured = false;

export async function signUpWithEmail(email: string, _password: string) {
  return { uid: `dev_${Date.now()}`, email, displayName: email.split('@')[0] };
}

export async function signInWithEmail(email: string, _password: string) {
  return { uid: `dev_${email.replace(/[^a-z0-9]/gi, '')}`, email, displayName: email.split('@')[0] };
}

export async function signInWithGoogle() {
  return { uid: `dev_google_${Date.now()}`, email: 'user@aether.health', displayName: 'Aether User' };
}

export async function signOut() {
  localStorage.removeItem('aether-dev-token');
}

export async function getIdToken(): Promise<string> {
  return localStorage.getItem('aether-dev-token') || 'dev_anonymous';
}

export async function sendPasswordReset(_email: string) {
  console.log('Password reset: Firebase not configured');
}
