import { BetsPerLeagueChart } from '@/components/charts/bets-per-league-chart';
import { ChartNoDataFallback } from '@/components/charts/chart-no-data-state';
import { getTopPickedLeagues } from '@/lib/supabase/queries';

export default async function EffectivityPage() {
  const picks = await getTopPickedLeagues(10);

  if (!picks.length) {
    return <ChartNoDataFallback title="TOP 10: Ilość typów wg lig" />;
  }

  return <BetsPerLeagueChart data={picks} />;
}
