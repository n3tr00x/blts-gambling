import { LeagueEffectivenessChart } from '@/components/charts/league-effectiveness';
import { getLeagueEffectiveness } from '@/lib/supabase/queries';

export default async function EffectivityPage() {
  const leagues = await getLeagueEffectiveness(10, 10);

  return <LeagueEffectivenessChart data={leagues} />;
}
