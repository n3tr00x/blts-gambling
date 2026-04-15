'use client';

import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Season } from '@/lib/supabase/database';

type SeasonFilterSelectProps = {
  seasons: Season[];
  value?: number;
  onSeasonChange: (seasonId: number) => void;
};

export function SeasonFilterSelect({
  seasons,
  value,
  onSeasonChange,
}: SeasonFilterSelectProps) {
  return (
    <Field>
      <FieldLabel htmlFor="season-filter">Sezon</FieldLabel>
      <Select
        value={value ? value.toString() : ''}
        onValueChange={value => onSeasonChange(parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue id="season-filter" placeholder="Wybierz sezon" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {seasons.map(season => (
              <SelectItem key={season.id} value={season.id.toString()}>
                {season.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
