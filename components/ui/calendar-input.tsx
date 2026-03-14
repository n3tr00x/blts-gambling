'use client';

import { useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateToISO } from '@/lib/utilities';
import { NewRoundValues } from '@/schemas';

type CalendarInputProps = { field: ControllerRenderProps<NewRoundValues, 'roundDate'> };

export function CalendarInput({ field }: CalendarInputProps) {
  const [open, setOpen] = useState(false);

  const parsedDate = field.value ? new Date(field.value) : undefined;

  console.log('calendar input render', parsedDate);
  console.log('formatted date', formatDateToISO(new Date(field.value)));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={field.name}
          variant="outline"
          className="text-muted-foreground justify-between font-normal"
        >
          {parsedDate
            ? parsedDate.toLocaleDateString()
            : 'Wybierz datę rozegrania kuponu'}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          {...field}
          mode="single"
          captionLayout="dropdown"
          disabled={{ after: new Date() }}
          selected={field.value}
          onSelect={date => {
            field.onChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
