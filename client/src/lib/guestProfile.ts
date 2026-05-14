import type { UserProfile } from '../types';

/** Local-only default when no saved profile exists (MVP, no backend auth). */
export const DEFAULT_GUEST_PROFILE: UserProfile = {
  name: 'Guest',
  gender: 'Male',
  age: 28,
  weight: 70,
  bloodGroup: 'O+',
  isPregnant: false,
};
