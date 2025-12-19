import { columns } from '@/components/leaderboard/columns';
import { DataTable } from '@/components/leaderboard/data-table';
import { SeasonSelector } from '@/components/leaderboard/season-selector';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAllSeasons, getRankingBySeason } from '@/lib/supabase/queries';

type AllSeasonLeaderboardProps = {
  searchedSeason: string;
};

export async function AllSeasonLeaderboard({
  searchedSeason,
}: AllSeasonLeaderboardProps) {
  const seasons = await getAllSeasons();
  const ranking = await getRankingBySeason(+searchedSeason);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Ranking sezonu</CardTitle>
        <CardDescription>
          od {seasons[0].start_date} do {seasons[0].end_date}
        </CardDescription>
        <CardAction>
          <SeasonSelector seasons={seasons} searchedSeason={searchedSeason} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={ranking} />
      </CardContent>
    </Card>
  );
}
