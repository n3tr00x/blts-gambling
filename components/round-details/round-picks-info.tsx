import { VoteIcon } from 'lucide-react';

import { InfoSection } from '@/components/round-details/info-section';
import { RoundPlayerPick } from '@/components/round-details/round-player-pick';
import { RoundDetails } from '@/lib/supabase/database';

type RoundPicksInfoProps = {
  picks: RoundDetails['picks'];
};

export function RoundPicksInfo({ picks }: RoundPicksInfoProps) {
  return (
    <InfoSection
      icon={<VoteIcon />}
      title="Informacje o typach poszczególnych graczy"
      className="col-span-2 lg:col-span-1"
    >
      {picks.map(pick => (
        <RoundPlayerPick key={pick.player.id} pick={pick} />
      ))}
    </InfoSection>
  );
}
