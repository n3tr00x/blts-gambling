'use client';

import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type CorrectFilterSelectProps = {
  correct: boolean | undefined;
  onCorrectChange: (value: boolean | undefined) => void;
};

export function CorrectFilterSelect({
  correct,
  onCorrectChange,
}: CorrectFilterSelectProps) {
  const correctValue = correct === true ? 'true' : correct === false ? 'false' : '';

  const correctChangeHandler = (value: string) => {
    if (value === 'true') {
      onCorrectChange(true);
    } else if (value === 'false') {
      onCorrectChange(false);
    } else {
      onCorrectChange(undefined);
    }
  };

  return (
    <Field>
      <FieldLabel htmlFor="correct-select">Czy trafione?</FieldLabel>
      <Select value={correctValue} onValueChange={correctChangeHandler}>
        <SelectTrigger id="correct-select" className="w-full">
          <SelectValue placeholder="Wybierz opcję" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Trafione</SelectItem>
          <SelectItem value="false">Nietrafione</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}
