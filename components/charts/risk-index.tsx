'use client';

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PlayerStatsSummary } from '@/lib/supabase/database';

const calculateRiskIndex = (avgOdds: number, totalPicks: number, hitCount: number) => {
  return ((avgOdds * totalPicks) / ((hitCount / totalPicks) * 100)).toFixed(2);
};

const chartConfig = {
  riskIndex: {
    label: 'Wskaźnik ryzyka',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

type RiskIndexChartProps = {
  data: PlayerStatsSummary[];
};

export function RiskIndexChart({ data }: RiskIndexChartProps) {
  const processedData = data.map(item => ({
    ...item,
    riskIndex: calculateRiskIndex(item.avgOdds, item.totalPicks, item.hitCount),
  }));

  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="text-2xl">Wykres wskaźnika ryzyka</CardTitle>
        <CardDescription>
          Przedstawia on kto gra ryzykownie a kto bezpiecznie
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px] w-full"
        >
          <RadarChart data={processedData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="w-[164px]" />}
            />
            <PolarAngleAxis dataKey="username" />
            <PolarRadiusAxis
              tick={false}
              axisLine={false}
              // domain={['dataMin - 0.5', 'dataMax + 0.5']}
              domain={([dataMin, dataMax]: [number, number]) => [
                dataMin - 0.5,
                dataMax + 0.5,
              ]}
            />
            <PolarGrid />
            <Radar dataKey="riskIndex" fill="var(--color-riskIndex)" fillOpacity={0.9} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-4 text-sm">
        <div className="mt-2 w-full space-y-2 border-t pt-4">
          <p className="text-muted-foreground text-xs font-semibold">Wzór obliczenia:</p>
          <div className="border-muted-foreground/20 bg-muted/30 rounded-lg border border-dashed p-4">
            <code className="text-foreground/80 font-mono text-xs">
              <span className="font-semibold">Risk Index</span> ={' '}
              <span className="text-blue-600 dark:text-blue-400">
                (Średni kurs × Łączna liczba typów)
              </span>{' '}
              ÷{' '}
              <span className="text-green-600 dark:text-green-400">
                (Liczba trafionych typów / Łączna liczba typów) × 100
              </span>
            </code>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
