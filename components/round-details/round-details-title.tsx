import { CardTitle } from '@/components/ui/card';
import { CouponAvailableBadge } from '@/components/ui/coupon-available-badge';
import { HitBadge } from '@/components/ui/hit-badge';

type RoundDetailsHeaderProps = {
  roundNumber: number;
  isHit: boolean;
  couponUrl: string | undefined;
};

export function RoundDetailsTitle({
  roundNumber,
  isHit,
  couponUrl,
}: RoundDetailsHeaderProps) {
  return (
    <CardTitle className="font-secondary flex items-center gap-2 text-2xl tracking-wide">
      <span>Zagrana runda nr {roundNumber}</span>
      <HitBadge isHit={isHit} />
      {couponUrl && <CouponAvailableBadge couponUrl={couponUrl} />}
    </CardTitle>
  );
}
