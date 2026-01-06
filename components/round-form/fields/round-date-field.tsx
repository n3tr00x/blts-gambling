'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { CalendarInput } from '@/components/ui/calendar-input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { NewRoundValues } from '@/schemas';

export function RoundDateField() {
  const { control } = useFormContext<NewRoundValues>();

  return (
    <Controller
      name="roundDate"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Data kuponu</FieldLabel>
          <CalendarInput field={field} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
