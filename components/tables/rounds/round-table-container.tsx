import { notFound } from 'next/navigation';

import { RoundViewTable } from '@/components/tables/rounds/round-view-table';
import { RoundsFilterPopover } from '@/components/tables/rounds/rounds-filter-popover';
import { RoundsPagination } from '@/components/tables/rounds/rounds-pagination';
import { AddRoundButton } from '@/components/ui/add-round-button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  getAllSeasons,
  getCurrentUser,
  getPlayedRounds,
  getRoundTypes,
} from '@/lib/supabase/queries';
import { parseBoolean, parseNumber, parseNumberArray } from '@/lib/utilities/filters';
import { RoundsFilters } from '@/types';

type SearchParams = {
  page?: string;
  correct?: string;
  roundNumbers?: string;
  roundTypeId?: string;
  seasonId?: string;
};

type RoundTableContainerProps = {
  searchQueryParams: SearchParams;
  roundsPerPage: number;
};

export async function RoundTableContainer({
  searchQueryParams,
  roundsPerPage,
}: RoundTableContainerProps) {
  const user = await getCurrentUser();
  const [seasons, roundTypes] = await Promise.all([getAllSeasons(), getRoundTypes()]);

  const page = parseNumber(searchQueryParams.page) || 1;

  const filters: RoundsFilters = {
    correct: parseBoolean(searchQueryParams.correct),
    roundNumbers: parseNumberArray(searchQueryParams.roundNumbers),
    roundTypeId: parseNumber(searchQueryParams.roundTypeId),
    seasonId: parseNumber(searchQueryParams.seasonId),
  };

  const { data: rounds, count } = await getPlayedRounds({
    page,
    roundsPerPage,
    filters,
  });

  if (!rounds) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardAction className="flex gap-2">
          <RoundsFilterPopover seasons={seasons} roundTypes={roundTypes} />
          {user && <AddRoundButton />}
        </CardAction>
      </CardHeader>
      <CardContent>
        <RoundViewTable isLoggedIn={!!user} rounds={rounds} />
      </CardContent>
      <CardFooter>
        <RoundsPagination
          page={page}
          count={count}
          roundsPerPage={roundsPerPage}
          // filters={filters}
        />
      </CardFooter>
    </Card>
  );
}
