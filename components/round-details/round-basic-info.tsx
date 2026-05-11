import { ReactNode } from 'react';
import Link from 'next/link';
import { InfoIcon } from 'lucide-react';

import { InfoSection } from '@/components/round-details/info-section';
import { HitBadge } from '@/components/ui/hit-badge';
import { formatDateToPolishLong } from '@/lib/utilities';

type RoundBasicInfoProps = {
  roundType: string;
  roundDate: string;
  isHit: boolean;
  couponUrl?: string;
};

type InfoItem = {
  label: string;
  value: ReactNode;
};

export function RoundBasicInfo({
  roundType,
  roundDate,
  isHit,
  couponUrl,
}: RoundBasicInfoProps) {
  const infoItems: InfoItem[] = [
    { label: 'Typ kuponu', value: roundType },
    { label: 'Data kuponu', value: formatDateToPolishLong(roundDate) },
    { label: 'Czy trafione?', value: <HitBadge isHit={isHit} /> },
  ];

  if (couponUrl) {
    infoItems.push({
      label: 'URL kuponu',
      value: (
        <Link
          href={couponUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Link do kuponu
        </Link>
      ),
    });
  }

  return (
    <InfoSection title="Podstawowe informacje" icon={<InfoIcon />} className="col-span-2">
      <div className="flex flex-col gap-3">
        {infoItems.map(item => (
          <div key={item.label} className="flex justify-between">
            <span className="font-medium">{item.label}</span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </InfoSection>
  );
}
