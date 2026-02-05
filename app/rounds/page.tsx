import { RoundViewTable } from '@/components/tables/rounds/round-view-table';
import { RoundsPagination } from '@/components/tables/rounds/rounds-pagination';
import { AddRoundButton } from '@/components/ui/add-round-button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { getPlayedRounds } from '@/lib/supabase/queries';
import { getCurrentUser } from '@/lib/supabase/queries/auth';

type RoundViewPageProps = {
  searchParams: Promise<{ page?: number }>;
};

export default async function RoundsViewPage({ searchParams }: RoundViewPageProps) {
  const { page } = await searchParams;
  const user = await getCurrentUser();

  const ROUNDS_PER_PAGE = 15;
  const currentPage = Number(page) || 1;

  const { data: rounds, count } = await getPlayedRounds({
    page: currentPage,
    roundsPerPage: ROUNDS_PER_PAGE,
  });

  return (
    <Card>
      <CardHeader>
        <CardAction>{user && <AddRoundButton />}</CardAction>
      </CardHeader>
      <CardContent>
        <RoundViewTable isLoggedIn={!!user} rounds={rounds} />
      </CardContent>
      <CardFooter>
        <RoundsPagination page={page} count={count} roundsPerPage={ROUNDS_PER_PAGE} />
      </CardFooter>
    </Card>
  );
}
