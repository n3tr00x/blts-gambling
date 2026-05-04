import { ReactNode, Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

type ChartsLayoutProps = {
  children: ReactNode;
  playersEffectivenessProgress: ReactNode;
  topPickedLeaguesByPlayers: ReactNode;
  top10Leagues: ReactNode;
  playersOddsByRound: ReactNode;
  leagueEffectiveness: ReactNode;
  riskIndex: ReactNode;
};

export default function ChartsLayout({
  playersEffectivenessProgress,
  top10Leagues,
  // playersOddsByRound,
  leagueEffectiveness,
  // riskIndex,
  topPickedLeaguesByPlayers,
}: ChartsLayoutProps) {
  return (
    <section id="charts" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Suspense fallback={<Skeleton className="col-span-full min-h-96 rounded-xl" />}>
        <div className="col-span-full">{playersEffectivenessProgress}</div>
      </Suspense>
      <Suspense fallback={<Skeleton className="col-span-1 min-h-96 rounded-xl" />}>
        <div className="col-span-1">{top10Leagues}</div>
      </Suspense>
      <Suspense fallback={<Skeleton className="col-span-1 min-h-96 rounded-xl" />}>
        <div className="col-span-1">{topPickedLeaguesByPlayers}</div>
      </Suspense>
      <Suspense fallback={<Skeleton className="col-span-1 min-h-96 rounded-xl" />}>
        <div className="col-span-1">{leagueEffectiveness}</div>
      </Suspense>
    </section>
  );
}
