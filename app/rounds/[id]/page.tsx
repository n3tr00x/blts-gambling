import { notFound } from 'next/navigation';

import { RoundDetailsCard } from '@/components/round-details/round-details-card';
import { getRoundByMatchdayId } from '@/lib/supabase/queries';

type RoundViewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoundViewPage({ params }: RoundViewPageProps) {
  const { id } = await params;
  const round = await getRoundByMatchdayId(id);

  if (!round) {
    notFound();
  }

  return <RoundDetailsCard round={round} />;
}
