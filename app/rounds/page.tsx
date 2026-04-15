import { Suspense } from 'react';

import { RoundTableContainer } from '@/components/tables/rounds/round-table-container';
import { RoundsTableFallback } from '@/components/tables/rounds/rounds-table-fallback';

type SearchParams = {
  page?: string;
  correct?: string;
  roundNumbers?: string;
  roundTypeId?: string;
  seasonId?: string;
};

type RoundViewPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function RoundsViewPage({ searchParams }: RoundViewPageProps) {
  const ROUNDS_PER_PAGE = 15;
  const searchQueryParams = await searchParams;

  return (
    <Suspense key={JSON.stringify(searchQueryParams)} fallback={<RoundsTableFallback />}>
      <RoundTableContainer
        searchQueryParams={searchQueryParams}
        roundsPerPage={ROUNDS_PER_PAGE}
      />
    </Suspense>
  );
}
