import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TopLeaguePerPlayer } from '@/lib/supabase/database';

import { TopLeaguePerPlayerCard } from './top-league-per-player-card';

type TopLeaguePerPlayerChartProps = {
  data: TopLeaguePerPlayer[];
};

export function TopLeaguePerPlayerChart({ data }: TopLeaguePerPlayerChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Najwyższy procent trafionych picków w lidze dla każdego gracza
        </CardTitle>
        <CardDescription>
          Analiza pokazująca, w których ligach poszczególni gracze mieli najwyższy procent
          trafionych picków, przy minimalnej liczbie 15 picków w danej lidze.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid min-h-[550px] gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map(item => (
            <TopLeaguePerPlayerCard key={item.player} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
