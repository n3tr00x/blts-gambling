import { CorrectFilterSelect } from '@/components/tables/rounds/correct-filter-select';
import { RoundNumberFilter } from '@/components/tables/rounds/round-number-filter';
import { RoundTypesFilterSelect } from '@/components/tables/rounds/round-types-filter-select';
import { SeasonFilterSelect } from '@/components/tables/rounds/season-filter-select';
import { RoundType, Season } from '@/lib/supabase/database';

import { RoundFilterFormState } from '../tables/rounds/rounds-filter-popover';

type FilterFormProps = {
  seasons: Season[];
  roundTypes: RoundType[];
  formFilters: RoundFilterFormState;
  onSetFilter: (
    filter: keyof RoundFilterFormState,
    value: RoundFilterFormState[keyof RoundFilterFormState],
  ) => void;
};

export function FilterForm({
  seasons,
  roundTypes,
  formFilters,
  onSetFilter,
}: FilterFormProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <CorrectFilterSelect
        correct={formFilters.correct}
        onCorrectChange={value => onSetFilter('correct', value)}
      />
      <SeasonFilterSelect
        seasons={seasons}
        value={formFilters.seasonId}
        onSeasonChange={value => onSetFilter('seasonId', value)}
      />
      <div className="col-span-2">
        <RoundNumberFilter
          value={formFilters.roundNumbers}
          onSetTags={newTags => onSetFilter('roundNumbers', newTags)}
        />
      </div>
      <div className="col-span-2">
        <RoundTypesFilterSelect
          roundTypes={roundTypes}
          value={formFilters.roundTypeId}
          onRoundTypeChange={value => onSetFilter('roundTypeId', value)}
        />
      </div>
    </div>
  );
}
