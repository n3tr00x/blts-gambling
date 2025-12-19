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
import { formatDateString } from '@/utilities/formatDateString';

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
      defaultValue={searchedMonth || months[0].month_key || ''}
      onValueChange={monthSelectorChange}
    >
      <SelectTrigger className="mb-2 w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {months?.map(month => (
          <SelectItem key={month.month_key} value={month.month_key || ''}>
            {formatDateString(month.month_key || '')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
