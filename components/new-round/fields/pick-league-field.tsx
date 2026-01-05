import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { LeaguesCombobox } from '@/components/ui/leagues-combobox';
import { Tables } from '@/lib/supabase/database/database.generated';
import { NewRoundValues } from '@/schemas';

type PickLeagueFieldProps = {
  leagues: Tables<'leagues'>[];
  index: number;
};

export function PickLeagueField({ leagues, index }: PickLeagueFieldProps) {
  const { control } = useFormContext<NewRoundValues>();

  return (
    <Controller
      control={control}
      name={`picks.${index}.leagueId`}
      render={({ field, fieldState }) => (
        <Field className="col-span-1" data-invalid={fieldState.invalid}>
          <FieldLabel>Liga</FieldLabel>
          <LeaguesCombobox
            leagues={leagues}
            value={field.value}
            fieldState={fieldState}
            onSelectLeague={field.onChange}
          />
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
