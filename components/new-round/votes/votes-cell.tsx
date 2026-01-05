'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { CheckedState } from '@radix-ui/react-checkbox';
import clsx from 'clsx';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TableCell } from '@/components/ui/table';
import { Tables } from '@/lib/supabase/database/database.generated';
import { VotesTableFormValues } from '@/schemas/votes-form.schema';

type VotesCellTableProps = {
  voterId: number;
  target: Tables<'players'>;
  rowIndex: number;
  columnIndex: number;
  votesFor: number[];
  maxVotes: number;
};

export function VotesCellTable({
  voterId,
  target,
  rowIndex,
  columnIndex,
  votesFor,
  maxVotes,
}: VotesCellTableProps) {
  const { control } = useFormContext<VotesTableFormValues>();

  const isChecked = votesFor.includes(target.id);
  const isSelfVote = voterId === target.id;
  // const isLimitReached = votesFor.length >= maxVotes;

  // const isDisabled = isSelfVote || (!isChecked && isLimitReached);
  const isDisabled = isSelfVote;

  const checkChangeHandler = ({
    checked,
    value,
    targetId,
    maxVotes,
    onChange,
  }: {
    checked: CheckedState;
    value: number[];
    targetId: number;
    maxVotes: number;
    onChange: (value: number[]) => void;
  }) => {
    // Odznaczanie
    if (!checked) {
      onChange(value.filter(id => id !== targetId));
      return;
    }

    // Zaznaczanie
    if (value.includes(targetId)) {
      return;
    }

    // Mamy miejsce → dodajemy normalnie
    if (value.length < maxVotes) {
      onChange([...value, targetId]);
      return;
    }

    // Przekroczony limit → usuwamy najstarszy i dodajemy nowy
    const [, ...rest] = value;

    onChange([...rest, targetId]);
    // if (checked) {
    //   if (value.length < maxVotes) {
    //     onChange([...value, targetId]);
    //   }
    //   return;
    // }

    // onChange(value.filter(id => id !== targetId));
  };

  return (
    <TableCell className="relative p-0">
      <Controller
        name={`votes.${rowIndex}.votesFor`}
        control={control}
        render={({ field }) => (
          <Label
            htmlFor={`vote-${rowIndex}-${columnIndex}`}
            className={clsx(
              'absolute inset-0 flex items-center justify-center',
              isDisabled ? 'bg-muted cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            <Checkbox
              id={`vote-${rowIndex}-${columnIndex}`}
              checked={isChecked}
              disabled={isDisabled}
              onCheckedChange={checked =>
                checkChangeHandler({
                  checked,
                  value: field.value,
                  targetId: target.id,
                  maxVotes,
                  onChange: field.onChange,
                })
              }
            />
          </Label>
        )}
      />
    </TableCell>
  );
}
