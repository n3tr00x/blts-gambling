import { TopLeaguePerPlayerChart } from '@/components/charts/top-league-per-player';
import { getTopLeaguePerPlayer } from '@/lib/supabase/queries/charts';

export default async function TopLeagueHitRatePage() {
  const data = await getTopLeaguePerPlayer(15);

  return <TopLeaguePerPlayerChart data={data} />;
}
