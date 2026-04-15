'use client';

import { Tag } from 'emblor';

import { FilterActions } from '@/components/filters/filter-actions';
import { FilterBadges } from '@/components/filters/filter-badges';
import { FilterForm } from '@/components/filters/filter-form';
import { FilterPopoverTrigger } from '@/components/filters/filter-popover-trigger';
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRoundFilterForm } from '@/hooks/use-round-filter-form';
import { useRoundFilters } from '@/hooks/use-round-filters';
import { RoundType, Season } from '@/lib/supabase/database';
import { parseNumbersArrayToTagArray } from '@/lib/utilities/filters';

type RoundsFilterPopoverProps = {
  seasons: Season[];
  roundTypes: RoundType[];
};

export type RoundFilterFormState = {
  correct?: boolean;
  roundNumbers: Tag[];
  seasonId?: number;
  roundTypeId?: number;
};

const countActiveFilters = (filters: RoundFilterFormState) => {
  return [
    filters.correct !== undefined,
    filters.roundNumbers && filters.roundNumbers.length > 0,
    filters.seasonId !== undefined,
    filters.roundTypeId !== undefined,
  ].filter(Boolean).length;
};

export function RoundsFilterPopover({ seasons, roundTypes }: RoundsFilterPopoverProps) {
  const { filters, setRoundFilter, clearRoundFilters } = useRoundFilters();

  const {
    filters: formFilters,
    setFilter,
    resetForm,
  } = useRoundFilterForm({
    initialFilters: {
      correct: filters.correct,
      roundNumbers: parseNumbersArrayToTagArray(filters.roundNumbers),
      seasonId: filters.seasonId,
      roundTypeId: filters.roundTypeId,
    },
  });

  const applyFiltersHandler = () => {
    setRoundFilter({
      correct: formFilters.correct,
      roundNumbers: formFilters.roundNumbers.map(tag => parseInt(tag.text)),
      seasonId: formFilters.seasonId,
      roundTypeId: formFilters.roundTypeId,
    });
  };

  const clearAllFilters = () => {
    resetForm();
    clearRoundFilters();
  };

  const clearFilterHandler = (
    filter: keyof RoundFilterFormState,
    value: RoundFilterFormState[keyof RoundFilterFormState],
  ) => {
    setFilter(filter, value);
  };

  const activeFiltersCount = countActiveFilters(formFilters);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {FilterPopoverTrigger.bind(null, { activeFiltersCount })()}
      </PopoverTrigger>
      <PopoverContent className="min-w-128">
        <PopoverHeader className="py-4 text-base">
          <PopoverTitle>Filtruj rozegrane rundy</PopoverTitle>
          <FilterBadges
            seasons={seasons}
            roundTypes={roundTypes}
            formFilters={formFilters}
            onClearFilter={clearFilterHandler}
          />
        </PopoverHeader>
        <div className="space-y-4">
          <FilterForm
            seasons={seasons}
            roundTypes={roundTypes}
            formFilters={formFilters}
            onSetFilter={setFilter}
          />
          <FilterActions
            hasActiveFilters={activeFiltersCount > 0}
            onApplyFilters={applyFiltersHandler}
            onClearAllFilters={clearAllFilters}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
