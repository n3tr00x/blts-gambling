import { CardTitle } from '@/components/ui/card';
import { HitBadge } from '@/components/ui/hit-badge';

type RoundDetailsHeaderProps = {
  roundNumber: number;
  isHit: boolean;
};

export function RoundDetailsTitle({ roundNumber, isHit }: RoundDetailsHeaderProps) {
  return (
    <CardTitle className="font-secondary flex text-2xl tracking-wide">
      <span className="mr-2">Zagrana runda nr {roundNumber}</span>
      <HitBadge isHit={isHit} />
    </CardTitle>
  );
}
