'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SeasonWithCurrent } from '@/lib/supabase/database';

type LeaderboardMonthSelectorProps = {
  searchedSeason?: string;
  seasons: SeasonWithCurrent[];
};

export function SeasonSelector({
  searchedSeason = '',
  seasons,
}: LeaderboardMonthSelectorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSeason = seasons.find(season => season.is_current);

  const seasonSelectorChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('season', value);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select
      defaultValue={searchedSeason || currentSeason?.id.toString() || ''}
      onValueChange={seasonSelectorChange}
    >
      <SelectTrigger className="mb-2 w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {seasons?.map(season => (
          <SelectItem key={season.id} value={season.id.toString() || ''}>
            {season.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
