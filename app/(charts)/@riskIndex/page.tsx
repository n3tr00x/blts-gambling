import { RiskIndexChart } from '@/components/charts/risk-index';
import { getPlayerStatsSummary } from '@/lib/supabase/queries';

export default async function RiskIndexPage() {
  const stats = await getPlayerStatsSummary();

  return <RiskIndexChart data={stats} />;
}
