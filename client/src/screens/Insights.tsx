import { useApp } from '../context/AppContext';
import FemaleInsights from './female-dynamics/Insights';
import MaleInsights from './male-dynamics/Insights';
import PregnancyInsights from './pregnancy-dynamics/Insights';

export default function Insights() {
  const { profile } = useApp();

  if (!profile) return null;

  if (profile.isPregnant) {
    return <PregnancyInsights />;
  }

  if (profile?.gender?.toLowerCase() === 'female') {
    return <FemaleInsights />;
  }

  return <MaleInsights />;
}
