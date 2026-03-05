import { columns } from '@/components/leaderboard/columns';
import { DataTable } from '@/components/leaderboard/data-table';
import { LeaderboardMonthSelector } from '@/components/leaderboard/leaderboard-month-selector';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getMatchdayMonths, getRankingByMonth } from '@/lib/supabase/queries';
import { formatToLongMonthYear } from '@/lib/utilities/date';

type MonthLeaderboardProps = {
  searchedMonth: string;
};

export async function MonthLeaderboard({ searchedMonth }: MonthLeaderboardProps) {
  const months = await getMatchdayMonths();
  const ranking = await getRankingByMonth(searchedMonth || months[0].monthKey || '');

  const monthLabel = formatToLongMonthYear(
    searchedMonth || months[0].monthKey || '',
  ).toLowerCase();

  return (
    <Card className="min-h-[450px] justify-center">
      <CardHeader>
        <CardTitle className="text-xl">Ranking miesiąca</CardTitle>
        <CardDescription>({monthLabel})</CardDescription>
        <CardAction>
          <LeaderboardMonthSelector months={months} searchedMonth={searchedMonth} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={ranking} />
      </CardContent>
    </Card>
  );
}
