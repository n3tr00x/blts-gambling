import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { parseBoolean, parseNumber, parseNumberArray } from '@/lib/utilities/filters';
import { RoundsFilters } from '@/types';

const readFilters = (searchParams: URLSearchParams): RoundsFilters => ({
  correct: parseBoolean(searchParams.get('correct')),
  roundNumbers: parseNumberArray(searchParams.get('roundNumbers')),
  seasonId: parseNumber(searchParams.get('seasonId')),
  roundTypeId: parseNumber(searchParams.get('roundTypeId')),
});

const buildFilterParams = (searchParams: URLSearchParams, filters: RoundsFilters) => {
  const searchQueryParams = new URLSearchParams(searchParams);

  Object.entries(filters).forEach(([name, value]) => {
    if (
      typeof value === 'boolean' ||
      typeof value === 'number' ||
      typeof value === 'string'
    ) {
      searchQueryParams.set(name, value.toString());
    } else if (Array.isArray(value) && value.length > 0) {
      searchQueryParams.set(name, value.join(','));
    } else {
      searchQueryParams.delete(name);
    }
  });

  return searchQueryParams;
};

export const useRoundFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);

  const setRoundFilter = useCallback(
    (filters: RoundsFilters) => {
      const builtSearchParams = buildFilterParams(searchParams, filters);
      const queryString = builtSearchParams.toString();
      router.push(`/rounds?${queryString}`);
    },
    [router, searchParams],
  );

  const clearRoundFilters = useCallback(() => {
    router.replace('/rounds');
  }, [router]);

  return {
    filters,
    setRoundFilter,
    clearRoundFilters,
  };
};
