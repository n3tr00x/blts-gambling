import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

type CouponAvailableBadgeProps = {
  couponUrl: string;
};

export function CouponAvailableBadge({ couponUrl }: CouponAvailableBadgeProps) {
  return (
    <Badge asChild className="cursor-pointer bg-blue-500 text-xs hover:bg-blue-600">
      <Link href={couponUrl} target="_blank" rel="noopener noreferrer">
        <LinkIcon className="h-3 w-3" />
        Kupon dostępny
      </Link>
    </Badge>
  );
}
