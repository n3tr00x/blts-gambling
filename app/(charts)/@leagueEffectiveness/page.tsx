import { LeagueEffectivenessChart } from '@/components/charts/league-effectiveness';
import { getLeagueEffectiveness } from '@/lib/supabase/queries';

export default async function EffectivityPage() {
  const leagues = await getLeagueEffectiveness(10);
  const sortedData = [...leagues].sort((a, b) => {
    const effectivenessA = (a.hitCount / a.pickCount) * 100;
    const effectivenessB = (b.hitCount / b.pickCount) * 100;
    return effectivenessB - effectivenessA;
  });

  return <LeagueEffectivenessChart data={sortedData} />;
}
