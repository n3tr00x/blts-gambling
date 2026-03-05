'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MatchdayMonth } from '@/lib/supabase/database';
import { formatToLongMonthYear } from '@/lib/utilities/date';

type LeaderboardMonthSelectorProps = {
  searchedMonth?: string;
  months: MatchdayMonth[];
};

export function LeaderboardMonthSelector({
  months,
  searchedMonth,
}: LeaderboardMonthSelectorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const monthSelectorChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('month', value);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select
      defaultValue={searchedMonth || months[0].monthKey || ''}
      onValueChange={monthSelectorChange}
    >
      <SelectTrigger className="mb-2 w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {months?.map(month => (
          <SelectItem key={month.monthKey} value={month.monthKey || ''}>
            {formatToLongMonthYear(month.monthKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
