import { Row } from '@tanstack/react-table';

import { HitBadge } from '@/components/ui/hit-badge';
import { RoundResult } from '@/lib/supabase/database';

type RoundColumn = Omit<RoundResult, 'season_name'>;

export function HitCell({ row }: { row: Row<RoundColumn> }) {
  const { correct } = row.original;

  return <HitBadge isHit={correct} />;
}
