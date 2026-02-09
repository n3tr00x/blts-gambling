import { RoundBasicInfo } from '@/components/round-details/round-basic-info';
import { RoundDetailsTitle } from '@/components/round-details/round-details-title';
import { RoundPicksInfo } from '@/components/round-details/round-picks-info';
import { RoundVotesTable } from '@/components/round-details/round-votes-table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RoundDetails } from '@/lib/supabase/database';

type RoundDetailsCardProps = { round: RoundDetails };

export function RoundDetailsCard({ round }: RoundDetailsCardProps) {
  const { roundNumber, isHit, roundType, roundDate, picks, votes } = round;

  return (
    <Card>
      <CardHeader>
        <RoundDetailsTitle roundNumber={roundNumber} isHit={isHit} />
      </CardHeader>
      <CardContent className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RoundBasicInfo roundType={roundType} roundDate={roundDate} isHit={isHit} />
          <RoundPicksInfo picks={picks} />
          <RoundVotesTable votes={votes} />
        </div>
      </CardContent>
    </Card>
  );
}
