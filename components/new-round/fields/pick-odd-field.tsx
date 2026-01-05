import { ChangeEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { NewRoundValues } from '@/schemas';

type PickOddFieldProps = {
  index: number;
};

export function PickOddField({ index }: PickOddFieldProps) {
  const { control } = useFormContext<NewRoundValues>();

  const oddValueChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void,
  ) => {
    const odd = Number(event.target.value);
    onChange(odd);
  };

  return (
    <Controller
      name={`picks.${index}.odd`}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="col-span-1" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Kurs</FieldLabel>
          <Input
            {...field}
            type="number"
            id={field.name}
            aria-invalid={fieldState.invalid}
            min={1}
            step={0.01}
            value={field.value ? String(field.value) : ''}
            onChange={event => oddValueChangeHandler(event, field.onChange)}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
