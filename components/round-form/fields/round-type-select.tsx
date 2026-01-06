'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tables } from '@/lib/supabase/database/database.generated';
import { NewRoundValues } from '@/schemas';

type RoundTypeSelectProps = { roundTypes: Tables<'round_types'>[] };

export function RoundTypeSelect({ roundTypes }: RoundTypeSelectProps) {
  const {
    control,
    formState: { disabled },
  } = useFormContext<NewRoundValues>();

  return (
    <Controller
      name="roundTypeId"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Rodzaj kuponu</FieldLabel>
          <Select
            {...field}
            disabled={disabled}
            value={field.value ? field.value.toString() : ''}
            onValueChange={value => field.onChange(Number(value))}
          >
            <SelectTrigger aria-invalid={fieldState.invalid}>
              <SelectValue placeholder="Wybierz typ rundy" />
            </SelectTrigger>
            <SelectContent>
              {roundTypes.map(type => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
