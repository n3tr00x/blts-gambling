import { BetsPerLeagueChart } from '@/components/charts/bets-per-league-chart';
import { getTopPickedLeagues } from '@/lib/supabase/queries';

export default async function EffectivityPage() {
  const picks = await getTopPickedLeagues(10);

  return <BetsPerLeagueChart data={picks} />;
}
