'use client';

import { useState } from 'react';
import { ControllerFieldState } from 'react-hook-form';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tables } from '@/lib/supabase/database/database.generated';
import { cn } from '@/lib/utilities/shadcn';

type LeaguesComboboxProps = {
  leagues: Tables<'leagues'>[];
  value: number | null;
  fieldState: ControllerFieldState;
  onSelectLeague: (leagueId: number | null) => void;
};

export function LeaguesCombobox({
  leagues,
  value,
  fieldState,
  onSelectLeague,
}: LeaguesComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedLeague = leagues.find(league => league.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={fieldState.invalid}
        >
          {selectedLeague
            ? `${selectedLeague.name} (${selectedLeague.country} ${selectedLeague.level})`
            : 'Wybierz ligę...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-104 p-0" align="start">
        <Command>
          <CommandInput placeholder="Szukaj ligi..." className="h-9" />
          <CommandList>
            <CommandEmpty>Nie znaleziono ligi.</CommandEmpty>
            <CommandGroup>
              {leagues.map(league => (
                <CommandItem
                  key={league.id}
                  value={league.id.toString()}
                  // value={value?.toString()}
                  keywords={[league.name, league.country]}
                  // onSelect={() => {
                  //   setValue(prev => (prev === league.id ? null : league.id));
                  //   setOpen(false);
                  // }}
                  onSelect={() => {
                    onSelectLeague(league.id);
                    setOpen(false);
                  }}
                >
                  <span className="font-bold">{league.name}</span>({league.country}{' '}
                  {league.level})
                  <Check
                    className={cn(
                      'ml-auto',
                      value === league.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
