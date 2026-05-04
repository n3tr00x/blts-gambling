'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TopPickedLeaguesByPlayers } from '@/lib/supabase/database';

import { TopPickedLeagueCard } from './top-picked-league-card';

type TopPickedLeaguesByPlayersProps = {
  data: TopPickedLeaguesByPlayers[];
};

export function TopPickedLeaguesByPlayersChart({ data }: TopPickedLeaguesByPlayersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Najczęściej pickowana liga przez gracza
        </CardTitle>
        <CardDescription>
          Pierwsza liga dla każdego gracza z procentem udziału
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid min-h-[550px] gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map(item => (
            <TopPickedLeagueCard key={item.player} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
