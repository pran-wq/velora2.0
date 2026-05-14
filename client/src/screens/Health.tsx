import { useApp } from '../context/AppContext';
import PregnancyHealth from './pregnancy-dynamics/Health';
import FemaleHealth from './female-dynamics/Health';
import MaleHealth from './male-dynamics/Health';

export default function Health() {
  const { profile } = useApp();

  if (!profile) return null;

  if (profile.isPregnant) {
    return <PregnancyHealth />;
  }

  if (profile?.gender?.toLowerCase() === 'female') {
    return <FemaleHealth />;
  }

  return <MaleHealth />;
}
