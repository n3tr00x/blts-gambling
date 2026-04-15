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
import { RoundType } from '@/lib/supabase/database';

type RoundTypesFilterSelectProps = {
  roundTypes: RoundType[];
  value?: number;
  onRoundTypeChange: (roundTypeId: number) => void;
};

export function RoundTypesFilterSelect({
  roundTypes,
  value,
  onRoundTypeChange,
}: RoundTypesFilterSelectProps) {
  return (
    <Field>
      <FieldLabel>Rodzaj rundy</FieldLabel>
      <Select
        value={value ? value.toString() : ''}
        onValueChange={value => onRoundTypeChange(parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Wybierz sezon" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {roundTypes.map(roundType => (
              <SelectItem key={roundType.id} value={roundType.id.toString()}>
                {roundType.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
