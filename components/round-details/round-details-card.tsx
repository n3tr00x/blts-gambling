import { RoundBasicInfo } from '@/components/round-details/round-basic-info';
import { RoundDetailsTitle } from '@/components/round-details/round-details-title';
import { RoundPicksInfo } from '@/components/round-details/round-picks-info';
import { RoundVotesTable } from '@/components/round-details/round-votes-table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RoundDetails } from '@/lib/supabase/database';

type RoundDetailsCardProps = {
  round: RoundDetails;
};

export function RoundDetailsCard({ round }: RoundDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <RoundDetailsTitle roundNumber={round.round_number} isHit={round.is_hit} />
      </CardHeader>
      <CardContent className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-2 gap-4">
          <RoundBasicInfo
            roundType={round.round_type}
            roundDate={round.round_date}
            isHit={round.is_hit}
          />
          <RoundPicksInfo picks={round.picks} />
          <RoundVotesTable votes={round.votes} />
        </div>
      </CardContent>
    </Card>
  );
}
