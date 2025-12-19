import { Suspense } from 'react';

import { AllSeasonLeaderboard } from '@/components/leaderboard/all-season';
import { LeaderboardSkeleton } from '@/components/leaderboard/leaderboard-skeleton';
import { MonthLeaderboard } from '@/components/leaderboard/month-leaderboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type LeaderboardPageProps = {
  searchParams: Promise<{ month?: string; season?: string }>;
};

export default async function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const { month: searchedMonth = '', season: searchedSeason = '' } = await searchParams;

  return (
    <section className="container mx-auto max-w-4xl py-4">
      <Tabs defaultValue="by-season">
        <TabsList>
          <TabsTrigger value="by-season">Ranking sezonu</TabsTrigger>
          <TabsTrigger value="by-month">Ranking miesiąca</TabsTrigger>
        </TabsList>
        <TabsContent value="by-season">
          <Suspense key={searchedSeason} fallback={<LeaderboardSkeleton />}>
            <AllSeasonLeaderboard searchedSeason={searchedSeason} />
          </Suspense>
        </TabsContent>
        <TabsContent value="by-month">
          <Suspense key={searchedMonth} fallback={<LeaderboardSkeleton />}>
            <MonthLeaderboard searchedMonth={searchedMonth} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </section>
  );
}
