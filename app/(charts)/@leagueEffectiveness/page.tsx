import { ChartNoDataFallback } from '@/components/charts/chart-no-data-state';
import { LeagueEffectivenessChart } from '@/components/charts/league-effectiveness';
import { getLeagueEffectiveness } from '@/lib/supabase/queries';

export default async function EffectivityPage() {
  const leagues = await getLeagueEffectiveness(10, 10);

  if (!leagues.length) {
    return <ChartNoDataFallback title="Największa skuteczność wg lig" />;
  }

  return <LeagueEffectivenessChart data={leagues} />;
}
