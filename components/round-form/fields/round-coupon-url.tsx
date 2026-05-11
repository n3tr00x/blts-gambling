import { Controller, useFormContext } from 'react-hook-form';
import { Link } from 'lucide-react';

import { Field, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { NewRoundValues } from '@/schemas';

export function RoundCouponUrlField() {
  const { control } = useFormContext<NewRoundValues>();

  return (
    <Controller
      name="couponUrl"
      control={control}
      render={({ field }) => (
        <Field className="col-span-1">
          <FieldLabel htmlFor={field.name}>URL kuponu</FieldLabel>
          <InputGroup>
            <InputGroupInput
              {...field}
              value={field.value ? field.value : ''}
              placeholder="Wprowadź tutaj URL do kuponu"
            />
            <InputGroupAddon>
              <Link />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      )}
    />
  );
}
