import { BadgeCheckIcon, BadgeXIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

type HitBadgeProps = {
  isHit: boolean;
};

export function HitBadge({ isHit }: HitBadgeProps) {
  return (
    <Badge
      className={`${isHit ? 'bg-green-400 text-xs' : undefined}`}
      variant={isHit ? 'default' : 'destructive'}
    >
      {isHit ? <BadgeCheckIcon /> : <BadgeXIcon />}
      {isHit ? 'Trafiony' : 'Nietrafiony'}
    </Badge>
  );
}
