import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MaleProfile from './male-dynamics/Profile';
import FemaleProfile from './female-dynamics/Profile';
import PregnancyProfile from './pregnancy-dynamics/Profile';

export default function Profile() {
  const { profile } = useApp();

  if (!profile) return <Navigate to="/login" />;

  if (profile.isPregnant) {
    return <PregnancyProfile />;
  }

  if (profile?.gender?.toLowerCase() === 'female') {
    return <FemaleProfile />;
  }

  return <MaleProfile />;
}
