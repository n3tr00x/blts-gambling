import { Row } from '@tanstack/react-table';

import { PlayedRound } from '@/lib/supabase/database';
import { formatDateToPolishLong } from '@/lib/utilities/date';

export function CouponMatchDateCell({ row }: { row: Row<PlayedRound> }) {
  const { matchDate } = row.original;

  return <span>{formatDateToPolishLong(matchDate)}</span>;
}
