import { XIcon } from 'lucide-react';

import { RoundFilterFormState } from '@/components/tables/rounds/rounds-filter-popover';
import { Badge } from '@/components/ui/badge';
import { RoundType, Season } from '@/lib/supabase/database';

type FilterBadgesProps = {
  seasons: Season[];
  roundTypes: RoundType[];
  formFilters: RoundFilterFormState;
  onClearFilter: (
    filter: keyof RoundFilterFormState,
    value: RoundFilterFormState[keyof RoundFilterFormState],
  ) => void;
};

export function FilterBadges({
  seasons,
  roundTypes,
  formFilters,
  onClearFilter,
}: FilterBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {formFilters.correct !== undefined && (
        <Badge
          variant="default"
          className="font-secondary cursor-pointer hover:opacity-80"
          onClick={() => onClearFilter('correct', undefined)}
        >
          Czy trafiony?{' '}
          <span className="font-semibold">
            {formFilters.correct ? 'Trafione' : 'Nietrafione'}
          </span>
          <XIcon data-icon="inline-end" />
        </Badge>
      )}
      {formFilters.seasonId !== undefined && (
        <Badge
          variant="default"
          className="font-secondary cursor-pointer hover:opacity-80"
          onClick={() => onClearFilter('seasonId', undefined)}
        >
          Sezon:
          <span className="font-semibold">
            {seasons.find(s => s.id === formFilters.seasonId)?.name}
          </span>
        </Badge>
      )}
      {formFilters.roundNumbers && formFilters.roundNumbers.length > 0 && (
        <Badge
          variant="default"
          className="font-secondary cursor-pointer hover:opacity-80"
          onClick={() => onClearFilter('roundNumbers', [])}
        >
          Rundy:
          <span className="font-semibold">
            {formFilters.roundNumbers.map(tag => tag.text).join(', ')}
          </span>
        </Badge>
      )}
      {formFilters.roundTypeId !== undefined && (
        <Badge
          variant="default"
          className="font-secondary cursor-pointer hover:opacity-80"
          onClick={() => onClearFilter('roundTypeId', undefined)}
        >
          Typ rundy:
          <span className="font-semibold">
            {roundTypes.find(rt => rt.id === formFilters.roundTypeId)?.name}
          </span>
        </Badge>
      )}
    </div>
  );
}
