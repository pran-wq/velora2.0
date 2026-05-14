import { useApp } from '../context/AppContext';
import PregnancyHome from './pregnancy-dynamics/Home';
import FemaleHome from './female-dynamics/Home';
import MaleHome from './male-dynamics/Home';

export default function Home() {
  const { profile } = useApp();

  if (!profile) return null;

  if (profile.isPregnant) {
    return <PregnancyHome />;
  }

  if (profile?.gender?.toLowerCase() === 'female') {
    return <FemaleHome />;
  }

  return <MaleHome />;
}
