import { ChartNoDataFallback } from '@/components/charts/chart-no-data-state';
import { TopPickedLeaguesByPlayersChart } from '@/components/charts/top-picked-leagues-by-players';
import { getTopPickedLeagueByPlayers } from '@/lib/supabase/queries/charts';

export default async function PlayerTopLeaguePage() {
  const data = await getTopPickedLeagueByPlayers();

  if (!data.length) {
    return <ChartNoDataFallback title="Najczęściej pickowana liga przez gracza" />;
  }

  return <TopPickedLeaguesByPlayersChart data={data} />;
}
