import { ChartNoDataFallback } from '@/components/charts/chart-no-data-state';
import { TopLeaguePerPlayerChart } from '@/components/charts/top-league-per-player';
import { getTopLeaguePerPlayer } from '@/lib/supabase/queries/charts';

export default async function TopLeagueHitRatePage() {
  const data = await getTopLeaguePerPlayer(15);

  if (!data.length) {
    return (
      <ChartNoDataFallback title="Najwyższy procent trafionych picków w lidze dla każdego gracza" />
    );
  }

  return <TopLeaguePerPlayerChart data={data} />;
}
