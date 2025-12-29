import { InfoIcon } from 'lucide-react';

import { InfoSection } from '@/components/round-details/info-section';
import { HitBadge } from '@/components/ui/hit-badge';

type RoundBasicInfoProps = {
  roundType: string;
  roundDate: string;
  isHit: boolean;
};

export function RoundBasicInfo({ roundType, roundDate, isHit }: RoundBasicInfoProps) {
  return (
    <InfoSection title="Podstawowe informacje" icon={<InfoIcon />} className="col-span-2">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <span>Typ kuponu</span>
          <span className="font-semibold">{roundType}</span>
        </div>
        <div className="flex justify-between">
          <span>Data kuponu</span>
          <span className="font-semibold">{roundDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Czy trafione?</span>
          <HitBadge isHit={isHit} />
        </div>
      </div>
    </InfoSection>
  );
}
