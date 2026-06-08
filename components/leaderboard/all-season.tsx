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

  const rankingWithPosition = ranking.map((player, index) => ({
    ...player,
    position: index + 1,
  }));

  const selectedSeason =
    seasons.find(season => season.id === +searchedSeason) ??
    seasons.find(season => season.isCurrent === true) ??
    seasons[0];

  const isFirstSeason = selectedSeason.id === 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Ranking sezonu</CardTitle>
        <CardDescription>
          {`od ${selectedSeason.startDate} do ${selectedSeason.endDate}`}
          {isFirstSeason && ' (ranking oparty tylko na trafionych typach)'}
        </CardDescription>
        <CardAction>
          <SeasonSelector seasons={seasons} searchedSeason={searchedSeason} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={rankingWithPosition} />
      </CardContent>
    </Card>
  );
}
