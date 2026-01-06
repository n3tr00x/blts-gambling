'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { NewRoundValues } from '@/schemas';

export function RoundHitField() {
  const { control } = useFormContext<NewRoundValues>();

  return (
    <Controller
      name="isHit"
      control={control}
      render={({ field }) => (
        <Field orientation="horizontal">
          <Checkbox
            id={field.name}
            name={field.name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <FieldLabel htmlFor={field.name} className="font-normal">
            Czy kupon został trafiony?
          </FieldLabel>
        </Field>
      )}
    />
  );
}
