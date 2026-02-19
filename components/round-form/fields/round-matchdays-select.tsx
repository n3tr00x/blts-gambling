import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MatchdayForSelection } from '@/lib/supabase/database';
import { NewRoundValues } from '@/schemas';

type RoundPrimaryInfoProps = { matchdays: MatchdayForSelection[] };

export function RoundMatchdaysSelect({ matchdays }: RoundPrimaryInfoProps) {
  const {
    control,
    formState: { disabled },
  } = useFormContext<NewRoundValues>();

  return (
    <Controller
      control={control}
      name="relatedMatchdayId"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Powiązana runda</FieldLabel>
          <Select
            {...field}
            disabled={disabled}
            value={field.value ? field.value.toString() : ''}
            onValueChange={value => field.onChange(Number(value))}
          >
            <SelectTrigger aria-invalid={fieldState.invalid}>
              <SelectValue placeholder="Wybierz powiązaną rundę" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {matchdays.map(matchday => (
                  <SelectItem key={matchday.id} value={matchday.id.toString()}>
                    {`Runda ${matchday.roundNumber} (${matchday.roundType})`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
